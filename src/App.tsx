import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { TeacherManagement } from './components/TeacherManagement';
import { SalarySlipManager } from './components/SalarySlip';
import { SettingsManager } from './components/Settings';
import { useLocalStorage } from './hooks/useLocalStorage';
import { TabType, Teacher, SalarySlip, AppSettings } from './types';

const DEFAULT_SETTINGS: AppSettings = {
  schoolName: 'MI AL-BAROKAH',
  schoolAddress: '',
  academicYear: '2023/2024',
  signatoryRole: 'Kepala Madrasah',
  signatoryName: 'H. Fulan, S.Pd.I',
  signatoryNip: '',
  waTemplate: 'Assalamualaikum Wr. Wb. Yth. [NAMA],\n\nBerikut terlampir Slip Gaji Anda untuk bulan [BULAN] [TAHUN].\n\nTerima kasih.',
  fonnteToken: ''
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  
  const [teachers, setTeachers] = useLocalStorage<Teacher[]>('mi_teachers', []);
  const [slips, setSlips] = useLocalStorage<SalarySlip[]>('mi_slips', []);
  const [settings, setSettings] = useLocalStorage<AppSettings>('mi_settings', DEFAULT_SETTINGS);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-100 font-sans text-slate-800 overflow-hidden">
      <header className="flex items-center justify-between px-6 py-3 bg-emerald-800 text-white shadow-md shrink-0 no-print">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-emerald-800 font-bold">MI</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight">Sistem Informasi Slip Gaji (SIP-MI)</h1>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <span>Tahun Ajaran {settings.academicYear}</span>
          <div className="w-px h-4 bg-emerald-600"></div>
          <span>Admin: Siti Aminah</span>
          <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center border border-emerald-400">SA</div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 flex flex-col overflow-y-auto w-full print:w-full print:overflow-visible">
          {activeTab === 'dashboard' && <Dashboard teachers={teachers} slips={slips} />}
          {activeTab === 'teachers' && <TeacherManagement teachers={teachers} setTeachers={setTeachers} />}
          {activeTab === 'slips' && <SalarySlipManager teachers={teachers} slips={slips} setSlips={setSlips} settings={settings} />}
          {activeTab === 'settings' && <SettingsManager settings={settings} setSettings={setSettings} />}
        </main>
      </div>
    </div>
  );
}

