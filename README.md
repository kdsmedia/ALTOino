# ALTOino Pro - Advanced AI Arduino IDE

ALTOino Pro adalah platform pengembangan Arduino berbasis web yang ditenagai oleh AI (Gemini 3 Pro) untuk membantu pengembang membuat kode, merakit hardware, dan mensimulasikan logika mikrokontroler secara instan.

## 🚀 Fitur Utama
- **AI Arduino Generator**: Membuat kode `.ino` kompleks hanya dengan perintah suara/teks.
- **Dynamic Wiring Guide**: Skema tabel pengkabelan yang dibuat otomatis sesuai hardware aktif.
- **Earning System**: Saldo (IDR) untuk pengguna melalui check-in harian dan sistem referral.
- **Cloud Storage**: Sinkronisasi proyek secara real-time menggunakan Firebase.
- **Virtual Workbench**: Simulasi status pin dan monitoring sistem secara visual.

## 🛠️ Persiapan Lokal
1. Clone repositori ini ke komputer Anda.
2. Pastikan [Node.js](https://nodejs.org/) sudah terinstal.
3. Jalankan perintah `npm install` untuk menginstal semua dependensi.
4. Buat file `.env` di root folder dan tambahkan kunci API Anda:
   ```env
   API_KEY=AIzaSyBUg_fDnLhxmxdZD0kDdWVBKMF1ewJwa2o
   ```
5. Jalankan `npm run dev` untuk memulai server pengembangan.

## 📦 Deployment
Aplikasi ini dirancang untuk dapat langsung dideploy ke platform modern:
1. **Vercel/Netlify**: Hubungkan repositori GitHub Anda dan atur **Environment Variable** `API_KEY` di dashboard.
2. **Build Manual**: Jalankan `npm run build` dan unggah folder `dist` ke hosting Anda.

## 🔐 Keamanan & Admin
- Akun dengan email `appsidhanie@gmail.com` akan otomatis mendapatkan akses ke **Admin Panel** untuk memproses penarikan saldo pengguna.
- API Key dikelola secara aman melalui environment variables dan tidak terpapar di sisi klien dalam kode statis.

---
**© 2025 Altomedia Engineering**  
*Membangun masa depan IoT dengan kecerdasan buatan.*