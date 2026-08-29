import re

with open("src/components/SharedSlipViewer.tsx", "r") as f:
    c = f.read()

# Replace html2canvas with html-to-image
if "html2canvas" in c:
    c = c.replace("import html2canvas from 'html2canvas';", "import { toPng } from 'html-to-image';")
    
    old_download = """const canvas = await html2canvas(printRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);"""
      
    new_download = """const imgData = await toPng(printRef.current, { quality: 1, pixelRatio: 2 });
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (printRef.current.offsetHeight * imgWidth) / printRef.current.offsetWidth;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);"""
      
    c = c.replace(old_download, new_download)

with open("src/components/SharedSlipViewer.tsx", "w") as f:
    f.write(c)

