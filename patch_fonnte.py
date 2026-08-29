import re

with open("src/components/SalarySlip.tsx", "r") as f:
    c = f.read()

# Fix handleScheduleSubmit (single)
old_single = """      // Send to Fonnte
      const formData = new FormData();
      formData.append('target', teacher.phone);
      formData.append('message', finalMessage);
        
        // Format schedule for Fonnte: YYYY-MM-DD HH:mm:ss
        const dateObj = new Date(scheduleDate);
        const pad = (n: number) => n.toString().padStart(2, '0');
        const formattedSchedule = `${dateObj.getFullYear()}-${pad(dateObj.getMonth()+1)}-${pad(dateObj.getDate())} ${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:${pad(dateObj.getSeconds())}`;
        formData.append('schedule', formattedSchedule);

        const response = await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: {
                'Authorization': settings.fonnteToken
            },
            body: formData
        });"""

new_single = """      // Format schedule for Fonnte: YYYY-MM-DD HH:mm:ss
      const dateObj = new Date(scheduleDate);
      const pad = (n: number) => n.toString().padStart(2, '0');
      const formattedSchedule = `${dateObj.getFullYear()}-${pad(dateObj.getMonth()+1)}-${pad(dateObj.getDate())} ${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:${pad(dateObj.getSeconds())}`;
      
      // Send to Fonnte using URLSearchParams
      const urlencoded = new URLSearchParams();
      urlencoded.append('target', teacher.phone);
      urlencoded.append('message', finalMessage);
      urlencoded.append('schedule', formattedSchedule);

      const response = await fetch('https://api.fonnte.com/send', {
          method: 'POST',
          headers: {
              'Authorization': settings.fonnteToken,
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: urlencoded
      });"""

c = c.replace(old_single, new_single)

# Fix handleMassScheduleSubmit (mass)
old_mass_start = """      try {
        const slipElement = document.getElementById(`hidden-slip-${slip.id}`);"""
old_mass_end = """        const result = await response.json();
        if (response.ok && result.status !== false) successCount++; else failCount++;
      } catch (err) {"""

# We'll use regex to replace everything in between
pattern = re.compile(r"      try \{\n        const slipElement.*?const result = await response\.json\(\);\n        if \(response\.ok && result\.status !== false\) successCount\+\+; else failCount\+\+;\n      \} catch \(err\) \{", re.DOTALL)

new_mass = """      try {
        const sharedId = slip.id + '_' + Date.now().toString(36);
        await setDoc(doc(db, 'shared_slips', sharedId), {
          slip: slip,
          settings: settings
        });

        const slipLink = `https://slipgajimialbarokah.netlify.app/?shared=${sharedId}`;
        const finalMessage = `${generateMessage(teacher.name, slip.month, slip.year)}\n\nSilakan klik tautan berikut untuk melihat atau mengunduh slip gaji Anda:\n${slipLink}`;

        // Stagger schedule time by 15 seconds for each slip to avoid spam triggers
        const staggerMs = i * 15 * 1000; 
        const scheduleDate = new Date(new Date(scheduleTime).getTime() + staggerMs).toISOString();

        // Format schedule for Fonnte: YYYY-MM-DD HH:mm:ss
        const dateObj = new Date(scheduleDate);
        const pad = (n: number) => n.toString().padStart(2, '0');
        const formattedSchedule = `${dateObj.getFullYear()}-${pad(dateObj.getMonth()+1)}-${pad(dateObj.getDate())} ${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:${pad(dateObj.getSeconds())}`;

        // Send to Fonnte using URLSearchParams
        const urlencoded = new URLSearchParams();
        urlencoded.append('target', teacher.phone);
        urlencoded.append('message', finalMessage);
        urlencoded.append('schedule', formattedSchedule);

        const response = await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: {
                'Authorization': settings.fonnteToken,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: urlencoded
        });
        const result = await response.json();
        if (response.ok && result.status !== false) successCount++; else failCount++;
      } catch (err) {"""

c = pattern.sub(new_mass, c)

with open("src/components/SalarySlip.tsx", "w") as f:
    f.write(c)
