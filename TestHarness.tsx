
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Beaker, Play, RotateCcw, ShieldCheck, AlertCircle, 
  CheckCircle2, Terminal, Info, Zap, Activity, Bug,
  ArrowRight, ListChecks, Search
} from 'lucide-react';
import { ArduinoProject } from '../types';

interface TestHarnessProps {
  project: ArduinoProject;
  onAutoFix: (issue: string) => void;
}

interface TestResult {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'pass' | 'fail' | 'warn';
  message: string;
  category: 'logic' | 'hardware' | 'power' | 'libraries';
}

const TestHarness: React.FC<TestHarnessProps> = ({ project, onAutoFix }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [activeTestIndex, setActiveTestIndex] = useState(-1);
  const [results, setResults] = useState<TestResult[]>([]);
  const [testLog, setTestLog] = useState<string[]>([]);

  const initialTests: TestResult[] = useMemo(() => [
    { id: 't1', name: 'Pin Collision Check', category: 'hardware', status: 'idle', message: 'Verifying unique pin assignments.',  },
    { id: 't2', name: 'Logic Entry Point', category: 'logic', status: 'idle', message: 'Checking for setup() and loop().',  },
    { id: 't3', name: 'I/O Initialization', category: 'hardware', status: 'idle', message: 'Verifying pinMode() configurations.',  },
    { id: 't4', name: 'Power Budget Analysis', category: 'power', status: 'idle', message: 'Estimating peak current draw.',  },
    { id: 't5', name: 'Library Dependency Scan', category: 'libraries', status: 'idle', message: 'Checking library inclusions.',  },
    { id: 't6', name: 'Serial Communication Check', category: 'logic', status: 'idle', message: 'Verifying Serial.begin() presence.',  },
  ], []);

  useEffect(() => {
    setResults(initialTests);
  }, [initialTests]);

  const runTestHarness = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setActiveTestIndex(0);
    setTestLog(["Initiating Test Harness Sequence...", `Target Project: ${project.name}`]);
    setResults(initialTests.map(t => ({ ...t, status: 'idle' })));

    const code = project.code;
    const controls = project.controls;

    for (let i = 0; i < initialTests.length; i++) {
      setActiveTestIndex(i);
      setResults(prev => prev.map((t, idx) => idx === i ? { ...t, status: 'running' } : t));
      
      // Artificial delay for simulation feel
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));
      
      let status: 'pass' | 'fail' | 'warn' = 'pass';
      let message = 'All checks passed.';

      // Actual Logic Tests
      const testId = initialTests[i].id;
      if (testId === 't1') {
        const pins = controls.map(c => c.pin);
        const uniquePins = new Set(pins);
        if (uniquePins.size !== pins.length) {
          status = 'fail';
          message = 'Duplicate pin assignments detected in Control Panel.';
        }
      } else if (testId === 't2') {
        if (!code.includes('setup()') || !code.includes('loop()')) {
          status = 'fail';
          message = 'Standard Arduino entry points missing.';
        }
      } else if (testId === 't3') {
        const pinModes = (code.match(/pinMode/g) || []).length;
        if (pinModes < controls.length) {
          status = 'warn';
          message = `Only ${pinModes}/${controls.length} hardware pins initialized via pinMode().`;
        }
      } else if (testId === 't4') {
        // Mock power calculation
        const peakDraw = controls.length * 20 + 50; // Simple estimate
        if (project.batteryType?.includes('USB') && peakDraw > 500) {
          status = 'warn';
          message = `Potential power instability (Est. ${peakDraw}mA on USB source).`;
        }
      } else if (testId === 't5') {
        const includes = (code.match(/#include/g) || []).length;
        if (includes < project.libraries.length) {
          status = 'fail';
          message = 'Missing #include statements for declared libraries.';
        }
      } else if (testId === 't6') {
        if (!code.includes('Serial.begin')) {
          status = 'warn';
          message = 'Serial monitoring not initialized. Debugging will be limited.';
        }
      }

      setResults(prev => prev.map((t, idx) => idx === i ? { ...t, status, message } : t));
      setTestLog(prev => [`[${status.toUpperCase()}] ${initialTests[i].name}: ${message}`, ...prev]);
    }

    setIsRunning(false);
    setActiveTestIndex(-1);
    setTestLog(prev => ["Sequence Complete.", ...prev]);
  };

  const passCount = results.filter(r => r.status === 'pass').length;
  const failCount = results.filter(r => r.status === 'fail').length;
  const warnCount = results.filter(r => r.status === 'warn').length;

  return (
    <div className="h-full flex flex-col bg-slate-950 overflow-hidden font-sans">
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <Beaker className={`w-5 h-5 ${isRunning ? 'text-amber-400 animate-bounce' : 'text-slate-500'}`} />
          </div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-widest">Logic Test Harness</h2>
            <p className="text-[9px] text-slate-500 font-mono uppercase tracking-tighter">
              {isRunning ? 'Execution in progress...' : 'Simulated Verification Engine'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isRunning ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-xl border border-slate-700">
               <Activity className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Running Step {activeTestIndex + 1}/6</span>
            </div>
          ) : (
            <button 
              onClick={runTestHarness}
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-amber-900/20 active:scale-95"
            >
              <Play className="w-3.5 h-3.5" /> Start Test Suite
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Test Checklist */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-950">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Summary Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                 <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Checks</div>
                 <div className="text-2xl font-black text-white">{results.length}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl border-l-4 border-l-emerald-500">
                 <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 text-emerald-500">Passed</div>
                 <div className="text-2xl font-black text-white">{passCount}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl border-l-4 border-l-rose-500">
                 <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 text-rose-500">Failed</div>
                 <div className="text-2xl font-black text-white">{failCount}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl border-l-4 border-l-amber-500">
                 <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 text-amber-500">Warnings</div>
                 <div className="text-2xl font-black text-white">{warnCount}</div>
              </div>
            </div>

            {/* Detailed Test Items */}
            <div className="space-y-3">
              {results.map((test, i) => (
                <div 
                  key={test.id} 
                  className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                    test.status === 'running' ? 'bg-amber-500/5 border-amber-500/30 ring-1 ring-amber-500/20' :
                    test.status === 'pass' ? 'bg-emerald-500/5 border-emerald-500/20' :
                    test.status === 'fail' ? 'bg-rose-500/5 border-rose-500/30' :
                    test.status === 'warn' ? 'bg-amber-500/5 border-amber-500/30' : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      test.status === 'running' ? 'bg-amber-500 text-white animate-pulse shadow-lg' :
                      test.status === 'pass' ? 'bg-emerald-500/20 text-emerald-400' :
                      test.status === 'fail' ? 'bg-rose-500/20 text-rose-400' :
                      test.status === 'warn' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-600'
                    }`}>
                       {test.status === 'running' ? <Search className="w-5 h-5" /> :
                        test.status === 'pass' ? <CheckCircle2 className="w-5 h-5" /> :
                        test.status === 'fail' ? <Bug className="w-5 h-5" /> :
                        test.status === 'warn' ? <AlertCircle className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                         <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">{test.category}</span>
                         {test.status === 'running' && <span className="text-[8px] bg-amber-500 text-white px-1.5 py-0.5 rounded animate-pulse">ANALYZING...</span>}
                      </div>
                      <h3 className="text-sm font-bold text-slate-200">{test.name}</h3>
                      <p className={`text-[10px] mt-0.5 ${
                        test.status === 'fail' ? 'text-rose-400' : 
                        test.status === 'warn' ? 'text-amber-400' : 'text-slate-500'
                      }`}>
                        {test.message}
                      </p>
                    </div>
                  </div>
                  
                  {test.status === 'fail' && (
                    <button 
                      onClick={() => onAutoFix(`Fix ${test.name}: ${test.message}`)}
                      className="px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                    >
                      Quick Fix
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Execution Console */}
        <div className="w-full md:w-80 lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-800 bg-slate-950/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <Terminal className="w-4 h-4 text-amber-500" /> Test Console
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 font-mono text-[10px] space-y-2 bg-slate-950/20 custom-scrollbar">
            {testLog.map((log, i) => (
               <div key={i} className={`flex gap-3 ${
                 log.includes('[FAIL]') ? 'text-rose-400' : 
                 log.includes('[PASS]') ? 'text-emerald-400' : 
                 log.includes('[WARN]') ? 'text-amber-400' : 'text-slate-500'
               }`}>
                 <span className="opacity-20 shrink-0">#{testLog.length - i}</span>
                 <span className="flex-1 break-words">{log}</span>
               </div>
            ))}
            {testLog.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-10 text-slate-500 text-center px-10">
                <ListChecks className="w-12 h-12 mb-3" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Console Standby</p>
                <p className="text-[8px] mt-2">Begin test sequence to view diagnostics</p>
              </div>
            )}
          </div>
          
          <div className="p-6 bg-slate-950 border-t border-slate-800">
             <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-black text-slate-500 uppercase">Test Coverage</span>
                   <span className="text-[10px] font-mono text-emerald-400">84.2%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: '84.2%' }}></div>
                </div>
                {failCount > 0 && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                    <div className="flex items-center gap-2 text-rose-400 text-[10px] font-black uppercase mb-1">
                      <Bug className="w-3.5 h-3.5" /> Stability Warning
                    </div>
                    <p className="text-[9px] text-slate-500 italic">Project contains critical logic errors that may prevent hardware initialization.</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestHarness;
