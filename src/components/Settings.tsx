import React from 'react';
import { AppSettings } from '../types';
import { Save, School, MessageCircle, Key, User } from 'lucide-react';

interface SettingsProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

export function SettingsManager({ settings, setSettings }: SettingsProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Pengaturan berhasil disimpan!');
  };

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto w-full flex flex-col gap-6 h-full overflow-y-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Pengaturan Sistem</h1>
        <p className="text-sm text-slate-500 mt-0.5">Konfigurasi data sekolah, penandatangan, dan template pesan.</p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6 pb-10">
        
        {/* Profil Sekolah */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
            <School className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-slate-700">Profil Sekolah</h2>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Nama Sekolah</label>
              <input
                type="text"
                name="schoolName"
                value={settings.schoolName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-colors"
                placeholder="MI AL-BAROKAH"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Tahun Ajaran</label>
              <input
                type="text"
                name="academicYear"
                value={settings.academicYear}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-colors"
                placeholder="2023/2024"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Alamat Lengkap</label>
              <input
                type="text"
                name="schoolAddress"
                value={settings.schoolAddress}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-colors"
                placeholder="Jl. Contoh No. 123"
              />
            </div>
          </div>
        </div>

        {/* Penandatangan */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
            <User className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-slate-700">Penandatangan Slip Gaji</h2>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Jabatan (Contoh: Kepala Sekolah / Bendahara)</label>
              <input
                type="text"
                name="signatoryRole"
                value={settings.signatoryRole}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-colors"
                placeholder="Kepala Madrasah"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Nama Penandatangan</label>
              <input
                type="text"
                name="signatoryName"
                value={settings.signatoryName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-colors"
                placeholder="Nama Lengkap"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">NIP (Opsional)</label>
              <input
                type="text"
                name="signatoryNip"
                value={settings.signatoryNip}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-colors"
                placeholder="NIP / NUPTK"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp & Fonnte */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-slate-700">Pesan WhatsApp & Fonnte API</h2>
          </div>
          <div className="p-5 flex flex-col gap-5">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Template Pesan Pengantar Slip</label>
              <textarea
                name="waTemplate"
                value={settings.waTemplate}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-colors"
                placeholder="Assalamualaikum Wr. Wb. Yth. [NAMA], Berikut terlampir Slip Gaji Anda untuk bulan [BULAN] [TAHUN]..."
                required
              />
              <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                Variabel yang tersedia: <br/>
                <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono">[NAMA]</code> untuk nama guru, 
                <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono ml-1">[BULAN]</code> untuk nama bulan, 
                <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono ml-1">[TAHUN]</code> untuk tahun
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-2">
                <Key className="w-3 h-3" /> Fonnte Device Token
              </label>
              <input
                type="text"
                name="fonnteToken"
                value={settings.fonnteToken}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-colors font-mono"
                placeholder="Masukkan API Token Fonnte..."
              />
              <p className="text-[11px] text-slate-500 mt-1.5">
                Kosongkan jika ingin menggunakan token default dari variabel environment sistem. Jika diisi, akan menimpa token default untuk pengiriman terjadwal maupun manual.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md shadow-sm transition-colors font-medium text-sm"
          >
            <Save className="w-4 h-4" />
            Simpan Pengaturan
          </button>
        </div>
      </form>
    </div>
  );
}
