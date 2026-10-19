# ⚙️ Backend API - Toko Baju

Folder ini berisi kode backend yang dibangun menggunakan **Next.js API Routes**. Tugas utama backend ini adalah menerima *request* dari frontend dan berkomunikasi dengan database MySQL di Aiven Cloud.

## 🗄️ Skema Database
Database menggunakan MySQL dengan tabel `baju`:
- `id` (INT, Auto Increment, Primary Key)
- `nama_baju` (VARCHAR)
- `kategori` (VARCHAR)
- `harga` (INT)
- `stok` (INT)
- `created_at` (TIMESTAMP)

## 🛣️ Endpoint API
- `GET /api/baju` : Mengambil semua data baju.
- `POST /api/baju` : Menambahkan data baju baru.
- `PUT /api/baju/[id]` : Mengupdate data baju berdasarkan ID.
- `DELETE /api/baju/[id]` : Menghapus data baju berdasarkan ID.

## 🛠️ Cara Menjalankan
1. Buat file `.env.local` di root folder ini dan isi dengan:
   ```env
   DB_HOST=mysql-xxxx.aivencloud.com
   DB_PORT=12345
   DB_USER=avnadmin
   DB_PASSWORD=password_anda
   DB_NAME=defaultdb