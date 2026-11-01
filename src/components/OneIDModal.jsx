import React, { useState } from 'react';
import { ShieldCheck, Lock, Smartphone, X, CheckCircle2 } from 'lucide-react';

export default function OneIDModal({ t, isOpen, onClose, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('pinfl');
  const [pinfl, setPinfl] = useState('32408991230045');
  const [phone, setPhone] = useState('+998 90 123 45 67');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleAuth = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: 'Azizbek Rahimov',
        pinfl: pinfl || '32408991230045',
        phone: phone || '+998 90 123 45 67',
        verified: true,
      });
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-[#0c1810] text-slate-900 dark:text-slate-100 shadow-2xl border-2 border-emerald-500/40 animate-in fade-in zoom-in-95 duration-200">
        {/* OneID Official Header */}
        <div className="bg-[#0052cc] p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-xl font-black tracking-tight flex items-center gap-1.5">
                ONE<span className="text-amber-400">ID</span>
              </div>
              <p className="text-xs text-blue-100">{t.oneid_sub}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-600 dark:text-slate-400">
          <button
            onClick={() => setActiveTab('pinfl')}
            className={`flex-1 py-3.5 text-center border-b-2 transition cursor-pointer ${
              activeTab === 'pinfl' ? 'border-[#0052cc] text-[#0052cc] bg-white dark:bg-slate-900' : 'border-transparent'
            }`}
          >
            {t.oneid_tab_pinfl}
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-3.5 text-center border-b-2 transition cursor-pointer ${
              activeTab === 'qr' ? 'border-[#0052cc] text-[#0052cc] bg-white dark:bg-slate-900' : 'border-transparent'
            }`}
          >
            {t.oneid_tab_mob}
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3.5 text-center border-b-2 transition cursor-pointer ${
              activeTab === 'login' ? 'border-[#0052cc] text-[#0052cc] bg-white dark:bg-slate-900' : 'border-transparent'
            }`}
          >
            {t.oneid_tab_pass}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="mb-4 flex items-center gap-2.5 p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl text-blue-800 dark:text-blue-300 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-600" />
            <span>{t.oneid_notice}</span>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                {t.oneid_pinfl_label}
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={14}
                  value={pinfl}
                  onChange={(e) => setPinfl(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm font-mono tracking-wider focus:border-[#0052cc] outline-none text-slate-900 dark:text-white"
                  placeholder="32408991230045"
                  required
                />
                <span className="absolute right-3.5 top-3 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">
                  {t.oneid_pinfl_active}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                {t.oneid_phone_label}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm font-mono tracking-wider focus:border-[#0052cc] outline-none text-slate-900 dark:text-white"
                  placeholder="+998 90 123 45 67"
                  required
                />
                <Smartphone className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-[#0052cc] hover:bg-[#0041a3] py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <span>{t.oneid_btn_loading}</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>{t.oneid_btn_auth}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="mt-4 text-center text-[11px] text-slate-400">
            {t.oneid_standards}
          </p>
        </div>
      </div>
    </div>
  );
}
