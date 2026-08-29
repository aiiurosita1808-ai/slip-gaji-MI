import re

with open("src/components/SalarySlip.tsx", "r") as f:
    c = f.read()

# Replace single
old_single = """      // Send to Fonnte using URLSearchParams
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

new_single = """      // Send to Fonnte using FormData
      const formData = new FormData();
      formData.append('target', teacher.phone);
      formData.append('message', finalMessage);
      formData.append('schedule', formattedSchedule);

      const response = await fetch('https://api.fonnte.com/send', {
          method: 'POST',
          headers: {
              'Authorization': settings.fonnteToken.trim()
          },
          body: formData
      });"""

c = c.replace(old_single, new_single)

# Replace mass
old_mass = """        // Send to Fonnte using URLSearchParams
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

new_mass = """        // Send to Fonnte using FormData
        const formData = new FormData();
        formData.append('target', teacher.phone);
        formData.append('message', finalMessage);
        formData.append('schedule', formattedSchedule);

        const response = await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: {
                'Authorization': settings.fonnteToken.trim()
            },
            body: formData
        });"""

c = c.replace(old_mass, new_mass)

with open("src/components/SalarySlip.tsx", "w") as f:
    f.write(c)
