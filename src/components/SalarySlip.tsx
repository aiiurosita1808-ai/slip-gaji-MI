import React, { useState, useRef } from 'react';
import { Teacher, SalarySlip, AppSettings } from '../types';
import { Printer, FilePlus, ChevronLeft, Download, Send, Clock, X, Mail, CheckCircle } from 'lucide-react';
import { toPng, toJpeg } from 'html-to-image';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import jsPDF from 'jspdf';
import { SlipDocument } from './SlipDocument';

interface SalarySlipProps {
  teachers: Teacher[];
  slips: SalarySlip[];
  setSlips: React.Dispatch<React.SetStateAction<SalarySlip[]>>;
  settings: AppSettings;
}

export function SalarySlipManager({ teachers, slips, setSlips, settings }: SalarySlipProps) {
  const generateMessage = (name: string, month: string, year: number) => {
    return settings.waTemplate.replace('[NAMA]', name).replace('[BULAN]', month).replace('[TAHUN]', year.toString());
  };
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toLocaleString('id-ID', { month: 'long' })
  );
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  
  const [viewingSlip, setViewingSlip] = useState<SalarySlip | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleTime, setScheduleTime] = useState('');
  const slipRef = useRef<HTMLDivElement>(null);
  
  // Mass operations state
  const [isMassScheduling, setIsMassScheduling] = useState(false);
  const [massProcessStatus, setMassProcessStatus] = useState<{current: number, total: number, message: string} | null>(null);

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(amount);
  };

  const generateSlipObject = (teacher: Teacher, month: string, year: number): SalarySlip => {
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

  const handleGenerateSlip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacherId) {
      alert('Pilih guru terlebih dahulu!');
      return;
    }

    const teacher = teachers.find(t => t.id === selectedTeacherId);
    if (!teacher) return;

    const existingSlip = slips.find(s => s.teacherId === teacher.id && s.month === selectedMonth && s.year === selectedYear);
    if (existingSlip) {
      alert(`Slip gaji untuk ${teacher.name} pada ${selectedMonth} ${selectedYear} sudah dibuat.`);
      setViewingSlip(existingSlip);
      return;
    }

    const newSlip = generateSlipObject(teacher, selectedMonth, selectedYear);

    setSlips([newSlip, ...slips]);
    setViewingSlip(newSlip);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!viewingSlip || !slipRef.current) return;
    
    try {
      const dataUrl = await toPng(slipRef.current, { quality: 1, pixelRatio: 2 });
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (slipRef.current.offsetHeight * pdfWidth) / slipRef.current.offsetWidth;
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Slip_Gaji_${viewingSlip.teacherName.replace(/\s+/g, '_')}_${viewingSlip.month}_${viewingSlip.year}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Terjadi kesalahan saat membuat PDF.');
    }
  };

  const handleSendEmail = async () => {
    if (!viewingSlip || !slipRef.current) return;
    
    const teacher = teachers.find(t => t.id === viewingSlip.teacherId);
    if (!teacher || !teacher.email) {
      alert('Email guru belum diisi! Silakan lengkapi di menu Data Guru.');
      return;
    }

    try {
      const dataUrl = await toPng(slipRef.current, { quality: 0.8, pixelRatio: 1.5 });
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (slipRef.current.offsetHeight * pdfWidth) / slipRef.current.offsetWidth;
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const base64Pdf = pdf.output('datauristring');
      const filename = `Slip_Gaji_${viewingSlip.teacherName.replace(/\s+/g, '_')}_${viewingSlip.month}_${viewingSlip.year}.pdf`;

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: teacher.email,
          base64Pdf,
          filename,
          subject: `Slip Gaji ${viewingSlip.month} ${viewingSlip.year} - ${teacher.name}`,
          text: generateMessage(teacher.name, viewingSlip.month, viewingSlip.year),
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      alert('Email berhasil dikirim!');
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat mengirim email. Pastikan konfigurasi SMTP sudah benar.');
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingSlip || !scheduleTime) return;

    const teacher = teachers.find(t => t.id === viewingSlip.teacherId);
    if (!teacher || !teacher.phone) {
      alert('Nomor WA guru belum diisi! Silakan lengkapi di menu Data Guru.');
      return;
    }

    try {
      // Generate a unique ID for the shared slip
      const sharedId = viewingSlip.id + '_' + Date.now().toString(36);
      
      // Save to Firestore shared_slips
      await setDoc(doc(db, 'shared_slips', sharedId), {
        slip: viewingSlip,
        settings: settings
      });

      const slipLink = `https://slipgajimialbarokah.netlify.app/?shared=${sharedId}`;
      const finalMessage = `${generateMessage(teacher.name, viewingSlip.month, viewingSlip.year)}

Silakan klik tautan berikut untuk melihat atau mengunduh slip gaji Anda:
${slipLink}`;
      const scheduleDate = new Date(scheduleTime).toISOString();

      // Format schedule for Fonnte: YYYY-MM-DD HH:mm:ss
      const dateObj = new Date(scheduleDate);
      const pad = (n: number) => n.toString().padStart(2, '0');
      const formattedSchedule = `${dateObj.getFullYear()}-${pad(dateObj.getMonth()+1)}-${pad(dateObj.getDate())} ${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:${pad(dateObj.getSeconds())}`;
      
      // Send to Fonnte using URLSearchParams string
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
      });

      const result = await response.json();
      if (!response.ok || result.status === false) {
        throw new Error(result.reason || 'Failed to schedule');
      }

      alert('Berhasil dijadwalkan! Slip gaji akan dikirim via WhatsApp sesuai jadwal.');
      setIsScheduling(false);
    } catch (error) {
      console.error(error);
      alert('Gagal menjadwalkan: ' + (error instanceof Error ? error.message : 'Silakan coba lagi.'));
    }
  };

  const handleMassScheduleSubmit = async (e: React.FormEvent) => {
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
        const sharedId = slip.id + '_' + Date.now().toString(36);
        await setDoc(doc(db, 'shared_slips', sharedId), {
          slip: slip,
          settings: settings
        });

        const slipLink = `https://slipgajimialbarokah.netlify.app/?shared=${sharedId}`;
        const finalMessage = `${generateMessage(teacher.name, slip.month, slip.year)}

Silakan klik tautan berikut untuk melihat atau mengunduh slip gaji Anda:
${slipLink}`;

        // Stagger schedule time by 15 seconds for each slip to avoid spam triggers
        const staggerMs = i * 15 * 1000; 
        const scheduleDate = new Date(new Date(scheduleTime).getTime() + staggerMs).toISOString();

        // Format schedule for Fonnte: YYYY-MM-DD HH:mm:ss
        const dateObj = new Date(scheduleDate);
        const pad = (n: number) => n.toString().padStart(2, '0');
        const formattedSchedule = `${dateObj.getFullYear()}-${pad(dateObj.getMonth()+1)}-${pad(dateObj.getDate())} ${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:${pad(dateObj.getSeconds())}`;

        // Send to Fonnte using URLSearchParams string
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
        });
        const result = await response.json();
        if (response.ok && result.status !== false) successCount++; else failCount++;
      } catch (err) {
        failCount++;
      }
    }

    setMassProcessStatus(null);
    alert(`Proses penjadwalan massal selesai!\nBerhasil: ${successCount}\nGagal/Tidak ada nomor WA: ${failCount}`);
  };

  if (viewingSlip) {
    return (
      <div className="flex-1 flex flex-col p-6 max-w-7xl mx-auto w-full">
        <div className="mb-4 flex justify-between items-center no-print">
          <button 
            onClick={() => setViewingSlip(null)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali
          </button>
          <div className="flex gap-2">
            <button 
              onClick={handleDownloadPdf}
              className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-1.5 rounded-md transition-colors text-sm font-medium shadow-sm"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button 
              onClick={handleSendEmail}
              className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-1.5 rounded-md transition-colors text-sm font-medium shadow-sm"
            >
              <Mail className="w-4 h-4" />
              Kirim Email
            </button>
            <button 
              onClick={() => setIsScheduling(true)}
              className="flex items-center gap-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-4 py-1.5 rounded-md transition-colors text-sm font-medium shadow-sm"
            >
              <Send className="w-4 h-4" />
              Kirim WA (Terjadwal)
            </button>
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-md transition-colors text-sm font-medium shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Cetak Slip
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="mx-auto flex justify-center w-full max-w-4xl print-container">
          <SlipDocument slip={viewingSlip} ref={slipRef} settings={settings} />
        </div>

        {isScheduling && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  Jadwalkan Pengiriman WA
                </h3>
                <button onClick={() => setIsScheduling(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleScheduleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Tanggal & Waktu Pengiriman</label>
                  <input
                    type="datetime-local"
                    required
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Slip gaji akan dikirim secara otomatis ke nomor WA guru pada waktu yang ditentukan menggunakan Fonnte API.
                  </p>
                </div>
                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setIsScheduling(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Simpan Jadwal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6 gap-6 max-w-7xl mx-auto w-full no-print">
      <section className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Buat Slip Gaji</h1>
          <p className="text-sm text-slate-500 mt-0.5">Buat, cetak, dan jadwalkan slip gaji.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleGenerateMassSlips} className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-1.5 rounded-md transition-colors text-sm font-medium shadow-sm">
            <FilePlus className="w-4 h-4" />
            Buat Semua (Bulan Ini)
          </button>
          <button onClick={() => setIsMassScheduling(true)} className="flex items-center gap-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-4 py-1.5 rounded-md transition-colors text-sm font-medium shadow-sm">
            <Clock className="w-4 h-4" />
            Jadwalkan Semua
          </button>
        </div>
      </section>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <form onSubmit={handleGenerateSlip} className="flex flex-col md:flex-row gap-3 items-end">
          <div className="flex-1 w-full">
            <label className="block font-bold text-slate-700 mb-1 text-[11px] uppercase tracking-wide">Pilih Guru</label>
            <select
              required
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors bg-white text-sm"
            >
              <option value="" disabled>-- Pilih Guru --</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.name} - {t.position}</option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-40">
            <label className="block font-bold text-slate-700 mb-1 text-[11px] uppercase tracking-wide">Bulan</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors bg-white text-sm"
            >
              {months.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-28">
            <label className="block font-bold text-slate-700 mb-1 text-[11px] uppercase tracking-wide">Tahun</label>
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-1.5 rounded-md transition-colors text-sm font-medium shadow-sm h-[34px]"
          >
            <FilePlus className="w-4 h-4" />
            Buat
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Riwayat Slip Gaji</h2>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm">
            <thead className="bg-white border-b border-slate-200 text-left">
              <tr>
                <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tanggal Dibuat</th>
                <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nama Guru</th>
                <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Periode</th>
                <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Total Gaji</th>
                <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {slips.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500 text-xs">
                    Belum ada riwayat slip gaji.
                  </td>
                </tr>
              ) : (
                slips.map((slip) => (
                  <tr key={slip.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-600">
                      {new Date(slip.date).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs font-bold text-slate-800">
                      {slip.teacherName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-600">
                      {slip.month} {slip.year}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs font-bold text-emerald-700 font-mono text-right">
                      Rp {formatCurrency(slip.totalSalary)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <button
                        onClick={() => setViewingSlip(slip)}
                        className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 px-2 py-1 rounded-md text-xs font-bold transition-colors"
                      >
                        Lihat Slip
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hidden Container for Mass Rendering */}
      <div style={{ position: 'absolute', top: -9999, left: -9999, opacity: 0, pointerEvents: 'none' }}>
        {slips.filter(s => s.month === selectedMonth && s.year === selectedYear).map(slip => (
          <div key={slip.id} id={`hidden-slip-${slip.id}`}>
            <SlipDocument slip={slip} settings={settings} />
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
