
import React, { useEffect, useRef, useState } from 'react';
import { X, Play, Pause, Trash2, Activity } from 'lucide-react';

interface DataPoint {
  timestamp: number;
  value: number;
}

interface SerialPlotterProps {
  onClose: () => void;
  isActive: boolean;
}

const SerialPlotter: React.FC<SerialPlotterProps> = ({ onClose, isActive }) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = window.setInterval(() => {
        const newValue = 512 + Math.sin(Date.now() / 500) * 200 + (Math.random() - 0.5) * 50;
        setData(prev => {
          const next = [...prev, { timestamp: Date.now(), value: newValue }];
          return next.slice(-100); // Keep last 100 points
        });
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isPaused]);

  const maxVal = 1024;
  const minVal = 0;
  const range = maxVal - minVal;

  const getPath = () => {
    if (data.length < 2) return '';
    const width = containerRef.current?.clientWidth || 500;
    const height = 200;
    const points = data.map((p, i) => {
      const x = (i / 99) * width;
      const y = height - ((p.value - minVal) / range) * height;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  if (!isActive) return null;

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2 text-emerald-400">
          <Activity className="w-4 h-4" />
          <span className="text-sm font-bold uppercase tracking-wider">Serial Plotter Simulator</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1.5 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white transition-colors"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setData([])}
            className="p-1.5 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white transition-colors ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="p-4 bg-slate-950">
        <div ref={containerRef} className="relative h-[200px] w-full border border-slate-800 bg-[#0d1117] rounded overflow-hidden">
          {/* Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="w-full h-px bg-slate-400" />
            ))}
          </div>
          
          <svg className="absolute inset-0 w-full h-full">
            <path
              d={getPath()}
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinejoin="round"
              className="transition-all duration-100"
            />
          </svg>

          {data.length > 0 && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-slate-900/80 rounded text-[10px] font-mono text-emerald-500 border border-emerald-500/20">
              Value: {data[data.length - 1].value.toFixed(1)}
            </div>
          )}
        </div>
        
        <div className="mt-3 flex justify-between text-[10px] font-mono text-slate-500 uppercase">
          <span>0.0s</span>
          <span className="text-slate-400">Simulated 115200 Baud</span>
          <span>10.0s</span>
        </div>
      </div>
    </div>
  );
};

export default SerialPlotter;
