with open("server.ts", "r") as f:
    c = f.read()

old_func = """async function sendWhatsAppMessage(phone: string, base64Pdf: string, filename: string, caption: string, token?: string, fileUrl?: string) {
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
}"""

new_func = """async function sendWhatsAppMessage(phone: string, base64Pdf: string, filename: string, caption: string, token?: string, _fileUrl?: string) {
  const apiKey = token || process.env.FONNTE_API_KEY;
  if (!apiKey) {
    throw new Error('FONNTE_API_KEY is missing');
  }
  // Convert base64 to buffer
  const base64Data = base64Pdf.split('base64,')[1] || base64Pdf;
  const buffer = Buffer.from(base64Data, 'base64');
  
  // 1. Upload to Uguu.se to get a direct public URL for Fonnte
  const uguuForm = new FormData();
  uguuForm.append('files[]', buffer, { filename: filename || 'Slip_Gaji.pdf', contentType: 'application/pdf' });
  const uguuRes = await fetch('https://uguu.se/upload.php', {
    method: 'POST',
    body: uguuForm,
    headers: uguuForm.getHeaders()
  });
  const uguuData = await uguuRes.json() as any;
  if (!uguuData.success || !uguuData.files || !uguuData.files[0]) {
    throw new Error(`Failed to upload PDF to temporary storage for Fonnte.`);
  }
  const publicPdfUrl = uguuData.files[0].url;
  console.log(`Uploaded to temp storage: ${publicPdfUrl}`);

  // 2. Send via Fonnte using the public URL
  const formData = new FormData();
  formData.append('target', phone);
  formData.append('url', publicPdfUrl);
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
}"""

c = c.replace(old_func, new_func)

with open("server.ts", "w") as f:
    f.write(c)
