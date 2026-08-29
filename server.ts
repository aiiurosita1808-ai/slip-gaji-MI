import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import cors from 'cors';
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

  app.post('/api/send-wa', async (req, res) => {
    try {
      const { target, message, schedule, token } = req.body;
      
      if (!target || !message || !token) {
        return res.status(400).json({ status: false, reason: 'Missing required fields' });
      }

      const formData = new FormData();
      formData.append('target', target);
      formData.append('message', message);
      if (schedule) {
        formData.append('schedule', schedule);
      }

      const response = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
          'Authorization': token,
        },
        body: formData
      });

      const responseData = await response.text();
      res.status(response.status).send(responseData);
    } catch (error: any) {
      console.error('Error sending WA:', error);
      res.status(500).json({ status: false, reason: error.message });
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
