import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import cors from 'cors';
import cron from 'node-cron';
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import nodemailer from 'nodemailer';

// Initialize Firebase Client
const firebaseConfig = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf8')
);

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
console.log('Firebase Client initialized successfully on server');

async function sendWhatsAppMessage(phone: string, base64Pdf: string, filename: string, caption: string, token?: string, fileUrl?: string) {
  const apiKey = token || process.env.FONNTE_API_KEY;
  if (!apiKey) {
    throw new Error('FONNTE_API_KEY is missing');
  }

  // Convert base64 to buffer
  const base64Data = base64Pdf.split('base64,')[1] || base64Pdf;
  const buffer = Buffer.from(base64Data, 'base64');

  const formData = new FormData();
  formData.append('target', phone);
  
  if (fileUrl) {
    formData.append('url', fileUrl);
    // When using URL, Fonnte might ignore the file parameter, but we MUST pass it
    // Wait, if url is passed, we shouldn't pass file for free plans.
  }
  
  formData.append('message', caption);

  const response = await fetch('https://api.fonnte.com/send', {
    method: 'POST',
    headers: {
      'Authorization': apiKey,
      ...formData.getHeaders(),
    },
    body: formData,
  });

  const data = await response.json() as any;
  if (!response.ok || !data.status) {
    throw new Error(`Fonnte API error: ${JSON.stringify(data)}`);
  }
  
  return data;
}

// Set up cron job every minute to check for scheduled slips
cron.schedule('* * * * *', async () => {
  if (!db) return;
  console.log('Checking for scheduled slips...');
  
  try {
    const now = new Date().toISOString();
    // Get all scheduled slips that are due and haven't been sent
    const slipsRef = collection(db, 'scheduled_slips');
    const q = query(slipsRef, where('scheduledTime', '<=', now));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return;
    }

    console.log(`Found ${snapshot.size} total scheduled slips (checking status).`);

    for (const document of snapshot.docs) {
      const slipData = document.data();
      if (slipData.status !== 'pending') continue;

      // Mark as processing to prevent overlapping cron runs from picking this up
      await updateDoc(doc(db, 'scheduled_slips', document.id), {
        status: 'processing'
      });

      const { phone, base64Pdf, filename, caption, fonnteToken, host } = slipData;
      const fileUrl = host ? `${host}/api/slip/${document.id}/${encodeURIComponent(filename || 'Slip_Gaji.pdf')}` : undefined;
      try {
        await sendWhatsAppMessage(phone, base64Pdf, filename, caption, fonnteToken, fileUrl);
        await updateDoc(doc(db, 'scheduled_slips', document.id), {
          status: 'sent',
          sentAt: new Date().toISOString()
        });
        console.log(`Successfully sent slip to ${phone}`);
      } catch (err: any) {
        console.error(`Failed to send slip to ${phone}:`, err.message);
        await updateDoc(doc(db, 'scheduled_slips', document.id), {
          status: 'failed',
          error: err.message
        });
      }

      // Add an 8-second delay between messages to avoid anti-spam limits
      await new Promise(resolve => setTimeout(resolve, 8000));
    }
  } catch (error) {
    console.error('Error in cron job:', error);
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  app.post('/api/send-email', async (req, res) => {
    try {
      const { email, base64Pdf, filename, subject, text } = req.body;
      if (!email || !base64Pdf) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return res.status(500).json({ error: 'SMTP configuration is missing. Please setup SMTP_USER and SMTP_PASS environment variables.' });
      }

      const base64Data = base64Pdf.split('base64,')[1] || base64Pdf;

      await transporter.sendMail({
        from: `"Admin" <${process.env.SMTP_USER}>`,
        to: email,
        subject: subject,
        text: text,
        attachments: [
          {
            filename: filename || 'document.pdf',
            content: base64Data,
            encoding: 'base64'
          }
        ]
      });

      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // API to schedule a slip
  app.post('/api/schedule-slip', async (req, res) => {
    try {
      const { phone, base64Pdf, filename, caption, scheduledTime, fonnteToken, host } = req.body;

      if (!phone || !base64Pdf || !scheduledTime) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const docRef = await addDoc(collection(db, 'scheduled_slips'), {
        phone,
        base64Pdf,
        filename: filename || 'Slip_Gaji.pdf',
        caption: caption || 'Berikut adalah slip gaji Anda.',
        scheduledTime,
        fonnteToken: fonnteToken || null,
        host: host || '',
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      res.json({ success: true, id: docRef.id });
    } catch (error: any) {
      console.error('Error scheduling slip:', error);
      res.status(500).json({ error: error.message });
    }
  });
  

  app.get('/api/slip/:id/:filename', async (req, res) => {
    try {
      const docSnap = await getDoc(doc(db, 'scheduled_slips', req.params.id));
      if (!docSnap.exists()) {
        return res.status(404).send('Slip not found');
      }
      const data = docSnap.data();
      const base64Data = data.base64Pdf.split('base64,')[1] || data.base64Pdf;
      const buffer = Buffer.from(base64Data, 'base64');
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${data.filename || 'slip.pdf'}"`);
      res.send(buffer);
    } catch (e) {
      res.status(500).send('Error');
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
