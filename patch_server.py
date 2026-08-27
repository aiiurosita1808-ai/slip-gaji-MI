import re

with open('server.ts', 'r') as f:
    content = f.read()

# Update sendWhatsAppMessage signature
content = content.replace(
    "async function sendWhatsAppMessage(phone: string, base64Pdf: string, filename: string, caption: string) {",
    "async function sendWhatsAppMessage(phone: string, base64Pdf: string, filename: string, caption: string, token?: string) {"
)

# Update FONNTE_API_KEY usage
content = content.replace(
    "const apiKey = process.env.FONNTE_API_KEY;\n  if (!apiKey) {\n    throw new Error('FONNTE_API_KEY is missing');\n  }",
    "const apiKey = token || process.env.FONNTE_API_KEY;\n  if (!apiKey) {\n    throw new Error('FONNTE_API_KEY is missing');\n  }"
)

# Update schedule API to accept fonnteToken
content = content.replace(
    "const { phone, base64Pdf, filename, caption, scheduledTime } = req.body;",
    "const { phone, base64Pdf, filename, caption, scheduledTime, fonnteToken } = req.body;"
)

# Save fonnteToken in addDoc
content = content.replace(
    "scheduledTime,\n        status: 'pending',",
    "scheduledTime,\n        fonnteToken: fonnteToken || null,\n        status: 'pending',"
)

# Call sendWhatsAppMessage with fonnteToken
content = content.replace(
    "const { phone, base64Pdf, filename, caption } = slipData;\n      \n      try {\n        await sendWhatsAppMessage(phone, base64Pdf, filename, caption);",
    "const { phone, base64Pdf, filename, caption, fonnteToken } = slipData;\n      \n      try {\n        await sendWhatsAppMessage(phone, base64Pdf, filename, caption, fonnteToken);"
)

with open('server.ts', 'w') as f:
    f.write(content)
