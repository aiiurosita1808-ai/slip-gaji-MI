import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { TeacherManagement } from './components/TeacherManagement';
import { SalarySlipManager } from './components/SalarySlip';
import { SettingsManager } from './components/Settings';
import { useCloudStorage } from './hooks/useCloudStorage';
import { TabType, Teacher, SalarySlip, AppSettings } from './types';
import { auth, loginWithGoogle, logout } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

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

function AuthenticatedApp({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  
  const [teachers, setTeachers] = useCloudStorage<Teacher[]>('mi_teachers', []);
  const [slips, setSlips] = useCloudStorage<SalarySlip[]>('mi_slips', []);
  const [settings, setSettings] = useCloudStorage<AppSettings>('mi_settings', DEFAULT_SETTINGS);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-100 font-sans text-slate-800 overflow-hidden">
      <header className="flex items-center justify-between px-6 py-3 bg-emerald-800 text-white shadow-md shrink-0 no-print">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-emerald-800 font-bold">MI</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight hidden sm:block">Sistem Informasi Slip Gaji (SIP-MI)</h1>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <span className="hidden md:inline">Tahun Ajaran {settings.academicYear}</span>
          <div className="w-px h-4 bg-emerald-600 hidden md:block"></div>
          <span className="truncate max-w-[120px]">{user.displayName || user.email}</span>
          {user.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-emerald-400" />
          ) : (
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center border border-emerald-400">
              {user.email?.charAt(0).toUpperCase()}
            </div>
          )}
          <button onClick={logout} className="text-xs bg-emerald-700 hover:bg-emerald-600 px-3 py-1 rounded transition-colors">
            Keluar
          </button>
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

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-700 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="font-bold text-2xl">MI</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">SIP-MI</h1>
          <p className="text-slate-500 mb-8">Silakan masuk untuk mengelola data Slip Gaji Madrasah</p>
          <button 
            onClick={loginWithGoogle}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Masuk dengan Google
          </button>
        </div>
      </div>
    );
  }

  return <AuthenticatedApp user={user} />;
}
