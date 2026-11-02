import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  MapPin, 
  TreePine, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  Wind, 
  Filter,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  KeyRound,
  UserCheck,
  UserX,
  UserPlus,
  Clock,
  Sparkles,
  ArrowRight,
  LogOut,
  RefreshCw,
  Eye,
  Check,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MinistryDashboard({ t, theme, isMobile = false, user, onUpdateCoins, lang = 'uz' }) {
  const isDark = theme === 'dark';
  
  // ==========================================
  // ADMIN AUTHENTICATION STATE
  // ==========================================
  const [isAdminAuth, setIsAdminAuth] = useState(() => {
    try {
      return localStorage.getItem('leafpay_admin_auth') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [adminLogin, setAdminLogin] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('2026');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin Sub-tab
  const [activeAdminTab, setActiveAdminTab] = useState('moderation'); // 'moderation', 'map', 'inspectors'

  // Map states
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // ==========================================
  // CITIZEN APPLICATIONS NEEDING ADMIN APPROVAL
  // ==========================================
  const INITIAL_APPLICATIONS = [
    {
      id: 'REQ-101',
      citizenName: 'Dilshod Karimov',
      phone: '+998 90 234 56 78',
      district: 'Yunusobod 4-mavze',
      coords: '41.3653, 69.2888',
      time: 'Bugun, 11:25',
      actionTitle: 'Yangi qayrag‘och va chinor niholi ekildi',
      actionCategory: 'tree',
      aiScore: '98.6%',
      rewardCoins: 20,
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop',
      status: 'pending', // 'pending' | 'approved' | 'rejected' | 'inspected'
      adminNote: ''
    },
    {
      id: 'REQ-102',
      citizenName: 'Malika Umarova',
      phone: '+998 93 456 78 90',
      district: 'Chilonzor 9-mavze',
      coords: '41.2825, 69.2081',
      time: 'Bugun, 10:40',
      actionTitle: '6 kg qayta ishlanuvchi plastik topshirildi',
      actionCategory: 'recycling',
      aiScore: '97.4%',
      rewardCoins: 15,
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop',
      status: 'pending',
      adminNote: ''
    },
    {
      id: 'REQ-103',
      citizenName: 'Sanjar Rustamov',
      phone: '+998 97 789 01 23',
      district: 'Yashnobod tumani',
      coords: '41.2950, 69.3200',
      time: 'Bugun, 09:15',
      actionTitle: 'Toza havo — Ishga velosipedda qatnov (12.4 km)',
      actionCategory: 'eco_transport',
      aiScore: '99.1%',
      rewardCoins: 10,
      image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop',
      status: 'pending',
      adminNote: ''
    },
    {
      id: 'REQ-104',
      citizenName: 'Aziza Rahimova',
      phone: '+998 90 123 45 67',
      district: 'Mirzo Ulug‘bek parki',
      coords: '41.3283, 69.3325',
      time: 'Kecha, 18:50',
      actionTitle: '3 ta manzarali buta sug‘orildi va parvarishlandi',
      actionCategory: 'tree',
      aiScore: '95.8%',
      rewardCoins: 15,
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop',
      status: 'approved',
      adminNote: 'Admin (R.Arujan) tomonidan ruxsat berildi'
    }
  ];

  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('leafpay_admin_applications');
      if (saved) {
        const cleaned = saved.replace(/A\.Davlatov|Asilbek Davlatov/g, 'R.Arujan');
        return JSON.parse(cleaned);
      }
    } catch (e) {}
    return INITIAL_APPLICATIONS;
  });

  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'approved', 'rejected'

  // ==========================================
  // REGIONAL INSPECTORS LIST
  // ==========================================
  const INITIAL_INSPECTORS = [
    { id: 1, name: 'Raximova Arujan', role: 'Bosh davlat inspektori', district: 'Toshkent shahar (Hammasi)', status: 'active', tier: 'SuperAdmin' },
    { id: 2, name: 'Sardor Aliyev', role: 'Katta inspektor', district: 'Chilonzor tumani', status: 'active', tier: 'Inspektor' },
    { id: 3, name: 'Nodira Karimova', role: 'Ekologiya nazoratchisi', district: 'Yunusobod tumani', status: 'active', tier: 'Inspektor' },
    { id: 4, name: 'Jamshid Toshpo‘latov', role: 'Dala inspektori', district: 'Mirzo Ulug‘bek tumani', status: 'inactive', tier: 'Inspektor' },
  ];

  const [inspectors, setInspectors] = useState(INITIAL_INSPECTORS);
  const [newInspectorName, setNewInspectorName] = useState('');
  const [newInspectorDistrict, setNewInspectorDistrict] = useState('Yashnobod tumani');

  const districts = [
    { id: 'all', name: "Toshkent shahri (Hammasi)", trees: 48920, reports: 34, aqi: 122, lat: 41.311082, lng: 69.240562, zoom: 12 },
    { id: 'chilonzor', name: "Chilonzor tumani", trees: 12450, reports: 8, aqi: 118, lat: 41.2825, lng: 69.2081, zoom: 14 },
    { id: 'yunusobod', name: "Yunusobod tumani", trees: 15300, reports: 5, aqi: 110, lat: 41.3653, lng: 69.2888, zoom: 14 },
    { id: 'mirzo', name: "Mirzo Ulug‘bek tumani", trees: 11200, reports: 12, aqi: 125, lat: 41.3283, lng: 69.3325, zoom: 14 },
    { id: 'yashnobod', name: "Yashnobod tumani", trees: 5800, reports: 6, aqi: 135, lat: 41.2950, lng: 69.3200, zoom: 14 },
    { id: 'sergeli', name: "Sergeli tumani", trees: 4170, reports: 3, aqi: 130, lat: 41.2210, lng: 69.2220, zoom: 14 },
  ];

  const currentStats = districts.find(d => d.id === selectedDistrict) || districts[0];

  // ==========================================
  // ADMIN AUTHENTICATION HANDLERS
  // ==========================================
  const handleAdminLogin = (e) => {
    if (e) e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);

    setTimeout(() => {
      setIsLoggingIn(false);
      // Valid credentials: login === 'admin' and (password === '2026' or 'admin')
      const validLogins = ['admin', 'arujan', 'raximova', 'asilbek'];
      if (validLogins.includes(adminLogin.trim().toLowerCase()) && 
          (adminPassword.trim() === '2026' || adminPassword.trim() === 'admin' || adminPassword.trim() === 'leafpay2026')) {
        setIsAdminAuth(true);
        try {
          localStorage.setItem('leafpay_admin_auth', 'true');
        } catch (err) {}
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (err) {}
      } else {
        setAuthError("Noto‘g‘ri login yoki parol! (Demo parol: 2026)");
      }
    }, 450);
  };

  const handleQuickDemoAdminAuth = () => {
    setAdminLogin('admin');
    setAdminPassword('2026');
    setAuthError('');
    setIsAdminAuth(true);
    try {
      localStorage.setItem('leafpay_admin_auth', 'true');
    } catch (err) {}
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err) {}
  };

  const handleAdminLogout = () => {
    setIsAdminAuth(false);
    try {
      localStorage.removeItem('leafpay_admin_auth');
    } catch (err) {}
  };

  // ==========================================
  // ADMIN APPROVAL ACTION HANDLERS
  // ==========================================
  // Grant permission & approve report (+ reward coins)
  const handleApproveReport = (reqId, coins) => {
    const updated = applications.map(app => {
      if (app.id === reqId) {
        return {
          ...app,
          status: 'approved',
          adminNote: `Admin (R.Arujan) tomonidan ruxsat berildi va +${coins} Eco-Coin o‘tkazildi`
        };
      }
      return app;
    });

    setApplications(updated);
    try {
      localStorage.setItem('leafpay_admin_applications', JSON.stringify(updated));
    } catch (e) {}

    // Credit coins if matching user or notification
    if (onUpdateCoins) {
      onUpdateCoins(coins);
    }

    try {
      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {}
  };

  // Reject report
  const handleRejectReport = (reqId) => {
    const updated = applications.map(app => {
      if (app.id === reqId) {
        return {
          ...app,
          status: 'rejected',
          adminNote: 'Admin tomonidan rad etildi: Qoidabuzarlik yoki talabga mos emas'
        };
      }
      return app;
    });

    setApplications(updated);
    try {
      localStorage.setItem('leafpay_admin_applications', JSON.stringify(updated));
    } catch (e) {}
  };

  // Dispatch inspector
  const handleInspectReport = (reqId) => {
    const updated = applications.map(app => {
      if (app.id === reqId) {
        return {
          ...app,
          status: 'inspected',
          adminNote: 'Joyiga tuman davlat inspektori yuborildi'
        };
      }
      return app;
    });

    setApplications(updated);
    try {
      localStorage.setItem('leafpay_admin_applications', JSON.stringify(updated));
    } catch (e) {}
  };

  // Toggle inspector status
  const handleToggleInspectorStatus = (id) => {
    setInspectors(prev => prev.map(insp => {
      if (insp.id === id) {
        return {
          ...insp,
          status: insp.status === 'active' ? 'inactive' : 'active'
        };
      }
      return insp;
    }));
  };

  // Add new inspector
  const handleAddInspector = (e) => {
    e.preventDefault();
    if (!newInspectorName.trim()) return;
    const newInsp = {
      id: Date.now(),
      name: newInspectorName.trim(),
      role: 'Ekologiya inspektori',
      district: newInspectorDistrict,
      status: 'active',
      tier: 'Inspektor'
    };
    setInspectors(prev => [...prev, newInsp]);
    setNewInspectorName('');
  };

  // Filtered applications
  const filteredApps = applications.filter(app => {
    if (filterStatus === 'all') return true;
    return app.status === filterStatus;
  });

  const pendingCount = applications.filter(a => a.status === 'pending').length;

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!isAdminAuth || activeAdminTab !== 'map') return;
    if (!window.L || !mapRef.current) return;

    if (!mapInstanceRef.current) {
      const map = window.L.map(mapRef.current, {
        center: [41.311082, 69.240562],
        zoom: 12,
        zoomControl: true,
        attributionControl: false
      });

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      // District Markers
      districts.filter(d => d.id !== 'all').forEach(d => {
        const pinIcon = window.L.divIcon({
          className: 'custom-gov-pin',
          html: `<div style="background:#10b981;color:#fff;border-radius:20px;padding:3px 8px;font-size:11px;font-weight:900;border:2px solid #fff;box-shadow:0 3px 8px rgba(0,0,0,0.3);white-space:nowrap;display:flex;align-items:center;gap:4px;">
            <span>🌱</span><span>${d.name.split(' ')[0]} (${(d.trees / 1000).toFixed(1)}k)</span>
          </div>`,
          iconSize: [120, 26],
          iconAnchor: [60, 13]
        });

        window.L.marker([d.lat, d.lng], { icon: pinIcon })
          .addTo(map)
          .bindPopup(`<b>${d.name}</b><br/>Ekilgan daraxtlar: <b>${d.trees.toLocaleString()} ta</b><br/>AQI Havosi: <b>${d.aqi} AQI</b><br/>Omon qolish: <b>91.4%</b>`);
      });

      // Violation Pin
      const alertIcon = window.L.divIcon({
        className: 'custom-alert-pin',
        html: `<div style="background:#e11d48;color:#fff;border-radius:20px;padding:3px 8px;font-size:11px;font-weight:900;border:2px solid #fff;box-shadow:0 3px 8px rgba(0,0,0,0.3);white-space:nowrap;display:flex;align-items:center;gap:4px;">
          <span>⚠️</span><span>Qonunbuzarlik</span>
        </div>`,
        iconSize: [110, 26],
        iconAnchor: [55, 13]
      });

      window.L.marker([41.3050, 69.2750], { icon: alertIcon })
        .addTo(map)
        .bindPopup(`<b>⚠️ Qonunbuzarlik holati</b><br/>Chinor daraxtiga zarar yetkazilgan.<br/>Holat: <b>Inspeksiya tomonidan o‘rganilmoqda</b>`);

      mapInstanceRef.current = map;
    } else {
      const map = mapInstanceRef.current;
      map.flyTo([currentStats.lat, currentStats.lng], currentStats.zoom, { duration: 1.2 });
    }
  }, [isAdminAuth, activeAdminTab, selectedDistrict]);

  // Clean up Leaflet map instance on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // =========================================================================
  // SCREEN 1: ADMIN RUXSATI TALAB QILINADI (GATEWAY / ACCESS CONTROL)
  // =========================================================================
  if (!isAdminAuth) {
    return (
      <div className="max-w-md mx-auto my-8 sm:my-12 px-3 sm:px-0">
        <div className={`rounded-[32px] p-6 sm:p-8 border-2 shadow-2xl relative overflow-hidden ${
          isDark ? 'eco-card-dark border-emerald-500/30' : 'eco-card-light border-emerald-500/40'
        }`}>
          {/* Decorative background glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Ministry Emblem Header */}
          <div className="text-center space-y-3 relative z-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 border-2 border-white/20">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 mb-1.5">
                <Lock className="w-3 h-3" />
                <span>Admin Ruxsati Talab Qilinadi</span>
              </div>
              <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
                Vazirlik va Admin Paneli
              </h2>
              <p className={`text-xs font-semibold mt-1 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                O‘zbekiston Respublikasi Ekologiya Vazirligi B2G boshqaruvi va fuqarolar arizalariga ruxsat berish tizimi.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleAdminLogin} className="mt-6 space-y-4 relative z-10">
            {authError && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className={`block text-[11px] font-black uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Admin Logini:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={adminLogin}
                  onChange={(e) => setAdminLogin(e.target.value)}
                  className={`w-full py-3 pl-10 pr-4 text-xs font-bold rounded-2xl border-2 outline-none transition ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
                  }`}
                  placeholder="admin"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className={`block text-[11px] font-black uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Admin Paroli yoki PIN kod:
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className={`w-full py-3 pl-10 pr-4 text-xs font-bold rounded-2xl border-2 outline-none transition font-mono ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
                  }`}
                  placeholder="Demo kod: 2026"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-black text-xs rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Ruxsat tekshirilmoqda...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Admin sifatida ruxsat olish va kirish</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Admin Grant Button */}
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-center relative z-10">
            <button
              type="button"
              onClick={handleQuickDemoAdminAuth}
              className="w-full py-2.5 px-3 rounded-2xl text-[11px] font-bold border-2 border-emerald-400/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>⚡ Bir bosishda Davlat Inspektori ruxsatini yoqish</span>
            </button>

            <p className="text-[10px] text-slate-400 font-semibold mt-2">
              🔒 256-bit shifrlangan davlat kanali • Zero-Trust ruxsat tizimi
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SCREEN 2: AUTHORIZED ADMIN DASHBOARD
  // =========================================================================
  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* =====================================================================
          ADMIN STATUS & CREDENTIAL BANNER
          ===================================================================== */}
      <div className={`rounded-3xl p-4 sm:p-5 border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg ${
        isDark ? 'eco-card-dark border-emerald-500/40' : 'eco-card-light border-emerald-500/50'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className={`text-base sm:text-lg font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
                Admin Ruxsati Faol: Raximova Arujan
              </h2>
              <span className="text-[10px] bg-emerald-600 text-white px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>SuperAdmin</span>
              </span>
            </div>
            <p className={`text-xs font-semibold mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Bosh davlat inspektori • Toshkent shahar boshqarmasi • Vakolat: To‘liq ma’muriy ruxsat
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button 
            onClick={() => alert("Haftalik PDF davlat hisoboti shakllantirildi va yuklab olindi!")}
            className="px-3.5 py-2 rounded-full text-xs font-black border-2 border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 dark:bg-slate-800 dark:text-white dark:border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Haftalik hisobot</span>
          </button>

          <button 
            onClick={handleAdminLogout}
            className="px-3.5 py-2 rounded-full text-xs font-black border-2 border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 flex items-center gap-1.5 transition cursor-pointer"
            title="Admin ruxsatini yopish"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Chiqish</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          ADMIN NAVIGATION SUB-TABS
          ===================================================================== */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveAdminTab('moderation')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeAdminTab === 'moderation'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : isDark
              ? 'bg-slate-900 border-2 border-slate-800 text-slate-300 hover:bg-slate-800'
              : 'bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Arizalarga ruxsat berish (Moderatsiya)</span>
          {pendingCount > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeAdminTab === 'moderation' ? 'bg-white text-emerald-700' : 'bg-rose-500 text-white animate-pulse'
            }`}>
              {pendingCount} yangi
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('map')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeAdminTab === 'map'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : isDark
              ? 'bg-slate-900 border-2 border-slate-800 text-slate-300 hover:bg-slate-800'
              : 'bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Shahar monitoringi & Xarita</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('inspectors')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeAdminTab === 'inspectors'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : isDark
              ? 'bg-slate-900 border-2 border-slate-800 text-slate-300 hover:bg-slate-800'
              : 'bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Inspektorlar va Ruxsatnomalar</span>
        </button>
      </div>

      {/* =====================================================================
          TAB 1: ARIZALARGA RUXSAT BERISH (MODERATSIYA & APPROVAL)
          ===================================================================== */}
      {activeAdminTab === 'moderation' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Sub Header & Filter */}
          <div className={`rounded-3xl p-4 sm:p-5 border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            isDark ? 'eco-card-dark' : 'eco-card-light'
          }`}>
            <div>
              <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
                Fuqarolarning ekologik arizalari (Tasdiqlash va Eco-Coin berish)
              </h3>
              <p className={`text-xs font-semibold mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Admin sifatida tekshirib, ruxsat berish (tasdiqlash) orqali fuqaroning hisobiga Eco-Coin ballarini o‘tkazasiz.
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'all', label: 'Barchasi' },
                { id: 'pending', label: `Kutilmoqda (${pendingCount})` },
                { id: 'approved', label: 'Ruxsat berilgan' },
                { id: 'rejected', label: 'Rad etilgan' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterStatus(f.id)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-black transition cursor-pointer ${
                    filterStatus === f.id
                      ? 'bg-emerald-600 text-white'
                      : isDark
                      ? 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Application Cards List */}
          <div className="space-y-3.5">
            {filteredApps.length === 0 ? (
              <div className={`rounded-3xl p-8 border-2 text-center ${isDark ? 'eco-card-dark' : 'eco-card-light'}`}>
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                <h4 className="font-black text-sm text-slate-900 dark:text-white">Ushbu toifada arizalar yo‘q</h4>
                <p className="text-xs text-slate-500 font-semibold mt-1">Barcha fuqarolar arizalari tekshirib chiqilgan.</p>
              </div>
            ) : (
              filteredApps.map((app) => (
                <div 
                  key={app.id}
                  className={`rounded-3xl p-4 sm:p-5 border-2 transition-all hover:shadow-lg ${
                    app.status === 'pending'
                      ? isDark ? 'eco-card-dark border-amber-500/40' : 'eco-card-light border-amber-500/40'
                      : app.status === 'approved'
                      ? isDark ? 'eco-card-dark border-emerald-500/40' : 'eco-card-light border-emerald-500/40'
                      : isDark ? 'eco-card-dark border-rose-500/30' : 'eco-card-light border-rose-500/30'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-sm shrink-0">
                        {app.citizenName.split(' ')[0][0]}{app.citizenName.split(' ')[1]?.[0] || ''}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-950'}`}>
                            {app.citizenName}
                          </h4>
                          <span className="font-mono text-[11px] text-slate-400 font-bold">{app.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-600" />
                            {app.district}
                          </span>
                          <span>•</span>
                          <span className="font-mono text-emerald-600 dark:text-emerald-400">GPS: {app.coords}</span>
                          <span>•</span>
                          <span>{app.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {app.status === 'pending' && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                          <Clock className="w-3 h-3 animate-spin" />
                          <span>Admin Ruxsati Kutilmoqda</span>
                        </span>
                      )}
                      {app.status === 'approved' && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Ruxsat Berildi (+{app.rewardCoins} Coin)</span>
                        </span>
                      )}
                      {app.status === 'rejected' && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-100 text-rose-900 border border-rose-300 flex items-center gap-1">
                          <X className="w-3 h-3 text-rose-600" />
                          <span>Rad Etildi</span>
                        </span>
                      )}
                      {app.status === 'inspected' && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-300 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-blue-600" />
                          <span>Inspeksiya Yuborildi</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body: Action details & proof photo */}
                  <div className="pt-3 flex flex-col md:flex-row gap-4 items-start justify-between">
                    <div className="flex gap-3 items-start w-full md:w-auto">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-emerald-500/20 shrink-0 bg-slate-100 shadow-sm">
                        <img 
                          src={app.image} 
                          alt={app.actionTitle} 
                          className="w-full h-full object-cover hover:scale-105 transition"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-xs font-black text-slate-900 dark:text-white">
                          {app.actionTitle}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap text-[11px] font-bold">
                          <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                            Mukofot: +{app.rewardCoins} Eco-Coin
                          </span>
                          <span className="px-2.5 py-0.5 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                            Vision AI: {app.aiScore} aniq
                          </span>
                        </div>
                        {app.adminNote && (
                          <div className="text-[11px] font-semibold text-slate-500 italic">
                            💬 {app.adminNote}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
                      {app.status === 'pending' ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleApproveReport(app.id, app.rewardCoins)}
                            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Ruxsat berish (+{app.rewardCoins} Coin)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRejectReport(app.id)}
                            className="px-3.5 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-300 font-black text-xs flex items-center gap-1 transition cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                            <span>Rad etish</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleInspectReport(app.id)}
                            className="px-3 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 text-slate-700 font-black text-xs flex items-center gap-1 transition cursor-pointer"
                            title="Joyiga inspektor yuborish"
                          >
                            <Building2 className="w-4 h-4" />
                            <span>Inspektor</span>
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 text-xs font-black">
                          {app.status === 'approved' && (
                            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Admin tomonidan tasdiqlangan</span>
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = applications.map(a => a.id === app.id ? { ...a, status: 'pending', adminNote: '' } : a);
                              setApplications(updated);
                            }}
                            className="text-[11px] text-slate-400 hover:text-slate-600 underline font-bold cursor-pointer"
                          >
                            Qayta ko‘rib chiqish
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: SHAHAR MONITORINGI & XARITA (ORIGINAL MAP & STATS)
          ===================================================================== */}
      {activeAdminTab === 'map' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Main KPI cards */}
          <div className={`grid ${isMobile ? 'grid-cols-2 gap-2.5' : 'grid-cols-2 sm:grid-cols-4 gap-4'}`}>
            <div className={`rounded-3xl p-3.5 sm:p-5 border-2 ${isDark ? 'eco-card-dark' : 'eco-card-light'}`}>
              <div className="text-[11px] sm:text-xs font-bold text-slate-500 mb-1 flex items-center justify-between">
                <span className="truncate">{t.gov_stat_trees}</span>
                <TreePine className="w-4 h-4 text-emerald-600 shrink-0" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-600 font-mono flex items-baseline gap-1">
                <span>{currentStats.trees.toLocaleString()}</span>
                <span className="text-[11px] font-bold text-slate-500">daraxt</span>
              </div>
              <div className="text-[10px] text-slate-500 font-bold mt-1">91.4% omon qolish</div>
            </div>

            <div className={`rounded-3xl p-3.5 sm:p-5 border-2 ${isDark ? 'eco-card-dark' : 'eco-card-light'}`}>
              <div className="text-[11px] sm:text-xs font-bold text-slate-500 mb-1 flex items-center justify-between">
                <span className="truncate">{t.gov_stat_aqi}</span>
                <Wind className="w-4 h-4 text-amber-600 shrink-0" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-600 font-mono">
                {currentStats.aqi} AQI
              </div>
              <div className="text-[10px] text-amber-700 dark:text-amber-400 font-bold mt-1">PM2.5: 42.1 µg/m³</div>
            </div>

            <div className={`rounded-3xl p-3.5 sm:p-5 border-2 ${isDark ? 'eco-card-dark' : 'eco-card-light'}`}>
              <div className="text-[11px] sm:text-xs font-bold text-slate-500 mb-1 flex items-center justify-between">
                <span className="truncate">{t.gov_stat_users}</span>
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              </div>
              <div className={`text-xl sm:text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-950'}`}>14,230</div>
              <div className="text-[10px] text-emerald-600 font-bold mt-1">SMS tasdiqlangan</div>
            </div>

            <div className={`rounded-3xl p-3.5 sm:p-5 border-2 ${isDark ? 'eco-card-dark' : 'eco-card-light'}`}>
              <div className="text-[11px] sm:text-xs font-bold text-slate-500 mb-1 flex items-center justify-between">
                <span className="truncate">{t.gov_stat_reports}</span>
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-rose-600 font-mono">{currentStats.reports} ta</div>
              <div className="text-[10px] text-slate-500 font-bold mt-1">29 tasi bartaraf</div>
            </div>
          </div>

          {/* Interactive Map & District Filter */}
          <div className={`rounded-3xl p-4 sm:p-6 border-2 space-y-4 ${isDark ? 'eco-card-dark' : 'eco-card-light'}`}>
            <div className={`flex ${isMobile ? 'flex-col items-start gap-2.5' : 'flex-col sm:flex-row items-start sm:items-center justify-between gap-3'}`}>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
                <h3 className={`font-black text-base ${isDark ? 'text-white' : 'text-slate-950'}`}>{t.gov_map_title}</h3>
              </div>

              <div className={`flex items-center gap-2 text-xs font-bold ${isMobile ? 'w-full' : ''}`}>
                <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className={`${isMobile ? 'w-full' : ''} px-4 py-2 rounded-xl font-bold outline-none border-2 transition ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-950'
                  }`}
                >
                  {districts.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Interactive Leaflet Map for Tashkent */}
            <div className={`relative w-full h-84 sm:h-96 rounded-2xl border-2 overflow-hidden shadow-inner ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-emerald-50/60 border-emerald-200'
            }`}>
              <div ref={mapRef} className="w-full h-full z-0" />

              {/* Interactive Map Legend & Stats Overlay */}
              <div className="absolute bottom-3 left-3 z-[400] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl border-2 border-emerald-200 dark:border-slate-800 text-[11px] font-bold shadow-lg space-y-1.5 select-none">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block shadow-sm" />
                  <span className="text-slate-900 dark:text-slate-200">{t.gov_pin_trees_verified} ({currentStats.trees.toLocaleString()})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-600 inline-block shadow-sm" />
                  <span className="text-slate-900 dark:text-slate-200">{t.gov_pin_violations} ({currentStats.reports} ta)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: INSPEKTORLAR VA RUXSATNOMALAR
          ===================================================================== */}
      {activeAdminTab === 'inspectors' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className={`rounded-3xl p-5 sm:p-6 border-2 space-y-4 ${isDark ? 'eco-card-dark' : 'eco-card-light'}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
                  Hududiy inspektorlarga admin ruxsati berish
                </h3>
                <p className={`text-xs font-semibold mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Tumanlar bo‘yicha ekologiya nazoratchilariga ariza tekshirish va tasdiqlash ruxsatini yoqish yoki o‘chirish.
                </p>
              </div>
            </div>

            {/* Inspectors List */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className={`uppercase tracking-wider font-black border-b ${
                  isDark ? 'bg-slate-900 text-emerald-300 border-slate-800' : 'bg-emerald-100 text-emerald-950 border-emerald-200'
                }`}>
                  <tr>
                    <th className="py-3 px-4">Inspektor</th>
                    <th className="py-3 px-4">Lavozimi</th>
                    <th className="py-3 px-4">Hududi</th>
                    <th className="py-3 px-4">Ruxsat Darajasi</th>
                    <th className="py-3 px-4 text-right">Ruxsat Holati</th>
                  </tr>
                </thead>
                <tbody className={`divide-y font-semibold ${isDark ? 'divide-slate-800 text-slate-200' : 'divide-emerald-100 text-slate-800'}`}>
                  {inspectors.map((insp) => (
                    <tr key={insp.id} className="hover:bg-slate-500/5 transition">
                      <td className="py-3.5 px-4 font-black">
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{insp.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-bold">{insp.role}</td>
                      <td className="py-3.5 px-4 font-semibold">{insp.district}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                          {insp.tier}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {insp.tier === 'SuperAdmin' ? (
                          <span className="text-[11px] font-black text-emerald-600">Doimiy faol</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggleInspectorStatus(insp.id)}
                            className={`px-3 py-1.5 rounded-full text-[11px] font-black transition cursor-pointer ${
                              insp.status === 'active'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {insp.status === 'active' ? '🟢 Ruxsat berilgan' : '🔴 Ruxsat o‘chirilgan'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Inspector Form */}
            <form onSubmit={handleAddInspector} className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={newInspectorName}
                onChange={(e) => setNewInspectorName(e.target.value)}
                placeholder="Yangi inspektor F.I.Sh."
                className={`w-full sm:flex-1 px-4 py-2.5 rounded-2xl border-2 text-xs font-bold outline-none ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
              <select
                value={newInspectorDistrict}
                onChange={(e) => setNewInspectorDistrict(e.target.value)}
                className={`w-full sm:w-auto px-4 py-2.5 rounded-2xl border-2 text-xs font-bold outline-none ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                {districts.filter(d => d.id !== 'all').map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Ruxsat berish</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
