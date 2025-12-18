
import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { 
  User, Mail, Database, FileCode, Trash2, 
  ExternalLink, Award, ShieldCheck, Zap, 
  Wallet, Calendar, Users, ArrowUpRight, 
  CheckCircle2, Clock, Smartphone, CreditCard, X,
  History as HistoryIcon // Renamed to avoid collision with window.History global type
} from 'lucide-react';
import { db, dailyCheckIn, bindEwallet, requestWithdrawal } from '../services/firebaseService';
import { UserProfile, ArduinoProject, EwalletInfo } from '../types';

interface ProfileViewProps {
  user: any | null;
  projects: ArduinoProject[];
  onDeleteProject: (id: string) => void;
  onOpenProject: (id: string) => void;
  onTriggerRewardedAd: (callback: () => void) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ 
  user, projects, onDeleteProject, onOpenProject, onTriggerRewardedAd 
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showEwalletModal, setShowEwalletModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [ewalletType, setEwalletType] = useState<'dana' | 'ovo' | 'gopay'>('dana');
  const [ewalletName, setEwalletName] = useState('');
  const [ewalletNumber, setEwalletNumber] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('100000');
  const [msg, setMsg] = useState<{ type: 's' | 'e', t: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
      setProfile(doc.data() as UserProfile);
    });
    return () => unsub();
  }, [user]);

  const handleCheckIn = async () => {
    if (!profile) return;
    
    // Validasi apakah sudah check-in hari ini sebelum tayangkan iklan
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    if (profile.lastCheckIn && now - profile.lastCheckIn < oneDay) {
      setMsg({ type: 'e', t: 'Anda sudah check-in hari ini.' });
      return;
    }

    // Trigger iklan berhadiah
    onTriggerRewardedAd(async () => {
      const ok = await dailyCheckIn(profile.uid);
      if (ok) setMsg({ type: 's', t: 'Berhasil Check-in! +Rp. 10' });
      else setMsg({ type: 'e', t: 'Gagal memproses bonus.' });
    });
  };

  const handleBind = async () => {
    if (!profile) return;
    try {
      await bindEwallet(profile.uid, { type: ewalletType, ownerName: ewalletName, number: ewalletNumber });
      setShowEwalletModal(false);
      setMsg({ type: 's', t: 'E-wallet berhasil diikat.' });
    } catch (e) {
      setMsg({ type: 'e', t: 'Gagal mengikat E-wallet.' });
    }
  };

  const handleWithdraw = async () => {
    if (!profile) return;
    try {
      await requestWithdrawal(profile.uid, parseInt(withdrawAmount));
      setShowWithdrawModal(false);
      setMsg({ type: 's', t: 'Permintaan penarikan terkirim ke admin.' });
    } catch (e: any) {
      setMsg({ type: 'e', t: e.message });
    }
  };

  if (!user || !profile) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800">
          <User className="w-12 h-12 text-slate-700" />
        </div>
        <h2 className="text-xl font-black text-white uppercase tracking-tighter">Akses Terbatas</h2>
        <p className="text-sm text-slate-500 max-w-xs">Silakan login untuk mengakses fitur Earning.</p>
      </div>
    );
  }

  const remainingTaskTime = 3 * 24 * 60 * 60 * 1000 - (Date.now() - profile.taskStartTime);
  const hoursRemaining = Math.max(0, Math.floor(remainingTaskTime / (1000 * 60 * 60)));

  return (
    <div className="h-full overflow-y-auto custom-scrollbar bg-slate-950 p-4 md:p-8 relative">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Alert Msg */}
        {msg && (
          <div className={`fixed top-20 right-8 z-[100] p-4 rounded-2xl shadow-2xl border flex items-center gap-3 animate-in slide-in-from-right ${
            msg.type === 's' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-rose-500/10 border-rose-500 text-rose-400'
          }`}>
            <Zap className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">{msg.t}</span>
            <button onClick={() => setMsg(null)} className="ml-2 opacity-50">×</button>
          </div>
        )}

        {/* Balance Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 relative p-8 bg-gradient-to-br from-emerald-600 to-teal-800 rounded-[40px] shadow-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] pointer-events-none -mr-32 -mt-32"></div>
            <div className="relative flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-emerald-100 uppercase tracking-widest opacity-80">Total Saldo ALTOino</p>
                  <h2 className="text-5xl font-black text-white tracking-tighter mt-1">
                    Rp. {profile.balance.toLocaleString()}
                  </h2>
                </div>
                <div className="p-4 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-8">
                <button 
                  onClick={() => setShowWithdrawModal(true)}
                  className="px-8 py-3 bg-white text-emerald-700 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-xl active:scale-95 flex items-center gap-2"
                >
                  <ArrowUpRight className="w-4 h-4" /> Tarik Saldo
                </button>
                <button 
                  onClick={() => setShowEwalletModal(true)}
                  className="px-8 py-3 bg-emerald-900/30 border border-emerald-400/30 text-emerald-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-900/50 transition-all active:scale-95"
                >
                   {profile.ewallet ? 'Ubah E-wallet' : 'Ikat E-wallet'}
                </button>
              </div>
            </div>
          </div>

          {/* Daily Check-in Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 flex flex-col justify-between relative overflow-hidden group">
             <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Bonus Harian</p>
                <h3 className="text-2xl font-black text-white tracking-tight mt-1">Hadir & Dapatkan</h3>
                <p className="text-[10px] text-slate-500 font-mono mt-2">Dapatkan Rp. 10 setiap hari hanya dengan menonton iklan.</p>
             </div>
             <button 
               onClick={handleCheckIn}
               className="mt-6 w-full py-4 bg-slate-950 border border-slate-800 rounded-3xl font-black text-[10px] uppercase tracking-widest text-emerald-500 hover:border-emerald-500 transition-all flex items-center justify-center gap-2 group-active:scale-95"
             >
                <Calendar className="w-4 h-4" /> Check-in Sekarang
             </button>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-[40px] overflow-hidden p-8 space-y-6">
           <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-500" /> Tugas Periode (3 Hari)
                </h3>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                   <Clock className="w-3 h-3" /> Berakhir dalam: {hoursRemaining} Jam
                </div>
              </div>
              <div className="px-4 py-2 bg-slate-950 rounded-2xl border border-slate-800 text-[10px] font-mono text-emerald-400">
                 {profile.projectCount} Valid Projects
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-6 rounded-3xl border transition-all ${profile.projectCount >= 50 ? 'bg-emerald-500/10 border-emerald-500' : 'bg-slate-950 border-slate-800'}`}>
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Proyek 50/50</span>
                    {profile.projectCount >= 50 ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Clock className="w-4 h-4 text-slate-700" />}
                 </div>
                 <h4 className="text-xl font-black text-white tracking-tight">Rp. 10.000</h4>
                 <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (profile.projectCount/50)*100)}%` }}></div>
                 </div>
              </div>

              <div className={`p-6 rounded-3xl border transition-all ${profile.projectCount >= 100 ? 'bg-emerald-500/10 border-emerald-500' : 'bg-slate-950 border-slate-800'}`}>
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Proyek 100/100</span>
                    {profile.projectCount >= 100 ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Clock className="w-4 h-4 text-slate-700" />}
                 </div>
                 <h4 className="text-xl font-black text-white tracking-tight">Rp. 25.000</h4>
                 <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (profile.projectCount/100)*100)}%` }}></div>
                 </div>
              </div>
           </div>
        </div>

        {/* Referral System */}
        <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 flex flex-col md:flex-row items-center gap-8">
           <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 text-center md:text-left">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kode Referral Anda</p>
              <h4 className="text-3xl font-black text-emerald-500 tracking-[0.2em] mt-1">{profile.referralCode}</h4>
              <button 
                onClick={() => { navigator.clipboard.writeText(profile.referralCode); setMsg({type:'s', t:'Kode disalin!'}) }}
                className="mt-3 text-[10px] font-black text-slate-400 uppercase hover:text-white"
              >
                Klik untuk Salin
              </button>
           </div>
           <div className="flex-1 space-y-4">
              <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                 <Users className="w-6 h-6 text-blue-500" /> Undang Teman & Dapatkan Rp. 500
              </h3>
              <p className="text-sm text-slate-500">Ajak pengembang lain untuk bergabung. Dapatkan Rp. 500 untuk setiap teman yang melakukan registrasi valid menggunakan kode Anda.</p>
              <div className="flex items-center gap-4">
                 <div className="px-4 py-2 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300">
                    <span className="font-bold text-white">{profile.validFriendsCount}</span> Teman Valid
                 </div>
              </div>
           </div>
        </div>

        {/* Original Projects List */}
        <div className="bg-slate-900 border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
               <HistoryIcon className="w-5 h-5 text-emerald-500" /> Riwayat Cloud
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 border-b border-slate-800">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Nama Proyek</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-8 py-4">
                      <span className="text-sm font-bold text-slate-200">{proj.name}</span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => onOpenProject(proj.id)} className="p-2 text-slate-500 hover:text-emerald-400"><ExternalLink className="w-4 h-4" /></button>
                        <button onClick={() => onDeleteProject(proj.id)} className="p-2 text-slate-500 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* E-wallet Binding Modal */}
      {showEwalletModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
           <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl p-8 space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-sm font-black text-white uppercase tracking-widest">Ikat E-wallet</h3>
                 <button onClick={() => setShowEwalletModal(false)}><X className="w-5 h-5 text-slate-500" /></button>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                 {['dana', 'ovo', 'gopay'].map((t) => (
                    <button 
                      key={t}
                      onClick={() => setEwalletType(t as any)}
                      className={`py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${ewalletType === t ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
                    >
                       {t}
                    </button>
                 ))}
              </div>

              <div className="space-y-4">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nama Pemilik</label>
                    <div className="relative">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                       <input 
                         value={ewalletName}
                         onChange={e => setEwalletName(e.target.value)}
                         className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white" 
                         placeholder="Sesuai Akun E-wallet"
                       />
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nomor E-wallet</label>
                    <div className="relative">
                       <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                       <input 
                         value={ewalletNumber}
                         onChange={e => setEwalletNumber(e.target.value)}
                         className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white" 
                         placeholder="08xxxxxxxxxx"
                       />
                    </div>
                 </div>
              </div>

              <button 
                onClick={handleBind}
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500"
              >
                Konfirmasi Data
              </button>
           </div>
        </div>
      )}

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
           <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl p-8 space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-sm font-black text-white uppercase tracking-widest">Penarikan Saldo</h3>
                 <button onClick={() => setShowWithdrawModal(false)}><X className="w-5 h-5 text-slate-500" /></button>
              </div>

              <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/20 text-center">
                 <p className="text-[10px] font-black text-emerald-500 uppercase">Saldo Tersedia</p>
                 <h4 className="text-3xl font-black text-white mt-1">Rp. {profile.balance.toLocaleString()}</h4>
              </div>

              <div className="space-y-4">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Jumlah Penarikan (Rp)</label>
                    <div className="relative">
                       <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                       <input 
                         type="number"
                         value={withdrawAmount}
                         onChange={e => setWithdrawAmount(e.target.value)}
                         className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white" 
                         placeholder="100000"
                       />
                    </div>
                    <p className="text-[9px] text-slate-600 italic mt-1">Minimal penarikan adalah Rp. 100.000</p>
                 </div>

                 {profile.ewallet ? (
                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-4">
                       <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 uppercase font-black text-[8px]">
                          {profile.ewallet.type}
                       </div>
                       <div>
                          <p className="text-xs font-bold text-white">{profile.ewallet.ownerName}</p>
                          <p className="text-[10px] text-slate-500">{profile.ewallet.number}</p>
                       </div>
                    </div>
                 ) : (
                    <button 
                      onClick={() => { setShowWithdrawModal(false); setShowEwalletModal(true); }}
                      className="w-full p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl text-[10px] font-black text-rose-400 uppercase tracking-widest"
                    >
                       Harap Ikat E-wallet Terlebih Dahulu
                    </button>
                 )}
              </div>

              <button 
                disabled={!profile.ewallet}
                onClick={handleWithdraw}
                className="w-full py-4 bg-emerald-600 disabled:opacity-30 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500"
              >
                Kirim Permintaan
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
