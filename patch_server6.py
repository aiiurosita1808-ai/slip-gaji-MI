with open("server.ts", "r") as f:
    c = f.read()

# Add import back
c = c.replace("import fetch from 'node-fetch';", "import fetch from 'node-fetch';\nimport FormData from 'form-data';")

# Change the sendWhatsAppMessage
old_func_body = """  const formData = new FormData();
  formData.append('target', phone);
  if (fileUrl) {
    formData.append('url', fileUrl);
  } else {
    const blob = new Blob([buffer], { type: 'application/pdf' });
    formData.append('file', blob, filename);
  }
  formData.append('message', caption);

  const response = await fetch('https://api.fonnte.com/send', {
    method: 'POST',
    headers: {
      'Authorization': apiKey,
    },
    body: formData,
  });"""

new_func_body = """  const formData = new FormData();
  formData.append('target', phone);
  if (fileUrl) {
    formData.append('url', fileUrl);
  } else {
    formData.append('file', buffer, { filename, contentType: 'application/pdf' });
  }
  formData.append('message', caption);

  const response = await fetch('https://api.fonnte.com/send', {
    method: 'POST',
    headers: {
      'Authorization': apiKey,
      ...formData.getHeaders(),
    },
    body: formData,
  });"""

c = c.replace(old_func_body, new_func_body)

with open("server.ts", "w") as f:
    f.write(c)
