with open("server.ts", "r") as f:
    c = f.read()

# Replace the slip endpoint
old_endpoint = """  app.get('/api/slip/:id', async (req, res) => {
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
  });"""

new_endpoint = """  app.get('/api/slip/:id/:filename', async (req, res) => {
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
  });"""
c = c.replace(old_endpoint, new_endpoint)

# Replace the cron fileUrl generator
old_cron_dest = "const fileUrl = host ? `${host}/api/slip/${document.id}` : undefined;"
new_cron_dest = "const fileUrl = host ? `${host}/api/slip/${document.id}/${encodeURIComponent(filename || 'Slip_Gaji.pdf')}` : undefined;"
c = c.replace(old_cron_dest, new_cron_dest)

with open("server.ts", "w") as f:
    f.write(c)
