# PPNP Lab Equipment

Aplikasi mobile untuk mengelola inventaris peralatan laboratorium secara lokal menggunakan React Native, Expo, TypeScript, dan SQLite.

## Fitur

- Dashboard ringkasan inventaris dan statistik peminjaman.
- CRUD kategori alat dan laboratorium.
- CRUD inventaris alat dengan kode, kategori, laboratorium, jumlah, kondisi, foto, dan deskripsi.
- Pencarian serta filter berdasarkan kategori, laboratorium, dan kondisi.
- Pencatatan peminjaman dan pengembalian alat.
- Status peminjaman: `Dipinjam`, `Dikembalikan`, dan `Terlambat`.
- Riwayat perubahan kondisi setiap alat.
- Laporan berdasarkan kategori, laboratorium, kondisi, dan peminjaman.
- Penyimpanan lokal menggunakan SQLite tanpa backend.

## Teknologi

- React Native `0.86.2`
- Expo `~57.0.0`
- TypeScript `~5.9.0`
- React Navigation
- Expo SQLite
- Expo Image Picker

## Persyaratan

- Node.js dan npm.
- Android Studio dan emulator Android, atau Expo Go pada perangkat Android.
- macOS dan Xcode jika ingin menjalankan target iOS.

## Instalasi

1. Masuk ke folder proyek:

   ```bash
   cd "Sistem Inventaris Laboratorium Berbasis SQLite"
   ```

2. Install dependensi:

   ```bash
   npm install
   ```

3. Jalankan pemeriksaan TypeScript:

   ```bash
   npm run typecheck
   ```

## Menjalankan aplikasi

```bash
npm start
```

Perintah target yang tersedia:

```bash
npm run android   # Menjalankan pada emulator/perangkat Android
npm run ios       # Menjalankan pada simulator iOS
npm run web       # Menjalankan versi web
```

Setelah server berjalan, scan QR code menggunakan Expo Go atau tekan target yang sesuai pada terminal Expo.

## Database

Aplikasi membuat database SQLite `ppnp_lab.db` secara otomatis saat pertama kali dijalankan. Tabel yang digunakan:

- `categories` — data kategori alat.
- `laboratories` — data laboratorium.
- `equipments` — data inventaris alat.
- `borrowings` — transaksi peminjaman dan pengembalian.
- `condition_histories` — riwayat perubahan kondisi alat.

Database disimpan lokal pada perangkat. Menghapus data aplikasi atau melakukan uninstall dapat menghapus database lokal tersebut.

## Struktur proyek

```text
.
├── App.tsx                 # Entry point dan inisialisasi database
├── app.json                # Konfigurasi Expo
├── package.json            # Dependensi dan script proyek
└── src
    ├── components/         # Komponen UI yang dapat digunakan kembali
    ├── constants/          # Tema dan konstanta aplikasi
    ├── database/           # Koneksi dan skema SQLite
    ├── navigation/         # Navigasi tab dan stack
    ├── screens/            # Halaman aplikasi
    ├── services/           # Operasi data dan logika layanan
    ├── types/              # Definisi tipe TypeScript
    └── utils/              # Validasi dan utilitas aplikasi
```

## Alur penggunaan

1. Tambahkan kategori dan laboratorium.
2. Tambahkan alat inventaris dan hubungkan dengan kategori serta laboratorium.
3. Kelola kondisi alat dan catat setiap perubahan.
4. Buat transaksi peminjaman dari menu Peminjaman.
5. Tandai alat telah dikembalikan dari halaman detail peminjaman.
6. Gunakan Dashboard dan Laporan untuk melihat ringkasan data.

## Script npm

| Script | Keterangan |
| --- | --- |
| `npm start` | Menjalankan Expo development server |
| `npm run android` | Menjalankan target Android |
| `npm run ios` | Menjalankan target iOS |
| `npm run web` | Menjalankan target web |
| `npm run typecheck` | Memeriksa tipe TypeScript |

## Catatan

Proyek ini menggunakan penyimpanan lokal dan belum menyediakan autentikasi maupun sinkronisasi ke server. Untuk penggunaan multi-pengguna, diperlukan backend dan mekanisme sinkronisasi tambahan.

