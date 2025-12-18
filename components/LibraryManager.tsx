
import React, { useState } from 'react';
import { Search, Package, Plus, Trash2, Check, User, Tag, Info } from 'lucide-react';
import { POPULAR_LIBRARIES, Library } from '../constants';

interface LibraryManagerProps {
  installedLibraries: string[];
  onAdd: (libName: string) => void;
  onRemove: (libName: string) => void;
}

const LibraryManager: React.FC<LibraryManagerProps> = ({ installedLibraries, onAdd, onRemove }) => {
  const [search, setSearch] = useState('');

  const filteredLibraries = POPULAR_LIBRARIES.filter(lib => 
    lib.name.toLowerCase().includes(search.toLowerCase()) || 
    lib.description.toLowerCase().includes(search.toLowerCase()) ||
    lib.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-slate-950 overflow-hidden">
      {/* Search Header */}
      <div className="p-4 bg-slate-900/50 border-b border-slate-800 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search libraries (e.g. sensors, display, wifi)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-600"
          />
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 px-3">
          <Package className="w-3.5 h-3.5" />
          <span>{installedLibraries.length} Installed</span>
        </div>
      </div>

      {/* Library List */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLibraries.map((lib) => {
            const isInstalled = installedLibraries.includes(lib.name);
            return (
              <div 
                key={lib.name}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isInstalled 
                    ? 'bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]' 
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-bold text-slate-200">{lib.name}</h3>
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded-md font-mono border border-slate-700">
                      v{lib.version}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed h-8">
                    {lib.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <User className="w-3 h-3" /> {lib.author}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Tag className="w-3 h-3" /> {lib.category}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end">
                  {isInstalled ? (
                    <button 
                      onClick={() => onRemove(lib.name)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg text-[11px] font-bold transition-all uppercase tracking-wider"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  ) : (
                    <button 
                      onClick={() => onAdd(lib.name)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-500 rounded-lg text-[11px] font-bold transition-all uppercase tracking-wider shadow-lg shadow-emerald-950/20"
                    >
                      <Plus className="w-3.5 h-3.5" /> Install
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredLibraries.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-600 italic">
            <Info className="w-8 h-8 mb-2 opacity-20" />
            <p className="text-sm">No libraries found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryManager;
