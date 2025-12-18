import React, { useState } from 'react';
import { 
  Copy, Check, Code2, UploadCloud, Loader2, Sparkles, 
  ShieldCheck, X, Bug, Package
} from 'lucide-react';
import { ProjectAudit } from '../types';
import { arduinoAI } from '../services/geminiService';

interface EditorProps {
  code: string;
  wiring: string;
  controls: any[];
  fileName: string;
  onOpenPlotter?: () => void;
  onOpenTestHarness?: () => void;
  onUpload?: () => Promise<void>;
  onAutoComment?: () => Promise<void>;
  onAutoFix?: (errorLog: string) => Promise<void>;
  isConnected: boolean;
  uploadProgress?: number | null;
  isCommenting?: boolean;
  isGenerating?: boolean;
}

const Editor: React.FC<EditorProps> = ({ 
  code, 
  wiring,
  controls,
  fileName, 
  onUpload, 
  onAutoFix,
  isConnected, 
  isCommenting,
  isGenerating
}) => {
  const [copied, setCopied] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [showFixModal, setShowFixModal] = useState(false);
  const [errorInput, setErrorInput] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (content: string, name: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFullExport = () => {
    if (!code) return;
    const safeName = fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'proyek_arduino';

    // 1. File .ino
    downloadFile(code, `${safeName}.ino`, 'text/plain');

    // 2. diagram.txt
    const diagramContent = `SKEMA DIAGRAM PIN - ${fileName}\n` +
      `==================================================\n\n` +
      `${wiring}\n\n` +
      `Dibuat secara otomatis di ALTOino IDE - ${new Date().toLocaleDateString()}`;
    downloadFile(diagramContent, `diagram.txt`, 'text/plain');

    // 3. komponen.txt
    let komponenList = `LIST KOMPONEN PROYEK\n` +
      `==================================================\n\n` +
      `- 1x Microcontroller (Arduino Uno/Nano/ESP32)\n`;
    
    controls.forEach(c => {
      komponenList += `- 1x ${c.label} (${c.type.toUpperCase()})\n`;
    });
    
    komponenList += `\nSaran: Sediakan kabel jumper, breadboard, dan power supply yang sesuai.`;
    downloadFile(komponenList, `komponen.txt`, 'text/plain');

    // 4. perakitan.txt
    const perakitanContent = `TUTORIAL PERAKITAN HARDWARE\n` +
      `==================================================\n\n` +
      `LANGKAH PERAKITAN:\n` +
      `1. Hubungkan Pin GND Board ke jalur negatif breadboard.\n` +
      `2. Hubungkan Pin 5V/3.3V ke jalur positif breadboard.\n` +
      `3. Hubungkan komponen berikut sesuai jalur pin:\n\n` +
      `${wiring.replace(/\|/g, '').replace(/-/g, '')}\n\n` +
      `TIPS:\n` +
      `- Pastikan tidak ada kabel yang terbalik (Short Circuit).\n` +
      `- Gunakan resistor jika menggunakan LED standar.\n`;
    downloadFile(perakitanContent, `perakitan.txt`, 'text/plain');

    // 5. README.md
    // Fixed: Corrected template literal syntax where double quotes were accidentally used instead of closing backticks.
    const readmeContent = `# ${fileName}\n\n` +
      `## Deskripsi Proyek\n` +
      `Proyek Arduino ini dikembangkan menggunakan **ALTOino AI IDE**.\n\n` +
      `### File Dokumentasi Terlampir:\n` +
      `- \`${safeName}.ino\`: Kode sumber utama.\n` +
      `- \`diagram.txt\`: Skema jalur kabel.\n` +
      `- \`komponen.txt\`: Daftar hardware yang digunakan.\n` +
      `- \`perakitan.txt\`: Panduan merakit kabel.\n\n` +
      `### Instruksi:\n` +
      `1. Pastikan Anda memiliki Arduino IDE versi terbaru.\n` +
      `2. Upload file \`.ino\` ke Board Anda.\n` +
      `3. Ikuti panduan merakit sesuai file \`perakitan.txt\`.\n\n` +
      `---\n` +
      `**Copyright By Altomedia**\n` +
      `ALTOino - Smart Arduino Development Engine`;
    downloadFile(readmeContent, `README.md`, 'text/markdown');
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleApplyFix = async () => {
    if (!onAutoFix || !errorInput.trim()) return;
    setShowFixModal(false);
    await onAutoFix(errorInput);
    setErrorInput('');
  };

  const isGlobalLoading = isCommenting || isAuditing || isGenerating;

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-700 rounded-lg overflow-hidden shadow-2xl relative group/editor">
      {isGlobalLoading && (
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-[60] flex flex-col items-center justify-center gap-4 animate-in fade-in">
          <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
          <p className="text-emerald-400 font-black uppercase tracking-widest text-xs">AI Memproses Kode...</p>
        </div>
      )}

      {showSuccess && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-bounce">
          <Check className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-widest">Aset Proyek Berhasil Diunduh! (5 File)</span>
        </div>
      )}

      {/* HEADER TOOLS */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700 z-10">
        <div className="flex items-center gap-2 text-emerald-400 overflow-hidden">
          <Code2 className="w-4 h-4 shrink-0" />
          <span className="text-sm font-medium text-slate-300 truncate">{fileName || 'Arduino'}.ino</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFixModal(true)}
            className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-md transition-all text-[10px] font-bold border border-rose-500/20"
          >
            <Bug className="w-3.5 h-3.5" />
            <span className="hidden lg:inline uppercase">Auto-Fix</span>
          </button>
          {onUpload && (
            <button
              onClick={onUpload}
              disabled={!isConnected || !code}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all text-[10px] font-bold border ${
                isConnected ? 'bg-orange-500 text-white border-orange-600' : 'bg-slate-800 text-slate-500 border-slate-700'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span className="hidden sm:inline uppercase">Upload</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 bg-[#0d1117] scrollbar-thin scrollbar-thumb-slate-800">
        <pre className="code-font text-sm leading-relaxed text-blue-100 whitespace-pre">
          {code || '// Klik Idea atau Sample Project di Sidebar untuk memulai...'}
        </pre>
      </div>
      
      {/* EXPORT ACTION FOOTER */}
      {code && (
        <div className="px-4 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between animate-in slide-in-from-bottom-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">Project Ready</span>
            <span className="text-[10px] font-mono text-slate-600">Copyright By Altomedia</span>
          </div>
          <div className="flex items-center gap-3">
             <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                copied ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
            <button
              onClick={handleFullExport}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
            >
              <Package className="w-4 h-4" />
              Ekspor Paket Proyek
            </button>
          </div>
        </div>
      )}

      {/* DEBUG MODAL */}
      {showFixModal && (
        <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-rose-400 text-xs font-black uppercase tracking-widest">AI Error Debugger</h3>
              <button onClick={() => setShowFixModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <textarea 
                value={errorInput}
                onChange={(e) => setErrorInput(e.target.value)}
                placeholder="Tempel log error dari Arduino IDE di sini untuk perbaikan otomatis..."
                className="w-full h-40 bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-rose-300 outline-none placeholder:text-slate-800"
              />
              <button 
                onClick={handleApplyFix}
                className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black uppercase rounded-xl transition-all"
              >
                Mulai Perbaikan Otomatis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor;