import React, { useEffect, useState, useRef } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { SalarySlip, AppSettings } from '../types';
import { SlipDocument } from './SlipDocument';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

export function SharedSlipViewer({ slipId }: { slipId: string }) {
  const [data, setData] = useState<{ slip: SalarySlip, settings: AppSettings } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchSlip() {
      try {
        const docRef = doc(db, 'shared_slips', slipId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData(docSnap.data() as { slip: SalarySlip, settings: AppSettings });
        } else {
          setError('Slip gaji tidak ditemukan atau link sudah tidak berlaku.');
        }
      } catch (err) {
        console.error(err);
        setError('Gagal memuat slip gaji. Periksa koneksi internet Anda.');
      } finally {
        setLoading(false);
      }
    }
    fetchSlip();
  }, [slipId]);

  const downloadPdf = async () => {
    if (!printRef.current || !data) return;
    try {
      const imgData = await toPng(printRef.current, { quality: 1, pixelRatio: 2 });
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (printRef.current.offsetHeight * imgWidth) / printRef.current.offsetWidth;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Slip_Gaji_${data.slip.teacherName}_${data.slip.month}_${data.slip.year}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Gagal membuat PDF.');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Ops!</h2>
          <p className="text-slate-600 mb-6">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-200 py-8 px-4 flex flex-col items-center">
      <div className="max-w-3xl w-full flex justify-end mb-4">
        <button 
          onClick={downloadPdf}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium shadow flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Unduh PDF
        </button>
      </div>
      <div className="bg-white shadow-xl max-w-3xl w-full p-8" ref={printRef}>
        <SlipDocument slip={data.slip} settings={data.settings} />
      </div>
    </div>
  );
}
