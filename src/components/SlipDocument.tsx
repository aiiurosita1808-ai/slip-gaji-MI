import React, { forwardRef } from 'react';
import { SalarySlip, AppSettings } from '../types';

interface SlipDocumentProps {
  slip: SalarySlip;
  settings: AppSettings;
}

export const SlipDocument = forwardRef<HTMLDivElement, SlipDocumentProps>(({ slip, settings }, ref) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(amount);
  };

  const DataRow = ({ label, value }: { label: string, value: number }) => (
    <div className="flex items-center py-2 text-sm relative">
      <span className="flex-1 text-slate-800 bg-white pr-2 relative z-10">{label}</span>
      <div className="absolute w-full h-[1px] bg-slate-100 top-1/2 -translate-y-1/2 z-0"></div>
      <div className="flex w-32 justify-between bg-white pl-2 z-10">
        <span className="text-slate-800">Rp</span>
        <span className="text-slate-900 border-b border-slate-400 text-right w-24">{formatCurrency(value)}</span>
      </div>
    </div>
  );

  return (
    <div ref={ref} className="bg-white shadow-xl rounded-lg p-10 flex flex-col w-[800px] print-container print:shadow-none print:border-none print:p-0 print:m-0 print:w-full">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-black tracking-wide text-black mb-1">SLIP GAJI</h1>
        <h2 className="text-2xl font-black tracking-wide text-black">{settings.schoolName.toUpperCase()}</h2>
        <p className="text-sm font-semibold">Tahun Ajaran {settings.academicYear}</p>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-6 font-semibold text-sm">
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="w-24">Nama</span>
            <span>: </span>
            <span className="flex-1 ml-2 border-b border-black">{slip.teacherName}</span>
          </div>
          <div className="flex items-center">
            <span className="w-24">Jabatan</span>
            <span>: </span>
            <span className="flex-1 ml-2 border-b border-black">{slip.teacherPosition}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="w-32">Tugas Tambahan</span>
            <span>: </span>
            <span className="flex-1 ml-2 border-b border-black">{slip.teacherAdditionalTask || '\u00A0'}</span>
          </div>
          <div className="flex items-center">
            <span className="w-32">Masa Kerja</span>
            <span>: </span>
            <span className="flex-1 ml-2 border-b border-black">{slip.teacherWorkTenure || '\u00A0'}</span>
          </div>
        </div>
      </div>

      <div className="border border-green-700 mb-8 mt-4">
        <div className="grid grid-cols-2 border-b border-green-700">
          <div className="text-center py-2 font-bold text-green-700 border-r border-green-700">PENERIMAAN (A)</div>
          <div className="text-center py-2 font-bold text-green-700">POTONGAN (B)</div>
        </div>
        <div className="grid grid-cols-2">
          <div className="p-4 pr-6 border-r border-green-700">
            <div className="space-y-1">
              <DataRow label="Gaji Pokok" value={slip.basicSalary} />
              <DataRow label="Beban Jam Mengajar (JTM)" value={slip.teachingLoad} />
              <DataRow label="Insentif Walas" value={slip.homeroomIncentive} />
              <DataRow label="Insentif Kinerja Tahunan" value={slip.annualPerformanceIncentive} />
              <DataRow label="Insentif Kinerja Bulanan" value={slip.monthlyPerformanceIncentive} />
              <DataRow label="Masa Kerja" value={slip.tenureAllowance} />
              <DataRow label="Pendidikan" value={slip.educationAllowance} />
              <DataRow label="Iuran BPJS" value={slip.bpjsAllowance} />
              <DataRow label="Iuran Qurban" value={slip.qurbanAllowance} />
            </div>
          </div>
          <div className="p-4 pr-6 flex flex-col justify-between">
            <div className="space-y-1">
              <DataRow label="Iuran BPJS Ketenagakerjaan" value={slip.bpjsDeduction} />
              <DataRow label="Iuran Qurban" value={slip.qurbanDeduction} />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 border-t border-green-700 font-bold">
          <div className="p-4 pr-6 flex justify-between items-center border-r border-green-700">
            <span>JUMLAH PENERIMAAN</span>
            <div className="flex w-32 justify-between">
              <span>Rp</span>
              <span className="text-right w-24 border-b border-black">{formatCurrency(slip.totalPenerimaan)}</span>
            </div>
          </div>
          <div className="p-4 pr-6 flex justify-between items-center">
            <span>JUMLAH POTONGAN</span>
            <div className="flex w-32 justify-between">
              <span>Rp</span>
              <span className="text-right w-24 border-b border-black">{formatCurrency(slip.totalPotongan)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-16 text-[15px]">
        <div className="flex font-black items-center">
          <span>TOTAL YANG DITERIMA (A-B): Rp </span>
          <span className="w-64 border-b border-black ml-2 inline-block px-1 text-right">{formatCurrency(slip.totalSalary)}</span>
        </div>
      </div>

      <div className="flex justify-end mt-4 pr-16 text-center text-sm font-semibold">
        <div>
          <p className="mb-20">{settings.signatoryRole}</p>
          <div className="w-48 mx-auto">
            <p className="border-b border-black whitespace-nowrap">{settings.signatoryName}</p>
            {settings.signatoryNip && <p className="mt-1 text-xs">NIP. {settings.signatoryNip}</p>}
          </div>
        </div>
      </div>
    </div>
  );
});
