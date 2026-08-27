with open("server.ts", "r") as f:
    c = f.read()

c = c.replace("formData.append('file', buffer, { filename });", "formData.append('file', buffer, { filename, contentType: 'application/pdf' });\n  formData.append('filename', filename);")

with open("server.ts", "w") as f:
    f.write(c)
