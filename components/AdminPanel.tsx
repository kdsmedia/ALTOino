
import React, { useState, useEffect } from 'react';
import { 
  Users, Wallet, CheckCircle, XCircle, 
  ArrowLeft, RefreshCw, Zap, ShieldCheck,
  Search, ExternalLink, Smartphone
} from 'lucide-react';
import { 
  getAdminStats, 
  getAllPendingWithdrawals, 
  approveWithdrawal, 
  rejectWithdrawal 
} from '../services/firebaseService';
import { WithdrawalRequest } from '../types';

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [stats, setStats] = useState({ totalUsers: 0, pendingWithdrawals: 0 });
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const s = await getAdminStats();
      const r = await getAllPendingWithdrawals();
      setStats(s);
      setRequests(r);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id: string) => {
    if (!confirm("Setujui penarikan ini? Saldo user akan otomatis terpotong.")) return;
    await approveWithdrawal(id);
    loadData();
  };

  const handleReject = async (id: string) => {
    if (!confirm("Tolak penarikan ini?")) return;
    await rejectWithdrawal(id);
    loadData();
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 font-sans overflow-hidden">
      {/* Admin Header */}
      <div className="p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-xl text-slate-500"><ArrowLeft /></button>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
               <ShieldCheck className="w-6 h-6 text-emerald-500" /> ALTOino Admin Panel
            </h2>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">HQ Command Terminal</p>
          </div>
        </div>
        <button onClick={loadData} className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-emerald-500 hover:text-white transition-all">
          <RefreshCw className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="bg-slate-900 border border-slate-800 p-6 rounded-[32px] shadow-xl">
              <Users className="w-8 h-8 text-blue-500 mb-4" />
              <div className="text-3xl font-black text-white">{stats.totalUsers}</div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Total Users</p>
           </div>
           <div className="bg-slate-900 border border-slate-800 p-6 rounded-[32px] shadow-xl">
              <Wallet className="w-8 h-8 text-amber-500 mb-4" />
              <div className="text-3xl font-black text-white">{stats.pendingWithdrawals}</div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Pending Withdrawals</p>
           </div>
           {/* Placeholder Stats */}
           <div className="bg-slate-900 border border-slate-800 p-6 rounded-[32px] shadow-xl">
              <Zap className="w-8 h-8 text-emerald-500 mb-4" />
              <div className="text-3xl font-black text-white">Active</div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">System Status</p>
           </div>
           <div className="bg-slate-900 border border-slate-800 p-6 rounded-[32px] shadow-xl">
              <ShieldCheck className="w-8 h-8 text-purple-500 mb-4" />
              <div className="text-3xl font-black text-white">99.9%</div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Security Uptime</p>
           </div>
        </div>

        {/* Pending Requests Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
               <Wallet className="w-5 h-5 text-amber-500" /> Permintaan Penarikan
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 border-b border-slate-800">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">User / Email</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">E-wallet Details</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Amount (Rp)</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white uppercase">{req.id}</span>
                        <span className="text-[10px] text-slate-500 font-mono mt-1">{req.userEmail}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="px-2 py-1 bg-emerald-500/10 rounded-lg text-[8px] font-black text-emerald-500 uppercase">
                          {req.ewallet.type}
                        </div>
                        <div className="flex flex-col">
                           <span className="text-xs text-slate-200">{req.ewallet.ownerName}</span>
                           <span className="text-[10px] text-slate-500 font-mono">{req.ewallet.number}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-emerald-400">Rp. {req.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => handleApprove(req.id)}
                          className="p-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleReject(req.id)}
                          className="p-3 bg-rose-500/10 text-rose-500 border border-rose-500/30 rounded-2xl hover:bg-rose-500 hover:text-white transition-all"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && !loading && (
                   <tr>
                     <td colSpan={4} className="px-8 py-12 text-center text-slate-600 italic text-sm">
                       Tidak ada permintaan penarikan saldo tertunda.
                     </td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
