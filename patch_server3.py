with open("server.ts", "r") as f:
    c = f.read()

# Remove import
c = c.replace("import FormData from 'form-data';\n", "")

# Replace the function body
old_func = """  const formData = new FormData();
  formData.append('target', phone);
  formData.append('file', buffer, { filename, contentType: 'application/pdf' });
  formData.append('filename', filename);
  formData.append('message', caption);

  const response = await fetch('https://api.fonnte.com/send', {
    method: 'POST',
    headers: {
      'Authorization': apiKey,
      ...formData.getHeaders(),
    },
    body: formData,
  });"""

new_func = """  const blob = new Blob([buffer], { type: 'application/pdf' });
  const formData = new FormData();
  formData.append('target', phone);
  formData.append('file', blob, filename);
  formData.append('message', caption);

  const response = await fetch('https://api.fonnte.com/send', {
    method: 'POST',
    headers: {
      'Authorization': apiKey,
    },
    body: formData,
  });"""

c = c.replace(old_func, new_func)

with open("server.ts", "w") as f:
    f.write(c)
