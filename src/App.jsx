import React, { useState, useEffect } from 'react';
import { 
  TreePine, 
  Sun, 
  Moon, 
  LogOut, 
  UserPlus, 
  User,
  Home,
  Camera,
  ShoppingBag,
  MapPin,
  Sparkles
} from 'lucide-react';
import { translations } from './translations';
import LandingPage from './components/LandingPage';
import CitizenApp from './components/CitizenApp';
import PartnerPortal from './components/PartnerPortal';
import MinistryDashboard from './components/MinistryDashboard';
import RegisterModal from './components/RegisterModal';
import SpringBackground from './components/SpringBackground';

export default function App() {
  const [lang, setLang] = useState('uz');
  const [theme, setTheme] = useState('light'); // 'light' is default
  const [activeTab, setActiveTab] = useState('landing');
  const [citizenSubTab, setCitizenSubTab] = useState('action');
  
  // Real mobile detection (Android / iOS / Phone browsers)
  const [isMobileScreen, setIsMobileScreen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll reveal observer: smoothly reveals sections as the user scrolls
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    const observeElements = () => {
      const elements = document.querySelectorAll('.reveal-on-scroll');
      elements.forEach((el) => observer.observe(el));
    };

    observeElements();
    const timer = setTimeout(observeElements, 200);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [activeTab, lang]);

  const isMobile = isMobileScreen;

  // Modals
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Persistent user state: saved in localStorage; defaults to active demo user (Aziza Rahimova)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('leafpay_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) return parsed;
      }
    } catch (e) {
      // ignore
    }
    // Default logged-in demo user (matching design)
    return {
      name: 'Aziza Rahimova',
      phone: '+998 90 123 45 67',
      district: 'Yunusobod',
      pinfl: '32408991230045',
      coins: 320,
      verified: true
    };
  });

  const t = translations[lang] || translations.uz;
  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSetUser = (newUser) => {
    setUser(newUser);
    try {
      if (newUser) {
        localStorage.setItem('leafpay_user', JSON.stringify(newUser));
      } else {
        localStorage.removeItem('leafpay_user');
      }
    } catch (e) {
      // ignore
    }
  };

  const handleUpdateCoins = (added) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, coins: prev.coins + added };
      try {
        localStorage.setItem('leafpay_user', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleLogout = () => {
    handleSetUser(null);
  };

  // Helper to render the active tab content
  const renderTabContent = (isMobileView = false) => {
    return (
      <>
        {activeTab === 'landing' && (
          <LandingPage 
            t={t} 
            theme={theme}
            user={user}
            isMobile={isMobileView}
            onStartDemo={() => {
              setActiveTab('citizen');
            }}
            onOpenMarket={() => {
              setActiveTab('citizen');
            }}
            onOpenRegister={() => setIsRegisterOpen(true)}
          />
        )}

        {(activeTab === 'citizen' || activeTab === 'demo') && (
          <div className="w-full flex-1 flex flex-col items-center justify-center -my-2 sm:-my-4">
            <div className="w-full flex items-center justify-between mb-2 max-w-md px-1">
              <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-spin" />
                <span>LeafPay Fuqaro Ilovasi (v11)</span>
              </span>
              <a
                href="/citizen.html"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-black text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-700 shadow-sm"
              >
                <span>Alohida ochish ↗</span>
              </a>
            </div>
            <iframe
              src="/citizen.html"
              title="LeafPay Fuqaro Ilovasi v11"
              allow="camera; geolocation; microphone"
              className="w-full border-0 min-h-[85dvh] h-[88dvh] rounded-3xl shadow-2xl max-w-md bg-white dark:bg-slate-900 border-2 border-emerald-500/20"
            />
          </div>
        )}

        {activeTab === 'partner' && (
          <PartnerPortal 
            t={t} 
            theme={theme}
            user={user}
            isMobile={isMobileView}
          />
        )}

        {activeTab === 'ministry' && (
          <MinistryDashboard 
            t={t} 
            theme={theme}
            isMobile={isMobileView}
            user={user}
            onUpdateCoins={handleUpdateCoins}
            lang={lang}
          />
        )}
      </>
    );
  };

  return (
    <div 
      data-theme={theme}
      className={`min-h-screen relative flex flex-col transition-colors duration-200 ${
        isDark ? 'eco-grid-dark text-slate-100' : 'eco-grid-light text-slate-900'
      }`}
    >
      {/* Spring Animated Background: Fluttering White Blossoms, Green Leaves & Glowing Fireflies */}
      <SpringBackground theme={theme} />

      <div className="relative z-10 flex-1 flex flex-col">
        {/* =========================================================================
            TOP HEADER
            ========================================================================= */}
      <header className="sticky top-0 z-40 pt-3 sm:pt-4 px-3 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <nav className={`rounded-full px-4 sm:px-6 py-2.5 sm:py-3 transition-all duration-200 flex items-center justify-between gap-2 shadow-lg ${
            isDark ? 'eco-nav-dark text-white' : 'eco-nav-light text-slate-900'
          }`}>
            {/* Logo */}
            <button 
              onClick={() => setActiveTab('landing')}
              className="flex items-center gap-2 group cursor-pointer shrink-0"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 group-hover:scale-105 transition">
                <TreePine className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className={`font-black text-base sm:text-xl tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
                LeafPay<span className="text-emerald-600 dark:text-emerald-400 font-extrabold">.uz</span>
              </span>
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1.5 xl:gap-2 text-xs font-bold">
              {[
                { id: 'landing', label: t.nav_home },
                { id: 'citizen', label: `${t.nav_app} (v11)`, isSpecial: true },
                { id: 'partner', label: t.nav_partner },
                { id: 'ministry', label: t.nav_ministry },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-2 rounded-full transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === item.id 
                      ? 'bg-emerald-600 text-white font-black shadow-md shadow-emerald-600/30' 
                      : item.isSpecial
                        ? 'border border-emerald-400 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-500/20 font-black'
                        : isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-700 hover:text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  {item.isSpecial && <Sparkles className="w-3.5 h-3.5 text-emerald-500" />}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Right Controls: Theme + Lang + Auth */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Sun/Moon Toggle */}
              <button
                onClick={toggleTheme}
                title={isDark ? "Yorug‘ rejimga o‘tish" : "Qorong‘i rejimga o‘tish"}
                className={`p-1.5 sm:p-2 rounded-full transition cursor-pointer ${
                  isDark 
                    ? 'text-amber-400 hover:bg-slate-800' 
                    : 'text-slate-700 hover:bg-emerald-100 hover:text-slate-950'
                }`}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Language Switcher Pill */}
              <div className={`flex items-center p-0.5 rounded-full text-[10px] sm:text-[11px] font-black border ${
                isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-300'
              }`}>
                {(['uz', 'ru', 'en']).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-1.5 sm:px-2.5 py-1 rounded-full uppercase transition cursor-pointer ${
                      lang === l 
                        ? 'bg-emerald-600 text-white font-black shadow-sm' 
                        : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              {/* Auth / Profile Area: Unified capsule ensuring the logout button never overflows */}
              {user ? (
                <div className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border text-xs font-bold transition shadow-sm ${
                  isDark ? 'bg-slate-900/90 border-slate-700 text-slate-200' : 'bg-white/90 border-slate-200 text-slate-800'
                }`}>
                  {/* User Avatar + Name */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px] font-black shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <span className="truncate max-w-[70px] sm:max-w-[100px]">{user.name.split(' ')[0]}</span>
                  </div>

                  {/* Divider */}
                  <span className="w-px h-3.5 bg-slate-200 dark:bg-slate-700 shrink-0" />

                  {/* Coin Badge */}
                  <div className="flex items-center gap-1 font-mono font-black text-emerald-700 dark:text-emerald-400 shrink-0">
                    <span className="text-xs">🪙</span>
                    <span>{user.coins}</span>
                  </div>

                  {/* Divider */}
                  <span className="w-px h-3.5 bg-slate-200 dark:bg-slate-700 shrink-0" />

                  {/* Logout Button: safely nested inside the pill capsule */}
                  <button
                    onClick={handleLogout}
                    title={t.logout}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-full transition cursor-pointer shrink-0"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setIsRegisterOpen(true)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-full shadow-md shadow-emerald-600/25 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{t.nav_register}</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Subnav on Mobile */}
          <div className="flex lg:hidden mt-2 px-1 justify-start sm:justify-center gap-1.5 overflow-x-auto py-1 text-xs font-bold no-scrollbar">
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition cursor-pointer ${
                activeTab === 'landing' ? 'bg-emerald-600 text-white font-black shadow-sm' : 'text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800'
              }`}
            >
              {t.nav_home}
            </button>
            <button
              onClick={() => setActiveTab('citizen')}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                activeTab === 'citizen' ? 'bg-emerald-600 text-white font-black shadow-sm' : 'border border-emerald-400 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-black'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t.nav_app} (v11)</span>
            </button>
            <button
              onClick={() => setActiveTab('partner')}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition cursor-pointer ${
                activeTab === 'partner' ? 'bg-emerald-600 text-white font-black shadow-sm' : 'text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800'
              }`}
            >
              {t.nav_partner}
            </button>
            <button
              onClick={() => setActiveTab('ministry')}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition cursor-pointer ${
                activeTab === 'ministry' ? 'bg-emerald-600 text-white font-black shadow-sm' : 'text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800'
              }`}
            >
              {t.nav_ministry}
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN CONTAINER: FLUID & RESPONSIVE VIEW (CLEAN ON BOTH DESKTOP AND MOBILE)
          ========================================================================= */}
      <main className={`flex-1 w-full mx-auto py-4 sm:py-6 pb-24 lg:pb-8 ${isMobile ? 'px-3 max-w-lg' : 'px-4 sm:px-6 max-w-6xl'}`}>
        {renderTabContent(isMobile)}
      </main>

      {/* Desktop Footer (Hidden on small mobile screens to keep app clean) */}
      <footer className={`hidden sm:block border-t py-8 text-xs transition-colors duration-200 ${
        isDark ? 'border-slate-800 text-slate-400 bg-slate-950/60' : 'border-slate-200 text-slate-600 bg-white/70'
      }`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 font-semibold">
          <div className="flex items-center gap-2">
            <span className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-950'}`}>LeafPay<span className="text-emerald-600 dark:text-emerald-400">.uz</span></span>
            <span>—</span>
            <span>{t.footer_text}</span>
          </div>

          <div className="flex items-center gap-3">
            <span>{t.footer_yashil}</span>
          </div>
        </div>
      </footer>

      {/* NATIVE MOBILE BOTTOM NAVIGATION BAR FOR REAL SMARTPHONES */}
      <div 
        style={{ paddingBottom: 'max(10px, env(safe-area-inset-bottom))' }}
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl transition-all duration-200 pt-2 px-2 shadow-2xl ${
          isDark ? 'bg-[#07130e]/95 border-emerald-900/60 text-slate-300' : 'bg-white/95 border-emerald-200 text-slate-700'
        }`}
      >
        <div className="max-w-md mx-auto flex items-center justify-around text-center">
          {/* 1. Home */}
          <button
            onClick={() => setActiveTab('landing')}
            className={`flex flex-col items-center gap-0.5 transition cursor-pointer ${
              activeTab === 'landing' ? 'text-emerald-600 dark:text-emerald-400 font-black scale-105' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-semibold">{t.tab_home_short}</span>
          </button>

          {/* 2. Fuqaro ilovasi (Elevated center button, v11) */}
          <button
            onClick={() => setActiveTab('citizen')}
            className="flex flex-col items-center -mt-5 transition cursor-pointer"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition hover:scale-105 ${
              activeTab === 'citizen'
                ? 'bg-emerald-600 text-white shadow-emerald-600/40 ring-4 ring-white dark:ring-slate-900'
                : 'bg-emerald-500 text-white shadow-emerald-500/30'
            }`}>
              <Camera className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black mt-1 text-emerald-700 dark:text-emerald-300">
              {t.nav_app}
            </span>
          </button>

          {/* 3. Hamkor */}
          <button
            onClick={() => setActiveTab('partner')}
            className={`flex flex-col items-center gap-0.5 transition cursor-pointer ${
              activeTab === 'partner' ? 'text-emerald-600 dark:text-emerald-400 font-black scale-105' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[10px] font-semibold">{t.nav_partner}</span>
          </button>

          {/* 4. Vazirlik */}
          <button
            onClick={() => setActiveTab('ministry')}
            className={`flex flex-col items-center gap-0.5 transition cursor-pointer ${
              activeTab === 'ministry' ? 'text-emerald-600 dark:text-emerald-400 font-black scale-105' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <MapPin className="w-5 h-5" />
            <span className="text-[10px] font-semibold">{t.nav_ministry}</span>
          </button>
        </div>
        {/* Home Indicator */}
        <div className="w-24 h-1 bg-slate-400/50 dark:bg-slate-600 rounded-full mx-auto mt-2" />
      </div>

      </div>

      {/* =========================================================================
          MODALS
          ========================================================================= */}
      <RegisterModal
        t={t}
        lang={lang}
        onLangChange={setLang}
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegisterSuccess={(newUser) => {
          handleSetUser(newUser);
        }}
      />
    </div>
  );
}
