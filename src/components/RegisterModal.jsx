import React, { useState } from 'react';
import { 
  Smartphone, 
  X, 
  CheckCircle2, 
  User, 
  Sparkles,
  TreePine,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RegisterModal({ t, isOpen, onClose, onRegisterSuccess, lang = 'uz', onLangChange }) {
  // Form states
  const [fullName, setFullName] = useState('Asilbek Davlatov');
  // Phone starts with +998, and digits are strictly limited to at most 9 digits (Uzbekistan standard: +998 XX YYY YY YY)
  const [phoneDigits, setPhoneDigits] = useState('901234567');

  // Flow states
  const [step, setStep] = useState(1); // 1: input info, 2: sms otp
  const [otp, setOtp] = useState(['4', '8', '2', '1']);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Strict phone handler: starts with +998, max length strictly 9 digits
  const handlePhoneDigitsChange = (e) => {
    let val = e.target.value.replace(/\D/g, ''); // only numeric digits
    if (val.startsWith('998')) {
      val = val.slice(3); // strip if pasted with 998
    }
    // Max length strictly 9 digits
    val = val.slice(0, 9);
    setPhoneDigits(val);
  };

  const formattedFullPhone = `+998 ${phoneDigits}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phoneDigits.length < 9) {
      alert("Iltimos, telefon raqamingizning to‘liq 9 ta raqamini kiriting (masalan: 90 123 45 67)!");
      return;
    }
    // Cyber security: sanitize full name
    const sanitizedName = fullName.replace(/[<>{}"'`;\\]/g, '').trim().slice(0, 60);
    setFullName(sanitizedName);

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2); // move to OTP step
    }, 500);
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      try {
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {}
      
      const sanitizedName = fullName.replace(/[<>{}"'`;\\]/g, '').trim().slice(0, 60);
      const registeredUser = {
        name: sanitizedName || 'Asilbek Davlatov',
        phone: formattedFullPhone,
        district: 'Yunusobod',
        coins: 10, // Initial welcome bonus (+10 Eco-Coin)
        verified: true
      };

      onRegisterSuccess(registeredUser);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-sm sm:max-w-md overflow-hidden rounded-[32px] bg-white dark:bg-[#07140e] text-slate-900 dark:text-slate-100 shadow-2xl border-2 border-emerald-500/40 my-auto animate-in zoom-in-95 duration-200">
        
        {/* =========================================================================
            HEADER: Brand Green Gradient + Sprout Emblem + Title + Bonus Subtitle
            ========================================================================= */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 pt-5 pb-4 px-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner">
              <TreePine className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                LeafPay’da Ro‘yxatdan o‘tish
              </h3>
              <p className="text-[11px] sm:text-xs text-emerald-100 font-semibold mt-0.5">
                Boshlang‘ich +10 Eco-Coin xush kelibsiz bonusi!
              </p>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition cursor-pointer shrink-0 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Indicator (OneID is completely removed) */}
        <div className="border-b border-emerald-100 dark:border-emerald-950 px-6 pt-3 pb-2.5 flex items-center gap-2 bg-emerald-50/40 dark:bg-emerald-950/20">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-black text-emerald-800 dark:text-emerald-300">
            Telefon raqam orqali (Tezkor SMS)
          </span>
        </div>

        {/* =========================================================================
            FORM BODY
            ========================================================================= */}
        <div className="p-5 sm:p-6 pt-4">
          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* 1. Ism va familiyangiz */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  ISM VA FAMILIYANGIZ
                </label>
                <div className="relative flex items-center rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 focus-within:border-emerald-500 transition shadow-sm">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Masalan: Asilbek Davlatov"
                    className="w-full bg-transparent px-4 py-3 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
                    required
                  />
                  <div className="pr-4 pointer-events-none text-slate-400">
                    <User className="w-5 h-5 text-emerald-600/70" />
                  </div>
                </div>
              </div>

              {/* 2. Telefon raqamingiz: Always starts with +998, max length strictly 9 digits */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  TELEFON RAQAMINGIZ
                </label>

                <div className="relative flex items-center rounded-2xl border-2 border-emerald-500/50 dark:border-emerald-500/40 bg-slate-50/90 dark:bg-slate-900/90 overflow-hidden focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition shadow-sm">
                  {/* Fixed +998 Prefix (guaranteed to start with +998) */}
                  <div className="flex items-center gap-1.5 pl-3.5 pr-2.5 py-3 bg-emerald-100/60 dark:bg-emerald-950/70 border-r border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-black font-mono text-sm select-none">
                    <span className="text-sm">🇺🇿</span>
                    <span>+998</span>
                  </div>

                  {/* Strictly limited to max 9 digits */}
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={9}
                    value={phoneDigits}
                    onChange={handlePhoneDigitsChange}
                    placeholder="901234567"
                    className="w-full bg-transparent px-3 py-3 text-base font-mono font-bold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none tracking-wider"
                    required
                  />

                  {/* Phone icon */}
                  <div className="pr-3.5 pointer-events-none text-emerald-600 dark:text-emerald-400">
                    <Smartphone className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Bonus notification badge */}
              <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/80 dark:bg-emerald-950/40 p-3.5 flex items-center gap-2.5 text-emerald-900 dark:text-emerald-200">
                <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 animate-pulse" />
                <span className="text-xs font-bold leading-snug">
                  Ro‘yxatdan o‘tganingiz uchun darhol +10 Eco-Coin beriladi!
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || phoneDigits.length === 0}
                className="w-full py-3.5 sm:py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50 text-white font-black text-sm rounded-full shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition cursor-pointer mt-1"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    SMS kod yuborilmoqda...
                  </span>
                ) : (
                  <>
                    <span>SMS kod olish</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Disclaimer */}
              <p className="text-center text-[10.5px] text-slate-500 dark:text-slate-400 font-semibold pt-1">
                Ro‘yxatdan o‘tish orqali siz LeafPay ekologik nizomiga rozilik bildirasiz
              </p>

            </form>
          ) : (
            /* STEP 2: SMS OTP Code */
            <form onSubmit={handleOtpVerify} className="space-y-4 text-center py-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 mx-auto flex items-center justify-center border border-emerald-300 dark:border-emerald-700">
                <Smartphone className="w-7 h-7" />
              </div>

              <div>
                <h4 className="font-black text-base text-slate-900 dark:text-white">Tasdiqlash kodi</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-semibold">
                  <span className="font-mono font-black text-emerald-700 dark:text-emerald-300">
                    +998 {phoneDigits}
                  </span> raqamiga 4 xonali SMS kod yuborildi
                </p>
              </div>

              <div className="flex justify-center gap-2.5 py-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    defaultValue={digit}
                    className="w-12 h-13 text-center text-xl font-black font-mono border-2 border-emerald-500 rounded-2xl bg-emerald-50 dark:bg-slate-900 text-emerald-950 dark:text-white outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-full shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                {isLoading ? (
                  <span>Tasdiqlanmoqda...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Tasdiqlash va hisob ochish</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-slate-500 hover:text-emerald-600 font-bold transition block mx-auto pt-1 cursor-pointer"
              >
                ← Raqamni o‘zgartirish
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}