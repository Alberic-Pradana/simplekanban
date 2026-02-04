# Simple Kanban Board

Aplikasi Manajemen Tugas berbasis web yang sederhana namun fungsional, dibangun menggunakan **React** dan **Vite**. Aplikasi ini dirancang untuk membantu Anda mengatur tugas sehari-hari dengan metodologi Kanban.

## 🚀 Fitur Utama

- **Papan Kanban Interaktif**: Empat kolom status untuk alur kerja yang jelas:
  - 📝 **Tugas Tersedia**: Ide atau tugas yang belum dimulai.
  - 🚧 **Sedang Diproses**: Tugas yang sedang dikerjakan.
  - ⏳ **Pending**: Tugas yang tertunda.
  - ✅ **Selesai**: Tugas yang telah rampung.

- **Manajemen Tugas**:
  - Tambah, Edit, dan Hapus tugas dengan mudah.
  - Pindahkan tugas antar kolom (Drag & Drop atau tombol navigasi).

- **Fitur Checklist Cepat** ⚡:
  - Tombol checklist (<i class="fas fa-check"></i>) muncul pada tugas di kolom *Sedang Diproses* dan *Pending*.
  - Sekali klik langsung memindahkan tugas ke *Selesai*.

- **Sistem Arsip** 📦:
  - Arsipkan tugas yang sudah *Selesai* agar papan tetap rapi.
  - Akses tugas yang diarsipkan melalui tombol Arsip di header.
  - Pulihkan tugas kembali ke papan atau hapus secara permanen.

- **Backup & Restore**:
  - **Ekspor**: Simpan seluruh data tugas Anda ke dalam file JSON.
  - **Impor**: Pulihkan data tugas dari file JSON dengan mudah.

- **Penyimpanan Lokal**:
  - Data tersimpan otomatis di browser (IndexedDB), sehingga data tidak hilang saat halaman di-refresh.

## 🛠️ Teknologi yang Digunakan

- [React](https://reactjs.org/) - Library JavaScript untuk antarmuka pengguna
- [Vite](https://vitejs.dev/) - Build tool yang super cepat
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) - Penyimpanan database di sisi klien
- [FontAwesome](https://fontawesome.com/) - Ikon antarmuka yang modern

## 📦 Instalasi dan Dijalankan

Ikuti langkah-langkah ini untuk menjalankan proyek di komputer lokal Anda:

1.  **Clone repositori ini** (atau unduh file source code):
    ```bash
    git clone https://github.com/username/simple-kanban.git
    cd simple-kanban
    ```

2.  **Instal dependensi**:
    ```bash
    npm install
    ```

3.  **Jalankan server pengembangan**:
    ```bash
    npm run dev
    ```

4.  Buka browser dan kunjungi alamat yang muncul (biasanya `http://localhost:5173`).

## 📖 Panduan Penggunaan

1.  **Membuat Tugas**: Klik tombol **+ Add Task** di pojok kiri atas. Isi judul dan deskripsi.
2.  **Memindahkan Tugas**: Gunakan tombol panah kiri/kanan pada kartu tugas untuk memindahkan antar kolom.
3.  **Menyelesaikan Tugas**:
    - Jika tugas ada di *Sedang Diproses* atau *Pending*, klik ikon **Checklist** (✓) untuk langsung menyelesaikannya.
4.  **Mengarsipkan Tugas**:
    - Setelah tugas ada di kolom *Selesai*, klik ikon **Arsip** (kotak) untuk menyembunyikannya dari papan.
5.  **Melihat Arsip**:
    - Klik ikon **Kotak Arsip** di sebelah tombol Import/Export di header.
    - Anda bisa memulihkan (*Restore*) atau menghapus permanen tugas dari sini.

## 📄 Lisensi

Proyek ini dibuat untuk tujuan pembelajaran dan produktivitas pribadi.

---
