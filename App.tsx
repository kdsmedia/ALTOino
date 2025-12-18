
import React, { useState, useEffect } from 'react';
import { 
  Send, Code, Loader2, MessageSquare, Sparkles, Layout, Menu, ChevronUp, ChevronDown, 
  FlaskConical, Library as LibraryIcon, Beaker,
  CircuitBoard, Zap, CloudSync, Lock
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import CircuitCanvas from './components/CircuitCanvas';
import LibraryManager from './components/LibraryManager';
import ControlPanel from './components/ControlPanel';
import VirtualLab from './components/VirtualLab';
import SerialPlotter from './components/SerialPlotter';
import TestHarness from './components/TestHarness';
import ProfileView from './components/ProfileView';
import AdminPanel from './components/AdminPanel';
import AuthModal from './components/AuthModal';
import { AdInterstitial } from './components/AdContainer';
import { arduinoAI } from './services/geminiService';
import { auth, syncProjectToCloud, fetchCloudProjects, deleteProjectFromCloud, incrementProjectCount, ensureUserProfile } from './services/firebaseService';
import { onAuthStateChanged, User } from 'firebase/auth';
import { ArduinoProject, HardwareComponent, UserProfile } from './types';

const App: React.FC = () => {
  const [projects, setProjects] = useState<ArduinoProject[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [promptValue, setPromptValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSyncingWiring, setIsSyncingWiring] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'code' | 'simulation' | 'test' | 'libraries' | 'controls' | 'profile' | 'admin'>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCircuitVisible, setIsCircuitVisible] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [showInterstitial, setShowInterstitial] = useState(false);
  const [isAdRewarded, setIsAdRewarded] = useState(false);
  const [adRewardCallback, setAdRewardCallback] = useState<(() => void) | null>(null);

  const [showSplash, setShowSplash] = useState(true);
  const [splashProgress, setSplashProgress] = useState(0);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const profile = await ensureUserProfile(u);
        setUserProfile(profile);
        setIsCloudSyncing(true);
        const cloudData = await fetchCloudProjects(u.uid);
        if (cloudData.length > 0) {
          setProjects(cloudData);
          setActiveProjectId(cloudData[0].id);
        }
        setIsCloudSyncing(false);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const activeProject = projects.find(p => p.id === activeProjectId);

  const handleGenerate = async (customPrompt?: string, suggestedLibs: string[] = []) => {
    const targetPrompt = customPrompt || promptValue;
    if (!targetPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const context = activeProject ? { 
        code: activeProject.code, 
        wiring: activeProject.wiring,
        batteryType: activeProject.batteryType,
        controls: activeProject.controls
      } : undefined;
      
      const result = await arduinoAI.generateArduinoCode(targetPrompt, context);
      
      const mergedLibs = Array.from(new Set([...(activeProject?.libraries || []), ...result.libraries, ...suggestedLibs]));

      if (activeProject) {
        setProjects(prev => prev.map(p => 
          p.id === activeProject.id 
            ? { ...p, code: result.code, wiring: result.wiringInstructions, description: result.explanation, libraries: mergedLibs } 
            : p
        ));
      } else {
        const newProject: ArduinoProject = {
          id: Date.now().toString(),
          name: targetPrompt.substring(0, 30),
          code: result.code,
          description: result.explanation,
          libraries: mergedLibs,
          wiring: result.wiringInstructions,
          controls: [],
          batteryType: 'USB 5V',
          createdAt: Date.now()
        };
        setProjects(prev => [newProject, ...prev]);
        setActiveProjectId(newProject.id);
      }
      if (user) await incrementProjectCount(user.uid);
      setPromptValue('');
      setActiveTab('code');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSyncAI = async () => {
    if (!activeProject) return;
    setIsSyncingWiring(true);
    try {
      const updatedWiring = await arduinoAI.syncWiringWithHardware(
        activeProject.code,
        activeProject.controls,
        activeProject.batteryType || 'USB 5V'
      );
      setProjects(prev => prev.map(p => 
        p.id === activeProject.id ? { ...p, wiring: updatedWiring } : p
      ));
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncingWiring(false);
    }
  };

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-[#020617] z-[100] flex flex-col items-center justify-center">
        <CircuitBoard className="w-20 h-20 text-emerald-500 animate-pulse mb-4" />
        <h1 className="text-4xl font-black text-white">ALTO<span className="text-emerald-500">ino</span></h1>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 overflow-hidden relative">
      {syncSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white px-6 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
          <Zap className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Wiring Berhasil Disinkronisasi!</span>
        </div>
      )}

      <div className={`fixed inset-y-0 left-0 z-[70] w-64 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar 
          onSelectComponent={(comp) => handleGenerate(`Tambahkan: ${comp.name}`, comp.libraries)} 
          onSelectExample={(ex) => {
             const newProject = { ...ex, id: Date.now().toString(), createdAt: Date.now() };
             setProjects(prev => [newProject, ...prev]);
             setActiveProjectId(newProject.id);
             setActiveTab('code');
          }}
          projects={projects}
          onSelectProject={(id) => { setActiveProjectId(id); setActiveTab('code'); }}
          activeProjectId={activeProjectId}
          onClose={() => setIsSidebarOpen(false)}
          onOpenProfile={() => setActiveTab('profile')}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          user={user}
        />
      </div>

      <main className="flex-1 flex flex-col min-w-0 h-full">
        {activeTab === 'admin' ? (
          <AdminPanel onBack={() => setActiveTab('chat')} />
        ) : (
          <>
            <div className={`transition-all duration-300 flex flex-col relative overflow-hidden shrink-0 ${isCircuitVisible && activeTab !== 'profile' ? 'h-[35%]' : 'h-0'}`}>
              <header className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between z-20">
                <div className="flex items-center gap-3">
                  <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-1 text-slate-400"><Menu className="w-5 h-5" /></button>
                  <h1 className="text-sm font-bold truncate">{activeProject?.name || "ALTOino IDE"}</h1>
                  {isCloudSyncing && <CloudSync className="w-3.5 h-3.5 text-emerald-500 animate-spin" />}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsConnected(!isConnected)} className={`px-4 py-1 rounded-lg text-[9px] font-black border transition-all ${isConnected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-500'}`}>
                    {isConnected ? 'LIVE' : 'SIM'}
                  </button>
                </div>
              </header>
              <CircuitCanvas wiring={activeProject?.wiring || ""} libraries={activeProject?.libraries || []} isSyncing={isSyncingWiring} />
            </div>

            <button onClick={() => setIsCircuitVisible(!isCircuitVisible)} className="absolute right-4 top-[33%] z-30 p-2 bg-slate-800 border border-slate-700 rounded-full shadow-xl">
              {isCircuitVisible ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <div className="flex-1 flex flex-col bg-slate-900 border-t border-slate-800 overflow-hidden">
              <div className="flex px-4 border-b border-slate-800 bg-slate-900 z-10 overflow-x-auto">
                {['chat', 'code', 'simulation', 'test', 'libraries', 'controls', 'profile'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`py-3 px-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === tab ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-500'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-hidden relative">
                {activeTab === 'profile' ? (
                  <ProfileView 
                    user={user} projects={projects} 
                    onDeleteProject={(id) => setProjects(prev => prev.filter(p => p.id !== id))}
                    onOpenProject={(id) => { setActiveProjectId(id); setActiveTab('code'); }}
                    onTriggerRewardedAd={(cb) => { setAdRewardCallback(() => cb); setShowInterstitial(true); }}
                  />
                ) : activeTab === 'chat' ? (
                  <div className="h-full flex flex-col p-4">
                    <div className="flex-1 flex flex-col items-center justify-center opacity-30">
                      <Sparkles className="w-16 h-16 text-emerald-500 mb-4" />
                      <p className="text-sm font-bold uppercase tracking-widest">Tulis permintaan Anda di bawah</p>
                    </div>
                    <div className="mt-4 flex gap-3 p-2 bg-slate-950 rounded-3xl border border-slate-800">
                      <input 
                        type="text" value={promptValue} 
                        onChange={e => setPromptValue(e.target.value)} 
                        onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                        placeholder="Buat alat penyiram tanaman otomatis..." 
                        className="flex-1 bg-transparent border-none py-3 px-6 text-sm text-white focus:ring-0 outline-none" 
                      />
                      <button onClick={() => handleGenerate()} disabled={isGenerating} className="px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl transition-all">
                        {isGenerating ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                ) : activeTab === 'code' ? (
                   <Editor 
                    code={activeProject?.code || ''} 
                    wiring={activeProject?.wiring || ''}
                    controls={activeProject?.controls || []}
                    fileName={activeProject?.name || 'Arduino'} 
                    isConnected={isConnected}
                    isGenerating={isGenerating}
                   />
                ) : activeTab === 'simulation' ? (
                  <VirtualLab project={activeProject!} onFixRequest={(m) => handleGenerate(m)} />
                ) : activeTab === 'test' ? (
                  <TestHarness project={activeProject!} onAutoFix={(m) => handleGenerate(m)} />
                ) : activeTab === 'libraries' ? (
                  <LibraryManager 
                    installedLibraries={activeProject?.libraries || []} 
                    onAdd={(l) => setProjects(prev => prev.map(p => p.id === activeProjectId ? {...p, libraries: [...p.libraries, l]} : p))}
                    onRemove={(l) => setProjects(prev => prev.map(p => p.id === activeProjectId ? {...p, libraries: p.libraries.filter(lib => lib !== l)} : p))}
                  />
                ) : activeTab === 'controls' ? (
                  <ControlPanel 
                    controls={activeProject?.controls || []}
                    batteryType={activeProject?.batteryType || 'USB 5V'}
                    onUpdateBattery={(b) => setProjects(prev => prev.map(p => p.id === activeProjectId ? {...p, batteryType: b} : p))}
                    onAdd={(c) => setProjects(prev => prev.map(p => p.id === activeProjectId ? {...p, controls: [...p.controls, {...c, id: Date.now().toString()}]} : p))}
                    onRemove={(id) => setProjects(prev => prev.map(p => p.id === activeProjectId ? {...p, controls: p.controls.filter(c => c.id !== id)} : p))}
                    onToggle={(id, s) => setProjects(prev => prev.map(p => p.id === activeProjectId ? {...p, controls: p.controls.map(c => c.id === id ? {...c, lastState: s} : c)} : p))}
                    onUpdateControl={(id, u) => setProjects(prev => prev.map(p => p.id === activeProjectId ? {...p, controls: p.controls.map(c => c.id === id ? {...c, ...u} : c)} : p))}
                    isConnected={isConnected}
                    onSyncAI={handleSyncAI}
                  />
                ) : null}
              </div>

              <AdInterstitial 
                isVisible={showInterstitial} 
                onClose={() => setShowInterstitial(false)} 
                isRewarded={isAdRewarded}
                onRewardEarned={adRewardCallback || undefined}
              />
            </div>
          </>
        )}
      </main>
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default App;
