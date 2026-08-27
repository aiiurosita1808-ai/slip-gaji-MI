import re

with open('src/components/SalarySlip.tsx', 'r') as f:
    content = f.read()

# 1. Imports
content = content.replace(
    "import { Printer, FilePlus, ChevronLeft, Download, Send, Clock, X, Mail } from 'lucide-react';",
    "import { Printer, FilePlus, ChevronLeft, Download, Send, Clock, X, Mail, CheckCircle } from 'lucide-react';\nimport { SlipDocument } from './SlipDocument';"
)

# 2. State
content = content.replace(
    "  const slipRef = useRef<HTMLDivElement>(null);",
    "  const slipRef = useRef<HTMLDivElement>(null);\n  const [isMassScheduling, setIsMassScheduling] = useState(false);\n  const [massProcessStatus, setMassProcessStatus] = useState<{current: number, total: number, message: string} | null>(null);"
)

# 3. generateSlipObject
replacement1 = """  const generateSlipObject = (teacher: Teacher, month: string, year: number): SalarySlip => {
    const totalPenerimaan = 
      (teacher.basicSalary || 0) + (teacher.teachingLoad || 0) + (teacher.homeroomIncentive || 0) + 
      (teacher.annualPerformanceIncentive || 0) + (teacher.monthlyPerformanceIncentive || 0) + 
      (teacher.tenureAllowance || 0) + (teacher.educationAllowance || 0) + 
      (teacher.bpjsAllowance || 0) + (teacher.qurbanAllowance || 0);
    const totalPotongan = (teacher.bpjsDeduction || 0) + (teacher.qurbanDeduction || 0);
    const totalSalary = totalPenerimaan - totalPotongan;

    return {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      teacherId: teacher.id, month, year, date: new Date().toISOString(),
      teacherName: teacher.name, teacherNip: teacher.nip, teacherPosition: teacher.position,
      teacherAdditionalTask: teacher.additionalTask || '', teacherWorkTenure: teacher.workTenure || '',
      basicSalary: teacher.basicSalary || 0, teachingLoad: teacher.teachingLoad || 0,
      homeroomIncentive: teacher.homeroomIncentive || 0, annualPerformanceIncentive: teacher.annualPerformanceIncentive || 0,
      monthlyPerformanceIncentive: teacher.monthlyPerformanceIncentive || 0, tenureAllowance: teacher.tenureAllowance || 0,
      educationAllowance: teacher.educationAllowance || 0, bpjsAllowance: teacher.bpjsAllowance || 0,
      qurbanAllowance: teacher.qurbanAllowance || 0, bpjsDeduction: teacher.bpjsDeduction || 0,
      qurbanDeduction: teacher.qurbanDeduction || 0, totalPenerimaan, totalPotongan, totalSalary
    };
  };

  const handleGenerateMassSlips = () => {
    const missingSlips: SalarySlip[] = [];
    teachers.forEach(teacher => {
      const existingSlip = slips.find(s => s.teacherId === teacher.id && s.month === selectedMonth && s.year === selectedYear);
      if (!existingSlip) {
        missingSlips.push(generateSlipObject(teacher, selectedMonth, selectedYear));
      }
    });
    
    if (missingSlips.length > 0) {
      setSlips(prev => [...missingSlips, ...prev]);
      alert(`Berhasil membuat ${missingSlips.length} slip gaji untuk ${selectedMonth} ${selectedYear}.`);
    } else {
      alert(`Semua slip gaji untuk ${selectedMonth} ${selectedYear} sudah dibuat sebelumnya.`);
    }
  };

  const handleGenerateSlip = (e: React.FormEvent) => {"""
content = content.replace("  const handleGenerateSlip = (e: React.FormEvent) => {", replacement1)


# 4. Refactor generate handle
pattern = r"const totalPenerimaan =[\s\S]*?const newSlip: SalarySlip = \{[\s\S]*?totalSalary\n    \};"
content = re.sub(pattern, "const newSlip = generateSlipObject(teacher, selectedMonth, selectedYear);", content)

# 5. Remove DataRow
pattern = r"  const DataRow = \(\{ label, value \}: \{ label: string, value: number \}\) => \([\s\S]*?\);\n"
content = re.sub(pattern, "", content)

# 6. Replace long HTML with SlipDocument
pattern = r'<div ref=\{slipRef\} className="bg-white shadow-xl rounded-lg p-10 flex flex-col max-w-4xl mx-auto w-full print-container print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none">[\s\S]*?<div className="flex justify-end mt-4 pr-16 text-center text-sm">\n\s*<div>\n\s*<p className="mb-20">Dibuat Oleh</p>\n\s*<p className="border-b border-black w-48 mx-auto"></p>\n\s*</div>\n\s*</div>\n\s*</div>'
replacement2 = '<div className="mx-auto flex justify-center w-full max-w-4xl print-container">\n          <SlipDocument slip={viewingSlip} ref={slipRef} />\n        </div>'
content = re.sub(pattern, replacement2, content)

# 7. Mass buttons
pattern = r'<p className="text-sm text-slate-500 mt-0\.5">Buat dan cetak slip gaji untuk guru\.</p>\n\s*</div>'
replacement3 = '<p className="text-sm text-slate-500 mt-0.5">Buat, cetak, dan jadwalkan slip gaji.</p>\n        </div>\n        <div className="flex gap-2">\n          <button onClick={handleGenerateMassSlips} className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-1.5 rounded-md transition-colors text-sm font-medium shadow-sm">\n            <FilePlus className="w-4 h-4" />\n            Buat Semua (Bulan Ini)\n          </button>\n          <button onClick={() => setIsMassScheduling(true)} className="flex items-center gap-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-4 py-1.5 rounded-md transition-colors text-sm font-medium shadow-sm">\n            <Clock className="w-4 h-4" />\n            Jadwalkan Semua\n          </button>\n        </div>'
content = re.sub(pattern, replacement3, content)

# 8. mass schedule submit
replacement4 = """  const handleMassScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleTime) return;
    
    const currentMonthSlips = slips.filter(s => s.month === selectedMonth && s.year === selectedYear);
    if (currentMonthSlips.length === 0) {
      alert(`Belum ada slip gaji untuk ${selectedMonth} ${selectedYear}. Buat terlebih dahulu.`);
      return;
    }

    setIsMassScheduling(false);
    setMassProcessStatus({ current: 0, total: currentMonthSlips.length, message: 'Memulai proses...' });

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < currentMonthSlips.length; i++) {
      const slip = currentMonthSlips[i];
      const teacher = teachers.find(t => t.id === slip.teacherId);
      
      setMassProcessStatus({ current: i + 1, total: currentMonthSlips.length, message: `Memproses slip untuk ${slip.teacherName}...` });
      
      if (!teacher || !teacher.phone) {
        failCount++;
        continue;
      }

      try {
        const slipElement = document.getElementById(`hidden-slip-${slip.id}`);
        if (!slipElement) throw new Error('Slip render element not found');

        const dataUrl = await toJpeg(slipElement, { cacheBust: true, quality: 0.6, pixelRatio: 1.5 });
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (slipElement.offsetHeight * pdfWidth) / slipElement.offsetWidth;
        pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        
        const base64Pdf = pdf.output('datauristring');
        const filename = `Slip_Gaji_${slip.teacherName.replace(r'\s+', '_')}_${slip.month}_${slip.year}.pdf`;
        const scheduleDate = new Date(scheduleTime).toISOString();

        const response = await fetch('/api/schedule-slip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: teacher.phone,
            base64Pdf,
            filename,
            caption: `Assalamualaikum Wr. Wb. Yth. ${teacher.name},\\n\\nBerikut terlampir Slip Gaji Anda untuk bulan ${slip.month} ${slip.year}.\\n\\nTerima kasih.`,
            scheduledTime: scheduleDate
          })
        });
        if (response.ok) successCount++; else failCount++;
      } catch (err) {
        failCount++;
      }
    }

    setMassProcessStatus(null);
    alert(`Proses penjadwalan massal selesai!\\nBerhasil: ${successCount}\\nGagal/Tidak ada nomor WA: ${failCount}`);
  };

  const handlePrint = () => {"""
content = content.replace("  const handlePrint = () => {", replacement4)

# 9. Appending at the end
replacement5 = """
      {/* Hidden Container for Mass Rendering */}
      <div style={{ position: 'absolute', top: -9999, left: -9999, opacity: 0, pointerEvents: 'none' }}>
        {slips.filter(s => s.month === selectedMonth && s.year === selectedYear).map(slip => (
          <div key={slip.id} id={`hidden-slip-${slip.id}`}>
            <SlipDocument slip={slip} />
          </div>
        ))}
      </div>

      {/* Mass Scheduling Modal */}
      {isMassScheduling && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                Jadwalkan Massal ({selectedMonth} {selectedYear})
              </h3>
              <button onClick={() => setIsMassScheduling(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleMassScheduleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Tanggal & Waktu Pengiriman</label>
                <input type="datetime-local" required value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none" />
                <p className="text-xs text-slate-500 mt-2">Semua slip untuk {selectedMonth} {selectedYear} akan dijadwalkan dan dikirim otomatis via WhatsApp Fonnte.</p>
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button type="button" onClick={() => setIsMassScheduling(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md">Batal</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md flex items-center gap-2"><Send className="w-4 h-4" /> Mulai Jadwalkan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mass Processing Overlay */}
      {massProcessStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Sedang Memproses...</h3>
            <p className="text-sm text-slate-500 mb-4">{massProcessStatus.message}</p>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${(massProcessStatus.current / massProcessStatus.total) * 100}%` }}></div>
            </div>
            <p className="text-xs font-bold text-slate-700 mt-3">{massProcessStatus.current} dari {massProcessStatus.total}</p>
          </div>
        </div>
      )}
    </div>
  );
}
"""
content = content.replace("    </div>\n  );\n}", replacement5)

with open('src/components/SalarySlip.tsx', 'w') as f:
    f.write(content)

