import re

with open("src/components/SalarySlip.tsx", "r") as f:
    c = f.read()

# Replace backend proxy single schedule
old_single = """      // Send to Fonnte via backend proxy (avoids browser quirks)
      const response = await fetch('/api/send-wa', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              token: settings.fonnteToken.trim(),
              target: teacher.phone,
              message: finalMessage,
              schedule: formattedSchedule
          })
      });"""

new_single = """      // Send to Fonnte using URLSearchParams
      const urlencoded = new URLSearchParams();
      urlencoded.append('target', teacher.phone);
      urlencoded.append('message', finalMessage);
      urlencoded.append('schedule', formattedSchedule);

      const response = await fetch('https://api.fonnte.com/send', {
          method: 'POST',
          headers: {
              'Authorization': settings.fonnteToken.trim()
          },
          body: urlencoded
      });"""

c = c.replace(old_single, new_single)

# Replace backend proxy mass schedule
old_mass = """        // Send to Fonnte via backend proxy (avoids browser quirks)
        const response = await fetch('/api/send-wa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: settings.fonnteToken.trim(),
                target: teacher.phone,
                message: finalMessage,
                schedule: formattedSchedule
            })
        });"""

new_mass = """        // Send to Fonnte using URLSearchParams
        const urlencoded = new URLSearchParams();
        urlencoded.append('target', teacher.phone);
        urlencoded.append('message', finalMessage);
        urlencoded.append('schedule', formattedSchedule);

        const response = await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: {
                'Authorization': settings.fonnteToken.trim()
            },
            body: urlencoded
        });"""

c = c.replace(old_mass, new_mass)

with open("src/components/SalarySlip.tsx", "w") as f:
    f.write(c)
