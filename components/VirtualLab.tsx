
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Play, RotateCcw, Cpu, Zap, Activity, AlertTriangle, CheckCircle2, 
  Terminal, Info, Gauge, Lightbulb, Waves, MousePointer2, 
  Volume2, MoveHorizontal, Radio, Signal, Power
} from 'lucide-react';
import { ArduinoProject, PinControl } from '../types';

interface VirtualLabProps {
  project: ArduinoProject;
  onFixRequest: (issue: string) => void;
}

const VirtualLab: React.FC<VirtualLabProps> = ({ project, onFixRequest }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);
  const [pinStates, setPinStates] = useState<Record<number, any>>({});
  const [vibe, setVibe] = useState(0);

  // Analisis Kode Secara Otomatis untuk Simulasi Logic
  const logicAnalysis = useMemo(() => {
    const code = project.code;
    const analysis = {
      pinsConfigured: [] as number[],
      hasSerial: code.includes("Serial.begin"),
      hasLoop: code.includes("loop()"),
      potentialConflicts: [] as string[]
    };

    // Cari pinMode(X, OUTPUT)
    const pinRegex = /pinMode\s*\(\s*(\d+)\s*,\s*(OUTPUT|INPUT|INPUT_PULLUP)\s*\)/g;
    let match;
    while ((match = pinRegex.exec(code)) !== null) {
      analysis.pinsConfigured.push(parseInt(match[1]));
    }

    return analysis;
  }, [project.code]);

  const runSimulation = () => {
    if (isSimulating) {
      setIsSimulating(false);
      setSimulationLog(prev => ["Simulation Halted.", ...prev]);
      return;
    }

    setIsSimulating(true);
    setSimulationLog(["Booting Virtual MCU...", "Loading Firmware: " + project.id]);
    
    // Simulate initial pin states from controls
    const initialStates: Record<number, any> = {};
    project.controls.forEach(c => {
      initialStates[c.pin] = c.lastState;
    });
    setPinStates(initialStates);

    // Mock Live Logic Loop
    const interval = setInterval(() => {
      setVibe(v => (v + 1) % 100);
      
      // Random activity simulation if logic allows
      if (Math.random() > 0.8) {
        const randomCtrl = project.controls[Math.floor(Math.random() * project.controls.length)];
        if (randomCtrl && randomCtrl.type === 'digital') {
          setPinStates(prev => ({...prev, [randomCtrl.pin]: Math.random() > 0.5}));
        }
      }
    }, 500);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    if (!isSimulating) return;
    const timeout = setTimeout(() => {
      setSimulationLog(prev => ["[MCU] setup() finished.", "[MCU] Entering loop()...", ...prev]);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [isSimulating]);

  const getHealthScore = () => {
    let score = 100;
    if (!logicAnalysis.hasLoop) score -= 40;
    if (!logicAnalysis.hasSerial) score -= 10;
    
    // Check if pins in controls are actually in code
    project.controls.forEach(c => {
      if (!logicAnalysis.pinsConfigured.includes(c.pin)) {
        score -= 5;
      }
    });

    return Math.max(0, score);
  };

  const healthScore = getHealthScore();

  return (
    <div className="h-full flex flex-col bg-slate-950 overflow-hidden font-sans">
      {/* Simulation Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
            <Cpu className={`w-5 h-5 ${isSimulating ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
          </div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-widest">Virtual Live Workbench</h2>
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${isSimulating ? 'bg-emerald-500 animate-ping' : 'bg-slate-700'}`}></span>
              <p className="text-[9px] text-slate-500 font-mono uppercase tracking-tighter">
                {isSimulating ? 'Real-time Execution Active' : 'Simulator Ready'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={runSimulation}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              isSimulating 
              ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30 hover:bg-rose-600/30' 
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-900/20'
            }`}
          >
            {isSimulating ? <RotateCcw className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isSimulating ? 'Stop Simulator' : 'Start Simulation'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Visual Workbench Area */}
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] [background-size:40px_40px] relative">
          
          <div className="max-w-5xl mx-auto space-y-8">
            {/* System Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-xl">
                <div className="relative w-14 h-14 shrink-0">
                   <svg className="w-full h-full -rotate-90">
                    <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
                    <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" 
                            strokeDasharray={151} 
                            strokeDashoffset={151 - (151 * healthScore) / 100} 
                            className={`${healthScore > 80 ? 'text-emerald-500' : 'text-rose-500'} transition-all duration-1000`} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-white">{healthScore}%</div>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Logic Integrity</h4>
                  <p className="text-xs font-bold text-slate-200">{healthScore === 100 ? 'System Perfect' : 'Review Needed'}</p>
                </div>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-xl">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                  <Activity className={`w-6 h-6 ${isSimulating ? 'animate-pulse' : ''}`} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">CPU Usage</h4>
                  <p className="text-xs font-bold text-slate-200">{isSimulating ? (10 + vibe/10).toFixed(1) : '0.0'}%</p>
                </div>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-xl">
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                  <Signal className={`w-6 h-6 ${isSimulating ? 'animate-bounce' : ''}`} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">I/O Activity</h4>
                  <p className="text-xs font-bold text-slate-200">{project.controls.length} Pins Tracked</p>
                </div>
              </div>
            </div>

            {/* Virtual Board Simulation */}
            <div className="relative bg-slate-900 border-2 border-slate-800 rounded-[32px] p-8 shadow-2xl overflow-hidden group/board">
              <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[radial-gradient(circle_at_center,#3b82f6_0%,transparent_70%)]"></div>
              
              <div className="flex flex-col lg:flex-row items-center gap-12">
                {/* Central Controller Visual */}
                <div className="relative shrink-0">
                  <div className="w-48 h-64 bg-blue-900 rounded-2xl border-4 border-blue-800 shadow-2xl relative flex flex-col items-center justify-center p-4">
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-800 rounded-full"></div>
                    <Cpu className={`w-20 h-20 ${isSimulating ? 'text-blue-400 animate-pulse' : 'text-blue-700'}`} />
                    <div className="mt-4 text-[10px] font-black text-blue-300 uppercase tracking-[0.3em]">MCU CORE</div>
                    
                    {/* Simulated Connection Pins */}
                    <div className="absolute -right-4 top-12 bottom-12 flex flex-col justify-between">
                      {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="w-4 h-2 bg-slate-700 rounded-r-sm border-y border-r border-slate-600"></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dynamic Component Web */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  {project.controls.map((ctrl) => {
                    const isActive = isSimulating && pinStates[ctrl.pin];
                    return (
                      <div key={ctrl.id} className={`p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 ${
                        isActive 
                        ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)] scale-[1.02]' 
                        : 'bg-slate-950/50 border-slate-800'
                      }`}>
                        <div className={`p-3 rounded-xl transition-colors ${
                          isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/40' : 'bg-slate-800 text-slate-500'
                        }`}>
                          {ctrl.type === 'digital' && <Lightbulb className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />}
                          {ctrl.type === 'input' && <MousePointer2 className="w-5 h-5" />}
                          {ctrl.type === 'buzzer' && <Volume2 className={`w-5 h-5 ${isActive ? 'animate-bounce' : ''}`} />}
                          {ctrl.type === 'servo' && <MoveHorizontal className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Pin {ctrl.pin}</span>
                            <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                              isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-600'
                            }`}>
                              {isActive ? 'HIGH' : 'LOW'}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-200 truncate">{ctrl.label}</h4>
                        </div>
                      </div>
                    );
                  })}
                  {project.controls.length === 0 && (
                    <div className="col-span-full border-2 border-dashed border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-slate-600 opacity-50">
                      <Zap className="w-8 h-8 mb-2" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-center">No Hardware Connected<br/>Add pins in Control Panel</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Simulated Signals (Mini Oscilloscope) */}
            {isSimulating && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                    <Waves className="w-4 h-4" /> Live Logic Waveform
                  </div>
                  <div className="text-[9px] font-mono text-slate-500">10ms / DIV</div>
                </div>
                <div className="h-24 w-full bg-slate-950 border border-slate-800 rounded-lg relative overflow-hidden">
                  <svg className="w-full h-full">
                    <path 
                      d={`M 0 50 ${Array.from({length: 40}).map((_, i) => `L ${i * 25} ${50 + Math.sin((i + vibe) * 0.5) * 20}`).join(' ')}`} 
                      fill="none" 
                      stroke="#10b981" 
                      strokeWidth="2" 
                      className="transition-all duration-100"
                    />
                  </svg>
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] [background-size:20px_20px]"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Console & Diagnostics */}
        <div className="w-full md:w-80 lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-800 bg-slate-950/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <Terminal className="w-4 h-4 text-emerald-400" /> Virtual Debugger
            </div>
            {simulationLog.length > 0 && (
               <button onClick={() => setSimulationLog([])} className="text-[8px] font-black text-slate-600 hover:text-slate-400 uppercase">Clear</button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 font-mono text-[10px] space-y-2.5 custom-scrollbar bg-slate-950/20">
            {simulationLog.map((log, i) => (
              <div key={i} className={`flex gap-3 leading-relaxed ${
                log.includes('[ERROR]') ? 'text-rose-400' : 
                log.includes('[MCU]') ? 'text-emerald-400' : 'text-slate-400'
              }`}>
                <span className="opacity-20 shrink-0">{new Date().toLocaleTimeString([], {hour12: false, fractionalSecondDigits: 1} as any)}</span>
                <span className="flex-1 break-words">{log}</span>
              </div>
            ))}
            {simulationLog.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-10 text-slate-500 text-center px-10">
                <Power className="w-12 h-12 mb-3" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Simulator Offline</p>
                <p className="text-[8px] mt-2">Start the engine to see virtual runtime logs</p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-800 bg-slate-900">
             <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Info className="w-3 h-3 text-blue-400" /> Firmware Integrity
                </h5>
                <ul className="space-y-2">
                   <li className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Pin Initialization</span>
                      {logicAnalysis.pinsConfigured.length > 0 ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <AlertTriangle className="w-3 h-3 text-amber-400" />}
                   </li>
                   <li className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Main Loop Activity</span>
                      {logicAnalysis.hasLoop ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <AlertTriangle className="w-3 h-3 text-rose-400" />}
                   </li>
                   <li className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Serial Debugging</span>
                      {logicAnalysis.hasSerial ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Info className="w-3 h-3 text-slate-600" />}
                   </li>
                </ul>
                {healthScore < 90 && (
                  <button 
                    onClick={() => onFixRequest("Analyze my code and ensure it matches the control panel setup. Make sure pinMode is set correctly for all used pins.")}
                    className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[9px] font-black uppercase rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-3 h-3" /> Auto-Fix Integrity
                  </button>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualLab;
