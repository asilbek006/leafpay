import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  ShieldCheck, 
  Sun, 
  Moon, 
  Bell, 
  User, 
  Smartphone, 
  MapPin, 
  ChevronDown, 
  Camera, 
  ShoppingBag, 
  Check,
  TreePine,
  Trash2,
  AlertTriangle
} from 'lucide-react';

export default function SpringShowcase({ theme, onStartDemo, onOpenRegister, user }) {
  const isDark = theme === 'dark';
  const [showcaseSubmitted, setShowcaseSubmitted] = useState(false);
  const [showcaseLang, setShowcaseLang] = useState('UZ');

  return (
    <section className="space-y-6 pt-4">
      {/* Top Banner Header matching the uploaded banner */}
      <div className="text-center space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-2">
          {/* Light Mode Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border-2 border-emerald-300 dark:border-emerald-800 shadow-sm text-xs font-bold text-slate-800 dark:text-slate-200">
            <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs">
              ☀️
            </span>
            <span>Light Mode — Yorqin, toza va bahorona dizayn</span>
          </div>

          {/* Dark Mode Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 dark:bg-[#07160f] border-2 border-emerald-500/40 shadow-sm text-xs font-bold text-emerald-300">
            <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-300 flex items-center justify-center text-xs">
              🌙
            </span>
            <span>Dark Mode — Zamonaviy va ko‘z yoritmaydigan dizayn</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          {/* 3 Leaves Emblem */}
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center">
            <svg viewBox="0 0 64 64" className="w-7 h-7" fill="none">
              <path d="M32 10 C32 10 44 22 40 38 C37 49 27 52 24 54 C24 54 26 44 32 36 C36 30 36 20 32 10 Z" fill="#10B981" />
              <path d="M26 28 C26 28 14 30 14 42 C14 50 20 54 24 54 C24 54 22 45 26 40 C30 35 28 30 26 28 Z" fill="#34D399" />
              <path d="M36 24 C36 24 50 26 50 38 C50 48 42 52 38 54 C38 54 40 44 36 38 C33 33 34 26 36 24 Z" fill="#059669" />
            </svg>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
            LeafPay
          </h2>
        </div>
        <p className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-300">
          Yashil amal evaziga raqamli imtiyoz
        </p>
      </div>

      {/* Main Interactive Showcase Grid matching the uploaded image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start max-w-6xl mx-auto">
        
        {/* =========================================================================
            PHONE 1: LIGHT MODE LOGIN & REGISTRATION SCREEN (LEFT)
            ========================================================================= */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div className="w-full max-w-[340px] rounded-[42px] border-[5px] border-slate-800 dark:border-emerald-600/50 bg-white shadow-2xl overflow-hidden text-slate-900 transition-all hover:scale-[1.01]">
            
            {/* Phone Notch / Dynamic Island */}
            <div className="pt-3 px-6 pb-2 flex items-center justify-between text-[11px] font-bold text-slate-800">
              <span>9:41</span>
              <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto" />
              <div className="flex items-center gap-1">
                <span className="text-[10px]">📶</span>
                <span className="text-[10px]">🔋</span>
              </div>
            </div>

            {/* Spring Blossom City Background */}
            <div className="relative pt-3 pb-3 px-5 text-center overflow-hidden bg-gradient-to-b from-emerald-100/70 via-emerald-50/40 to-white">
              {/* Tashkent TV Tower & Spring Blossoms Silhouette */}
              <div className="absolute inset-0 pointer-events-none opacity-35 overflow-hidden">
                <svg viewBox="0 0 300 140" className="w-full h-full object-cover">
                  <path d="M 230 140 L 230 70 L 233 60 L 233 30 L 230 10 L 227 30 L 227 60 L 230 70 Z" fill="#10b981" opacity="0.4" />
                  <path d="M 220 75 L 240 75 L 236 88 L 224 88 Z" fill="#10b981" opacity="0.5" />
                  <circle cx="40" cy="30" r="9" fill="#ffffff" />
                  <circle cx="40" cy="30" r="3.5" fill="#f59e0b" />
                  <circle cx="80" cy="20" r="7" fill="#ffffff" />
                  <circle cx="80" cy="20" r="2.8" fill="#f59e0b" />
                </svg>
              </div>

              {/* Language Pills: UZ RU EN */}
              <div className="relative z-10 flex justify-end mb-1">
                <div className="flex items-center gap-0.5 bg-white/90 shadow-sm border border-emerald-200 p-0.5 rounded-full text-[10px] font-black">
                  {['UZ', 'RU', 'EN'].map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setShowcaseLang(l)}
                      className={`px-2 py-0.5 rounded-full transition cursor-pointer ${
                        showcaseLang === l ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-emerald-700'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logo & Slogan */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 flex items-center justify-center mb-1">
                  <svg viewBox="0 0 64 64" className="w-8 h-8" fill="none">
                    <path d="M32 10 C32 10 44 22 40 38 C37 49 27 52 24 54 C24 54 26 44 32 36 C36 30 36 20 32 10 Z" fill="#10B981" />
                    <path d="M26 28 C26 28 14 30 14 42 C14 50 20 54 24 54 C24 54 22 45 26 40 C30 35 28 30 26 28 Z" fill="#34D399" />
                    <path d="M36 24 C36 24 50 26 50 38 C50 48 42 52 38 54 C38 54 40 44 36 38 C33 33 34 26 36 24 Z" fill="#059669" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-slate-900">
                  LeafPay
                </h3>
                <p className="text-[11px] font-bold text-emerald-800">
                  Yashil amal evaziga raqamli imtiyoz
                </p>
              </div>
            </div>

            {/* Inputs & Buttons */}
            {showcaseSubmitted ? (
              <div className="p-6 text-center space-y-3 py-12 animate-in zoom-in-95">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center text-2xl font-black shadow-inner">
                  ✓
                </div>
                <h4 className="font-black text-sm text-slate-900">
                  {showcaseLang === 'RU' ? 'Успешный вход!' : showcaseLang === 'EN' ? 'Signed in successfully!' : 'Muvaffaqiyatli kirdingiz!'}
                </h4>
                <p className="text-xs text-slate-600 font-semibold">
                  {showcaseLang === 'RU' ? 'Начислено +320 Eco-Coin!' : showcaseLang === 'EN' ? '+320 Eco-Coin welcome bonus!' : '+320 Eco-Coin balansi faollashdi!'}
                </p>
                <button
                  type="button"
                  onClick={() => setShowcaseSubmitted(false)}
                  className="text-xs text-emerald-600 font-bold underline cursor-pointer pt-2"
                >
                  {showcaseLang === 'RU' ? 'Сбросить' : showcaseLang === 'EN' ? 'Reset' : 'Qayta ko‘rish'}
                </button>
              </div>
            ) : (
              <div className="p-5 pt-3 space-y-3">
                {/* Input: Ism va familiya */}
                <div className="relative">
                  <User className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    readOnly
                    value="Aziza Rahimova"
                    className="w-full rounded-2xl border-2 border-emerald-100 bg-slate-50 pl-10 pr-3 py-2.5 text-xs font-bold text-slate-900"
                  />
                </div>

                {/* Input: Telefon */}
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    readOnly
                    value="+998 90 123 45 67"
                    className="w-full rounded-2xl border-2 border-emerald-100 bg-slate-50 pl-10 pr-3 py-2.5 text-xs font-mono font-bold text-slate-900"
                  />
                </div>

                {/* Input: Tuman */}
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3.5" />
                  <div className="w-full rounded-2xl border-2 border-emerald-100 bg-slate-50 pl-10 pr-8 py-2.5 text-xs font-bold text-slate-900 flex items-center justify-between">
                    <span>Yunusobod</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>

                {/* Button: Ro'yxatdan o'tish */}
                <button
                  type="button"
                  onClick={() => setShowcaseSubmitted(true)}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-full shadow-md shadow-emerald-600/30 transition cursor-pointer"
                >
                  {showcaseLang === 'RU' ? 'Зарегистрироваться' : showcaseLang === 'EN' ? 'Sign Up' : 'Ro‘yxatdan o‘tish'}
                </button>

                {/* yoki */}
                <div className="relative flex items-center justify-center my-1.5">
                  <div className="w-full border-t border-slate-200" />
                  <span className="absolute px-2 bg-white text-[10px] font-bold text-slate-400">
                    {showcaseLang === 'RU' ? 'или' : showcaseLang === 'EN' ? 'or' : 'yoki'}
                  </span>
                </div>

                {/* Button: OneID */}
                <button
                  type="button"
                  onClick={() => setShowcaseSubmitted(true)}
                  className="w-full py-2.5 bg-white border-2 border-slate-200 text-slate-800 font-black text-xs rounded-full shadow-sm flex items-center justify-center gap-1.5 hover:bg-slate-50 transition cursor-pointer"
                >
                  <span className="w-4 h-4 rounded bg-[#0052cc] text-white flex items-center justify-center text-[9px] font-black">
                    ID
                  </span>
                  <span>{showcaseLang === 'RU' ? 'Вход через OneID' : showcaseLang === 'EN' ? 'Sign in with OneID' : 'OneID orqali kirish'}</span>
                </button>

                {/* Checkbox */}
                <div className="flex items-start gap-2 pt-1">
                  <div className="w-4 h-4 rounded bg-emerald-600 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    ✓
                  </div>
                  <span className="text-[10px] text-slate-600 leading-tight font-medium">
                    {showcaseLang === 'RU' ? 'Согласен с правилами приложения.' : showcaseLang === 'EN' ? 'I agree to the terms and rules.' : 'Ro‘yxatdan o‘tib, ilova qoidalari bilan roziman.'}
                  </span>
                </div>
              </div>
            )}

            {/* Bottom Bar Indicator */}
            <div className="pb-2 pt-1 flex justify-center">
              <div className="w-24 h-1 bg-slate-300 rounded-full" />
            </div>

          </div>
          <span className="mt-2 text-xs font-black text-emerald-700 dark:text-emerald-400">
            1. Ro‘yxatdan o‘tish / Kirish
          </span>
        </div>

        {/* =========================================================================
            PHONE 2: LIGHT MODE CITIZEN APP (MIDDLE)
            ========================================================================= */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div className="w-full max-w-[340px] rounded-[42px] border-[5px] border-slate-800 dark:border-emerald-600/50 bg-[#f7fdf9] shadow-2xl overflow-hidden text-slate-900 transition-all hover:scale-[1.01]">
            
            {/* Phone Notch */}
            <div className="pt-3 px-6 pb-2 flex items-center justify-between text-[11px] font-bold text-slate-800">
              <span>9:41</span>
              <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto" />
              <div className="flex items-center gap-1">
                <span className="text-[10px]">📶</span>
                <span className="text-[10px]">🔋</span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {/* Header: Salom, Aziza! 👋 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-emerald-500">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" 
                      alt="Aziza" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">Salom, Aziza! 👋</div>
                    <div className="text-[10px] text-emerald-700 font-semibold">Yunusobod · Faol</div>
                  </div>
                </div>
                <div className="relative p-1.5 rounded-full bg-white border border-emerald-200">
                  <Bell className="w-4 h-4 text-slate-700" />
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-rose-500 rounded-full" />
                </div>
              </div>

              {/* Green Card: Mening Eco-Coin'im 320 > + Seedling */}
              <div 
                onClick={onStartDemo}
                className="rounded-3xl p-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-[10px] text-emerald-100 font-bold">Mening Eco-Coin‘im</div>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="text-base">🪙</span>
                    <span className="text-2xl font-black font-mono">320</span>
                    <ChevronRight className="w-4 h-4 text-emerald-200" />
                  </div>
                </div>
                <div className="w-14 h-14 shrink-0 flex items-center justify-center text-3xl">
                  🌱
                </div>
              </div>

              {/* 3 Quick Actions: Ko'chat, Tozalash, Muammo */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <button 
                  onClick={onStartDemo}
                  className="p-2.5 rounded-2xl bg-white border border-emerald-200 flex flex-col items-center justify-center gap-1 shadow-sm cursor-pointer"
                >
                  <span className="text-xl">🌱</span>
                  <span className="text-[10px] font-black leading-tight text-slate-800">Ko‘chat ekish</span>
                </button>

                <button 
                  onClick={onStartDemo}
                  className="p-2.5 rounded-2xl bg-white border border-blue-200 flex flex-col items-center justify-center gap-1 shadow-sm cursor-pointer"
                >
                  <span className="text-xl">🗑️</span>
                  <span className="text-[10px] font-black leading-tight text-slate-800">Hududni tozalash</span>
                </button>

                <button 
                  onClick={onStartDemo}
                  className="p-2.5 rounded-2xl bg-white border border-rose-200 flex flex-col items-center justify-center gap-1 shadow-sm cursor-pointer"
                >
                  <span className="text-xl">⚠️</span>
                  <span className="text-[10px] font-black leading-tight text-slate-800">Muammo xabar</span>
                </button>
              </div>

              {/* Mening ta'sirim */}
              <div className="rounded-2xl p-2.5 bg-white border border-emerald-100 shadow-sm">
                <div className="text-[10px] font-black text-slate-700 mb-1.5">Mening ta‘sirim</div>
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <div className="p-1 rounded-xl bg-emerald-50 text-[10px] font-bold text-emerald-800">
                    🌱 12 Ko‘chat
                  </div>
                  <div className="p-1 rounded-xl bg-blue-50 text-[10px] font-bold text-blue-800">
                    🗑️ 3 Tozalash
                  </div>
                  <div className="p-1 rounded-xl bg-amber-50 text-[10px] font-bold text-amber-800">
                    ⚠️ 2 Xabar
                  </div>
                </div>
              </div>

              {/* Bugungi vazifa */}
              <div 
                onClick={onStartDemo}
                className="p-2.5 rounded-2xl bg-emerald-100/70 border border-emerald-300 flex items-center justify-between gap-2 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌱</span>
                  <div>
                    <div className="text-[10px] font-black text-emerald-900">Bugungi vazifa</div>
                    <div className="text-[9px] text-emerald-800 font-semibold">1 ta ko‘chat ekib, +10 oling!</div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-700" />
              </div>

              {/* Hamkorlarimiz */}
              <div>
                <div className="flex items-center justify-between text-[10px] font-black mb-1">
                  <span>Hamkorlarimiz</span>
                  <span className="text-emerald-700">Barchasini ko‘rish ›</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <div className="p-1.5 rounded-xl bg-white border border-slate-200">
                    <div className="w-6 h-6 rounded-md bg-blue-600 text-white text-[10px] font-black flex items-center justify-center mx-auto mb-1">M</div>
                    <div className="text-[9px] font-black truncate">Metro</div>
                    <div className="text-[8px] text-emerald-600 font-bold">10 coin</div>
                  </div>
                  <div className="p-1.5 rounded-xl bg-white border border-slate-200">
                    <div className="w-6 h-6 rounded-md bg-rose-600 text-white text-[10px] font-black flex items-center justify-center mx-auto mb-1">🛒</div>
                    <div className="text-[9px] font-black truncate">Korzinka</div>
                    <div className="text-[8px] text-emerald-600 font-bold">20 coin</div>
                  </div>
                  <div className="p-1.5 rounded-xl bg-white border border-slate-200">
                    <div className="w-6 h-6 rounded-md bg-amber-600 text-white text-[10px] font-black flex items-center justify-center mx-auto mb-1">☕</div>
                    <div className="text-[9px] font-black truncate">Kafe</div>
                    <div className="text-[8px] text-emerald-600 font-bold">15 coin</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Dock Navigation */}
            <div className="bg-white border-t border-slate-200 p-2 px-4 flex items-center justify-between text-[9px] font-black text-slate-600">
              <div className="flex flex-col items-center text-emerald-600">
                <span>🏠</span>
                <span>Bosh sahifa</span>
              </div>
              <div className="flex flex-col items-center">
                <span>🗺️</span>
                <span>Xarita</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-base -mt-4 shadow-lg shadow-emerald-600/40">
                +
              </div>
              <div className="flex flex-col items-center">
                <span>🎁</span>
                <span>Mukofotlar</span>
              </div>
              <div className="flex flex-col items-center">
                <span>👤</span>
                <span>Profil</span>
              </div>
            </div>

          </div>
          <span className="mt-2 text-xs font-black text-emerald-700 dark:text-emerald-400">
            2. Fuqaro Ilovasi (Light Mode)
          </span>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: DARK MODE PREVIEW & ACTION HIGHLIGHT CARDS
            ========================================================================= */}
        <div className="lg:col-span-4 space-y-3.5">
          
          {/* Action Card 1: Ko'chat ekish */}
          <div 
            onClick={onStartDemo}
            className="p-4 rounded-3xl bg-emerald-950/80 border-2 border-emerald-500/40 text-white shadow-lg flex items-center justify-between gap-3 cursor-pointer hover:border-emerald-400 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/30 border border-emerald-400/40 text-emerald-400 flex items-center justify-center text-2xl shrink-0">
                🌱
              </div>
              <div>
                <h4 className="font-black text-sm text-emerald-300">Ko‘chat ekish</h4>
                <p className="text-xs text-slate-300 mt-0.5 font-medium">
                  Rasmga oling va joylashuvni tasdiqlang. <span className="text-emerald-400 font-bold">+10 Eco-Coin</span>
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-emerald-400 shrink-0" />
          </div>

          {/* Action Card 2: Hududni tozalash */}
          <div 
            onClick={onStartDemo}
            className="p-4 rounded-3xl bg-[#091a26]/90 border-2 border-blue-500/40 text-white shadow-lg flex items-center justify-between gap-3 cursor-pointer hover:border-blue-400 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/40 text-blue-400 flex items-center justify-center text-2xl shrink-0">
                🗑️
              </div>
              <div>
                <h4 className="font-black text-sm text-blue-300">Hududni tozalash</h4>
                <p className="text-xs text-slate-300 mt-0.5 font-medium">
                  Toza muhit uchun hissa qo‘shing. <span className="text-blue-400 font-bold">+10 Eco-Coin</span>
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-blue-400 shrink-0" />
          </div>

          {/* Action Card 3: Qonunbuzarlik haqida xabar berish */}
          <div 
            onClick={onStartDemo}
            className="p-4 rounded-3xl bg-[#211116]/90 border-2 border-rose-500/40 text-white shadow-lg flex items-center justify-between gap-3 cursor-pointer hover:border-rose-400 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-600/30 border border-rose-400/40 text-rose-400 flex items-center justify-center text-2xl shrink-0">
                ⚠️
              </div>
              <div>
                <h4 className="font-black text-sm text-rose-300">Qonunbuzarlik haqida xabar</h4>
                <p className="text-xs text-slate-300 mt-0.5 font-medium">
                  Havoga zarar yetkazuvchi holatlarni bildiring. <span className="text-rose-400 font-bold">+5 Eco-Coin</span>
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-rose-400 shrink-0" />
          </div>

          {/* Action Card 4: Eco-Coin'larni mukofotlarga almashtiring */}
          <div className="p-4 rounded-3xl bg-slate-900/90 border-2 border-slate-700 text-white shadow-lg space-y-2.5">
            <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider">
              Eco-Coin‘larni mukofotlarga almashtiring
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded-2xl bg-blue-950/60 border border-blue-500/40 text-center">
                <div className="text-xs font-black text-blue-300">Metro</div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5">10 Coin ›</div>
              </div>
              <div className="p-2 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-center">
                <div className="text-xs font-black text-rose-300">Korzinka</div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5">20 Coin ›</div>
              </div>
              <div className="p-2 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-center">
                <div className="text-xs font-black text-amber-300">Kafe</div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5">15 Coin ›</div>
              </div>
            </div>
          </div>

          {/* Motivational Bottom Badge */}
          <div 
            onClick={onStartDemo}
            className="p-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-between px-5 font-black text-xs shadow-lg shadow-emerald-600/30 cursor-pointer transition hover:scale-[1.01]"
          >
            <div className="flex items-center gap-2">
              <span>🌱</span>
              <span>Kichik amallar, katta o‘zgarishlar!</span>
            </div>
            <ArrowRight className="w-4 h-4" />
          </div>

        </div>

      </div>
    </section>
  );
}
