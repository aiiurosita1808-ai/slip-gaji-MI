import re

with open("src/components/SalarySlip.tsx", "r") as f:
    c = f.read()

# I need to add import for db, doc, setDoc
if "import { db } from '../firebase'" not in c:
    c = c.replace("import { toPng, toJpeg } from 'html-to-image';", "import { toPng, toJpeg } from 'html-to-image';\nimport { db } from '../firebase';\nimport { doc, setDoc } from 'firebase/firestore';")

# Replace handleScheduleSubmit content
old_single = """      const dataUrl = await toJpeg(slipRef.current, { cacheBust: true, quality: 0.6, pixelRatio: 1.5 });
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (slipRef.current.offsetHeight * pdfWidth) / slipRef.current.offsetWidth;
      pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      
      const base64Pdf = pdf.output('datauristring');
      const filename = `Slip_Gaji_${viewingSlip.teacherName.replace(/\s+/g, '_')}_${viewingSlip.month}_${viewingSlip.year}.pdf`;

      const scheduleDate = new Date(scheduleTime).toISOString();

      // Upload to Filebin
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
        const blob = new Blob([byteArray], { type: 'text/plain' }); // Use text/plain to bypass CORS preflight

        await fetch(filebinUrl, {
            method: 'POST',
            body: blob
        });

        // Send to Fonnte
        const formData = new FormData();
        formData.append('target', teacher.phone);
        formData.append('url', filebinUrl);
        formData.append('message', caption);"""

new_single = """      // Generate a unique ID for the shared slip
      const sharedId = viewingSlip.id + '_' + Date.now().toString(36);
      
      // Save to Firestore shared_slips
      await setDoc(doc(db, 'shared_slips', sharedId), {
        slip: viewingSlip,
        settings: settings
      });

      const slipLink = `https://slipgajimialbarokah.netlify.app/?shared=${sharedId}`;
      const finalMessage = `${caption}\n\nSilakan klik tautan berikut untuk melihat atau mengunduh slip gaji Anda:\n${slipLink}`;
      const scheduleDate = new Date(scheduleTime).toISOString();

      // Send to Fonnte
      const formData = new FormData();
      formData.append('target', teacher.phone);
      formData.append('message', finalMessage);"""

c = c.replace(old_single, new_single)

old_mass = """      try {
        const dataUrl = await toJpeg(node, { cacheBust: true, quality: 0.6, pixelRatio: 1.5 });
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (node.offsetHeight * pdfWidth) / node.offsetWidth;
        pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        
        const base64Pdf = pdf.output('datauristring');
        const filename = `Slip_Gaji_${teacher.name.replace(/\s+/g, '_')}_${slip.month}_${slip.year}.pdf`;

        // Upload to Filebin
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
        const blob = new Blob([byteArray], { type: 'text/plain' }); // Use text/plain to bypass CORS preflight

        await fetch(filebinUrl, {
            method: 'POST',
            body: blob
        });

        // Send to Fonnte
        const formData = new FormData();
        formData.append('target', teacher.phone);
        formData.append('url', filebinUrl);
        formData.append('message', generateMessage(teacher.name, slip.month, slip.year));"""

new_mass = """      try {
        const sharedId = slip.id + '_' + Date.now().toString(36);
        await setDoc(doc(db, 'shared_slips', sharedId), {
          slip: slip,
          settings: settings
        });

        const slipLink = `https://slipgajimialbarokah.netlify.app/?shared=${sharedId}`;
        const finalMessage = `${generateMessage(teacher.name, slip.month, slip.year)}\n\nSilakan klik tautan berikut untuk melihat atau mengunduh slip gaji Anda:\n${slipLink}`;

        // Send to Fonnte
        const formData = new FormData();
        formData.append('target', teacher.phone);
        formData.append('message', finalMessage);"""

c = c.replace(old_mass, new_mass)

with open("src/components/SalarySlip.tsx", "w") as f:
    f.write(c)

