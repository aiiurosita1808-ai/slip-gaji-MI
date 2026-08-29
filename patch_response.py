import re

with open("src/components/SalarySlip.tsx", "r") as f:
    c = f.read()

old_resp = """        const response = await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: {
                'Authorization': settings.fonnteToken
            },
            body: formData
        });

      if (!response.ok) {
        throw new Error('Failed to schedule');
      }

      alert('Berhasil dijadwalkan! Slip gaji akan dikirim via WhatsApp sesuai jadwal.');"""

new_resp = """        const response = await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: {
                'Authorization': settings.fonnteToken
            },
            body: formData
        });

      const result = await response.json();
      if (!response.ok || result.status === false) {
        throw new Error(result.reason || 'Failed to schedule');
      }

      alert('Berhasil dijadwalkan! Slip gaji akan dikirim via WhatsApp sesuai jadwal.');"""

c = c.replace(old_resp, new_resp)

with open("src/components/SalarySlip.tsx", "w") as f:
    f.write(c)
