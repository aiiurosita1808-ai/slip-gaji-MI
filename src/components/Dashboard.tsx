import React from 'react';
import { Users, FileText, CheckCircle, TrendingUp } from 'lucide-react';
import { Teacher, SalarySlip } from '../types';

interface DashboardProps {
  teachers: Teacher[];
  slips: SalarySlip[];
}

export function Dashboard({ teachers, slips }: DashboardProps) {
  const currentMonth = new Date().toLocaleString('id-ID', { month: 'long' });
  const currentYear = new Date().getFullYear();
  
  const currentMonthSlips = slips.filter(s => s.month === currentMonth && s.year === currentYear);
  const totalSalaryThisMonth = currentMonthSlips.reduce((acc, slip) => acc + slip.totalSalary, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="flex-1 flex flex-col p-6 gap-6 max-w-7xl mx-auto w-full">
      <section className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Ringkasan sistem penggajian guru bulan {currentMonth} {currentYear}.</p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 flex items-start gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-md">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Total Guru</p>
            <h3 className="text-lg font-bold text-slate-800 mt-0.5">{teachers.length}</h3>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 flex items-start gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-md">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Slip Tercetak</p>
            <h3 className="text-lg font-bold text-slate-800 mt-0.5">{currentMonthSlips.length}</h3>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 flex items-start gap-3 md:col-span-2">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-md">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Total Pengeluaran Gaji</p>
            <h3 className="text-lg font-bold text-slate-800 mt-0.5 font-mono">{formatCurrency(totalSalaryThisMonth)}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Slip Gaji Terakhir Dibuat</h2>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm">
            <thead className="bg-white border-b border-slate-200 text-left">
              <tr>
                <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tanggal</th>
                <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nama Guru</th>
                <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Periode</th>
                <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Total Gaji</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {slips.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500 text-xs">
                    Belum ada slip gaji yang dibuat.
                  </td>
                </tr>
              ) : (
                [...slips].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5).map((slip) => (
                  <tr key={slip.id} className="hover:bg-slate-50">
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
                      {formatCurrency(slip.totalSalary)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
