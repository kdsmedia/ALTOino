
import React, { useEffect, useRef, useState } from 'react';
import { Terminal as TerminalIcon, Trash2, StopCircle, Play } from 'lucide-react';

interface SerialMonitorProps {
  // Use 'any' for port as SerialPort type is not natively available in global types
  port: any | null;
}

const SerialMonitor: React.FC<SerialMonitorProps> = ({ port }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isReading, setIsReading] = useState(false);
  const readerRef = useRef<ReadableStreamDefaultReader | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const startReading = async () => {
    if (!port || isReading) return;
    
    setIsReading(true);
    try {
      while (port.readable && isReading) {
        readerRef.current = port.readable.getReader();
        try {
          while (true) {
            const { value, done } = await readerRef.current.read();
            if (done) break;
            const text = new TextDecoder().decode(value);
            setLogs(prev => [...prev, text].slice(-100));
          }
        } catch (error) {
          console.error('Serial Read Error:', error);
        } finally {
          readerRef.current.releaseLock();
        }
      }
    } catch (err) {
      console.error('Fatal Serial Error:', err);
    }
  };

  const stopReading = () => {
    setIsReading(false);
    readerRef.current?.cancel();
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 font-mono text-xs">
      <div className="flex items-center justify-between p-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2 text-slate-400">
          <TerminalIcon className="w-3.5 h-3.5" />
          <span className="font-bold uppercase tracking-tighter">Serial Monitor (115200 baud)</span>
        </div>
        <div className="flex items-center gap-2">
          {isReading ? (
            <button onClick={stopReading} className="p-1 hover:bg-slate-800 text-rose-400 rounded transition-colors" title="Stop Monitor">
              <StopCircle className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={startReading} disabled={!port} className="p-1 hover:bg-slate-800 text-emerald-400 disabled:opacity-30 rounded transition-colors" title="Start Monitor">
              <Play className="w-4 h-4" />
            </button>
          )}
          <button onClick={() => setLogs([])} className="p-1 hover:bg-slate-800 text-slate-500 hover:text-white rounded transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 text-emerald-500/90 whitespace-pre-wrap">
        {logs.length === 0 ? (
          <span className="text-slate-700 italic">// No serial data. Click Play to start monitoring...</span>
        ) : (
          logs.join('')
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};

export default SerialMonitor;
