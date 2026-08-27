import re

with open("src/components/SalarySlip.tsx", "r") as f:
    c = f.read()

# Replace:
# const blob = new Blob([byteArray], { type: 'application/pdf' });
# await fetch(filebinUrl, {
#     method: 'POST',
#     body: blob,
#     headers: { 'Content-Type': 'application/pdf' }
# });

old_code = """const blob = new Blob([byteArray], { type: 'application/pdf' });

        await fetch(filebinUrl, {
            method: 'POST',
            body: blob,
            headers: { 'Content-Type': 'application/pdf' }
        });"""

new_code = """const blob = new Blob([byteArray], { type: 'text/plain' }); // Use text/plain to bypass CORS preflight

        await fetch(filebinUrl, {
            method: 'POST',
            body: blob
        });"""

c = c.replace(old_code, new_code)

with open("src/components/SalarySlip.tsx", "w") as f:
    f.write(c)
