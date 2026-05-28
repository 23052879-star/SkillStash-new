import React, { useState } from 'react';
import { Coins, CreditCard, ShieldCheck, ArrowUpRight, ArrowDownLeft, Zap, Sparkles, CheckCircle2, History, AlertCircle } from 'lucide-react';
import { useUserStore } from '../../stores/userStore';
import { CheckoutModal } from '../../components/payment/CheckoutModal';

export const BillingPage: React.FC = () => {
  const { credits } = useUserStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Hardcoded premium mock transactions
  const [transactions] = useState([
    {
      id: 'TXN-98402',
      type: 'purchase',
      description: 'Pro Hunter Pack (+15 Credits)',
      amount: '₹799.00',
      date: 'May 28, 2026',
      status: 'success',
    },
    {
      id: 'TXN-97312',
      type: 'deduction',
      description: 'AI Resume Tailoring (Full Optimization)',
      amount: '1 Credit',
      date: 'May 28, 2026',
      status: 'success',
    },
    {
      id: 'TXN-95029',
      type: 'purchase',
      description: 'Starter Pack (+5 Credits)',
      amount: '₹399.00',
      date: 'May 24, 2026',
      status: 'success',
    },
    {
      id: 'TXN-94002',
      type: 'deduction',
      description: 'AI Resume Tailoring (Keyword Matching)',
      amount: '1 Credit',
      date: 'May 24, 2026',
      status: 'success',
    }
  ]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-gray-150 dark:border-gray-700">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Billing & Credits</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your AI Tailoring credits, purchase packages, and view your transaction history.
          </p>
        </div>
        <button
          onClick={() => setIsCheckoutOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold shadow-lg hover:shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
        >
          <Coins className="h-5 w-5" />
          <span>Buy Tailoring Credits</span>
        </button>
      </div>

      {/* Credit Balance Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative overflow-hidden md:col-span-2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-700/50">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center h-full gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/20 text-blue-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Active Balance
              </div>
              <div>
                <h3 className="text-4xl md:text-5xl font-black tracking-tight">{credits}</h3>
                <p className="text-xs text-slate-400 mt-1.5 font-medium">Available AI Resume Tailoring Credits</p>
              </div>
            </div>
            
            <div className="bg-white/5 border border-white/15 p-4 rounded-2xl max-w-xs backdrop-blur-sm">
              <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider mb-2">What are credits used for?</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Each credit unlocks a full AI tailoring session for a specific job description. This includes keywords generation, bullet optimization, a tailored summary, and real-time ATS optimization guidelines.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Purchase card */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-md flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-black text-gray-900 dark:text-white">Pro Package Deal</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Get our most popular plan to optimize your resume for up to 15 different applications.
            </p>
            <div className="pt-2">
              <span className="text-3xl font-black text-blue-600 dark:text-blue-400">₹799</span>
              <span className="text-xs text-gray-400 font-medium ml-1">/ 15 credits</span>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full mt-4 py-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-extrabold rounded-2xl border border-blue-100 dark:border-blue-900/30 transition-all text-xs"
          >
            Select Pro Pack
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl overflow-hidden shadow-md">
        <div className="px-6 py-5 border-b border-gray-150 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
          <h3 className="font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <History className="h-5 w-5 text-blue-500" /> Transaction Ledger
          </h3>
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
            Secured via Cashfree
          </span>
        </div>
        
        <div className="divide-y divide-gray-150 dark:divide-gray-700">
          {transactions.map((txn) => (
            <div key={txn.id} className="p-6 flex items-center justify-between hover:bg-gray-50/30 dark:hover:bg-gray-800/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  txn.type === 'purchase'
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600'
                    : 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600'
                }`}>
                  {txn.type === 'purchase' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-900 dark:text-white leading-tight">{txn.description}</h4>
                  <div className="flex items-center gap-2 mt-1.5 text-[11px] text-gray-400">
                    <span className="font-bold tracking-wider">{txn.id}</span>
                    <span>•</span>
                    <span>{txn.date}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-black ${
                  txn.type === 'purchase' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-850 dark:text-gray-300'
                }`}>
                  {txn.type === 'purchase' ? '+' : '-'}{txn.amount}
                </p>
                <span className="inline-flex items-center gap-1 mt-1 text-[9px] uppercase font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="h-3 w-3" /> SUCCESSFUL
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Banner */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-2xl flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300">PCI-DSS Compliant Encryption</h4>
          <p className="text-[11px] text-blue-700/80 dark:text-blue-400/80 leading-relaxed mt-0.5">
            Your transactions are secure. We do not store card credentials. All data is processed using AES-256 secure channel transmission over SSL by Cashfree Payments.
          </p>
        </div>
      </div>

      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </div>
  );
};

export default BillingPage;
