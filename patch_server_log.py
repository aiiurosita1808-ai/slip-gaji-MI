with open("server.ts", "r") as f:
    c = f.read()
c = c.replace("const response = await fetch('https://api.fonnte.com/send', {", "const response = await fetch('https://api.fonnte.com/send', {")
c = c.replace("const responseText = await response.text();", "")
c = c.replace("if (!response.ok) {", "const responseText = await response.text();\n  console.log('Fonnte Response:', responseText);\n  if (!response.ok) {")
with open("server.ts", "w") as f:
    f.write(c)
