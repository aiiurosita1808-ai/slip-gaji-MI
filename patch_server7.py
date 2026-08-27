with open("server.ts", "r") as f:
    c = f.read()

# Change the sendWhatsAppMessage
old_func_body = """  const formData = new FormData();
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

new_func_body = """  const formData = new FormData();
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
  });"""

c = c.replace(old_func_body, new_func_body)

with open("server.ts", "w") as f:
    f.write(c)
