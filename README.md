# 🍃 LeafPay.uz — Yashil amal evaziga raqamli imtiyoz

[![React](https://img.shields.io/badge/React-18.x-61dafb?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.x-646cff?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-38b2ac?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?logo=leaflet&logoColor=white)](https://leafletjs.com)
[![Security Hardened](https://img.shields.io/badge/Security-Multi--Layer%20Hardened-emerald)](./SECURITY.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **LeafPay** — O‘zbekiston Respublikasida fuqarolarning ekologik faolligini (daraxt ekish, velosipedda yurish, chiqindilarni saralash) sun’iy intellekt (Vision AI) va geolokatsiya (GPS) orqali tekshirib, ularga raqamli **Eco-Coin** ballari hamda hamkor korxonalarda (Toshkent Metropoliteni, Safia, Korzinka) chegirmalar taqdim etuvchi Milliy Green-FinTech ekotizimi.

---

## 🌟 Asosiy Imkoniyatlar (Key Features)

1. **Fuqaro ilovasi (Citizen App v11):**
   - 📸 **Vision AI Tekshiruv:** Suratdagi ekologik amalni aniqlash va tekshirish.
   - 📍 **Jonli GPS va Geofencing:** OpenStreetMap / Leaflet integratsiyasi, foydalanuvchining Toshkentdagi aniq joylashuvini real vaqtda aniqlash.
   - 🔄 **pHash Dublikat Himoyasi:** Bir xil rasmni takroran yuklashni bloklash.
   - 🪙 **Eco-Bozor va Dinamik QR Kuponlar:** 60 soniyalik CSPRNG asosidagi xavfsiz bir martalik QR kuponlar.

2. **Hamkor Kabineti (Partner Portal):**
   - 🏪 Safia, Korzinka va Toshkent Metropoliteni uchun maxsus kassa moduli.
   - ⚡ **Bir martalik kupon verifikatsiyasi:** Kuponni bir marta ishlatilgandan so‘ng bazada bloklash (Anti-Double Spending).
   - 📊 ESG reytingi va tijoriy aylanma statistikasi.

3. **Vazirlik Boshqaruv Paneli (Ministry Dashboard):**
   - 🏛️ Ekologiya vazirligi va Toshkent shahar hokimligi uchun real vaqtli monitoring xaritasi.
   - 📈 Tumanlar kesimidagi ko‘kalamzorlashtirish ko‘rsatkichlari.
   - 📋 Fuqarolar hisobotlarini tasdiqlash va audit qilish.

4. **Kiberxavfsizlik va Himoya (Zero-Trust Security):**
   - Cloudflare DDoS & Bot Shield.
   - Qat’iy Content Security Policy (CSP), X-Frame-Options, X-Content-Type-Options.
   - XSS sanitizatsiyasi va O‘zbekiston hududiy GPS geofencing tekshiruvi.
   - To‘liq xavfsizlik arxitekturasi uchun [SECURITY.md](./SECURITY.md) fayliga qarang.

---

## 🚀 O‘rnatish va Ishga Tushirish (Quick Start)

### Talablar:
- Node.js 18+
- npm 9+

### Bosqichlar:

```bash
# 1. Repozitoriyani klonlash
git clone https://github.com/asilbek006/leafpay.git
cd leafpay

# 2. Bog‘liqliklarni o‘rnatish
npm install

# 3. Dasturchi rejimida ishga tushirish (Dev Server)
npm run dev

# 4. Ishlab chiqarish (Production) build qilish
npm run build
```

---

## 📱 Qo‘llab-quvvatlanadigan Tillari
- 🇺🇿 O‘zbekcha (Lotin) — To‘liq 100% lokalizatsiya
- 🇷🇺 Ruscha (Русский) — To‘liq 100% lokalizatsiya
- 🇬🇧 Inglizcha (English) — To‘liq 100% lokalizatsiya

---

## 👥 Muallif
- **Asilbek Davlatov** ([@asilbek006](https://github.com/asilbek006))
