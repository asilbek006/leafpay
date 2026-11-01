import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Coins, 
  TreePine, 
  Wind, 
  Building2, 
  CheckCircle, 
  AlertTriangle,
  ShoppingBag,
  MapPin,
  Clock,
  UserCheck,
  Search,
  ScanLine,
  Layers,
  Store,
  CreditCard,
  Gift,
  HelpCircle,
  TrendingDown
} from 'lucide-react';

export default function LandingPage({ 
  t, 
  theme, 
  user,
  isMobile = false,
  onStartDemo, 
  onOpenMarket, 
  onOpenRegister 
}) {
  const isDark = theme === 'dark';

  return (
    <div className={`space-y-12 py-2 ${isMobile ? 'max-w-md mx-auto space-y-8' : ''}`}>
      {/* =========================================================================
          HERO SECTION - BAHOR NAFASI, HIGH CONTRAST & CLEAN TYPOGRAPHY
          ========================================================================= */}
      <section className="relative text-center max-w-4xl mx-auto space-y-5 pt-2 reveal-on-scroll reveal-visible">
        {/* Main Headline - Crystal Clear Dual Colors (Emerald + Slate/White) */}
        <h1 className={`font-black tracking-tight leading-[1.1] ${
          isMobile ? 'text-3xl sm:text-4xl' : 'text-5xl sm:text-7xl'
        }`}>
          <span className="text-emerald-600 dark:text-emerald-400">
            {t.hero_title_1}
          </span>{' '}
          <span className={isDark ? "text-white" : "text-slate-950"}>
            {t.hero_title_2}
          </span>
        </h1>

        {/* Subtitle - Natural & Readable */}
        <p className={`font-semibold leading-relaxed ${
          isMobile ? 'text-xs max-w-xs mx-auto' : 'text-base sm:text-xl max-w-2xl mx-auto'
        } ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          {t.hero_subtitle_start}{' '}
          <span className="text-emerald-600 dark:text-emerald-400 font-black">{t.hero_subtitle_coins}</span>{' '}
          {t.hero_subtitle_end}
        </p>

        {/* Action Buttons - 100% CLEAN STACKING, ZERO OVERLAP */}
        <div className={`pt-2 w-full ${
          isMobile 
            ? 'flex flex-col gap-2.5 max-w-xs mx-auto' 
            : 'flex flex-col sm:flex-row items-center justify-center gap-3.5'
        }`}>
          {/* Primary Demo Button */}
          <button
            onClick={onStartDemo}
            className="w-full sm:w-auto px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-full shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>{t.btn_start_demo}</span>
          </button>

          {/* Secondary Eco-Market Button (Warm Golden Yellow like qahorov.uz) */}
          <button
            onClick={onOpenMarket}
            className="w-full sm:w-auto px-7 py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-full shadow-md shadow-amber-400/25 flex items-center justify-center gap-2 transition hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-slate-950" />
            <span>{t.btn_market}</span>
          </button>

          {/* Quick Register Button - only shown if user is NOT registered yet */}
          {!user && onOpenRegister && (
            <button
              onClick={onOpenRegister}
              className={`w-full sm:w-auto px-6 py-3.5 font-black text-xs rounded-full border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                isDark 
                  ? 'border-emerald-600/50 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/40' 
                  : 'border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t.nav_register} (+10)</span>
            </button>
          )}
        </div>

        {/* Quick Banner: If registered, shows welcome & balance; if not, prompts to register */}
        {user ? (
          <div className="pt-2 max-w-xl mx-auto">
            <div 
              onClick={onStartDemo}
              className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between gap-3 text-left hover:scale-[1.01] ${
                isDark ? 'bg-emerald-950/40 border-emerald-700/50 text-white' : 'bg-emerald-50 border-emerald-300 text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <TreePine className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-black text-emerald-700 dark:text-emerald-300">
                    {t.landing_welcome_user}, {user.name}!
                  </div>
                  <div className="text-xs font-semibold">
                    {t.landing_coins_balance}: <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">{user.coins} Eco-Coin</span> · {t.landing_start_today_action}
                  </div>
                </div>
              </div>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shrink-0">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        ) : onOpenRegister ? (
          <div className="pt-2 max-w-xl mx-auto">
            <div 
              onClick={onOpenRegister}
              className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between gap-3 text-left hover:scale-[1.01] ${
                isDark ? 'bg-emerald-950/40 border-emerald-700/50 text-white' : 'bg-emerald-50 border-emerald-300 text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-emerald-700 dark:text-emerald-300">{t.reg_hero_banner_title}</div>
                  <div className="text-xs font-semibold">{t.reg_welcome_bonus}</div>
                </div>
              </div>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shrink-0">
                {t.nav_register} <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ) : null}
      </section>

      {/* =========================================================================
          POINT 1: MUAMMO (THE PROBLEM)
          ========================================================================= */}
      <section className="space-y-4 reveal-on-scroll">
        <div className="text-center space-y-1">
          <div className="inline-block text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            {t.pitch_problem_tag}
          </div>
          <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
            {t.pitch_problem_title}
          </h2>
        </div>

        {/* Official Problem Quote Card */}
        <div className={`rounded-3xl p-6 sm:p-7 border-2 text-left relative overflow-hidden ${
          isDark ? 'eco-card-dark' : 'eco-card-light'
        }`}>
          <div className="text-rose-500 font-serif text-5xl leading-none absolute top-4 left-4 opacity-20 select-none">“</div>
          <p className={`text-sm sm:text-base font-semibold italic leading-relaxed pl-4 sm:pl-6 ${
            isDark ? 'text-slate-200' : 'text-slate-800'
          }`}>
            {t.pitch_problem_quote}
          </p>
        </div>

        {/* 3 Core Problem Breakdown Cards */}
        <div className={`grid gap-4 text-left ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
          <div className={`rounded-3xl p-5 border-2 ${isDark ? 'eco-card-dark' : 'eco-card-light'}`}>
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mb-3 text-xl font-bold">
              🚨
            </div>
            <h4 className={`font-black text-sm mb-1 ${isDark ? 'text-white' : 'text-slate-950'}`}>
              {t.pitch_prob_point1_title}
            </h4>
            <p className={`text-xs leading-relaxed font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {t.pitch_prob_point1_desc}
            </p>
          </div>

          <div className={`rounded-3xl p-5 border-2 ${isDark ? 'eco-card-dark' : 'eco-card-light'}`}>
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mb-3 text-xl font-bold">
              🤷
            </div>
            <h4 className={`font-black text-sm mb-1 ${isDark ? 'text-white' : 'text-slate-950'}`}>
              {t.pitch_prob_point2_title}
            </h4>
            <p className={`text-xs leading-relaxed font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {t.pitch_prob_point2_desc}
            </p>
          </div>

          <div className={`rounded-3xl p-5 border-2 ${isDark ? 'eco-card-dark' : 'eco-card-light'}`}>
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 flex items-center justify-center mb-3 text-xl font-bold">
              🌫️
            </div>
            <h4 className={`font-black text-sm mb-1 ${isDark ? 'text-white' : 'text-slate-950'}`}>
              {t.pitch_prob_point3_title}
            </h4>
            <p className={`text-xs leading-relaxed font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {t.pitch_prob_point3_desc}
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          POINT 2: NEGA HOZIR? (WHY NOW - 2026 NATIONAL PROJECT)
          ========================================================================= */}
      <section className="space-y-4 reveal-on-scroll">
        <div className="text-center space-y-1">
          <div className="inline-block text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            {t.pitch_why_tag}
          </div>
          <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
            {t.pitch_why_title}
          </h2>
        </div>

        <div className={`rounded-3xl p-6 sm:p-7 border-2 space-y-5 text-left ${
          isDark ? 'eco-card-dark' : 'eco-card-light'
        }`}>
          <p className={`text-sm sm:text-base font-semibold leading-relaxed ${
            isDark ? 'text-slate-200' : 'text-slate-800'
          }`}>
            {t.pitch_why_desc}
          </p>

          {/* 2026 -> 2035 Timeline Roadmap */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
              isDark ? 'bg-slate-900 border-slate-700' : 'bg-emerald-50 border-emerald-200'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                2026
              </div>
              <div>
                <div className="text-xs font-black text-emerald-700 dark:text-emerald-400">Milliy Boshlanish</div>
                <div className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{t.pitch_why_goal1}</div>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
              isDark ? 'bg-slate-900 border-slate-700' : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                2035
              </div>
              <div>
                <div className="text-xs font-black text-blue-700 dark:text-blue-400">-50% Emissiya</div>
                <div className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{t.pitch_why_goal2}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          POINT 3: G‘OYA (THE RETAIL LOYALTY CARD ANALOGY)
          ========================================================================= */}
      <section className="space-y-4 reveal-on-scroll">
        <div className="text-center space-y-1">
          <div className="inline-block text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            {t.pitch_idea_tag}
          </div>
          <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
            {t.pitch_idea_title}
          </h2>
        </div>

        <div className={`rounded-3xl p-6 sm:p-7 border-2 space-y-6 text-left ${
          isDark ? 'eco-card-dark' : 'eco-card-light'
        }`}>
          <p className={`text-sm sm:text-base font-semibold leading-relaxed ${
            isDark ? 'text-slate-200' : 'text-slate-800'
          }`}>
            {t.pitch_idea_desc}
          </p>

          {/* Visual Side-by-side comparison (Store bonus vs LeafPay) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Store Card */}
            <div className={`p-5 rounded-2xl border-2 space-y-2 opacity-80 ${
              isDark ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-center gap-2 text-xs font-black text-slate-500">
                <Store className="w-4 h-4" />
                <span>{t.pitch_idea_compare_store_title}</span>
              </div>
              <div className="text-sm font-bold">
                {t.pitch_idea_compare_store_flow}
              </div>
            </div>

            {/* LeafPay Green Ecosystem Card */}
            <div className={`p-5 rounded-2xl border-2 space-y-2 relative overflow-hidden ${
              isDark ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200' : 'bg-emerald-100/70 border-emerald-400 text-emerald-950'
            }`}>
              <div className="flex items-center gap-2 text-xs font-black text-emerald-700 dark:text-emerald-300">
                <TreePine className="w-4 h-4 text-emerald-600" />
                <span>{t.pitch_idea_compare_leaf_title}</span>
              </div>
              <div className="text-sm font-black">
                {t.pitch_idea_compare_leaf_flow}
              </div>
            </div>
          </div>

          {/* Eco-Coin Definition Note */}
          <div className={`p-4 rounded-2xl text-xs font-bold border flex items-center gap-3 ${
            isDark ? 'bg-amber-950/40 border-amber-800 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <Coins className="w-5 h-5 text-amber-500 shrink-0" />
            <span>{t.pitch_idea_ecocoin}</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          POINT 4: MISOL (TALABA AZIZA MISOLIDA - USER STORY)
          ========================================================================= */}
      <section className="space-y-4 reveal-on-scroll">
        <div className="text-center space-y-1">
          <div className="inline-block text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            {t.pitch_story_tag}
          </div>
          <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
            {t.pitch_story_title}
          </h2>
          <p className={`text-xs sm:text-sm font-semibold max-w-2xl mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {t.pitch_story_sub}
          </p>
        </div>

        {/* 4-Step Interactive User Journey Cards */}
        <div className={`grid gap-4 text-left ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'}`}>
          {/* Step 1 */}
          <div className={`rounded-3xl p-5 border-2 space-y-2 ${isDark ? 'eco-card-dark' : 'eco-card-light'}`}>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-lg">
              🌱
            </div>
            <h4 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-950'}`}>
              {t.pitch_story_step1}
            </h4>
            <p className={`text-xs leading-relaxed font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {t.pitch_story_step1_desc}
            </p>
          </div>

          {/* Step 2 */}
          <div className={`rounded-3xl p-5 border-2 space-y-2 ${isDark ? 'eco-card-dark' : 'eco-card-light'}`}>
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-lg">
              🤖
            </div>
            <h4 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-950'}`}>
              {t.pitch_story_step2}
            </h4>
            <p className={`text-xs leading-relaxed font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {t.pitch_story_step2_desc}
            </p>
          </div>

          {/* Step 3 */}
          <div className={`rounded-3xl p-5 border-2 space-y-2 ${isDark ? 'eco-card-dark' : 'eco-card-light'}`}>
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-lg">
              🪙
            </div>
            <h4 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-950'}`}>
              {t.pitch_story_step3}
            </h4>
            <p className={`text-xs leading-relaxed font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {t.pitch_story_step3_desc}
            </p>
          </div>

          {/* Step 4 */}
          <div className={`rounded-3xl p-5 border-2 space-y-2 ${isDark ? 'eco-card-dark' : 'eco-card-light'}`}>
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-lg">
              🚇
            </div>
            <h4 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-950'}`}>
              {t.pitch_story_step4}
            </h4>
            <p className={`text-xs leading-relaxed font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {t.pitch_story_step4_desc}
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          POINT 5: XAVFSIZLIK (WHY FAKE PHOTOS CANNOT PASS - 5 ANTI-FRAUD LAYERS)
          ========================================================================= */}
      <section className="space-y-4 reveal-on-scroll">
        <div className="text-center space-y-1">
          <div className="inline-block text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            {t.pitch_fraud_tag}
          </div>
          <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
            {t.pitch_fraud_title}
          </h2>
          <p className={`text-xs sm:text-sm font-semibold max-w-2xl mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {t.pitch_fraud_sub}
          </p>
        </div>

        {/* 5-layer Security Grid */}
        <div className={`grid gap-3.5 text-left ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-5'}`}>
          {/* Layer 1: GPS */}
          <div className={`rounded-3xl p-5 border-2 space-y-2 ${isDark ? 'eco-card-dark' : 'eco-card-light'}`}>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-black">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className={`font-black text-xs pt-1 ${isDark ? 'text-white' : 'text-slate-950'}`}>
              {t.fraud_l1_name}
            </h4>
            <p className={`text-[11px] leading-relaxed font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {t.fraud_l1_desc}
            </p>
          </div>

          {/* Layer 2: Vision AI */}
          <div className={`rounded-3xl p-5 border-2 space-y-2 ${isDark ? 'eco-card-dark' : 'eco-card-light'}`}>
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-black">
              <ScanLine className="w-5 h-5" />
            </div>
            <h4 className={`font-black text-xs pt-1 ${isDark ? 'text-white' : 'text-slate-950'}`}>
              {t.fraud_l2_name}
            </h4>
            <p className={`text-[11px] leading-relaxed font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {t.fraud_l2_desc}
            </p>
          </div>

          {/* Layer 3: pHash duplicate */}
          <div className={`rounded-3xl p-5 border-2 space-y-2 ${isDark ? 'eco-card-dark' : 'eco-card-light'}`}>
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-black">
              <Search className="w-5 h-5" />
            </div>
            <h4 className={`font-black text-xs pt-1 ${isDark ? 'text-white' : 'text-slate-950'}`}>
              {t.fraud_l3_name}
            </h4>
            <p className={`text-[11px] leading-relaxed font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {t.fraud_l3_desc}
            </p>
          </div>

          {/* Layer 4: Daily cap */}
          <div className={`rounded-3xl p-5 border-2 space-y-2 ${isDark ? 'eco-card-dark' : 'eco-card-light'}`}>
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-black">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className={`font-black text-xs pt-1 ${isDark ? 'text-white' : 'text-slate-950'}`}>
              {t.fraud_l4_name}
            </h4>
            <p className={`text-[11px] leading-relaxed font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {t.fraud_l4_desc}
            </p>
          </div>

          {/* Layer 5: Peer review */}
          <div className={`rounded-3xl p-5 border-2 space-y-2 ${isDark ? 'eco-card-dark' : 'eco-card-light'}`}>
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center font-black">
              <UserCheck className="w-5 h-5" />
            </div>
            <h4 className={`font-black text-xs pt-1 ${isDark ? 'text-white' : 'text-slate-950'}`}>
              {t.fraud_l5_name}
            </h4>
            <p className={`text-[11px] leading-relaxed font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {t.fraud_l5_desc}
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          POINT 6: PULNI KIM TO‘LAYDI? (WHO PAYS? BUSINESS MODEL)
          ========================================================================= */}
      <section className="space-y-4 reveal-on-scroll">
        <div className="text-center space-y-1">
          <div className="inline-block text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
            {t.pitch_econ_tag}
          </div>
          <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
            {t.pitch_econ_title}
          </h2>
          <p className={`text-xs sm:text-sm font-semibold max-w-2xl mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {t.pitch_econ_sub}
          </p>
        </div>

        {/* 4 Economic Ecosystem Cards (3 Payers + 1 Free Citizen) */}
        <div className={`grid gap-4 text-left ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
          {/* 1. Hamkor biznes */}
          <div className={`rounded-3xl p-6 border-2 space-y-2.5 ${isDark ? 'eco-card-dark' : 'eco-card-light'}`}>
            <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 flex items-center justify-center font-black text-xl">
              ☕
            </div>
            <h4 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-950'}`}>
              {t.econ_side1_name}
            </h4>
            <p className={`text-xs leading-relaxed font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {t.econ_side1_desc}
            </p>
          </div>

          {/* 2. ESG Corporate Sponsors */}
          <div className={`rounded-3xl p-6 border-2 space-y-2.5 ${isDark ? 'eco-card-dark' : 'eco-card-light'}`}>
            <div className="w-11 h-11 rounded-2xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 flex items-center justify-center font-black text-xl">
              🏦
            </div>
            <h4 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-950'}`}>
              {t.econ_side2_name}
            </h4>
            <p className={`text-xs leading-relaxed font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {t.econ_side2_desc}
            </p>
          </div>

          {/* 3. State & Ministry */}
          <div className={`rounded-3xl p-6 border-2 space-y-2.5 ${isDark ? 'eco-card-dark' : 'eco-card-light'}`}>
            <div className="w-11 h-11 rounded-2xl bg-teal-100 dark:bg-teal-950/70 text-teal-600 flex items-center justify-center font-black text-xl">
              🏛️
            </div>
            <h4 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-950'}`}>
              {t.econ_side3_name}
            </h4>
            <p className={`text-xs leading-relaxed font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {t.econ_side3_desc}
            </p>
          </div>

          {/* 4. Citizen - 100% Free */}
          <div className={`rounded-3xl p-6 border-2 space-y-2.5 relative overflow-hidden ${
            isDark ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' : 'bg-emerald-100/70 border-emerald-400 text-emerald-950'
          }`}>
            <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black text-xl shadow-md shadow-emerald-500/30">
              🎁
            </div>
            <h4 className="font-black text-sm text-emerald-800 dark:text-emerald-300">
              {t.econ_side4_name}
            </h4>
            <p className="text-xs leading-relaxed font-bold">
              {t.econ_side4_desc}
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          COMPARISON TABLE (PITCH DECK SLIDE 13)
          ========================================================================= */}
      <section className="space-y-4 reveal-on-scroll">
        <div className="text-center space-y-1">
          <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
            {t.comp_title}
          </h2>
          <p className={`text-xs sm:text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {t.comp_sub}
          </p>
        </div>

        <div className={`rounded-3xl border-2 overflow-x-auto w-full max-w-full min-w-0 ${isDark ? 'eco-card-dark' : 'eco-card-light'}`}>
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead className={`uppercase tracking-wider font-black border-b ${
              isDark ? 'bg-slate-900 text-emerald-300 border-slate-800' : 'bg-emerald-100 text-emerald-950 border-emerald-200'
            }`}>
              <tr>
                <th className="py-4 px-5">{t.comp_col_sys}</th>
                <th className="py-4 px-5">{t.comp_col_part}</th>
                <th className="py-4 px-5">{t.comp_col_rew}</th>
                <th className="py-4 px-5">{t.comp_col_tech}</th>
                <th className="py-4 px-5">{t.comp_col_res}</th>
              </tr>
            </thead>
            <tbody className={`divide-y font-semibold ${isDark ? 'divide-slate-800 text-slate-200' : 'divide-emerald-100 text-slate-800'}`}>
              <tr className="hover:bg-slate-500/5 transition">
                <td className="py-3.5 px-5 font-bold text-slate-500">{t.comp_trad_name}</td>
                <td className="py-3.5 px-5">{t.comp_trad_part}</td>
                <td className="py-3.5 px-5 text-slate-500">{t.comp_trad_rew}</td>
                <td className="py-3.5 px-5">{t.comp_trad_tech}</td>
                <td className="py-3.5 px-5">{t.comp_trad_res}</td>
              </tr>
              <tr className="hover:bg-slate-500/5 transition">
                <td className="py-3.5 px-5 font-bold text-teal-700 dark:text-teal-400">{t.comp_teeme_name}</td>
                <td className="py-3.5 px-5">{t.comp_teeme_part}</td>
                <td className="py-3.5 px-5">{t.comp_teeme_rew}</td>
                <td className="py-3.5 px-5">{t.comp_teeme_tech}</td>
                <td className="py-3.5 px-5">{t.comp_teeme_res}</td>
              </tr>
              <tr className="hover:bg-slate-500/5 transition">
                <td className="py-3.5 px-5 font-bold text-amber-700 dark:text-amber-400">{t.comp_ant_name}</td>
                <td className="py-3.5 px-5">{t.comp_ant_part}</td>
                <td className="py-3.5 px-5">{t.comp_ant_rew}</td>
                <td className="py-3.5 px-5">{t.comp_ant_tech}</td>
                <td className="py-3.5 px-5">{t.comp_ant_res}</td>
              </tr>
              <tr className={`font-black ${isDark ? 'bg-emerald-950 text-emerald-200' : 'bg-emerald-200/70 text-emerald-950'}`}>
                <td className="py-4 px-5 text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 font-black text-sm">
                  <TreePine className="w-5 h-5 text-emerald-600 shrink-0" /> LeafPay
                </td>
                <td className="py-4 px-5">{t.comp_leaf_part}</td>
                <td className="py-4 px-5">{t.comp_leaf_rew}</td>
                <td className="py-4 px-5">{t.comp_leaf_tech}</td>
                <td className="py-4 px-5">{t.comp_leaf_res}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
