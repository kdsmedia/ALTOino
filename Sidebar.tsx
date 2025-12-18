import React, { useState } from 'react';
import { 
  Cpu, Box, History, ChevronDown, ChevronRight, Zap, Eye, Activity, 
  Sliders, Radio, X, Layout, Layers, FolderTree, CircuitBoard, 
  BookOpen, Star, HelpCircle, Shield, Info, FileText, AlertCircle, Send,
  Sparkles, LogOut, User, Cloud, Lock, UserPlus
} from 'lucide-react';
import { HARDWARE_COMPONENTS, EXAMPLE_PROJECTS } from './constants';
import { ArduinoProject, ComponentType, HardwareComponent } from './types';
import { AdBanner } from './components/AdContainer';
import { logout } from './services/firebaseService';
import { User as FirebaseUser } from 'firebase/auth';

interface SidebarProps {
  onSelectComponent: (comp: HardwareComponent) => void;
  projects: ArduinoProject[];
  onSelectProject: (id: string) => void;
  onSelectExample: (example: any) => void;
  activeProjectId: string | null;
  onClose?: () => void;
  onShowInfo?: (modal: string) => void;
  onOpenProfile?: () => void;
  onOpenAuth?: () => void;
  user: FirebaseUser | null;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  onSelectComponent, 
  projects, 
  onSelectProject,
  onSelectExample,
  activeProjectId,
  onClose,
  onShowInfo,
  onOpenProfile,
  onOpenAuth,
  user
}) => {
  const [isHardwareMenuOpen, setIsHardwareMenuOpen] = useState(false);
  const [isExamplesOpen, setIsExamplesOpen] = useState(false);
  const [isInfoMenuOpen, setIsInfoMenuOpen] = useState(false);
  
  const groupedComponents = HARDWARE_COMPONENTS.reduce((acc, comp) => {
    const key = comp.type;
    if (!acc[key]) acc[key] = [];
    acc[key].push(comp);
    return acc;
  }, {} as Record<string, HardwareComponent[]>);

  return (
    <div className="h-full bg-slate-900 border-r border-slate-800 flex flex-col shadow-2xl overflow-hidden select-none">
      <div className="p-5 border-b border-slate-800 bg-slate-900/50 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xl">
            <CircuitBoard className="w-6 h-6 animate-pulse" />
            <span className="tracking-tighter text-white font-black">ALTO<span className="text-emerald-500 font-normal">ino</span></span>
          </div>
          {onClose && (
            <button onClick={onClose} className="md:hidden p-1.5 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="relative group">
          {user ? (
            <div 
              onClick={onOpenProfile}
              className="flex items-center gap-3 p-2.5 bg-slate-950 border border-slate-800 rounded-2xl cursor-pointer hover:bg-slate-800 hover:border-emerald-500/30 transition-all group"
            >
              <div className="relative">
                {user.photoURL ? (
                  <img src={user.photoURL} className="w-9 h-9 rounded-full border border-emerald-500/30 group-hover:scale-105 transition-transform shadow-lg" alt="profile" />
                ) : (
                  <div className="w-9 h-9 rounded-full border border-emerald-500/30 bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-black text-xs uppercase">
                    {user.displayName?.charAt(0) || user.email?.charAt(0)}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center">
                  <Cloud className="w-2 h-2 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-white truncate">{user.displayName || 'Operator'}</p>
                <p className="text-[8px] text-emerald-500 font-mono uppercase font-black">Open Cloud Profile</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); logout(); }} className="p-2 text-slate-700 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-emerald-600 text-white rounded-[20px] font-black text-[10px] uppercase tracking-[0.15em] hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-950/20 active:scale-[0.97] group overflow-hidden relative"
            >
              <div className="absolute inset-0 animate-shine pointer-events-none"></div>
              <UserPlus className="w-4 h-4 shrink-0" />
              <span>Sign In / Join</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5 space-y-3 custom-scrollbar">
        <div className="space-y-1">
          <button onClick={() => setIsExamplesOpen(!isExamplesOpen)} className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all ${isExamplesOpen ? 'bg-amber-500/10 text-amber-300' : 'text-slate-400 hover:bg-slate-800'}`}>
            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Library Proyek</span>
            </div>
            {isExamplesOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          {isExamplesOpen && (
            <div className="ml-4 pl-3 border-l border-amber-500/20 py-1 space-y-1">
              {EXAMPLE_PROJECTS.map((ex, i) => (
                <button key={i} onClick={() => onSelectExample(ex)} className="w-full text-left px-3 py-2 text-[10px] text-slate-400 hover:text-white truncate transition-colors">{ex.name}</button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <button onClick={() => setIsHardwareMenuOpen(!isHardwareMenuOpen)} className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all ${isHardwareMenuOpen ? 'bg-emerald-500/10 text-emerald-300' : 'text-slate-400 hover:bg-slate-800'}`}>
            <div className="flex items-center gap-3">
              <FolderTree className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Katalog Hardware</span>
            </div>
            {isHardwareMenuOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          {isHardwareMenuOpen && (
            <div className="ml-4 pl-3 border-l border-emerald-500/20 py-2 space-y-3">
              {Object.values(ComponentType).map(type => (
                <div key={type} className="space-y-1">
                  <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">{type}</p>
                  {groupedComponents[type]?.map(comp => (
                    <button key={comp.name} onClick={() => onSelectComponent(comp)} className="w-full text-left px-2 py-1.5 text-[10px] text-slate-400 hover:text-white truncate">{comp.name}</button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="h-px bg-slate-800 my-4 opacity-50" />

        <div>
          <div className="px-3 py-2 flex items-center justify-between text-slate-600">
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
               <History className="w-4 h-4" /> Riwayat Sketsa
             </div>
             {user && <Zap className="w-3 h-3 text-emerald-500 animate-pulse" />}
          </div>
          <div className="mt-2 space-y-1">
            {projects.map((proj: ArduinoProject) => (
              <button key={proj.id} onClick={() => onSelectProject(proj.id)} className={`w-full text-left px-4 py-3 text-[11px] rounded-xl border transition-all truncate flex items-center gap-3 ${activeProjectId === proj.id ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-bold' : 'text-slate-400 border-transparent hover:bg-slate-800'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${activeProjectId === proj.id ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-slate-700'}`} />
                <span className="truncate">{proj.name}</span>
              </button>
            ))}
            {projects.length === 0 && <p className="text-[9px] text-slate-700 italic px-4 py-4">Belum ada proyek lokal/cloud.</p>}
          </div>
        </div>
      </div>

      <AdBanner id="ad-sidebar-bottom" />

      <div className="p-5 border-t border-slate-800 bg-slate-900/80">
        <div className="flex items-center justify-between px-3 py-2 bg-slate-950 rounded-xl border border-slate-800">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">MCU Link</span>
            <span className="text-[9px] font-bold text-emerald-500">READY</span>
          </div>
          <Zap className="w-4 h-4 text-emerald-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;