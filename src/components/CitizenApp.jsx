import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Coins, 
  RefreshCw, 
  ArrowRight, 
  QrCode, 
  Ticket, 
  Coffee, 
  ShoppingBag, 
  TreePine,
  Clock,
  Lock,
  UserPlus,
  Bell,
  Trash2,
  AlertTriangle,
  ChevronRight,
  Gift,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';

export default function CitizenApp({ t, theme, user, isMobile = false, onRequireLogin, onUpdateCoins, initialSubTab = 'action' }) {
  const isDark = theme === 'dark';
  const [selectedAction, setSelectedAction] = useState('tree');
  const [gpsData, setGpsData] = useState({
    lat: 41.311082,
    lng: 69.240562,
    accuracy: 6,
    district: "Toshkent, Mirzo Ulug‘bek",
    address: "Amir Temur ko‘chasi",
    isReal: false
  });
  const [isGettingGps, setIsGettingGps] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isDuplicateTest, setIsDuplicateTest] = useState(false);

  // Map references for Leaflet
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const geofenceCircleRef = useRef(null);
  
  // Verification states
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);
  const [verificationResult, setVerificationResult] = useState(null);

  // Eko-Bozor / Coupons
  const [activeTab, setActiveTab] = useState(initialSubTab || 'action');

  useEffect(() => {
    if (initialSubTab) {
      setActiveTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Sample demo photos
  const samplePhotos = {
    tree: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80",
    clean: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=600&auto=format&fit=crop&q=80",
    fake: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80"
  };

  // Real GPS & Geolocation Handler
  const handleGetRealGps = () => {
    setIsGettingGps(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = parseFloat(position.coords.latitude.toFixed(6));
          const lng = parseFloat(position.coords.longitude.toFixed(6));
          const acc = Math.round(position.coords.accuracy || 6);

          setGpsData(prev => ({
            ...prev,
            lat,
            lng,
            accuracy: acc,
            district: "Jonli GPS aniqlanmoqda...",
            isReal: true
          }));

          // Geofence Anti-Spoofing Check: Uzbekistan Bounding Box (Lat: 37.0 - 45.6, Lng: 56.0 - 73.5)
          const isInsideUzbekistan = lat >= 37.0 && lat <= 45.6 && lng >= 56.0 && lng <= 73.5;
          if (!isInsideUzbekistan) {
            console.warn("Anti-Spoofing Alert: GPS coordinates outside Uzbekistan territory.");
          }

          // Reverse geocoding via OpenStreetMap Nominatim
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=17&addressdetails=1`, {
            headers: { 'Accept-Language': 'uz,ru,en' }
          })
            .then(res => res.json())
            .then(data => {
              if (data && data.address) {
                const addr = data.address;
                const dName = addr.city_district || addr.suburb || addr.neighbourhood || addr.city || addr.town || "Toshkent";
                const road = addr.road ? `, ${addr.road}` : '';
                setGpsData(prev => ({
                  ...prev,
                  lat,
                  lng,
                  accuracy: acc,
                  district: `${dName}${road}`,
                  address: data.display_name ? data.display_name.split(',').slice(0, 3).join(',') : '',
                  isReal: true
                }));
              }
            })
            .catch(() => {
              setGpsData(prev => ({
                ...prev,
                lat,
                lng,
                accuracy: acc,
                district: "Haqiqiy GPS (Jonli joylashuv)",
                isReal: true
              }));
            })
            .finally(() => {
              setIsGettingGps(false);
            });
        },
        (error) => {
          console.warn("Geolocation warning:", error);
          setGpsData(prev => ({
            ...prev,
            lat: 41.311082,
            lng: 69.240562,
            accuracy: 8,
            district: "Toshkent markazi (Amir Temur)",
            isReal: false
          }));
          setIsGettingGps(false);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    } else {
      setIsGettingGps(false);
    }
  };

  // Auto-request GPS on component mount
  useEffect(() => {
    handleGetRealGps();
  }, []);

  // Initialize and update Live Leaflet Map
  useEffect(() => {
    if (!window.L || !mapRef.current) return;

    if (!mapInstanceRef.current) {
      // Create Map
      const map = window.L.map(mapRef.current, {
        center: [gpsData.lat, gpsData.lng],
        zoom: 15,
        zoomControl: true,
        attributionControl: false
      });

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      // Custom pulsing user GPS marker
      const userIcon = window.L.divIcon({
        className: 'custom-gps-user-marker',
        html: `<div style="position:relative;display:flex;align-items:center;justify-content:center;width:34px;height:34px;">
          <div style="position:absolute;width:34px;height:34px;border-radius:50%;background:rgba(16,185,129,0.4);animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></div>
          <div style="width:20px;height:20px;border-radius:50%;background:#10b981;border:3px solid #ffffff;box-shadow:0 2px 8px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;color:#fff;font-size:10px;font-weight:900;">📍</div>
        </div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const userMarker = window.L.marker([gpsData.lat, gpsData.lng], { icon: userIcon }).addTo(map);
      userMarker.bindPopup(`<b>📍 Sizning joylashuvingiz</b><br/>${gpsData.district}<br/><span style="font-size:11px;color:#059669;font-family:monospace">Lat: ${gpsData.lat}, Lng: ${gpsData.lng}</span>`);
      userMarkerRef.current = userMarker;

      // Geofence circle
      const circle = window.L.circle([gpsData.lat, gpsData.lng], {
        radius: 400,
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 0.08,
        weight: 2,
        dashArray: '5, 5'
      }).addTo(map);
      geofenceCircleRef.current = circle;

      // Nearby community eco pins
      const treeIcon = window.L.divIcon({
        className: 'eco-pin-tree',
        html: `<div style="background:#10b981;color:#fff;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-size:13px;border:2px solid #fff;box-shadow:0 2px 5px rgba(0,0,0,0.25);">🌱</div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const cleanIcon = window.L.divIcon({
        className: 'eco-pin-clean',
        html: `<div style="background:#0284c7;color:#fff;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-size:13px;border:2px solid #fff;box-shadow:0 2px 5px rgba(0,0,0,0.25);">🧹</div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      window.L.marker([gpsData.lat + 0.0018, gpsData.lng + 0.0016], { icon: treeIcon })
        .addTo(map)
        .bindPopup("<b>🌱 Yangi ko‘chat</b><br/>Chinor ko‘chati · 2 soat oldin AI tomonidan tasdiqlangan (+10 coin)");

      window.L.marker([gpsData.lat - 0.0017, gpsData.lng - 0.0015], { icon: cleanIcon })
        .addTo(map)
        .bindPopup("<b>🧹 Tozalangan maydon</b><br/>Mahalla hududi tozalandi (+10 coin)");

      mapInstanceRef.current = map;
    } else {
      // Re-center and update
      const map = mapInstanceRef.current;
      map.setView([gpsData.lat, gpsData.lng], 15);
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([gpsData.lat, gpsData.lng]);
        userMarkerRef.current.setPopupContent(`<b>📍 Sizning joylashuvingiz</b><br/>${gpsData.district}<br/><span style="font-size:11px;color:#059669;font-family:monospace">Lat: ${gpsData.lat}, Lng: ${gpsData.lng}</span>`);
      }
      if (geofenceCircleRef.current) {
        geofenceCircleRef.current.setLatLng([gpsData.lat, gpsData.lng]);
      }
    }
  }, [gpsData]);

  // Clean up Leaflet map instance on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Hardened file upload handler with cyber attack protection & type validation
  const handleFileUpload = (e) => {
    if (!user) {
      onRequireLogin();
      return;
    }
    const file = e.target.files[0];
    if (file) {
      // 1. Strict MIME Type Validation (Prevents Malicious Scripts / Stored XSS / Executables)
      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedMimes.includes(file.type)) {
        alert("Xavfsizlik ogohlantirishi: Faqat JPG, PNG yoki WEBP formatdagi haqiqiy fotosuratlar qabul qilinadi. Boshqa fayllar xavfsizlik filtri orqali bloklandi.");
        return;
      }
      // 2. Strict File Size Cap (Anti-DoS / Memory Bomb defense - max 8MB)
      if (file.size > 8 * 1024 * 1024) {
        alert("Xavfsizlik ogohlantirishi: Fotosurat hajmi 8MB dan oshmasligi lozim!");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setIsDuplicateTest(false);
        setVerificationResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Preset selector with authentication check
  const handleSelectPreset = (imageSrc, isDup = false) => {
    if (!user) {
      onRequireLogin();
      return;
    }
    setUploadedImage(imageSrc);
    setIsDuplicateTest(isDup);
    setVerificationResult(null);
  };

  // 5-step Verification
  const startVerification = (testType = 'normal') => {
    if (!user) {
      onRequireLogin();
      return;
    }

    setIsVerifying(true);
    setVerificationStep(1);
    setVerificationResult(null);

    setTimeout(() => {
      setVerificationStep(2);

      setTimeout(() => {
        if (testType === 'ai_fail') {
          setIsVerifying(false);
          setVerificationResult('ai_error');
          return;
        }

        setVerificationStep(3);

        setTimeout(() => {
          if (testType === 'duplicate') {
            setIsVerifying(false);
            setVerificationResult('duplicate_error');
            return;
          }

          setVerificationStep(4);

          setTimeout(() => {
            setVerificationStep(5);

            setTimeout(() => {
              setIsVerifying(false);
              setVerificationResult('success');
              const addedCoins = selectedAction === 'tree' ? 15 : selectedAction === 'clean' ? 10 : 5;
              onUpdateCoins(addedCoins);
              
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
              });
            }, 800);
          }, 700);
        }, 700);
      }, 800);
    }, 700);
  };

  // QR Redeem
  const handleRedeemCoupon = async (coupon) => {
    if (!user) {
      onRequireLogin();
      return;
    }
    if (user.coins < coupon.price) {
      alert("Eco-Coin ballaringiz yetarli emas!");
      return;
    }

    // Deduct Eco-Coin ball
    onUpdateCoins(-coupon.price);

    setSelectedCoupon(coupon);
    setCountdown(60);
    setCopiedToken(false);
    // Cryptographically secure token entropy (Anti-forgery & anti-collision protection)
    const cryptoArray = new Uint32Array(1);
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(cryptoArray);
    } else {
      cryptoArray[0] = Math.floor(Math.random() * 1000000);
    }
    const secureEntropy = (cryptoArray[0] % 900000 + 100000).toString();
    const tokenPayload = `LEAFPAY-${coupon.id.toUpperCase()}-${secureEntropy}`;
    setActiveTokenStr(tokenPayload);

    try {
      const url = await QRCode.toDataURL(tokenPayload, {
        width: 260,
        margin: 2,
        color: {
          dark: '#064e3b',
          light: '#ffffff',
        },
      });
      setQrCodeUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  // Timer
  useEffect(() => {
    let timer;
    if (selectedCoupon && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    } else if (countdown === 0) {
      setSelectedCoupon(null);
    }
    return () => clearInterval(timer);
  }, [selectedCoupon, countdown]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* =========================================================================
          TOP MOBILE / APP HEADER: Salom, Aziza! 👋 + Notification Bell
          ========================================================================= */}
      <div className="flex items-center justify-between px-1 sm:px-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500 shadow-md bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-xl shrink-0">
            {user ? (
              <span className="font-black text-emerald-800 dark:text-emerald-200">
                {user.name.charAt(0)}
              </span>
            ) : (
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
                alt="Aziza" 
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div>
            <h3 className={`text-base sm:text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Salom, {user ? user.name.split(' ')[0] : 'Aziza'}! 👋
            </h3>
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              {user ? (user.district || 'Yunusobod tumani') : 'Toshkent, Yunusobod'} · Faol ekolog
            </p>
          </div>
        </div>

        {/* Bell Notification Button */}
        <button
          onClick={() => alert("Sizda 1 ta yangi xabarnoma bor: Bahoriy daraxt ekish haftaligi doirasida +10 bonus Eco-Coin beriladi!")}
          className="relative p-2.5 rounded-full bg-white dark:bg-slate-900 border-2 border-emerald-200 dark:border-emerald-800 text-slate-700 dark:text-slate-200 hover:text-emerald-600 transition shadow-sm cursor-pointer"
          title="Xabarnomalar"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
        </button>
      </div>

      {/* =========================================================================
          HERO CARD: Mening Eco-Coin'im (320 >) + Seedling in Soil Illustration
          ========================================================================= */}
      <div 
        onClick={() => setActiveTab('wallet')}
        className={`relative overflow-hidden rounded-[32px] p-6 text-white shadow-xl border-2 transition-all cursor-pointer hover:scale-[1.01] ${
          isDark 
            ? 'bg-gradient-to-br from-[#0c2e1c] via-[#092215] to-[#06180f] border-emerald-500/40 shadow-emerald-950/40' 
            : 'bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 border-emerald-400/50 shadow-emerald-700/25'
        }`}
      >
        {/* Soft Ambient Light Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-100 tracking-wide">
              Mening Eco-Coin‘im
            </span>
            <div className="flex items-center gap-3 pt-1">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-md shadow-amber-400/40">
                🪙
              </div>
              <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight">
                {user ? user.coins : 320}
              </span>
              <ChevronRight className="w-6 h-6 text-emerald-200" />
            </div>
            <p className="text-[11px] font-semibold text-emerald-200/90 pt-1">
              Mukofotlarga almashtirish uchun bosing →
            </p>
          </div>

          {/* Seedling Growing in Soil Illustration */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
              {/* Soil mound */}
              <ellipse cx="60" cy="98" rx="42" ry="14" fill="#3f271d" opacity="0.9" />
              <ellipse cx="60" cy="96" rx="36" ry="10" fill="#583526" />
              <ellipse cx="58" cy="94" rx="26" ry="6" fill="#784732" />
              {/* Small soil crumbs */}
              <circle cx="28" cy="98" r="3" fill="#3f271d" />
              <circle cx="92" cy="99" r="2.5" fill="#3f271d" />
              <circle cx="45" cy="102" r="2" fill="#583526" />

              {/* Seedling Stem */}
              <path d="M60 92 Q 59 70 60 48" stroke="#34d399" strokeWidth="5" strokeLinecap="round" fill="none" />
              
              {/* Left Leaf */}
              <path d="M 60 62 C 40 60 30 45 42 36 C 54 35 60 52 60 62 Z" fill="#4ade80" />
              <path d="M 60 62 Q 46 48 42 36" stroke="#22c55e" strokeWidth="1.5" fill="none" />
              
              {/* Right Leaf */}
              <path d="M 60 52 C 80 50 90 35 78 26 C 66 25 60 42 60 52 Z" fill="#22c55e" />
              <path d="M 60 52 Q 74 38 78 26" stroke="#15803d" strokeWidth="1.5" fill="none" />
              
              {/* Top Fresh Sprout Leaf */}
              <path d="M 60 48 C 55 35 65 20 60 14 C 55 20 65 35 60 48 Z" fill="#86efac" />
            </svg>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3 PROMINENT QUICK ACTIONS: Ko'chat ekish, Hududni tozalash, Muammo xabar berish
          ========================================================================= */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        {/* 1. Ko'chat ekish (Green) */}
        <button
          onClick={() => {
            setSelectedAction('tree');
            setActiveTab('action');
            const el = document.getElementById('camera-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`p-3.5 sm:p-5 rounded-3xl border-2 text-center transition cursor-pointer flex flex-col items-center justify-center gap-2 hover:scale-[1.02] shadow-sm ${
            selectedAction === 'tree' && activeTab === 'action'
              ? 'border-emerald-500 bg-emerald-100/90 dark:bg-emerald-950 ring-2 ring-emerald-500 shadow-emerald-500/20'
              : isDark ? 'border-emerald-900/60 bg-[#081a11]' : 'border-emerald-200 bg-white'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl shadow-inner">
            🌱
          </div>
          <span className={`text-xs sm:text-sm font-black leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Ko‘chat ekish
          </span>
          <span className="text-[10px] font-black font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full">
            +15 coin
          </span>
        </button>

        {/* 2. Hududni tozalash (Blue) */}
        <button
          onClick={() => {
            setSelectedAction('clean');
            setActiveTab('action');
            const el = document.getElementById('camera-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`p-3.5 sm:p-5 rounded-3xl border-2 text-center transition cursor-pointer flex flex-col items-center justify-center gap-2 hover:scale-[1.02] shadow-sm ${
            selectedAction === 'clean' && activeTab === 'action'
              ? 'border-blue-500 bg-blue-100/90 dark:bg-blue-950 ring-2 ring-blue-500 shadow-blue-500/20'
              : isDark ? 'border-blue-900/60 bg-[#081421]' : 'border-blue-200 bg-white'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl shadow-inner">
            🗑️
          </div>
          <span className={`text-xs sm:text-sm font-black leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Hududni tozalash
          </span>
          <span className="text-[10px] font-black font-mono text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded-full">
            +10 coin
          </span>
        </button>

        {/* 3. Muammo xabar berish (Red/Orange) */}
        <button
          onClick={() => {
            setSelectedAction('report');
            setActiveTab('action');
            const el = document.getElementById('camera-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`p-3.5 sm:p-5 rounded-3xl border-2 text-center transition cursor-pointer flex flex-col items-center justify-center gap-2 hover:scale-[1.02] shadow-sm ${
            selectedAction === 'report' && activeTab === 'action'
              ? 'border-rose-500 bg-rose-100/90 dark:bg-rose-950 ring-2 ring-rose-500 shadow-rose-500/20'
              : isDark ? 'border-rose-900/60 bg-[#1f0f13]' : 'border-rose-200 bg-white'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center text-2xl shadow-inner">
            ⚠️
          </div>
          <span className={`text-xs sm:text-sm font-black leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Muammo xabar
          </span>
          <span className="text-[10px] font-black font-mono text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/40 px-2 py-0.5 rounded-full">
            +5 coin
          </span>
        </button>
      </div>

      {/* =========================================================================
          MENING TA'SIRIM (MY IMPACT): 12 Ko'chat, 3 Tozalash, 2 Xabar
          ========================================================================= */}
      <div className={`rounded-3xl p-5 border-2 shadow-sm ${isDark ? 'eco-card-dark' : 'eco-card-light'}`}>
        <div className="flex items-center justify-between mb-3">
          <h4 className={`text-xs sm:text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Mening ta‘sirim
          </h4>
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
            Jami: 17 ta yashil amal
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
            <div className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono flex items-center justify-center gap-1">
              <span>🌱</span> 12
            </div>
            <div className="text-[11px] font-black text-slate-700 dark:text-slate-300 mt-0.5">
              Ko‘chat
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800">
            <div className="text-xl sm:text-2xl font-black text-blue-700 dark:text-blue-400 font-mono flex items-center justify-center gap-1">
              <span>🗑️</span> 3
            </div>
            <div className="text-[11px] font-black text-slate-700 dark:text-slate-300 mt-0.5">
              Tozalash
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800">
            <div className="text-xl sm:text-2xl font-black text-amber-700 dark:text-amber-400 font-mono flex items-center justify-center gap-1">
              <span>⚠️</span> 2
            </div>
            <div className="text-[11px] font-black text-slate-700 dark:text-slate-300 mt-0.5">
              Xabar
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          BUGUNGI VAZIFA (DAILY MISSION): Bugun 1 ta ko'chat ekib, +10 Eco-Coin oling!
          ========================================================================= */}
      <div 
        onClick={() => {
          setSelectedAction('tree');
          setActiveTab('action');
          const el = document.getElementById('camera-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        className={`p-4 rounded-3xl border-2 flex items-center justify-between gap-3 cursor-pointer transition hover:scale-[1.01] shadow-sm ${
          isDark 
            ? 'bg-emerald-950/40 border-emerald-700/50 hover:bg-emerald-900/40' 
            : 'bg-emerald-50 border-emerald-300 hover:bg-emerald-100/70'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl shrink-0 shadow-md shadow-emerald-500/25">
            🌱
          </div>
          <div>
            <div className="text-xs font-black text-emerald-800 dark:text-emerald-300">
              Bugungi vazifa
            </div>
            <div className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              Bugun 1 ta ko‘chat ekib, <span className="text-emerald-600 dark:text-emerald-400 font-black">+10 Eco-Coin</span> oling!
            </div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
      </div>

      {/* =========================================================================
          HAMKORLARIMIZ (PARTNERS): Metro, Korzinka, Kafe
          ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className={`text-xs sm:text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
            Hamkorlarimiz
          </h4>
          <button 
            onClick={() => setActiveTab('wallet')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            Barchasini ko‘rish <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
          {/* Toshkent Metro */}
          <div 
            onClick={() => {
              setActiveTab('wallet');
            }}
            className={`p-3.5 sm:p-4 rounded-3xl border-2 text-center transition cursor-pointer hover:scale-[1.02] shadow-sm ${
              isDark ? 'eco-card-dark' : 'eco-card-light'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl mx-auto mb-2 shadow-md shadow-blue-500/30">
              M
            </div>
            <div className={`text-xs font-black truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Toshkent Metro
            </div>
            <div className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
              10 Eco-Coin
            </div>
          </div>

          {/* Korzinka */}
          <div 
            onClick={() => {
              setActiveTab('wallet');
            }}
            className={`p-3.5 sm:p-4 rounded-3xl border-2 text-center transition cursor-pointer hover:scale-[1.02] shadow-sm ${
              isDark ? 'eco-card-dark' : 'eco-card-light'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black text-xl mx-auto mb-2 shadow-md shadow-rose-500/30">
              🛒
            </div>
            <div className={`text-xs font-black truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Korzinka
            </div>
            <div className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
              20 Eco-Coin
            </div>
          </div>

          {/* Kafe */}
          <div 
            onClick={() => {
              setActiveTab('wallet');
            }}
            className={`p-3.5 sm:p-4 rounded-3xl border-2 text-center transition cursor-pointer hover:scale-[1.02] shadow-sm ${
              isDark ? 'eco-card-dark' : 'eco-card-light'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-black text-xl mx-auto mb-2 shadow-md shadow-amber-500/30">
              ☕
            </div>
            <div className={`text-xs font-black truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Kafe & Restoran
            </div>
            <div className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
              15 Eco-Coin
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE ACTION & CAMERA SECTION
          ========================================================================= */}
      <div id="camera-section" className="pt-2">
        {/* Tabs */}
        <div className={`flex p-1.5 rounded-2xl border-2 text-xs font-black mb-6 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-emerald-200'
        }`}>
          <button
            onClick={() => setActiveTab('action')}
            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'action' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-emerald-800'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Kamera & Amalni tasdiqlash</span>
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'wallet' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-emerald-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t.tab_market}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: HARAKATNI QAYD ETISH */}
      {activeTab === 'action' && (
        <div className="space-y-6">
          {/* Action Type Selector */}
          <div>
            <label className={`block text-xs font-black mb-2 uppercase tracking-wider ${
              isDark ? 'text-emerald-400' : 'text-slate-900'
            }`}>
              {t.action_select_label}
            </label>
            <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'}`}>
              {[
                { id: 'tree', title: t.action_tree_title, bonus: t.action_tree_bonus, icon: "🌱", desc: t.action_tree_desc },
                { id: 'clean', title: t.action_clean_title, bonus: t.action_clean_bonus, icon: "🧹", desc: t.action_clean_desc },
                { id: 'report', title: t.action_report_title, bonus: t.action_report_bonus, icon: "📸", desc: t.action_report_desc },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedAction(item.id);
                    setUploadedImage(null);
                    setVerificationResult(null);
                  }}
                  className={`p-5 rounded-3xl border-2 text-left transition cursor-pointer ${
                    selectedAction === item.id
                      ? 'border-emerald-600 bg-emerald-100/70 dark:bg-emerald-950/80 ring-2 ring-emerald-500 shadow-md'
                      : isDark ? 'border-slate-800 bg-slate-900' : 'border-emerald-200 bg-white'
                  }`}
                >
                  <div className="text-3xl mb-1.5">{item.icon}</div>
                  <div className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-950'}`}>{item.title}</div>
                  <div className={`text-xs mt-0.5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{item.desc}</div>
                  <div className="mt-3 text-xs font-mono font-black text-emerald-700 dark:text-emerald-300">{item.bonus}</div>
                </button>
              ))}
            </div>
          </div>

          {/* GPS Location & Live Interactive Map Widget */}
          <div className={`rounded-3xl border-2 space-y-3 shadow-sm ${
            isMobile ? 'p-4' : 'p-5'
          } ${
            isDark ? 'eco-card-dark' : 'eco-card-light'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 sm:p-3 rounded-2xl bg-emerald-600 text-white shrink-0 shadow-md shadow-emerald-600/25">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className={`text-xs sm:text-sm font-black flex items-center gap-2 flex-wrap ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    <span>{gpsData.district}</span>
                    {gpsData.isReal ? (
                      <span className="text-[10px] bg-emerald-600 text-white px-2.5 py-0.5 rounded-full font-black animate-pulse flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        <span>Haqiqiy GPS (Jonli)</span>
                      </span>
                    ) : (
                      <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full font-bold">
                        GPS ulanmoqda...
                      </span>
                    )}
                  </div>
                  <div className={`text-xs font-mono font-semibold mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Lat: {gpsData.lat}, Lng: {gpsData.lng} (Aniqlik: ±{gpsData.accuracy || 6}m)
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleGetRealGps}
                  disabled={isGettingGps}
                  className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 rounded-full text-xs font-black border-2 border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 dark:bg-slate-800 dark:text-white dark:border-slate-700 flex items-center justify-center gap-2 transition cursor-pointer shadow-sm shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isGettingGps ? 'animate-spin' : ''}`} />
                  <span>{isGettingGps ? "Aniqlanmoqda..." : "GPS'ni yangilash"}</span>
                </button>

                <button
                  onClick={() => {
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.flyTo([gpsData.lat, gpsData.lng], 16);
                    }
                  }}
                  title="Joylashuvimga qaytish"
                  className="p-2.5 rounded-full border-2 border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 dark:bg-slate-800 dark:text-white dark:border-slate-700 transition cursor-pointer shrink-0 shadow-sm"
                >
                  <Compass className="w-4 h-4 text-emerald-600" />
                </button>
              </div>
            </div>

            {/* Live Leaflet Map Container */}
            <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-inner">
              <div ref={mapRef} className="w-full h-full z-0" />
              
              {/* Map Info Overlay */}
              <div className="absolute bottom-2.5 left-2.5 z-[400] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 text-[10.5px] font-bold text-slate-800 dark:text-slate-200 shadow-md flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-ping" />
                  <span className="font-black text-emerald-700 dark:text-emerald-400">Sizning joyingiz</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🌱</span>
                  <span>Ekilgan</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🧹</span>
                  <span>Tozalangan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Area */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className={`text-xs font-black uppercase tracking-wider ${
                isDark ? 'text-emerald-400' : 'text-slate-900'
              }`}>
                {t.photo_label}
              </label>
              <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-400">
                {t.photo_protect_badge}
              </span>
            </div>

            <div className="relative">
              <div className={`grid gap-4 transition-all duration-300 ${
                isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'
              } ${
                !user ? 'filter blur-[3px] opacity-30 pointer-events-none select-none' : ''
              }`}>
                {/* Upload Box */}
                <div className={`relative border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center min-h-[250px] text-center overflow-hidden ${
                  isDark ? 'border-slate-700 bg-slate-900/60' : 'border-emerald-300 bg-emerald-50/50'
                }`}>
                  {uploadedImage ? (
                    <div className="relative w-full h-full min-h-[220px] rounded-2xl overflow-hidden group">
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded preview" 
                        className="w-full h-56 object-cover rounded-2xl"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                        <label className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-full cursor-pointer shadow-lg">
                          {t.photo_change_btn}
                          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-200 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mx-auto">
                        <Camera className="w-8 h-8" />
                      </div>
                      <div>
                        <div className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
                          {t.photo_upload_text}
                        </div>
                        <p className={`text-xs font-semibold mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          {t.photo_exif_text}
                        </p>
                      </div>
                      <label className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-full cursor-pointer shadow-md transition">
                        <span>{t.photo_choose_btn}</span>
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                      </label>
                    </div>
                  )}
                </div>

                {/* Presets - High Contrast */}
                <div className={`rounded-3xl p-6 border-2 flex flex-col justify-between ${
                  isDark ? 'eco-card-dark' : 'eco-card-light'
                }`}>
                  <div>
                    <div className={`text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
                      isDark ? 'text-emerald-300' : 'text-emerald-900'
                    }`}>
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>{t.preset_title}</span>
                    </div>
                    <p className={`text-xs font-semibold mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {t.preset_sub}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        onClick={() => handleSelectPreset(samplePhotos.tree, false)}
                        className="p-3 rounded-2xl border-2 border-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 text-left transition cursor-pointer"
                      >
                        <div className="font-black text-emerald-950 dark:text-emerald-200">{t.preset_valid_tree}</div>
                        <div className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400">100% Valid</div>
                      </button>

                      <button
                        onClick={() => handleSelectPreset(samplePhotos.clean, false)}
                        className="p-3 rounded-2xl border-2 border-teal-400 bg-teal-100 dark:bg-teal-950/80 text-left transition cursor-pointer"
                      >
                        <div className="font-black text-teal-950 dark:text-teal-200">{t.preset_valid_clean}</div>
                        <div className="text-[10px] font-bold text-teal-800 dark:text-teal-400">Subbotnik</div>
                      </button>

                      <button
                        onClick={() => handleSelectPreset(samplePhotos.tree, true)}
                        className="p-3 rounded-2xl border-2 border-amber-400 bg-amber-100 dark:bg-amber-950/80 text-left transition cursor-pointer"
                      >
                        <div className="font-black text-amber-950 dark:text-amber-200">{t.preset_duplicate}</div>
                        <div className="text-[10px] font-bold text-amber-800 dark:text-amber-400">pHash Anti-Fraud</div>
                      </button>

                      <button
                        onClick={() => handleSelectPreset(samplePhotos.fake, false)}
                        className="p-3 rounded-2xl border-2 border-rose-400 bg-rose-100 dark:bg-rose-950/80 text-left transition cursor-pointer"
                      >
                        <div className="font-black text-rose-950 dark:text-rose-200">{t.preset_invalid_ai}</div>
                        <div className="text-[10px] font-bold text-rose-800 dark:text-rose-400">YOLOv8 Fail</div>
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-4">
                    <button
                      disabled={!uploadedImage || isVerifying}
                      onClick={() => {
                        if (isDuplicateTest) {
                          startVerification('duplicate');
                        } else if (uploadedImage === samplePhotos.fake) {
                          startVerification('ai_fail');
                        } else {
                          startVerification('normal');
                        }
                      }}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-black text-xs rounded-full shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      {isVerifying ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>{t.btn_verifying}</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>{t.btn_submit_action}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Lock Overlay when not registered */}
              {!user && (
                <div className="absolute inset-0 z-20 rounded-3xl bg-slate-950/75 backdrop-blur-md border-2 border-emerald-500/50 flex flex-col items-center justify-center p-6 text-center text-white shadow-2xl animate-in fade-in zoom-in-95">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/20">
                    <Lock className="w-7 h-7" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight mb-1 text-white">
                    {t.auth_required_title}
                  </h3>
                  <p className="text-xs text-slate-300 max-w-sm mb-5 font-semibold leading-relaxed">
                    {t.auth_required_desc}
                  </p>
                  <button
                    onClick={onRequireLogin}
                    className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-full shadow-lg shadow-emerald-600/40 flex items-center gap-2 transition hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{t.auth_required_btn}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Verification Progress Box */}
          {isVerifying && (
            <div className={`p-6 rounded-3xl border-2 shadow-xl space-y-3 ${
              isDark ? 'eco-card-dark' : 'eco-card-light'
            }`}>
              <div className="flex items-center justify-between text-xs font-black text-slate-900 dark:text-white">
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
                  <span>5 qatlamli tekshiruv bosqichlari:</span>
                </span>
                <span className="font-mono text-emerald-600 font-black">{verificationStep} / 5</span>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { step: 1, label: t.check_step_1 },
                  { step: 2, label: t.check_step_2 },
                  { step: 3, label: t.check_step_3 },
                  { step: 4, label: t.check_step_4 },
                  { step: 5, label: t.check_step_5 },
                ].map((item) => (
                  <div 
                    key={item.step} 
                    className={`p-3 rounded-2xl border-2 flex items-center justify-between font-bold ${
                      verificationStep > item.step 
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 dark:bg-emerald-950 dark:border-emerald-600 dark:text-emerald-200' 
                        : verificationStep === item.step 
                        ? 'bg-amber-100 border-amber-400 text-amber-950 animate-pulse' 
                        : isDark ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-slate-100 border-slate-300 text-slate-500'
                    }`}
                  >
                    <span>{item.label}</span>
                    {verificationStep > item.step ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : verificationStep === item.step ? (
                      <RefreshCw className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {verificationResult === 'success' && (
            <div className="p-6 rounded-3xl bg-emerald-100 dark:bg-emerald-950 border-2 border-emerald-400 dark:border-emerald-700 space-y-3">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-md">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-black text-base text-emerald-950 dark:text-emerald-100">{t.res_success_title}</h4>
                  <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mt-0.5">
                    {t.res_success_desc} (+{selectedAction === 'tree' ? 15 : selectedAction === 'clean' ? 10 : 5} Eco-Coin)
                  </p>
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveTab('wallet')}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-black flex items-center gap-1.5 transition shadow-md cursor-pointer"
                >
                  <span>{t.res_btn_market}</span>
                </button>
              </div>
            </div>
          )}

          {verificationResult === 'duplicate_error' && (
            <div className="p-6 rounded-3xl bg-rose-100 dark:bg-rose-950 border-2 border-rose-400 dark:border-rose-700 space-y-2">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-rose-600 text-white rounded-2xl shadow-md">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-black text-base text-rose-950 dark:text-rose-100">{t.res_dup_title}</h4>
                  <p className="text-xs font-bold text-rose-800 dark:text-rose-300 mt-0.5">
                    {t.res_dup_desc}
                  </p>
                </div>
              </div>
            </div>
          )}

          {verificationResult === 'ai_error' && (
            <div className="p-6 rounded-3xl bg-amber-100 dark:bg-amber-950 border-2 border-amber-400 dark:border-amber-700 space-y-2">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-600 text-white rounded-2xl shadow-md">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-black text-base text-amber-950 dark:text-amber-100">{t.res_ai_title}</h4>
                  <p className="text-xs font-bold text-amber-800 dark:text-amber-300 mt-0.5">
                    {t.res_ai_desc}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: EKO-BOZOR */}
      {activeTab === 'wallet' && (
        <div className="space-y-6">
          <div>
            <h3 className={`text-lg font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-950'}`}>
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <span>{t.market_title}</span>
            </h3>
            <p className={`text-xs font-semibold mt-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {t.market_sub}
            </p>
          </div>

          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
            {[
              {
                id: 'metro-ticket',
                title: t.market_metro_title,
                desc: t.market_metro_desc,
                price: 20,
                icon: Ticket,
                color: "text-blue-600",
                badge: "Metro / Transport"
              },
              {
                id: 'safia-coffee',
                title: t.market_coffee_title,
                desc: t.market_coffee_desc,
                price: 15,
                icon: Coffee,
                color: "text-amber-600",
                badge: "Kafe & Restoran"
              },
              {
                id: 'eco-bag',
                title: t.market_bag_title,
                desc: t.market_bag_desc,
                price: 30,
                icon: ShoppingBag,
                color: "text-emerald-600",
                badge: "Supermarket"
              }
            ].map((coupon) => (
              <div 
                key={coupon.id} 
                className={`rounded-3xl p-6 flex flex-col justify-between border-2 ${
                  isDark ? 'eco-card-dark' : 'eco-card-light'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-300 dark:border-slate-700">
                      {coupon.badge}
                    </span>
                    <span className="font-mono font-black text-emerald-700 dark:text-emerald-400 text-sm flex items-center gap-1">
                      <Coins className="w-4 h-4 text-amber-500" />
                      {coupon.price} ball
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800">
                      <coupon.icon className={`w-6 h-6 ${coupon.color}`} />
                    </div>
                    <div>
                      <h4 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-950'}`}>{coupon.title}</h4>
                      <p className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{coupon.desc}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleRedeemCoupon(coupon)}
                  className="mt-5 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-full shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>{t.market_btn_redeem}</span>
                </button>
              </div>
            ))}
          </div>

          {/* QR Modal */}
          {selectedCoupon && (
            <div className={`p-6 rounded-3xl border-2 border-emerald-500 shadow-2xl max-w-sm mx-auto text-center space-y-4 animate-in zoom-in-95 ${
              isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-950'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> {t.market_qr_title}
                </span>
                <span className="text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full flex items-center gap-1 text-slate-800 dark:text-slate-200">
                  <Clock className="w-3 h-3 text-amber-500" /> {countdown}s
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-inner inline-block mx-auto border border-slate-200">
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="Voucher QR Code" className="w-48 h-48 mx-auto" />
                ) : (
                  <div className="w-48 h-48 bg-slate-200 animate-pulse rounded-xl" />
                )}
              </div>

              <div>
                <h4 className="font-black text-sm">{selectedCoupon.title}</h4>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">
                  {t.market_qr_tip}
                </p>

                {activeTokenStr && (
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[11px] truncate max-w-[190px]">
                      {activeTokenStr}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(activeTokenStr);
                        setCopiedToken(true);
                        setTimeout(() => setCopiedToken(false), 2000);
                      }}
                      className="px-2 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-black cursor-pointer hover:bg-emerald-700 transition"
                    >
                      {copiedToken ? "Nusxalandi! ✓" : "Nusxa olish"}
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedCoupon(null)}
                className="w-full py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-black rounded-full transition cursor-pointer"
              >
                {t.market_close_btn}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
