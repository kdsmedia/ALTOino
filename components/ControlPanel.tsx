
import React, { useState } from 'react';
import { 
  ToggleRight, Trash2, Power, MousePointerClick, 
  Music, Sliders, ToggleLeft, Circle, Battery, Zap, RefreshCw,
  Activity, ArrowDownCircle, ArrowUpCircle
} from 'lucide-react';
import { PinControl } from '../types';
import { BATTERY_OPTIONS } from '../constants';

interface ControlPanelProps {
  controls: PinControl[];
  batteryType: string;
  onUpdateBattery: (val: string) => void;
  onAdd: (control: Omit<PinControl, 'id'>) => void;
  onRemove: (id: string) => void;
  onToggle: (id: string, state: any) => void;
  onUpdateControl: (id: string, updates: Partial<PinControl>) => void;
  isConnected: boolean;
  onSyncAI: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  controls, batteryType, onUpdateBattery, onAdd, onRemove, onToggle, onSyncAI 
}) => {
  const [newPin, setNewPin] = useState(2);
  const [newLabel, setNewLabel] = useState('');
  const [newType, setNewType] = useState<'digital' | 'buzzer' | 'servo' | 'input'>('digital');

  const handleAdd = () => {
    onAdd({ 
      pin: newPin, 
      label: newLabel || (newType === 'buzzer' ? 'Buzzer' : newType === 'servo' ? 'Servo' : newType === 'input' ? 'Button' : 'Switch'), 
      type: newType, 
      lastState: newType === 'servo' ? 90 : false,
      config: newType === 'buzzer' ? { duration: 200, frequency: 1000 } : undefined
    });
    setNewLabel('');
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 overflow-hidden font-sans">
      {/* Settings Bar */}
      <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-lg">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex flex-col gap-1 min-w-[160px]">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Battery className="w-3 h-3 text-emerald-400" /> Sumber Daya Utama
            </label>
            <select 
              value={batteryType} 
              onChange={e => onUpdateBattery(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-bold outline-none focus:border-emerald-500 transition-colors"
            >
              {BATTERY_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Sync</label>
            <button 
              onClick={onSyncAI}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Sync AI Logic
            </button>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-4 text-right">
           <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Data Rate</span>
              <span className="text-xs font-mono text-emerald-500">115200 BAUD</span>
           </div>
           <Activity className="w-6 h-6 text-emerald-500/20 animate-pulse" />
        </div>
      </div>

      {/* Add New Pin Section */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-col md:flex-row md:items-end gap-4 shrink-0 shadow-lg">
        <div className="flex gap-4">
          <div className="flex flex-col gap-1 w-20">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pin #</label>
            <input 
              type="number" 
              value={newPin} 
              onChange={e => setNewPin(parseInt(e.target.value))}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-emerald-400 font-bold outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1 md:w-48">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipe</label>
            <select 
              value={newType} 
              onChange={e => setNewType(e.target.value as any)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none"
            >
              <option value="digital">Digital Output (LED/Relay)</option>
              <option value="input">Digital Input (Sensor/Button)</option>
              <option value="buzzer">Buzzer</option>
              <option value="servo">Servo</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Label</label>
          <input 
            type="text" 
            value={newLabel} 
            onChange={e => setNewLabel(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-slate-700"
            placeholder="Contoh: Lampu Teras"
          />
        </div>
        <button 
          onClick={handleAdd}
          className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-2 px-6 text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-emerald-950/40"
        >
          Tambah Pin
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {controls.map((ctrl) => {
            // Fixed: lastState is boolean | number, so we check for true or 1.
            const isHigh = ctrl.lastState === true || ctrl.lastState === 1;
            
            return (
              <div 
                key={ctrl.id} 
                className={`relative bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl transition-all duration-300 ${
                  isHigh ? 'ring-2 ring-emerald-500/50 bg-emerald-500/[0.03]' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl transition-all duration-300 ${
                      isHigh ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-slate-800 text-slate-600'
                    }`}>
                      {ctrl.type === 'digital' && <Power className="w-4 h-4" />}
                      {ctrl.type === 'input' && <MousePointerClick className="w-4 h-4" />}
                      {ctrl.type === 'buzzer' && <Music className="w-4 h-4" />}
                      {ctrl.type === 'servo' && <Sliders className="w-4 h-4" />}
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Pin {ctrl.pin}</div>
                        {ctrl.type === 'input' && (
                          <div className="flex items-center gap-1">
                             <ArrowDownCircle className="w-2.5 h-2.5 text-blue-400" />
                             <span className="text-[8px] font-black text-blue-400 uppercase tracking-tighter">Input</span>
                          </div>
                        )}
                        {ctrl.type === 'digital' && (
                          <div className="flex items-center gap-1">
                             <ArrowUpCircle className="w-2.5 h-2.5 text-orange-400" />
                             <span className="text-[8px] font-black text-orange-400 uppercase tracking-tighter">Output</span>
                          </div>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-white truncate max-w-[140px] leading-tight">{ctrl.label}</h4>
                    </div>
                  </div>
                  <button onClick={() => onRemove(ctrl.id)} className="text-slate-600 hover:text-rose-400 transition-colors p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="absolute top-4 right-12 flex items-center gap-1.5">
                   <div className={`w-2 h-2 rounded-full ${isHigh ? 'bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse' : 'bg-slate-800'}`}></div>
                   <span className={`text-[9px] font-mono font-black tracking-tighter transition-colors ${isHigh ? 'text-emerald-400' : 'text-slate-700'}`}>
                     {isHigh ? 'HIGH' : 'LOW'}
                   </span>
                </div>

                {ctrl.type === 'digital' && (
                  <button
                    onClick={() => onToggle(ctrl.id, !ctrl.lastState)}
                    className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] border shadow-lg ${
                      isHigh ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-950/50' : 'bg-slate-950 text-slate-500 border-slate-800'
                    }`}
                  >
                    {isHigh ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                    <span className="text-[10px] font-black uppercase tracking-widest">{isHigh ? 'MATIKAN' : 'NYALAKAN'}</span>
                  </button>
                )}

                {ctrl.type === 'input' && (
                  <div className="space-y-3">
                    <button
                      onMouseDown={() => onToggle(ctrl.id, true)}
                      onMouseUp={() => onToggle(ctrl.id, false)}
                      onMouseLeave={() => onToggle(ctrl.id, false)}
                      className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] border ${
                        isHigh 
                        ? 'bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-950/50' 
                        : 'bg-slate-950 text-slate-500 border-slate-800'
                      }`}
                    >
                      <MousePointerClick className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Simulasi Tekan</span>
                    </button>
                    <div className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-950/50 rounded-lg border border-slate-800/50">
                       <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Serial Sync</span>
                       <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full bg-emerald-500 transition-all duration-100 ${isHigh ? 'w-full' : 'w-0'}`}></div>
                       </div>
                    </div>
                  </div>
                )}

                {ctrl.type === 'servo' && (
                  <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-slate-500 uppercase font-black">Sudut Rotasi</span>
                      <span className="text-emerald-400 font-bold">{ctrl.lastState}°</span>
                    </div>
                    <input 
                      type="range" min="0" max="180" value={ctrl.lastState as number}
                      onChange={(e) => onToggle(ctrl.id, parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                )}

                {ctrl.type === 'buzzer' && (
                   <button
                    onClick={() => {
                       onToggle(ctrl.id, true);
                       setTimeout(() => onToggle(ctrl.id, false), ctrl.config?.duration || 200);
                    }}
                    className="w-full py-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center gap-3 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all shadow-inner"
                  >
                    <Music className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Bunyikan Nada</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
