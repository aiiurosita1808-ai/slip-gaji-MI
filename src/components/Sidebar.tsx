import React from 'react';
import { LayoutDashboard, Users, FileText, Settings } from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'teachers', label: 'Data Guru', icon: <Users className="w-4 h-4" /> },
    { id: 'slips', label: 'Slip Gaji', icon: <FileText className="w-4 h-4" /> },
    { id: 'settings', label: 'Pengaturan', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 no-print h-full">
      <nav className="flex-1 p-3 space-y-1">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Main Menu</div>
        <ul>
          {menuItems.map((item) => (
            <li key={item.id} className="mb-1">
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  activeTab === item.id 
                    ? 'bg-emerald-50 text-emerald-700 font-medium border-l-4 border-emerald-600' 
                    : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
