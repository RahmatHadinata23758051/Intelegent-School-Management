# Requirements Document — ISMS-EWA Phase 1

## Introduction

ISMS-EWA (Intelligent School Management System with Early Warning Analytics) adalah sistem manajemen sekolah berbasis web yang dirancang untuk mendeteksi siswa berisiko secara dini melalui analitik akademik dan perilaku. Dokumen ini mendefinisikan kebutuhan untuk **Phase 1 — Backend Foundation**, yaitu pembangunan fondasi backend Laravel yang bersih, terstruktur, dan siap dikembangkan ke fase berikutnya.

Fondasi ini mencakup inisialisasi proyek Laravel 10, konfigurasi environment dengan SQLite, setup autentikasi berbasis token menggunakan Laravel Sanctum, pembuatan skema database inti, Eloquent Models, struktur folder yang scalable, serta dokumentasi teknis.

---

## Glossary

- **System**: Aplikasi backend ISMS-EWA berbasis Laravel 10
- **API**: Application Programming Interface yang diekspos melalui endpoint HTTP
- **Auth_Controller**: Controller yang menangani proses autentikasi (login, logout, me)
- **Sanctum**: Laravel Sanctum, library autentikasi token-based bawaan Laravel
- **Token**: Personal Access Token yang diterbitkan oleh Sanctum setelah login berhasil
- **Migration**: File Laravel yang mendefinisikan struktur tabel database secara programatik
- **Model**: Kelas Eloquent ORM yang merepresentasikan tabel database
- **User**: Entitas pengguna sistem (admin, guru, staf)
- **Student**: Entitas siswa yang dikelola dalam sistem
- **SchoolClass**: Entitas kelas sekolah yang mengelompokkan siswa
- **Grade**: Entitas nilai akademik siswa per mata pelajaran
- **Violation**: Entitas catatan pelanggaran/perilaku siswa
- **RiskScore**: Entitas skor risiko siswa yang dihitung dari data akademik dan perilaku
- **Seeder**: File Laravel untuk mengisi data awal ke database
- **role**: Atribut pada User yang menentukan peran (contoh: admin, teacher, staff)
- **severity**: Tingkat keparahan pelanggaran (contoh: low, medium, high)
- **risk_level**: Tingkat risiko siswa (contoh: low, medium, high)
- **Services**: Direktori `app/Services` yang dipersiapkan untuk business logic di fase berikutnya

---

## Requirements

### Requirement 1: Inisialisasi dan Konfigurasi Proyek Laravel

**User Story:** Sebagai developer, saya ingin proyek Laravel 10 yang bersih dan terkonfigurasi dengan benar, agar fondasi backend dapat dikembangkan lebih lanjut tanpa hambatan teknis.

#### Acceptance Criteria

1. THE System SHALL menggunakan Laravel versi 10 sebagai framework backend.
2. THE System SHALL menggunakan SQLite sebagai database dengan path `database/database.sqlite`.
3. WHEN proyek dijalankan dengan perintah `php artisan serve`, THE System SHALL merespons tanpa error pada endpoint `/api`.
4. THE System SHALL memiliki file `.env` yang terkonfigurasi dengan nilai `DB_CONNECTION=sqlite` dan `DB_DATABASE` mengarah ke file `database/database.sqlite`.
5. IF file `database/database.sqlite` tidak ditemukan saat migrasi dijalankan, THEN THE System SHALL membuat file tersebut secara otomatis atau memberikan instruksi yang jelas kepada developer.
6. THE System SHALL memiliki `APP_KEY` yang telah di-generate pada file `.env`.

---

### Requirement 2: Setup Autentikasi dengan Laravel Sanctum

**User Story:** Sebagai pengguna sistem, saya ingin dapat login dan mendapatkan token akses, agar saya dapat mengakses endpoint API yang terproteksi secara aman.

#### Acceptance Criteria

1. THE System SHALL menggunakan Laravel Sanctum untuk autentikasi berbasis token.
2. WHEN request `POST /api/auth/login` diterima dengan `email` dan `password` yang valid, THE Auth_Controller SHALL mengembalikan respons JSON yang berisi `token` dan data `user`.
3. WHEN request `POST /api/auth/login` diterima dengan kredensial yang tidak valid, THE Auth_Controller SHALL mengembalikan respons HTTP 401 dengan pesan error yang deskriptif.
4. WHEN request `POST /api/auth/logout` diterima dengan Token yang valid pada header `Authorization: Bearer {token}`, THE Auth_Controller SHALL mencabut Token tersebut dan mengembalikan respons HTTP 200.
5. WHEN request `GET /api/auth/me` diterima dengan Token yang valid pada header `Authorization: Bearer {token}`, THE Auth_Controller SHALL mengembalikan data User yang sedang terautentikasi dalam format JSON.
6. WHEN request `GET /api/auth/me` diterima tanpa Token atau dengan Token yang tidak valid, THE Auth_Controller SHALL mengembalikan respons HTTP 401.
7. THE System SHALL menyimpan password User dalam bentuk hash menggunakan algoritma bcrypt.
8. THE System SHALL mendaftarkan route autentikasi di bawah prefix `/api/auth`.

---

### Requirement 3: Database Migrations untuk Skema Inti

**User Story:** Sebagai developer, saya ingin semua tabel database inti terdefinisi melalui migrations Laravel, agar skema database dapat direproduksi secara konsisten di environment manapun.

#### Acceptance Criteria

1. THE System SHALL memiliki Migration untuk tabel `users` dengan kolom: `id`, `name`, `email` (unique), `password`, `role`, `timestamps`.
2. THE System SHALL memiliki Migration untuk tabel `school_classes` dengan kolom: `id`, `name`, `grade_level`, `homeroom_teacher_id` (foreign key ke `users.id`), `timestamps`.
3. THE System SHALL memiliki Migration untuk tabel `students` dengan kolom: `id`, `name`, `email` (unique), `student_id` (unique), `class_id` (foreign key ke `school_classes.id`), `timestamps`.
4. THE System SHALL memiliki Migration untuk tabel `grades` dengan kolom: `id`, `student_id` (foreign key ke `students.id`), `subject`, `score`, `semester`, `academic_year`, `timestamps`.
5. THE System SHALL memiliki Migration untuk tabel `violations` dengan kolom: `id`, `student_id` (foreign key ke `students.id`), `description`, `severity`, `reported_by` (foreign key ke `users.id`), `reported_date`, `timestamps`.
6. THE System SHALL memiliki Migration untuk tabel `risk_scores` dengan kolom: `id`, `student_id` (foreign key ke `students.id`, unique), `total_score`, `academic_score`, `behavioral_score`, `risk_level`, `last_updated`, `timestamps`.
7. WHEN perintah `php artisan migrate` dijalankan, THE System SHALL menjalankan semua Migration tanpa error.
8. THE System SHALL mendefinisikan semua foreign key constraint dengan mengikuti konvensi penamaan Laravel.
9. IF perintah `php artisan migrate:fresh` dijalankan, THEN THE System SHALL menghapus dan membuat ulang semua tabel tanpa error.

---

### Requirement 4: Eloquent Models untuk Semua Entitas

**User Story:** Sebagai developer, saya ingin Eloquent Model tersedia untuk setiap tabel database, agar interaksi dengan database dapat dilakukan secara ekspresif dan konsisten menggunakan ORM.

#### Acceptance Criteria

1. THE System SHALL memiliki Model `User` dengan `$fillable` yang mendefinisikan kolom yang dapat diisi secara massal, dan `$hidden` yang menyembunyikan kolom `password` dan `remember_token`.
2. THE System SHALL memiliki Model `SchoolClass` dengan `$fillable` yang sesuai dengan kolom tabel `school_classes`.
3. THE System SHALL memiliki Model `Student` dengan `$fillable` yang sesuai dengan kolom tabel `students`.
4. THE System SHALL memiliki Model `Grade` dengan `$fillable` yang sesuai dengan kolom tabel `grades`.
5. THE System SHALL memiliki Model `Violation` dengan `$fillable` yang sesuai dengan kolom tabel `violations`.
6. THE System SHALL memiliki Model `RiskScore` dengan `$fillable` yang sesuai dengan kolom tabel `risk_scores`.
7. THE System SHALL mendefinisikan relasi Eloquent pada setiap Model sesuai dengan foreign key yang ada (contoh: `Student` belongsTo `SchoolClass`, `Grade` belongsTo `Student`).
8. THE System SHALL menempatkan semua Model di direktori `app/Models`.

---

### Requirement 5: Struktur Folder yang Clean dan Scalable

**User Story:** Sebagai developer, saya ingin struktur folder proyek yang terorganisir dan mengikuti konvensi Laravel, agar pengembangan di fase berikutnya dapat dilakukan dengan mudah dan konsisten.

#### Acceptance Criteria

1. THE System SHALL memiliki direktori `app/Services` yang siap digunakan untuk business logic di fase berikutnya.
2. THE System SHALL memiliki direktori `app/Http/Controllers` dengan `AuthController` sebagai controller autentikasi.
3. THE System SHALL memiliki direktori `app/Http/Requests` yang siap digunakan untuk Form Request Validation.
4. THE System SHALL menempatkan semua route API di file `routes/api.php`.
5. THE System SHALL memiliki `LoginRequest` di direktori `app/Http/Requests` untuk memvalidasi input login (`email` wajib dan berformat email, `password` wajib).

---

### Requirement 6: Database Seeder untuk Data Awal

**User Story:** Sebagai developer, saya ingin data awal tersedia setelah menjalankan seeder, agar saya dapat langsung menguji endpoint autentikasi tanpa perlu membuat data secara manual.

#### Acceptance Criteria

1. THE System SHALL memiliki `UserSeeder` yang membuat minimal satu User dengan role `admin` untuk keperluan pengujian.
2. THE System SHALL menyimpan password User pada Seeder dalam bentuk hash menggunakan `Hash::make()`.
3. WHEN perintah `php artisan db:seed` dijalankan, THE System SHALL mengisi tabel `users` dengan data awal tanpa error.
4. THE System SHALL mendokumentasikan kredensial User default (email dan password plaintext) di file dokumentasi `docs/phase-1-foundation.md`.

---

### Requirement 7: Dokumentasi Teknis Phase 1

**User Story:** Sebagai developer, saya ingin dokumentasi teknis yang lengkap tersedia di folder `docs/`, agar siapapun yang bergabung ke proyek dapat memahami setup dan menjalankan proyek dengan cepat.

#### Acceptance Criteria

1. THE System SHALL memiliki file `docs/phase-1-foundation.md` yang berisi penjelasan setup proyek.
2. THE System SHALL mendokumentasikan struktur folder proyek beserta penjelasan singkat setiap direktori utama di `docs/phase-1-foundation.md`.
3. THE System SHALL mendokumentasikan penjelasan setiap Migration (nama tabel, kolom, dan relasi) di `docs/phase-1-foundation.md`.
4. THE System SHALL mendokumentasikan langkah-langkah cara menjalankan proyek (clone, install, konfigurasi `.env`, migrate, seed, serve) di `docs/phase-1-foundation.md`.
5. THE System SHALL mendokumentasikan semua endpoint autentikasi yang tersedia (method, path, request body, response) di `docs/phase-1-foundation.md`.
6. THE System SHALL mendokumentasikan kredensial default untuk pengujian di `docs/phase-1-foundation.md`.
7. THE System SHALL menulis seluruh konten `docs/phase-1-foundation.md` dalam Bahasa Indonesia.
