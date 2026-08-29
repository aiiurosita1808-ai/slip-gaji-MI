import re

with open("src/components/SalarySlip.tsx", "r") as f:
    c = f.read()

# Replace single schedule
c = c.replace("""      const response = await fetch('https://api.fonnte.com/send', {
          method: 'POST',
          headers: {
              'Authorization': settings.fonnteToken,
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: urlencoded
      });""", """      const response = await fetch('https://api.fonnte.com/send', {
          method: 'POST',
          headers: {
              'Authorization': settings.fonnteToken
          },
          body: urlencoded
      });""")

# Replace mass schedule
c = c.replace("""        const response = await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: {
                'Authorization': settings.fonnteToken,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: urlencoded
        });""", """        const response = await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: {
                'Authorization': settings.fonnteToken
            },
            body: urlencoded
        });""")

with open("src/components/SalarySlip.tsx", "w") as f:
    f.write(c)
