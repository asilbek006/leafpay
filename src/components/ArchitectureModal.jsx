import React, { useState } from 'react';
import { 
  Layers, 
  X, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Network, 
  CheckCircle
} from 'lucide-react';

export default function ArchitectureModal({ t, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('flow');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-3xl bg-white dark:bg-[#0b1710] text-slate-900 dark:text-slate-100 shadow-2xl border-2 border-emerald-500/40 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                {t.arch_title}
                <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-3 py-0.5 rounded-full border border-emerald-500/30">
                  {t.arch_badge}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.arch_sub}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto border-b border-emerald-500/10 bg-slate-50/50 dark:bg-slate-950/60 px-4 text-xs font-bold scrollbar-none">
          {[
            { id: 'flow', label: t.arch_tab_flow, icon: Network },
            { id: 'why', label: t.arch_tab_why, icon: ShieldCheck },
            { id: 'tech', label: t.arch_tab_tech, icon: Cpu },
            { id: 'db', label: t.arch_tab_db, icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3.5 px-4 border-b-2 whitespace-nowrap transition cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {activeTab === 'flow' && (
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
                  {t.arch_flow_heading}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.arch_flow_sub}
                </p>
              </div>

              {/* Step by step interactive cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div className="p-4 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 space-y-2 text-center">
                  <div className="text-2xl">🪪</div>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{t.arch_step1_t}</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                    {t.arch_step1_d}
                  </p>
                </div>

                <div className="p-4 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 space-y-2 text-center">
                  <div className="text-2xl">📸</div>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{t.arch_step2_t}</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                    {t.arch_step2_d}
                  </p>
                </div>

                <div className="p-4 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 space-y-2 text-center">
                  <div className="text-2xl">🤖</div>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{t.arch_step3_t}</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                    {t.arch_step3_d}
                  </p>
                </div>

                <div className="p-4 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 space-y-2 text-center">
                  <div className="text-2xl">🪙</div>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{t.arch_step4_t}</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                    {t.arch_step4_d}
                  </p>
                </div>

                <div className="p-4 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 space-y-2 text-center">
                  <div className="text-2xl">🚇</div>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{t.arch_step5_t}</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                    {t.arch_step5_d}
                  </p>
                </div>
              </div>

              {/* Intuitive Architecture Box */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs">
                <div className="text-emerald-600 dark:text-emerald-400 font-bold mb-2">
                  // Data Pipeline Architecture:
                </div>
                <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  [Mobile Web PWA] ➔ [API Gateway: Rate-Limit 3/day] ➔ [OneID Auth: PINFL]<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;↳ [AI Verification: YOLOv8 Object Detection] ➔ [pHash: Duplicate Check]<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ [PostGIS: Geo-Fencing Valid] ➔ [Wallet +15 Coins] ➔ [Live Map Updated]
                </div>
              </div>
            </div>
          )}

          {activeTab === 'why' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {t.arch_why_heading}
              </h3>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/30">
                  <div className="font-bold text-emerald-800 dark:text-emerald-300 text-sm mb-1">
                    {t.arch_q1}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {t.arch_a1}
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/30">
                  <div className="font-bold text-emerald-800 dark:text-emerald-300 text-sm mb-1">
                    {t.arch_q2}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {t.arch_a2}
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/30">
                  <div className="font-bold text-emerald-800 dark:text-emerald-300 text-sm mb-1">
                    {t.arch_q3}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {t.arch_a3}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tech' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Production-Ready Tech Stack:
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 mb-1">Backend & API</div>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <li>• Python Django 5 + Django REST Framework</li>
                    <li>• Celery + Redis (Asynchronous queue)</li>
                    <li>• OneID OAuth2 OIDC Auth Protocol</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 mb-1">Database & Storage</div>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <li>• PostgreSQL 16 + PostGIS Spatial Geofencing</li>
                    <li>• Redis (Rate limits, Dynamic QR tokens)</li>
                    <li>• Cloudflare R2 / S3 (Encrypted photo storage)</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 mb-1">AI & Computer Vision</div>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <li>• YOLOv8 (Saplings and foliage detection)</li>
                    <li>• pHash (Perceptual Hashing duplicate prevention)</li>
                    <li>• Face & License plate automatic blurring</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 mb-1">Frontend & Clients</div>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <li>• React 19 + Tailwind CSS + PWA (Camera & GPS)</li>
                    <li>• Leaflet + OpenStreetMap geo-monitoring</li>
                    <li>• Real-time Dynamic QR code scanner</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'db' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Relational Database Models:
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 mb-1">1. Users (OneID)</div>
                  <div>- id (UUID PK)</div>
                  <div>- pinfl (VARCHAR UNIQUE)</div>
                  <div>- full_name (VARCHAR)</div>
                  <div>- phone (VARCHAR)</div>
                  <div>- eco_coins (INT)</div>
                </div>

                <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 mb-1">2. Actions</div>
                  <div>- id (UUID PK)</div>
                  <div>- user_id (FK)</div>
                  <div>- type (TREE/CLEAN)</div>
                  <div>- location (Point)</div>
                  <div>- phash_hash (VARCHAR)</div>
                  <div>- status (APPROVED)</div>
                </div>

                <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 mb-1">3. Coupons</div>
                  <div>- id (UUID PK)</div>
                  <div>- partner_id (FK)</div>
                  <div>- title (Metro/Safia)</div>
                  <div>- cost_coins (INT)</div>
                  <div>- dynamic_qr (VARCHAR)</div>
                  <div>- is_used (BOOLEAN)</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>OWASP Top 10 & E-Government Standards Compliant</span>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full transition cursor-pointer"
          >
            {t.arch_close_btn}
          </button>
        </div>
      </div>
    </div>
  );
}
