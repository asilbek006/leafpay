import React, { useState } from 'react';
import { 
  Store, 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Users, 
  Coffee, 
  ArrowUpRight, 
  Search,
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
  Clock,
  Sparkles
} from 'lucide-react';

const DEFAULT_HISTORY = [
  { code: 'LEAFPAY-SAFIA-OLD-1024', time: '19:42', name: 'Azizbek R.', deal: 'Cappuccino -20%', sum: '22,400 so‘m' },
  { code: 'LEAFPAY-SAFIA-OLD-2891', time: '18:15', name: 'Malika K.', deal: 'Desert & Choy -15%', sum: '34,000 so‘m' },
  { code: 'LEAFPAY-SAFIA-OLD-3312', time: '17:03', name: 'Jasur T.', deal: 'Americano -20%', sum: '16,000 so‘m' },
  { code: 'LEAFPAY-SAFIA-OLD-4190', time: '15:20', name: 'Dilnoza S.', deal: 'Latte -20%', sum: '20,800 so‘m' },
];

export default function PartnerPortal({ t, theme, user, isMobile = false }) {
  const isDark = theme === 'dark';
  const [couponCode, setCouponCode] = useState('LEAFPAY-safia-coffee-9821');
  const [scanResult, setScanResult] = useState(null);
  const [lastVerifiedInfo, setLastVerifiedInfo] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  // Persistent list of redeemed coupons (Single-Use Anti-Fraud database)
  const [redeemedList, setRedeemedList] = useState(() => {
    try {
      const saved = localStorage.getItem('leafpay_redeemed_coupons');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_HISTORY;
  });

  // Persistent KPI stats
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('leafpay_partner_stats');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      todayVisits: 38,
      couponsRedeemed: 29,
      revenueGenerated: '4,850,000',
      esgRating: 'A+'
    };
  });

  // Verify and redeem coupon with anti-fraud & XSS protection
  const handleVerifyCoupon = (e) => {
    if (e) e.preventDefault();
    // Cyber defense: sanitize input to alphanumeric, dash and underscore only (Anti-XSS / Injection)
    const cleanCode = couponCode.replace(/[^A-Za-z0-9\-_]/g, '').slice(0, 50).trim();
    if (!cleanCode) return;

    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setIsScanning(false);
      const upper = cleanCode.toUpperCase();

      // ANTI-FRAUD RULE 1: Has this exact coupon code already been redeemed?
      const alreadyUsed = redeemedList.find(item => item.code.toUpperCase() === upper);
      if (alreadyUsed) {
        // BLOCKED! Duplicate attempt intercepted!
        setScanResult('already_used');
        setLastVerifiedInfo(alreadyUsed);
        return;
      }

      // Check code validity (must be LeafPay token or Safia / Metro coupon)
      const isValid = upper.includes('SAFIA') || upper.includes('METRO') || upper.startsWith('LEAFPAY');
      if (isValid) {
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const isMetro = upper.includes('METRO');
        const customerName = user?.name ? user.name : 'Azizbek Rahimov';

        const newEntry = {
          code: cleanCode,
          time: timeStr,
          name: customerName.split(' ')[0] + ' ' + (customerName.split(' ')[1]?.[0] || 'R') + '.',
          deal: isMetro ? 'Metro Chiptasi (ATTO) -100%' : 'Cappuccino & Desert -20%',
          sum: isMetro ? '1,700 so‘m' : '24,000 so‘m'
        };

        setLastVerifiedInfo(newEntry);
        setScanResult('valid');

        // Add to redeemed database so it CANNOT be used again!
        const updatedList = [newEntry, ...redeemedList];
        setRedeemedList(updatedList);
        try {
          localStorage.setItem('leafpay_redeemed_coupons', JSON.stringify(updatedList));
        } catch (e) {}

        const addedRevenue = isMetro ? 1700 : 24000;
        const currentRevNum = parseInt(String(stats.revenueGenerated).replace(/,/g, ''), 10) || 4850000;
        const newRev = (currentRevNum + addedRevenue).toLocaleString();

        const updatedStats = {
          ...stats,
          todayVisits: stats.todayVisits + 1,
          couponsRedeemed: stats.couponsRedeemed + 1,
          revenueGenerated: newRev
        };
        setStats(updatedStats);
        try {
          localStorage.setItem('leafpay_partner_stats', JSON.stringify(updatedStats));
        } catch (e) {}
      } else {
        // Unknown or fake coupon
        setScanResult('invalid');
      }
    }, 600);
  };

  // Reset demo data back to clean state
  const handleResetDemo = () => {
    setRedeemedList(DEFAULT_HISTORY);
    const initialStats = {
      todayVisits: 38,
      couponsRedeemed: 29,
      revenueGenerated: '4,850,000',
      esgRating: 'A+'
    };
    setStats(initialStats);
    setCouponCode('LEAFPAY-safia-coffee-9821');
    setScanResult(null);
    setLastVerifiedInfo(null);
    try {
      localStorage.removeItem('leafpay_redeemed_coupons');
      localStorage.removeItem('leafpay_partner_stats');
    } catch (e) {}
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Partner Header */}
      <div className={`rounded-3xl p-5 sm:p-6 border-2 flex ${
        isMobile ? 'flex-col items-start gap-3' : 'flex-col sm:flex-row items-center justify-between gap-4'
      } ${
        isDark ? 'eco-card-dark' : 'eco-card-light'
      }`}>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/25 shrink-0">
            <Coffee className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className={`text-lg sm:text-xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>{t.partner_title}</h2>
              <span className="text-xs bg-emerald-600 text-white px-3 py-0.5 rounded-full font-black">
                {t.partner_badge}
              </span>
            </div>
            <p className={`text-xs font-semibold mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{t.partner_branch}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[11px] sm:text-xs font-black border-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl inline-flex items-center gap-1.5 ${
            isDark ? 'bg-emerald-950 text-emerald-300 border-emerald-700' : 'bg-emerald-50 text-emerald-900 border-emerald-300'
          }`}>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t.partner_esg}</span>
          </span>
        </div>
      </div>

      {/* KPI Stats */}
      <div className={`grid ${isMobile ? 'grid-cols-2 gap-2.5' : 'grid-cols-2 sm:grid-cols-4 gap-4'}`}>
        <div className={`rounded-3xl p-3.5 sm:p-5 border-2 ${isDark ? 'eco-card-dark' : 'eco-card-light'}`}>
          <div className="text-[11px] sm:text-xs font-bold text-slate-500 mb-1 flex items-center justify-between">
            <span className="truncate">{t.partner_stat_visits}</span>
            <Users className="w-4 h-4 text-blue-600 shrink-0" />
          </div>
          <div className={`text-xl sm:text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-950'}`}>{stats.todayVisits} ta</div>
          <div className="text-[10px] text-emerald-600 font-black mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +18% o‘sish
          </div>
        </div>

        <div className={`rounded-3xl p-3.5 sm:p-5 border-2 ${isDark ? 'eco-card-dark' : 'eco-card-light'}`}>
          <div className="text-[11px] sm:text-xs font-bold text-slate-500 mb-1 flex items-center justify-between">
            <span className="truncate">{t.partner_stat_coupons}</span>
            <QrCode className="w-4 h-4 text-emerald-600 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 font-mono">{stats.couponsRedeemed} ta</div>
          <div className="text-[10px] text-slate-500 font-bold mt-1">Yangi xaridorlar</div>
        </div>

        <div className={`rounded-3xl p-3.5 sm:p-5 border-2 ${isDark ? 'eco-card-dark' : 'eco-card-light'}`}>
          <div className="text-[11px] sm:text-xs font-bold text-slate-500 mb-1 flex items-center justify-between">
            <span className="truncate">{t.partner_stat_revenue}</span>
            <TrendingUp className="w-4 h-4 text-amber-600 shrink-0" />
          </div>
          <div className={`text-base sm:text-xl font-black font-mono truncate ${isDark ? 'text-white' : 'text-slate-950'}`}>{stats.revenueGenerated} <span className="text-[10px] sm:text-xs font-normal text-slate-500">so‘m</span></div>
          <div className="text-[10px] text-emerald-600 font-black mt-1">Kupon savdosi</div>
        </div>

        <div className={`rounded-3xl p-3.5 sm:p-5 border-2 ${isDark ? 'eco-card-dark' : 'eco-card-light'}`}>
          <div className="text-[11px] sm:text-xs font-bold text-slate-500 mb-1 flex items-center justify-between">
            <span className="truncate">{t.partner_stat_plan}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          </div>
          <div className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>Faol</div>
          <div className="text-[10px] text-slate-500 font-bold mt-1">500,000 so‘m / oy</div>
        </div>
      </div>

      {/* QR Scanner / Coupon Validator Area */}
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 gap-6'}`}>
        {/* Verification Form */}
        <div className={`rounded-3xl p-5 sm:p-6 border-2 space-y-4 ${isDark ? 'eco-card-dark' : 'eco-card-light'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-emerald-600 shrink-0" />
              <h3 className={`font-black text-base ${isDark ? 'text-white' : 'text-slate-950'}`}>{t.partner_verify_title}</h3>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              {t.partner_one_time_badge}
            </span>
          </div>

          <p className={`text-xs font-semibold leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {t.partner_verify_sub}
          </p>

          <form onSubmit={handleVerifyCoupon} className="space-y-3">
            <div>
              <label className={`block text-xs font-black uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-800'
              }`}>
                {t.partner_input_label}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    if (scanResult) setScanResult(null);
                  }}
                  className={`w-full rounded-2xl px-4 py-3 text-xs font-mono font-bold outline-none border-2 transition ${
                    isDark 
                      ? 'bg-slate-900 border-slate-700 text-emerald-300 focus:border-emerald-500' 
                      : 'bg-slate-50 border-slate-300 text-slate-950 focus:border-emerald-600'
                  }`}
                  placeholder="LEAFPAY-xxxx-xxxx"
                  required
                />
                <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isScanning}
              className="w-full py-3.5 sm:py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs rounded-full shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              {isScanning ? (
                <span>{t.partner_verifying}</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.partner_btn_verify}</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Test Presets */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>{t.partner_quick_tests_label}</span>
              <button
                type="button"
                onClick={handleResetDemo}
                title="Tarixni tozalash"
                className="text-[10px] text-slate-400 hover:text-emerald-600 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Qayta o‘rnatish</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
              {/* Preset 1: Fresh Safia Coupon */}
              <button
                type="button"
                onClick={() => {
                  const randomNum = Math.floor(1000 + Math.random() * 9000);
                  setCouponCode(`LEAFPAY-safia-${randomNum}`);
                  setScanResult(null);
                }}
                className={`p-2 rounded-xl border text-left transition cursor-pointer flex items-center gap-1.5 ${
                  isDark ? 'bg-slate-900 border-emerald-500/30 text-emerald-300 hover:bg-slate-800' : 'bg-emerald-50 border-emerald-300 text-emerald-950 hover:bg-emerald-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="truncate">{t.partner_btn_test_fresh}</span>
              </button>

              {/* Preset 2: Fresh Metro Coupon */}
              <button
                type="button"
                onClick={() => {
                  const randomNum = Math.floor(1000 + Math.random() * 9000);
                  setCouponCode(`LEAFPAY-metro-atto-${randomNum}`);
                  setScanResult(null);
                }}
                className={`p-2 rounded-xl border text-left transition cursor-pointer flex items-center gap-1.5 ${
                  isDark ? 'bg-slate-900 border-blue-500/30 text-blue-300 hover:bg-slate-800' : 'bg-blue-50 border-blue-300 text-blue-950 hover:bg-blue-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                <span className="truncate">{t.partner_btn_test_metro}</span>
              </button>

              {/* Preset 3: Already Used Coupon Test (Anti-Fraud Proof) */}
              <button
                type="button"
                onClick={() => {
                  if (redeemedList.length > 0) {
                    setCouponCode(redeemedList[0].code);
                  } else {
                    setCouponCode('LEAFPAY-safia-coffee-9821');
                  }
                  setScanResult(null);
                }}
                className={`p-2 rounded-xl border text-left transition cursor-pointer flex items-center gap-1.5 ${
                  isDark ? 'bg-slate-900 border-amber-500/30 text-amber-300 hover:bg-slate-800' : 'bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span className="truncate">{t.partner_btn_test_used}</span>
              </button>

              {/* Preset 4: Fake / Invalid Coupon */}
              <button
                type="button"
                onClick={() => {
                  setCouponCode('SOXTA-KUPON-XYZ-999');
                  setScanResult(null);
                }}
                className={`p-2 rounded-xl border text-left transition cursor-pointer flex items-center gap-1.5 ${
                  isDark ? 'bg-slate-900 border-rose-500/30 text-rose-300 hover:bg-slate-800' : 'bg-rose-50 border-rose-300 text-rose-950 hover:bg-rose-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span className="truncate">{t.partner_btn_test_fake}</span>
              </button>
            </div>
          </div>

          {/* Validation Result Box */}
          {scanResult === 'valid' && (
            <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950 border-2 border-emerald-400 text-xs space-y-1.5 animate-in zoom-in-95">
              <div className="font-black text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.partner_res_ok}</span>
              </div>
              <p className="font-bold text-slate-700 dark:text-slate-300">
                Mijoz: {lastVerifiedInfo?.name || 'Azizbek Rahimov'} · Profil tasdiqlangan.
              </p>
              <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Kupon bir martalik reestrga kiritildi va muvaffaqiyatli bekor qilindi.</span>
              </div>
            </div>
          )}

          {scanResult === 'already_used' && (
            <div className="p-4 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border-2 border-amber-500 text-xs space-y-2 animate-in zoom-in-95">
              <div className="font-black text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{t.partner_res_already_used}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-amber-300 dark:border-amber-700 space-y-1 font-bold">
                <div className="text-[11px] text-amber-900 dark:text-amber-300">
                  ⚠️ Ushbu token allaqachon ({lastVerifiedInfo?.time || 'Bugun'} da) ishlatilgan!
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Kod: {lastVerifiedInfo?.code || couponCode} · Mijoz: {lastVerifiedInfo?.name || 'Azizbek R.'}
                </div>
              </div>
              <p className="text-[10px] font-bold text-amber-900 dark:text-amber-300">
                {t.partner_res_already_used_desc}
              </p>
            </div>
          )}

          {scanResult === 'invalid' && (
            <div className="p-4 rounded-2xl bg-rose-100 dark:bg-rose-950 border-2 border-rose-400 text-xs text-rose-950 dark:text-rose-200 space-y-1 animate-in zoom-in-95">
              <div className="font-black flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{t.partner_res_err}</span>
              </div>
            </div>
          )}
        </div>

        {/* Live Partner Feed */}
        <div className={`rounded-3xl p-5 sm:p-6 border-2 space-y-3 ${isDark ? 'eco-card-dark' : 'eco-card-light'}`}>
          <div className="flex items-center justify-between">
            <h3 className={`font-black text-base ${isDark ? 'text-white' : 'text-slate-950'}`}>{t.partner_feed_title}</h3>
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-mono">
              {redeemedList.length} ta
            </span>
          </div>

          <div className="space-y-2.5 text-xs max-h-[460px] overflow-y-auto no-scrollbar pr-0.5">
            {redeemedList.map((item, idx) => (
              <div key={idx} className={`p-3.5 rounded-2xl border-2 flex items-center justify-between font-bold transition ${
                idx === 0 && scanResult === 'valid' ? 'ring-2 ring-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40' : ''
              } ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <div className={`font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>{item.deal}</div>
                  <div className="text-[10px] text-slate-500 font-semibold mt-0.5 flex items-center gap-1.5">
                    <span>{item.name}</span>
                    <span>·</span>
                    <span className="font-mono">{item.time}</span>
                    <span>·</span>
                    <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-900/40 px-1.5 py-0.5 rounded">
                      Tasdiqlangan
                    </span>
                  </div>
                </div>
                <div className="text-right font-mono font-black text-emerald-600">
                  {item.sum}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
