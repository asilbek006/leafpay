import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  MapPin, 
  TreePine, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  Wind, 
  Filter
} from 'lucide-react';

export default function MinistryDashboard({ t, theme, isMobile = false }) {
  const isDark = theme === 'dark';
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const districts = [
    { id: 'all', name: "Toshkent shahri (Hammasi)", trees: 48920, reports: 34, aqi: 122, lat: 41.311082, lng: 69.240562, zoom: 12 },
    { id: 'chilonzor', name: "Chilonzor tumani", trees: 12450, reports: 8, aqi: 118, lat: 41.2825, lng: 69.2081, zoom: 14 },
    { id: 'yunusobod', name: "Yunusobod tumani", trees: 15300, reports: 5, aqi: 110, lat: 41.3653, lng: 69.2888, zoom: 14 },
    { id: 'mirzo', name: "Mirzo Ulug‘bek tumani", trees: 11200, reports: 12, aqi: 125, lat: 41.3283, lng: 69.3325, zoom: 14 },
    { id: 'yashnobod', name: "Yashnobod tumani", trees: 5800, reports: 6, aqi: 135, lat: 41.2950, lng: 69.3200, zoom: 14 },
    { id: 'sergeli', name: "Sergeli tumani", trees: 4170, reports: 3, aqi: 130, lat: 41.2210, lng: 69.2220, zoom: 14 },
  ];

  const currentStats = districts.find(d => d.id === selectedDistrict) || districts[0];

  // Initialize and update Leaflet Map for Tashkent
  useEffect(() => {
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
  }, [selectedDistrict]);

  // Clean up Leaflet map instance on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className={`rounded-3xl p-5 sm:p-6 border-2 flex ${
        isMobile ? 'flex-col items-start gap-3' : 'flex-col sm:flex-row items-center justify-between gap-4'
      } ${
        isDark ? 'eco-card-dark' : 'eco-card-light'
      }`}>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
            <Building2 className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className={`text-lg sm:text-xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>{t.gov_title}</h2>
              <span className="text-xs bg-emerald-600 text-white px-3 py-0.5 rounded-full font-black">
                {t.gov_badge}
              </span>
            </div>
            <p className={`text-xs font-semibold mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{t.gov_sub}</p>
          </div>
        </div>

        <button 
          onClick={() => alert(t.gov_btn_export + "...")}
          className={`${isMobile ? 'w-full justify-center' : ''} px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs font-black border-2 border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 dark:bg-slate-800 dark:text-white dark:border-slate-700 flex items-center gap-2 transition cursor-pointer`}
        >
          <Download className="w-4 h-4 text-emerald-600" />
          <span>{t.gov_btn_export}</span>
        </button>
      </div>

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

      {/* Reports Table */}
      <div className={`rounded-3xl p-6 border-2 space-y-4 ${isDark ? 'eco-card-dark' : 'eco-card-light'}`}>
        <h3 className={`font-black text-base ${isDark ? 'text-white' : 'text-slate-950'}`}>{t.gov_tbl_title}</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`uppercase tracking-wider font-black border-b ${
              isDark ? 'bg-slate-900 text-emerald-300 border-slate-800' : 'bg-emerald-100 text-emerald-950 border-emerald-200'
            }`}>
              <tr>
                <th className="py-4 px-5">{t.gov_tbl_date}</th>
                <th className="py-4 px-5">{t.gov_tbl_loc}</th>
                <th className="py-4 px-5">{t.gov_tbl_issue}</th>
                <th className="py-4 px-5">{t.gov_tbl_conf}</th>
                <th className="py-4 px-5">{t.gov_tbl_status}</th>
              </tr>
            </thead>
            <tbody className={`divide-y font-semibold ${isDark ? 'divide-slate-800 text-slate-200' : 'divide-emerald-100 text-slate-800'}`}>
              {[
                { time: "18:30", loc: "Chilonzor 9-mavze", issue: t.gov_rep_tree_cut, conf: "99.1%", status: t.gov_st_en_route, badge: "bg-amber-100 text-amber-950 border-amber-300" },
                { time: "15:10", loc: "Yunusobod 4-mavze", issue: t.gov_rep_waste_burn, conf: "96.4%", status: t.gov_st_fined, badge: "bg-rose-100 text-rose-950 border-rose-300" },
                { time: "11:20", loc: "Mirzo Ulug‘bek parki", issue: t.gov_rep_dry_sapling, conf: "94.2%", status: t.gov_st_resolved, badge: "bg-emerald-100 text-emerald-950 border-emerald-300" },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-500/5 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-500">{row.time}</td>
                  <td className={`py-3 px-4 font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>{row.loc}</td>
                  <td className="py-3 px-4">{row.issue}</td>
                  <td className="py-3 px-4 font-mono font-black text-emerald-600">{row.conf}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black border-2 ${row.badge}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
