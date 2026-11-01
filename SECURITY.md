# 🛡️ LeafPay.uz — Kiberxavfsizlik va Himoya Arxitekturasi (Cyber Defense & Security Policy)

> **LeafPay** — O‘zbekiston Respublikasi ekologik tashabbuslarini raqamlashtirish, fuqarolarni rag‘batlantirish va biznes hamkorlar (Safia, Korzinka, Toshkent Metropoliteni) o‘rtasida shaffof, xavfsiz almashinuvni ta’minlovchi Green-FinTech ekotizimi.

Ushbu hujjat LeafPay platformasining kiber-hujumlarga qarshi ko‘p bosqichli himoya qatlamlarini (Multi-Layer Zero-Trust Cyber Defense) tavsiflaydi.

---

## 1. Kiberxavfsizlik Arxitekturasi (5 Qatlamli Himoya)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. EDGE & NETWORK LAYER (Cloudflare DDoS & Bot Shield)      │
│    • L3/L4/L7 DDoS Attack Protection                        │
│    • Reverse Proxy - Real IP yashirin                       │
│    • SSL/TLS 1.3 Strict HTTPS Encryption                    │
├─────────────────────────────────────────────────────────────┤
│ 2. HTTP SECURITY HEADERS & BROWSER SECURITY                 │
│    • Content-Security-Policy (CSP) whitelist                │
│    • X-Content-Type-Options: nosniff                        │
│    • X-Frame-Options: SAMEORIGIN (Anti-Clickjacking)        │
│    • Permissions-Policy (Camera & Geolocation restrict)     │
├─────────────────────────────────────────────────────────────┤
│ 3. INPUT VALIDATION & ANTI-XSS / INJECTION                  │
│    • Strict Phone Number Sanitization (+998 XX YYY YY YY)   │
│    • Alphanumeric Coupon Token Filter ([A-Za-z0-9-_])       │
│    • HTML / Script injection stripping in User Profiles     │
├─────────────────────────────────────────────────────────────┤
│ 4. PAYLOAD & ANTI-MALWARE VERIFICATION                      │
│    • Strict Image MIME validation (JPG, PNG, WEBP only)     │
│    • 8MB Max payload cap (Decompression Bomb protection)    │
│    • SVG script injection execution blocked                │
├─────────────────────────────────────────────────────────────┤
│ 5. ANTI-FRAUD & ZERO-TRUST ECO-COIN ENGINE                  │
│    • Live GPS Geofencing (Uzbekistan Bounding Box Check)    │
│    • Perceptual Hash (pHash) Duplicate Photo Interception   │
│    • Dynamic 60-Second Cryptographic QR Tokens (CSPRNG)     │
│    • Immutable Single-Use Redemption Registry               │
│    • Rate Limiting (Daily 3-action cap per citizen)         │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Kiber-Hujumlar va Qo‘llanilgan Himoya Choralari

### 2.1. DDoS va Tarmoq Hujumlari (L3 / L4 / L7 DDoS)
- **Hujum ssenariysi:** Botnet tarmoqlari orqali serverni soxta so‘rovlar bilan to‘ldirib, tizimni ishdan chiqarish.
- **Himoya:** Cloudflare Edge tarmog‘i orqali barcha trafik filtrlanadi. Haqiqiy server IP manzili yashirilgan. Avtomatik bot detection va rate-limiting ishlaydi.

### 2.2. XSS (Cross-Site Scripting) va Injection
- **Hujum ssenariysi:** Ro‘yxatdan o‘tish (ism, telefon) yoki kupon kiritish orqali `<script>` teglarini yuborib fuqarolar ma’lumotlarini o‘g‘irlash.
- **Himoya:**
  - `RegisterModal`: Barcha foydalanuvchi ma’lumotlari `replace(/[<>{}"'`;\\]/g, '')` filtrlari orqali tozalanadi.
  - `PartnerPortal`: Kupon kodi faqat `[A-Za-z0-9\-_]` simvollariga cheklangan.
  - CSP (Content Security Policy) notanish domendan skript yuklanishini to‘liq bloklaydi.

### 2.3. Clickjacking va MIME-Sniffing
- **Hujum ssenariysi:** Saytni soxta iframe ichiga yashirib fuqarolar nomidan harakat sodir etish.
- **Himoya:**
  - `X-Frame-Options: SAMEORIGIN`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`

### 2.4. Qalbaki GPS va Geolocation Spoofing (Eko-Firibgarlik)
- **Hujum ssenariysi:** Hujumchi o‘tirmagan joyidan soxta GPS koordinatalari yuborib noqonuniy Eco-Coin yig‘ishga urinishi.
- **Himoya:**
  - **Uzbekistan Geofencing Bounding Box:** Kenglik `[37.0, 45.6]` va uzunlik `[56.0, 73.5]` oralig‘i qat’iy tekshiriladi. Chegaradan tashqari har qanday koordinata avtomatik qizil belgi bilan bloklanadi.
  - GPS aniqlik tekshiruvi (`coords.accuracy`).

### 2.5. Ziyonkor Fayl Yuklash (Malicious File Upload / Web Shell)
- **Hujum ssenariysi:** Rasm o‘rniga `.php`, `.sh`, `.exe` yoki ziyonkor `.svg` yuklash orqali server yoki mijoz brauzerini nazoratga olish.
- **Himoya:**
  - MIME-type qat’iy tekshiruvi: faqat `image/jpeg`, `image/png`, `image/webp`.
  - Fayl hajmi 8 MB dan oshmasligi tekshiriladi (Buffer overflow / RAM exhaustion himoyasi).

### 2.6. Kuponlarni Soxtalashtirish va Qayta Ishlatish (Replay & Double-Spending Attack)
- **Hujum ssenariysi:** Bitta kuponni skrinshot qilib olib, bir nechta Safia yoki metro bekatlarida qayta-qayta ishlatish, yoki kupon kodlarini taxmin qilish (brute-force).
- **Himoya:**
  - **CSPRNG (Cryptographically Secure Pseudo-Random Number Generator):** `window.crypto.getRandomValues` orqali 100,000 dan 999,999 gacha yuqori entropiyali tokenlar yaratiladi.
  - **60 soniyalik Dinamik Taymer:** Kupon faqat 60 soniya faol turadi va dinamik yangilanadi.
  - **Yagona Foydalanish Registri (Single-Use Registry):** Kupon birinchi marta tekshirilishi bilanoq tizim bazasida `USED` holatiga o‘tkaziladi. Ikkinchi urinish darhol "Qayta ishlatish bloklandi!" xatosi bilan to‘xtatiladi.

---

## 3. Aloqa va Kiber-Hodisa Xabarnomasi
Xavfsizlik bo‘yicha zaifliklar yoki hisobotlar uchun:
- **Xavfsizlik xizmati:** `security@leafpay.uz`
- **Toshkent, O‘zbekiston**
