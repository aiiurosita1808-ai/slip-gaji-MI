with open("server.ts", "r") as f:
    c = f.read()

# 1. Add URL to sendWhatsAppMessage signature
old_sig = "async function sendWhatsAppMessage(phone: string, base64Pdf: string, filename: string, caption: string, token?: string) {"
new_sig = "async function sendWhatsAppMessage(phone: string, base64Pdf: string, filename: string, caption: string, token?: string, fileUrl?: string) {"
c = c.replace(old_sig, new_sig)

# 2. Add URL support in sendWhatsAppMessage
old_func_body = """  const blob = new Blob([buffer], { type: 'application/pdf' });
  const formData = new FormData();
  formData.append('target', phone);
  formData.append('file', blob, filename);
  formData.append('message', caption);"""

new_func_body = """  const formData = new FormData();
  formData.append('target', phone);
  if (fileUrl) {
    formData.append('url', fileUrl);
  } else {
    const blob = new Blob([buffer], { type: 'application/pdf' });
    formData.append('file', blob, filename);
  }
  formData.append('message', caption);"""

c = c.replace(old_func_body, new_func_body)

# 3. Add host to /api/schedule-slip
old_schedule_req = "const { phone, base64Pdf, filename, caption, scheduledTime, fonnteToken } = req.body;"
new_schedule_req = "const { phone, base64Pdf, filename, caption, scheduledTime, fonnteToken, host } = req.body;"
c = c.replace(old_schedule_req, new_schedule_req)

old_schedule_add = "fonnteToken: fonnteToken || null,\n        status: 'pending',"
new_schedule_add = "fonnteToken: fonnteToken || null,\n        host: host || '',\n        status: 'pending',"
c = c.replace(old_schedule_add, new_schedule_add)

# 4. Pass fileUrl in cron job
old_cron_dest = "const { phone, base64Pdf, filename, caption, fonnteToken } = slipData;\n      \n      try {\n        await sendWhatsAppMessage(phone, base64Pdf, filename, caption, fonnteToken);"
new_cron_dest = "const { phone, base64Pdf, filename, caption, fonnteToken, host } = slipData;\n      const fileUrl = host ? `${host}/api/slip/${document.id}` : undefined;\n      try {\n        await sendWhatsAppMessage(phone, base64Pdf, filename, caption, fonnteToken, fileUrl);"
c = c.replace(old_cron_dest, new_cron_dest)

# 5. Add /api/slip/:id endpoint before app.listen
api_slip_endpoint = """
  app.get('/api/slip/:id', async (req, res) => {
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
"""

c = c.replace("  // Vite middleware for development", api_slip_endpoint + "\n  // Vite middleware for development")

with open("server.ts", "w") as f:
    f.write(c)
