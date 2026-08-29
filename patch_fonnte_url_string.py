import re

with open("src/components/SalarySlip.tsx", "r") as f:
    c = f.read()

# Replace JSON in single schedule
old_single = """      // Send to Fonnte using JSON
      const response = await fetch('https://api.fonnte.com/send', {
          method: 'POST',
          headers: {
              'Authorization': settings.fonnteToken.trim(),
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              target: teacher.phone,
              message: finalMessage,
              schedule: formattedSchedule
          })
      });"""

new_single = """      // Send to Fonnte using URLSearchParams string
      const urlencoded = new URLSearchParams();
      urlencoded.append('target', teacher.phone);
      urlencoded.append('message', finalMessage);
      urlencoded.append('schedule', formattedSchedule);

      const response = await fetch('https://api.fonnte.com/send', {
          method: 'POST',
          headers: {
              'Authorization': settings.fonnteToken.trim(),
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: urlencoded.toString()
      });"""

c = c.replace(old_single, new_single)

# Replace JSON in mass schedule
old_mass = """        // Send to Fonnte using JSON
        const response = await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: {
                'Authorization': settings.fonnteToken.trim(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                target: teacher.phone,
                message: finalMessage,
                schedule: formattedSchedule
            })
        });"""

new_mass = """        // Send to Fonnte using URLSearchParams string
        const urlencoded = new URLSearchParams();
        urlencoded.append('target', teacher.phone);
        urlencoded.append('message', finalMessage);
        urlencoded.append('schedule', formattedSchedule);

        const response = await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: {
                'Authorization': settings.fonnteToken.trim(),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: urlencoded.toString()
        });"""

c = c.replace(old_mass, new_mass)

with open("src/components/SalarySlip.tsx", "w") as f:
    f.write(c)
