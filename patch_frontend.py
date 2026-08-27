import re

with open("src/components/SalarySlip.tsx", "r") as f:
    c = f.read()

# We need to replace the API calls in handleScheduleSubmit and handleMassScheduleSubmit

def replace_between(text, start_str, end_str, replacement):
    start = text.find(start_str)
    if start == -1: return text
    end = text.find(end_str, start)
    if end == -1: return text
    return text[:start] + replacement + text[end + len(end_str):]

# 1. Update handleScheduleSubmit
start_schedule = "const response = await fetch('/api/schedule-slip', {"
end_schedule = "});"
replacement_schedule = """// Upload to Filebin
        const binId = 'slip' + Date.now() + Math.floor(Math.random()*1000);
        const filebinUrl = `https://filebin.net/${binId}/${filename}`;
        
        // Convert base64 to Blob
        const base64Data = base64Pdf.split('base64,')[1] || base64Pdf;
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        await fetch(filebinUrl, {
            method: 'POST',
            body: blob,
            headers: { 'Content-Type': 'application/pdf' }
        });

        // Send to Fonnte
        const formData = new FormData();
        formData.append('target', teacher.phone);
        formData.append('url', filebinUrl);
        formData.append('message', caption);
        
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

c = replace_between(c, start_schedule, end_schedule, replacement_schedule)

# 2. Update handleMassScheduleSubmit
start_mass = "const response = await fetch('/api/schedule-slip', {"
end_mass = "});"
replacement_mass = """// Upload to Filebin
        const binId = 'slip' + Date.now() + Math.floor(Math.random()*1000);
        const filebinUrl = `https://filebin.net/${binId}/${filename}`;
        
        // Convert base64 to Blob
        const base64Data = base64Pdf.split('base64,')[1] || base64Pdf;
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        await fetch(filebinUrl, {
            method: 'POST',
            body: blob,
            headers: { 'Content-Type': 'application/pdf' }
        });

        // Send to Fonnte
        const formData = new FormData();
        formData.append('target', teacher.phone);
        formData.append('url', filebinUrl);
        formData.append('message', generateMessage(teacher.name, slip.month, slip.year));
        
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

c = replace_between(c, start_mass, end_mass, replacement_mass)

with open("src/components/SalarySlip.tsx", "w") as f:
    f.write(c)
