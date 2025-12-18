
import React, { useState, useEffect } from 'react';
import { X, Info, Zap, Loader2 } from 'lucide-react';

interface AdBannerProps {
  id: string;
  label?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ id, label = "Sponsored Content" }) => {
  return (
    <div className="w-full p-2 mt-auto">
      <div className="flex items-center justify-between px-2 mb-1">
        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{label}</span>
        <Info className="w-2.5 h-2.5 text-slate-700" />
      </div>
      <div 
        id={id} 
        className="w-full h-24 bg-slate-950 border border-dashed border-slate-800 rounded-lg flex items-center justify-center group overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <p className="text-[9px] font-mono text-slate-700 uppercase text-center px-4">
          Native Banner Ad<br/>
          <span className="text-[7px] opacity-50">Slot ID: {id}</span>
        </p>
      </div>
    </div>
  );
};

interface AdInterstitialProps {
  onClose: () => void;
  onRewardEarned?: () => void;
  isVisible: boolean;
  isRewarded?: boolean;
}

export const AdInterstitial: React.FC<AdInterstitialProps> = ({ onClose, onRewardEarned, isVisible, isRewarded }) => {
  const [countdown, setCountdown] = useState(5);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    let timer: number;
    if (isVisible) {
      setCountdown(5);
      setCanClose(false);
      timer = window.setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanClose(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isVisible]);

  if (!isVisible) return null;

  const handleClose = () => {
    if (canClose) {
      if (isRewarded && onRewardEarned) {
        onRewardEarned();
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black animate-in fade-in duration-300 flex flex-col items-center justify-center">
      {/* Native Control Bar */}
      <div className="absolute top-0 left-0 w-full p-4 flex items-center justify-between z-10">
        <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-3">
          <Zap className="w-3 h-3 text-emerald-500" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Sponsored</span>
        </div>

        {canClose ? (
          <button 
            onClick={handleClose}
            className="flex items-center gap-2 px-6 py-2 bg-white text-black rounded-full font-black text-[10px] uppercase hover:bg-emerald-500 hover:text-white transition-all shadow-2xl active:scale-95"
          >
            <X className="w-4 h-4" /> Close
          </button>
        ) : (
          <div className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-white font-mono text-[10px] font-bold border border-white/10">
            Ad ends in {countdown}s
          </div>
        )}
      </div>

      {/* Ad Placeholder - Clean Content Area */}
      <div className="w-full h-full flex flex-col items-center justify-center p-8 space-y-8">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/20 blur-[120px] rounded-full animate-pulse"></div>
          <div className="relative w-32 h-32 bg-slate-900 border border-slate-800 rounded-[40px] flex items-center justify-center shadow-2xl">
            {canClose ? (
              <Zap className="w-12 h-12 text-emerald-500" />
            ) : (
              <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
            )}
          </div>
        </div>
        
        <div className="text-center space-y-2 max-w-sm">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
            {canClose ? 'Reward Ready' : 'Loading Ad Content'}
          </h2>
          <p className="text-slate-500 text-[10px] font-medium leading-relaxed uppercase tracking-widest">
            {isRewarded 
              ? 'Tonton hingga selesai untuk mendapatkan bonus Rp. 10' 
              : 'Iklan membantu kami menjaga ALTOino tetap gratis'}
          </p>
        </div>
      </div>

      <div className="absolute bottom-6 left-0 w-full flex justify-center">
        <div className="px-3 py-1 bg-white/5 rounded-md text-[8px] font-mono text-slate-700 uppercase tracking-widest border border-white/5">
          Native Interstitial Ad System
        </div>
      </div>
    </div>
  );
};
