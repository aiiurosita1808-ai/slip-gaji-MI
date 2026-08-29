import re

with open("src/components/SalarySlip.tsx", "r") as f:
    c = f.read()

c = c.replace("'Authorization': settings.fonnteToken,", "'Authorization': settings.fonnteToken.trim(),")

with open("src/components/SalarySlip.tsx", "w") as f:
    f.write(c)
