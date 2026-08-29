import re

with open("src/components/SalarySlip.tsx", "r") as f:
    c = f.read()

old_mass = """        const response = await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: {
                'Authorization': settings.fonnteToken
            },
            body: formData
        });
        if (response.ok) successCount++; else failCount++;"""

new_mass = """        const response = await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: {
                'Authorization': settings.fonnteToken
            },
            body: formData
        });
        const result = await response.json();
        if (response.ok && result.status !== false) successCount++; else failCount++;"""

c = c.replace(old_mass, new_mass)

with open("src/components/SalarySlip.tsx", "w") as f:
    f.write(c)

