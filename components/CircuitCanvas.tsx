
import React from 'react';
import { Layers, Box, Zap, Map, Info, Terminal, Palette, ShieldCheck, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface CircuitCanvasProps {
  wiring: string;
  libraries: string[];
  isSyncing?: boolean;
}

const CircuitCanvas: React.FC<CircuitCanvasProps> = ({ wiring, libraries, isSyncing }) => {
  return (
    <div className="relative flex-1 bg-[#0f172a] overflow-hidden group">
      {/* Blueprint Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      {/* Syncing Overlay */}
      {isSyncing && (
        <div className="absolute inset-0 z-40 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3 animate-in fade-in">
           <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
           <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Sinkronisasi Jalur...</p>
        </div>
      )}

      <div className="absolute inset-0 p-3 md:p-6 flex flex-col min-h-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3 md:mb-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <Map className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-[10px] md:text-sm font-bold text-slate-200 uppercase tracking-widest">Engineering Blueprint</h2>
              <p className="hidden md:block text-[10px] text-slate-500 font-mono">Categorized Wiring & ASCII Schematics</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 md:gap-2">
            {libraries.length > 0 ? libraries.slice(0, 3).map((lib, i) => (
              <span key={i} className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 text-[8px] md:text-[10px] font-mono border border-blue-500/20 rounded truncate max-w-[80px] md:max-w-none">
                {lib}.h
              </span>
            )) : (
              <span className="px-1.5 py-0.5 bg-slate-800 text-slate-600 text-[8px] md:text-[10px] font-mono border border-slate-700 rounded">
                Standard I/O
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row gap-3 md:gap-6 overflow-hidden min-h-0">
          {/* Main Wiring Card with Markdown Support */}
          <div className="flex-1 bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-xl p-3 md:p-6 overflow-y-auto custom-scrollbar shadow-2xl min-h-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-tighter">
                <Layers className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
                Assembly & Connection Guide
              </div>
              <div className="flex items-center gap-2 text-[8px] text-emerald-500 uppercase font-black tracking-widest">
                <ShieldCheck className="w-3 h-3" /> Validated Schematic
              </div>
            </div>
            
            <div className="prose-arduino text-slate-300">
              {wiring ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {wiring}
                </ReactMarkdown>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-600 opacity-40 italic font-mono text-sm">
                  <Terminal className="w-8 h-8 mb-2" />
                  Request a schematic to generate detailed wiring...
                </div>
              )}
            </div>
          </div>

          {/* Side Panel: Color Standards & Pin Summary */}
          <div className="hidden sm:flex md:w-64 lg:w-72 flex-col gap-3 md:gap-4 shrink-0 overflow-y-auto custom-scrollbar">
            {/* Wiring Color Legend */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 md:p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-3 text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <Palette className="w-3.5 h-3.5 text-emerald-400" /> Wiring Legend
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]"></div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-200 uppercase tracking-tighter">Power</span>
                    <span className="text-[8px] text-slate-500">VCC, 5V, 3.3V, VIN</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-slate-950 border border-slate-700 shadow-[0_0_8px_rgba(0,0,0,0.5)]"></div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-200 uppercase tracking-tighter">Ground</span>
                    <span className="text-[8px] text-slate-500">Common GND</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]"></div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-200 uppercase tracking-tighter">Signal</span>
                    <span className="text-[8px] text-slate-500">I/O & Data Lines</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-200 uppercase tracking-tighter">Data Bus</span>
                    <span className="text-[8px] text-slate-500">I2C, SPI, UART</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 md:p-4">
              <div className="flex items-center gap-2 mb-2 text-[9px] font-black text-amber-500 uppercase tracking-widest">
                <Info className="w-3 h-3" /> Hardware Tip
              </div>
              <p className="text-[9px] text-slate-500 leading-relaxed italic">
                Always double-check your common ground (GND) connections between components and the controller to ensure a stable reference voltage.
              </p>
            </div>

            {/* Summary Tag */}
            <div className="flex-1 bg-slate-900/40 border border-dashed border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <Zap className="w-8 h-8 text-slate-700 mb-2" />
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Ready for Build</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircuitCanvas;
