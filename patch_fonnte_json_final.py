import re

with open("src/components/SalarySlip.tsx", "r") as f:
    c = f.read()

# Replace FormData with JSON in single schedule
old_single = """      // Send to Fonnte using FormData
      const formData = new FormData();
      formData.append('target', teacher.phone);
      formData.append('message', finalMessage);
      formData.append('schedule', formattedSchedule);

      const response = await fetch('https://api.fonnte.com/send', {
          method: 'POST',
          headers: {
              'Authorization': settings.fonnteToken
          },
          body: formData
      });"""

new_single = """      // Send to Fonnte using JSON
      const response = await fetch('https://api.fonnte.com/send', {
          method: 'POST',
          headers: {
              'Authorization': settings.fonnteToken,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              target: teacher.phone,
              message: finalMessage,
              schedule: formattedSchedule
          })
      });"""

c = c.replace(old_single, new_single)

# Replace FormData with JSON in mass schedule
old_mass = """        const formData = new FormData();
        formData.append('target', teacher.phone);
        formData.append('message', finalMessage);
        formData.append('schedule', formattedSchedule);

        const response = await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: {
                'Authorization': settings.fonnteToken
            },
            body: formData
        });"""

new_mass = """        const response = await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: {
                'Authorization': settings.fonnteToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                target: teacher.phone,
                message: finalMessage,
                schedule: formattedSchedule
            })
        });"""

c = c.replace(old_mass, new_mass)

with open("src/components/SalarySlip.tsx", "w") as f:
    f.write(c)
