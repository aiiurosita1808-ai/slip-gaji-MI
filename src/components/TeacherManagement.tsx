import React, { useState, useRef } from 'react';
import { Teacher } from '../types';
import { Plus, Edit2, Trash2, X, Save, Users, Upload, Download } from 'lucide-react';

interface TeacherManagementProps {
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
}

export function TeacherManagement({ teachers, setTeachers }: TeacherManagementProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<Teacher, 'id'>>({
    nip: '',
    name: '',
    position: '',
    additionalTask: '',
    workTenure: '',
    phone: '',
    email: '',
    basicSalary: 0,
    teachingLoad: 0,
    homeroomIncentive: 0,
    annualPerformanceIncentive: 0,
    monthlyPerformanceIncentive: 0,
    tenureAllowance: 0,
    educationAllowance: 0,
    bpjsAllowance: 0,
    qurbanAllowance: 0,
    bpjsDeduction: 0,
    qurbanDeduction: 0,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const handleOpenForm = (teacher?: Teacher) => {
    if (teacher) {
      setFormData({
        nip: teacher.nip || '',
        name: teacher.name || '',
        position: teacher.position || '',
        additionalTask: teacher.additionalTask || '',
        workTenure: teacher.workTenure || '',
        phone: teacher.phone || '',
        email: teacher.email || '',
        basicSalary: teacher.basicSalary || 0,
        teachingLoad: teacher.teachingLoad || 0,
        homeroomIncentive: teacher.homeroomIncentive || 0,
        annualPerformanceIncentive: teacher.annualPerformanceIncentive || 0,
        monthlyPerformanceIncentive: teacher.monthlyPerformanceIncentive || 0,
        tenureAllowance: teacher.tenureAllowance || 0,
        educationAllowance: teacher.educationAllowance || 0,
        bpjsAllowance: teacher.bpjsAllowance || 0,
        qurbanAllowance: teacher.qurbanAllowance || 0,
        bpjsDeduction: teacher.bpjsDeduction || 0,
        qurbanDeduction: teacher.qurbanDeduction || 0,
      });
      setEditingId(teacher.id);
    } else {
      setFormData({
        nip: '',
        name: '',
        position: '',
        additionalTask: '',
        workTenure: '',
        phone: '',
        email: '',
        basicSalary: 0,
        teachingLoad: 0,
        homeroomIncentive: 0,
        annualPerformanceIncentive: 0,
        monthlyPerformanceIncentive: 0,
        tenureAllowance: 0,
        educationAllowance: 0,
        bpjsAllowance: 0,
        qurbanAllowance: 0,
        bpjsDeduction: 0,
        qurbanDeduction: 0,
      });
      setEditingId(null);
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setTeachers(teachers.map(t => t.id === editingId ? { ...formData, id: editingId } : t));
    } else {
      const newTeacher: Teacher = {
        ...formData,
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()
      };
      setTeachers([...teachers, newTeacher]);
    }
    handleCloseForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data guru ini?')) {
      setTeachers(teachers.filter(t => t.id !== id));
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const headers = [
      "NIP", "Nama Lengkap", "Jabatan", "Tugas Tambahan", "Masa Kerja", "Nomor WA",
      "Gaji Pokok", "Beban Jam Mengajar", "Insentif Walas", "Kinerja Tahunan", 
      "Kinerja Bulanan", "Tunjangan Masa Kerja", "Tunjangan Pendidikan", 
      "Tunjangan BPJS", "Tunjangan Qurban", "Potongan BPJS", "Potongan Qurban"
    ];
    
    const sampleData = [
      "1234567890", "Ahmad Syauqi S.Pd.I", "Guru Kelas", "Wali Kelas 4A", "5 Tahun", "08123456789",
      "2850000", "500000", "440000", "0", "330000", "200000", "0", "85000", "50000", "85000", "50000"
    ];

    const csvContent = headers.join(',') + '\n' + sampleData.join(',');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "template_guru.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) {
      alert('File CSV kosong atau tidak valid.');
      return;
    }

    const separator = lines[0].includes(';') ? ';' : ',';
    const headers = lines[0].split(separator).map(h => h.replace(/^["']|["']$/g, '').trim().toLowerCase());
    const newTeachers: Teacher[] = [];

    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i];
      const values = currentLine.split(separator).map(v => v.replace(/^["']|["']$/g, '').trim());

      if (values.length < 3) continue;

      const getVal = (key: string, isNumber = false) => {
        const idx = headers.findIndex(h => h.includes(key.toLowerCase()));
        if (idx === -1) return isNumber ? 0 : '';
        const val = values[idx]?.trim() || '';
        return isNumber ? Number(val.replace(/[^0-9.-]+/g, '')) || 0 : val;
      };

      const teacher: Teacher = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString() + i,
        nip: getVal('nip') as string,
        name: (getVal('nama') || getVal('name')) as string,
        position: (getVal('jabatan') || getVal('position')) as string,
        additionalTask: (getVal('tugas tambahan') || getVal('additionaltask')) as string,
        workTenure: (getVal('masa kerja') || getVal('worktenure')) as string,
        phone: (getVal('nomor wa') || getVal('phone') || getVal('telepon')) as string,
        basicSalary: (getVal('gaji pokok', true) || getVal('basicsalary', true)) as number,
        teachingLoad: (getVal('jam mengajar', true) || getVal('teachingload', true)) as number,
        homeroomIncentive: (getVal('insentif walas', true) || getVal('homeroomincentive', true)) as number,
        annualPerformanceIncentive: (getVal('kinerja tahunan', true) || getVal('annualperformance', true)) as number,
        monthlyPerformanceIncentive: (getVal('kinerja bulanan', true) || getVal('monthlyperformance', true)) as number,
        tenureAllowance: (getVal('tunjangan masa kerja', true) || getVal('tenureallowance', true)) as number,
        educationAllowance: (getVal('pendidikan', true) || getVal('educationallowance', true)) as number,
        bpjsAllowance: (getVal('tunjangan bpjs', true) || getVal('bpjsallowance', true)) as number,
        qurbanAllowance: (getVal('tunjangan qurban', true) || getVal('qurbanallowance', true)) as number,
        bpjsDeduction: (getVal('potongan bpjs', true) || getVal('bpjsdeduction', true)) as number,
        qurbanDeduction: (getVal('potongan qurban', true) || getVal('qurbandeduction', true)) as number,
      };
      
      if (teacher.name) {
         newTeachers.push(teacher);
      }
    }
    
    if (newTeachers.length > 0) {
      setTeachers(prev => [...prev, ...newTeachers]);
      alert(`Berhasil menambahkan ${newTeachers.length} guru dari file CSV.`);
    } else {
      alert('Gagal mengimpor data. Pastikan format kolom sesuai.');
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 gap-6 max-w-7xl mx-auto w-full">
      <section className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Data Guru</h1>
          <p className="text-sm text-slate-500 mt-0.5">Kelola data master guru madrasah.</p>
        </div>
        {!isFormOpen && (
          <div className="flex gap-2">
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-1.5 rounded-md text-sm font-medium shadow-sm transition-colors"
              title="Unduh Template CSV"
            >
              <Download className="w-4 h-4" />
              Template
            </button>
            
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-1.5 rounded-md text-sm font-medium shadow-sm transition-colors"
            >
              <Upload className="w-4 h-4" />
              Import CSV
            </button>
            <button
              onClick={() => handleOpenForm()}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-md text-sm font-medium shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Tambah Guru
            </button>
          </div>
        )}
      </section>

      {isFormOpen ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              {editingId ? 'Edit Data Guru' : 'Tambah Guru Baru'}
            </h2>
            <button onClick={handleCloseForm} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Informasi Umum</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-[11px] uppercase tracking-wide">Nama Lengkap</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full px-3 py-1.5 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-[11px] uppercase tracking-wide">NIP / NUPTK</label>
                  <input type="text" name="nip" required value={formData.nip} onChange={handleInputChange} className="w-full px-3 py-1.5 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-[11px] uppercase tracking-wide">Jabatan</label>
                  <input type="text" name="position" required value={formData.position} onChange={handleInputChange} className="w-full px-3 py-1.5 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-[11px] uppercase tracking-wide">Tugas Tambahan</label>
                  <input type="text" name="additionalTask" value={formData.additionalTask} onChange={handleInputChange} className="w-full px-3 py-1.5 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-[11px] uppercase tracking-wide">Masa Kerja</label>
                  <input type="text" name="workTenure" value={formData.workTenure} onChange={handleInputChange} className="w-full px-3 py-1.5 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors" placeholder="e.g. 5 Tahun" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-[11px] uppercase tracking-wide">Nomor WA</label>
                  <input type="text" name="phone" value={formData.phone || ''} onChange={handleInputChange} className="w-full px-3 py-1.5 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors" placeholder="e.g. 08123456789" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-[11px] uppercase tracking-wide">Email</label>
                  <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} className="w-full px-3 py-1.5 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors" placeholder="e.g. guru@example.com" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-bold text-emerald-700 mb-3 border-b border-slate-100 pb-2">Penerimaan (A)</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-[11px] uppercase tracking-wide">Gaji Pokok (Rp)</label>
                    <input type="number" name="basicSalary" min="0" required value={formData.basicSalary} onChange={handleInputChange} className="w-full px-3 py-1.5 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors font-mono" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-[11px] uppercase tracking-wide">Beban Jam Mengajar / JTM (Rp)</label>
                    <input type="number" name="teachingLoad" min="0" required value={formData.teachingLoad} onChange={handleInputChange} className="w-full px-3 py-1.5 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors font-mono" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-[11px] uppercase tracking-wide">Insentif Walas (Rp)</label>
                    <input type="number" name="homeroomIncentive" min="0" required value={formData.homeroomIncentive} onChange={handleInputChange} className="w-full px-3 py-1.5 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors font-mono" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-[11px] uppercase tracking-wide">Insentif Kinerja Tahunan (Rp)</label>
                    <input type="number" name="annualPerformanceIncentive" min="0" required value={formData.annualPerformanceIncentive} onChange={handleInputChange} className="w-full px-3 py-1.5 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors font-mono" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-[11px] uppercase tracking-wide">Insentif Kinerja Bulanan (Rp)</label>
                    <input type="number" name="monthlyPerformanceIncentive" min="0" required value={formData.monthlyPerformanceIncentive} onChange={handleInputChange} className="w-full px-3 py-1.5 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors font-mono" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-[11px] uppercase tracking-wide">Masa Kerja (Rp)</label>
                    <input type="number" name="tenureAllowance" min="0" required value={formData.tenureAllowance} onChange={handleInputChange} className="w-full px-3 py-1.5 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors font-mono" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-[11px] uppercase tracking-wide">Pendidikan (Rp)</label>
                    <input type="number" name="educationAllowance" min="0" required value={formData.educationAllowance} onChange={handleInputChange} className="w-full px-3 py-1.5 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors font-mono" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-[11px] uppercase tracking-wide">Iuran BPJS (Rp)</label>
                    <input type="number" name="bpjsAllowance" min="0" required value={formData.bpjsAllowance} onChange={handleInputChange} className="w-full px-3 py-1.5 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors font-mono" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-[11px] uppercase tracking-wide">Iuran Qurban (Rp)</label>
                    <input type="number" name="qurbanAllowance" min="0" required value={formData.qurbanAllowance} onChange={handleInputChange} className="w-full px-3 py-1.5 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors font-mono" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-red-600 mb-3 border-b border-slate-100 pb-2">Potongan (B)</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-[11px] uppercase tracking-wide">Iuran BPJS Ketenagakerjaan (Rp)</label>
                    <input type="number" name="bpjsDeduction" min="0" required value={formData.bpjsDeduction} onChange={handleInputChange} className="w-full px-3 py-1.5 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors font-mono" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-[11px] uppercase tracking-wide">Iuran Qurban (Rp)</label>
                    <input type="number" name="qurbanDeduction" min="0" required value={formData.qurbanDeduction} onChange={handleInputChange} className="w-full px-3 py-1.5 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors font-mono" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-slate-100 text-sm">
              <button
                type="button"
                onClick={handleCloseForm}
                className="px-4 py-1.5 text-slate-600 font-medium hover:bg-slate-100 rounded-md transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-1.5 rounded-md transition-colors font-medium shadow-sm"
              >
                <Save className="w-4 h-4" />
                Simpan Data
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-left">
                <tr>
                  <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nama & Jabatan</th>
                  <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tugas Tambahan</th>
                  <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Gaji Pokok</th>
                  <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teachers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <Users className="w-10 h-10 text-slate-300 mb-3" />
                        <p className="text-xs">Belum ada data guru.</p>
                        <p className="text-[10px] mt-1">Klik "Tambah Guru" untuk mulai menambahkan.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  teachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-xs font-bold text-slate-800">{teacher.name}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{teacher.position}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-600">
                        {teacher.additionalTask || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs font-bold text-slate-800 font-mono text-right">
                        {formatCurrency(teacher.basicSalary)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenForm(teacher)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(teacher.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
