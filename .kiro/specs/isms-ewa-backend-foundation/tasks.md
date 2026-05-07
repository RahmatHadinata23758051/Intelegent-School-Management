# Implementation Plan: ISMS-EWA Backend Foundation (Phase 1)

## Overview

Rencana implementasi ini membangun fondasi backend Laravel 10 untuk sistem ISMS-EWA secara bertahap dan incremental. Setiap task membangun di atas task sebelumnya, dimulai dari inisialisasi proyek hingga property-based tests. Semua kode ditulis dalam PHP menggunakan framework Laravel 10.

**Bahasa implementasi:** PHP 8.1+ / Laravel 10  
**Database:** SQLite (`database/database.sqlite`)  
**Autentikasi:** Laravel Sanctum

---

## Tasks

- [x] 1. Inisialisasi proyek Laravel 10 dan konfigurasi environment
  - Buat proyek Laravel 10 baru menggunakan `composer create-project laravel/laravel:^10.0 isms-ewa-backend`
  - Buat file `database/database.sqlite` kosong
  - Konfigurasi file `.env`: set `DB_CONNECTION=sqlite`, `DB_DATABASE` mengarah ke path absolut `database/database.sqlite`, dan hapus konfigurasi DB lain yang tidak relevan
  - Jalankan `php artisan key:generate` untuk mengisi `APP_KEY`
  - Verifikasi proyek berjalan tanpa error dengan `php artisan serve` (cukup cek tidak ada error saat boot)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 2. Install dan konfigurasi Laravel Sanctum
  - Install Sanctum via Composer: `composer require laravel/sanctum`
  - Publish konfigurasi Sanctum: `php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"`
  - Tambahkan `HasApiTokens` trait ke model `User` yang sudah ada
  - Pastikan middleware `auth:sanctum` tersedia untuk digunakan di routes
  - _Requirements: 2.1_

- [ ] 3. Buat database migrations untuk semua tabel inti
  - [x] 3.1 Buat migration untuk tabel `users`
    - Modifikasi migration `users` bawaan Laravel (atau buat baru jika belum ada) dengan kolom: `id`, `name`, `string('email')->unique()`, `password`, `string('role', 50)`, `timestamps`
    - _Requirements: 3.1_

  - [x] 3.2 Buat migration untuk tabel `school_classes`
    - Buat file migration baru dengan kolom: `id`, `string('name')`, `string('grade_level', 50)`, `foreignId('homeroom_teacher_id')->constrained('users')`, `timestamps`
    - _Requirements: 3.2_

  - [x] 3.3 Buat migration untuk tabel `students`
    - Buat file migration baru dengan kolom: `id`, `string('name')`, `string('email')->unique()`, `string('student_id', 50)->unique()`, `foreignId('class_id')->constrained('school_classes')`, `timestamps`
    - _Requirements: 3.3_

  - [x] 3.4 Buat migration untuk tabel `grades`
    - Buat file migration baru dengan kolom: `id`, `foreignId('student_id')->constrained('students')`, `string('subject')`, `decimal('score', 5, 2)`, `string('semester', 10)`, `string('academic_year', 20)`, `timestamps`
    - _Requirements: 3.4_

  - [x] 3.5 Buat migration untuk tabel `violations`
    - Buat file migration baru dengan kolom: `id`, `foreignId('student_id')->constrained('students')`, `text('description')`, `string('severity', 20)`, `foreignId('reported_by')->constrained('users')`, `date('reported_date')`, `timestamps`
    - _Requirements: 3.5_

  - [x] 3.6 Buat migration untuk tabel `risk_scores`
    - Buat file migration baru dengan kolom: `id`, `foreignId('student_id')->constrained('students')->unique()`, `decimal('total_score', 5, 2)`, `decimal('academic_score', 5, 2)`, `decimal('behavioral_score', 5, 2)`, `string('risk_level', 20)`, `timestamp('last_updated')`, `timestamps`
    - _Requirements: 3.6_

  - [x] 3.7 Jalankan semua migrations
    - Jalankan `php artisan migrate` dan pastikan semua 6 tabel terbuat tanpa error
    - Verifikasi `php artisan migrate:fresh` juga berjalan tanpa error
    - _Requirements: 3.7, 3.8, 3.9_

- [ ] 4. Buat Eloquent Models untuk semua entitas
  - [x] 4.1 Buat atau modifikasi Model `User`
    - Pastikan `app/Models/User.php` memiliki `$fillable = ['name', 'email', 'password', 'role']`
    - Pastikan `$hidden = ['password', 'remember_token']`
    - Tambahkan relasi: `homeroomClasses()` → `hasMany(SchoolClass::class, 'homeroom_teacher_id')` dan `reportedViolations()` → `hasMany(Violation::class, 'reported_by')`
    - _Requirements: 4.1, 4.7, 4.8_

  - [x] 4.2 Buat Model `SchoolClass`
    - Buat `app/Models/SchoolClass.php` dengan `$fillable = ['name', 'grade_level', 'homeroom_teacher_id']`
    - Tambahkan relasi: `homeroomTeacher()` → `belongsTo(User::class, 'homeroom_teacher_id')` dan `students()` → `hasMany(Student::class, 'class_id')`
    - _Requirements: 4.2, 4.7, 4.8_

  - [x] 4.3 Buat Model `Student`
    - Buat `app/Models/Student.php` dengan `$fillable = ['name', 'email', 'student_id', 'class_id']`
    - Tambahkan relasi: `schoolClass()` → `belongsTo(SchoolClass::class, 'class_id')`, `grades()` → `hasMany(Grade::class)`, `violations()` → `hasMany(Violation::class)`, `riskScore()` → `hasOne(RiskScore::class)`
    - _Requirements: 4.3, 4.7, 4.8_

  - [x] 4.4 Buat Model `Grade`
    - Buat `app/Models/Grade.php` dengan `$fillable = ['student_id', 'subject', 'score', 'semester', 'academic_year']`
    - Tambahkan relasi: `student()` → `belongsTo(Student::class)`
    - _Requirements: 4.4, 4.7, 4.8_

  - [x] 4.5 Buat Model `Violation`
    - Buat `app/Models/Violation.php` dengan `$fillable = ['student_id', 'description', 'severity', 'reported_by', 'reported_date']`
    - Tambahkan relasi: `student()` → `belongsTo(Student::class)` dan `reporter()` → `belongsTo(User::class, 'reported_by')`
    - _Requirements: 4.5, 4.7, 4.8_

  - [x] 4.6 Buat Model `RiskScore`
    - Buat `app/Models/RiskScore.php` dengan `$fillable = ['student_id', 'total_score', 'academic_score', 'behavioral_score', 'risk_level', 'last_updated']`
    - Tambahkan relasi: `student()` → `belongsTo(Student::class)`
    - _Requirements: 4.6, 4.7, 4.8_

- [x] 5. Checkpoint — Verifikasi migrations dan models
  - Pastikan semua tests pass, tanyakan kepada user jika ada pertanyaan.

- [x] 6. Buat LoginRequest untuk validasi input
  - Buat `app/Http/Requests/LoginRequest.php` menggunakan `php artisan make:request LoginRequest`
  - Implementasikan `authorize()` mengembalikan `true`
  - Implementasikan `rules()` dengan aturan: `email` → `['required', 'email']`, `password` → `['required']`
  - _Requirements: 5.3, 5.5_

- [x] 7. Buat AuthController dengan tiga method autentikasi
  - Buat `app/Http/Controllers/AuthController.php` menggunakan `php artisan make:controller AuthController`
  - Implementasikan method `login(LoginRequest $request)`:
    - Ambil kredensial dari request
    - Cari user berdasarkan email, verifikasi password dengan `Hash::check()`
    - Jika tidak valid, kembalikan respons JSON `{"message": "Kredensial tidak valid."}` dengan HTTP 401
    - Jika valid, buat token Sanctum dengan `$user->createToken('auth_token')->plainTextToken`
    - Kembalikan respons JSON `{"token": "...", "user": {...}}` dengan HTTP 200
  - Implementasikan method `logout(Request $request)`:
    - Cabut token aktif dengan `$request->user()->currentAccessToken()->delete()`
    - Kembalikan respons JSON `{"message": "Berhasil logout."}` dengan HTTP 200
  - Implementasikan method `me(Request $request)`:
    - Kembalikan data user yang terautentikasi dengan `$request->user()`
  - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.7_

- [x] 8. Setup routes di `routes/api.php`
  - Tambahkan route publik: `Route::post('/auth/login', [AuthController::class, 'login'])`
  - Tambahkan route terproteksi dalam group `Route::middleware('auth:sanctum')`:
    - `Route::post('/auth/logout', [AuthController::class, 'logout'])`
    - `Route::get('/auth/me', [AuthController::class, 'me'])`
  - Pastikan semua route berada di bawah prefix `/api` (sudah default di `routes/api.php`)
  - _Requirements: 2.8, 5.4_

- [x] 9. Buat UserSeeder dengan data admin awal
  - Buat atau modifikasi `database/seeders/UserSeeder.php`
  - Buat minimal satu user dengan data: `name`, `email` (contoh: `admin@isms.test`), `password` di-hash dengan `Hash::make('password')`, `role` = `admin`
  - Daftarkan `UserSeeder` di `DatabaseSeeder.php` agar dipanggil saat `php artisan db:seed`
  - Jalankan `php artisan db:seed` dan verifikasi user admin terbuat tanpa error
  - _Requirements: 6.1, 6.2, 6.3_

- [x] 10. Siapkan direktori `app/Services`
  - Buat direktori `app/Services/` dengan file `.gitkeep` agar direktori ter-commit ke git
  - Direktori ini kosong di Phase 1 dan akan diisi oleh service classes di fase berikutnya
  - _Requirements: 5.1_

- [x] 11. Checkpoint — Verifikasi autentikasi end-to-end
  - Pastikan semua tests pass, tanyakan kepada user jika ada pertanyaan.

- [ ] 12. Tulis feature tests untuk AuthController
  - [x] 12.1 Buat `AuthControllerTest` untuk skenario login valid
    - Buat `tests/Feature/AuthControllerTest.php`
    - Test: login dengan email dan password valid mengembalikan HTTP 200 dengan field `token` dan `user`
    - _Requirements: 2.2_

  - [ ]* 12.2 Tulis property test untuk Property 1: Login valid selalu mengembalikan token dan user
    - **Property 1: Login dengan kredensial valid selalu mengembalikan token dan data user**
    - Loop minimal 100 iterasi dengan user acak berbeda (gunakan `fake()`)
    - Setiap iterasi: buat user baru → login → verifikasi respons HTTP 200 mengandung `token` (string non-kosong) dan `user` (objek dengan `id`, `name`, `email`, `role`)
    - **Validates: Requirements 2.2**

  - [x] 12.3 Tulis test untuk skenario login tidak valid
    - Test: login dengan password salah mengembalikan HTTP 401
    - Test: login dengan email tidak terdaftar mengembalikan HTTP 401
    - _Requirements: 2.3_

  - [ ]* 12.4 Tulis property test untuk Property 2: Login tidak valid selalu mengembalikan HTTP 401
    - **Property 2: Login dengan kredensial tidak valid selalu mengembalikan HTTP 401**
    - Loop minimal 100 iterasi dengan kombinasi email/password acak yang tidak cocok dengan data di database
    - Setiap iterasi: verifikasi respons selalu HTTP 401
    - **Validates: Requirements 2.3**

  - [x] 12.5 Tulis test untuk skenario logout
    - Test: logout dengan token valid mengembalikan HTTP 200
    - Test: token tidak dapat digunakan setelah logout (request `/me` mengembalikan HTTP 401)
    - _Requirements: 2.4_

  - [ ]* 12.6 Tulis property test untuk Property 3: Logout mencabut token (round-trip)
    - **Property 3: Logout mencabut token sehingga tidak dapat digunakan kembali**
    - Loop minimal 100 iterasi dengan user acak
    - Setiap iterasi: buat user → login → logout → coba `/me` dengan token lama → verifikasi HTTP 401
    - **Validates: Requirements 2.4**

  - [x] 12.7 Tulis test untuk endpoint `/me`
    - Test: `/me` dengan token valid mengembalikan data user yang sesuai (id, name, email, role cocok)
    - Test: field `password` tidak muncul dalam respons
    - Test: `/me` tanpa token mengembalikan HTTP 401
    - _Requirements: 2.5, 2.6, 4.1_

  - [ ]* 12.8 Tulis property test untuk Property 4: `/me` mengembalikan data user yang sesuai dengan token
    - **Property 4: Endpoint /me mengembalikan data user yang sesuai dengan token**
    - Loop minimal 100 iterasi dengan user acak berbeda
    - Setiap iterasi: buat user → login → panggil `/me` → verifikasi `id`, `name`, `email`, `role` cocok dengan user yang login, dan field `password` tidak ada dalam respons
    - **Validates: Requirements 2.5, 4.1**

- [ ] 13. Tulis tests untuk validasi dan model
  - [x] 13.1 Buat `LoginRequestTest` untuk validasi input
    - Buat `tests/Feature/LoginRequestTest.php`
    - Test: request dengan email tidak valid (bukan format email) ditolak dengan HTTP 422
    - Test: request tanpa password ditolak dengan HTTP 422
    - Test: request tanpa email ditolak dengan HTTP 422
    - _Requirements: 5.5_

  - [ ]* 13.2 Tulis property test untuk Property 6: LoginRequest menolak semua input tidak valid
    - **Property 6: LoginRequest menolak semua input yang tidak valid**
    - Loop minimal 100 iterasi dengan kombinasi input tidak valid acak (email bukan format email, password kosong, atau keduanya)
    - Setiap iterasi: verifikasi request tidak mencapai controller (respons HTTP 422)
    - **Validates: Requirements 5.5**

  - [x] 13.3 Buat `UserModelTest` untuk mass assignment dan hidden fields
    - Buat `tests/Unit/UserModelTest.php`
    - Test: mass assignment hanya mengisi kolom yang ada di `$fillable`
    - Test: field `password` dan `remember_token` tidak muncul saat model di-serialize ke JSON
    - _Requirements: 4.1_

  - [ ]* 13.4 Tulis property test untuk Property 5: Password selalu disimpan dalam bentuk hash bcrypt
    - **Property 5: Password user selalu disimpan dalam bentuk hash bcrypt**
    - Loop minimal 100 iterasi dengan password plaintext acak
    - Setiap iterasi: buat user dengan password acak → ambil nilai `password` dari database → verifikasi nilai tersimpan tidak sama dengan plaintext → verifikasi `Hash::check($plaintext, $hashed)` mengembalikan `true`
    - **Validates: Requirements 2.7, 6.2**

  - [ ]* 13.5 Tulis property test untuk Property 7: Mass assignment hanya mengisi kolom di `$fillable`
    - **Property 7: Mass assignment model hanya mengisi kolom yang ada di $fillable**
    - Loop minimal 100 iterasi dengan data acak yang mengandung kolom di luar `$fillable`
    - Setiap iterasi: lakukan mass assignment pada setiap Model (User, SchoolClass, Student, Grade, Violation, RiskScore) → verifikasi hanya kolom `$fillable` yang tersimpan
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6**

  - [x] 13.6 Buat `StudentModelTest` untuk relasi Eloquent
    - Buat `tests/Unit/StudentModelTest.php`
    - Test: relasi `schoolClass()` mengembalikan instance `SchoolClass` dengan `id` yang sesuai dengan `class_id`
    - Test: relasi `grades()` mengembalikan collection `Grade` yang benar
    - Test: relasi `violations()` mengembalikan collection `Violation` yang benar
    - Test: relasi `riskScore()` mengembalikan instance `RiskScore` yang benar
    - _Requirements: 4.7_

  - [ ]* 13.7 Tulis property test untuk Property 8: Relasi Eloquent mengembalikan instance yang benar
    - **Property 8: Relasi Eloquent mengembalikan instance yang benar**
    - Loop minimal 100 iterasi dengan pasangan entitas acak
    - Setiap iterasi: buat pasangan entitas terhubung (Student-SchoolClass, Grade-Student, Violation-Student, RiskScore-Student) → akses relasi Eloquent → verifikasi instance yang dikembalikan memiliki `id` yang sesuai dengan nilai foreign key yang tersimpan
    - **Validates: Requirements 4.7**

- [x] 14. Tulis smoke tests dan migration tests
  - Buat `tests/Feature/SmokeTest.php`
  - Test: verifikasi Laravel versi 10 digunakan
  - Test: verifikasi konfigurasi `DB_CONNECTION` adalah `sqlite`
  - Test: verifikasi semua 6 tabel ada di database setelah migrasi (`users`, `school_classes`, `students`, `grades`, `violations`, `risk_scores`)
  - Test: verifikasi semua route autentikasi terdaftar (`POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`)
  - Test: verifikasi semua file model ada di `app/Models/`
  - Test: verifikasi direktori `app/Services` dan `app/Http/Requests` ada
  - Test: verifikasi `UserSeeder` membuat user admin dengan password ter-hash
  - _Requirements: 1.1, 1.2, 3.7, 5.1, 5.2, 5.3, 6.1, 6.2, 6.3_

- [x] 15. Checkpoint — Pastikan semua tests pass
  - Jalankan `php artisan test` dan pastikan semua tests pass tanpa error.
  - Tanyakan kepada user jika ada pertanyaan sebelum melanjutkan.

- [x] 16. Buat dokumentasi teknis `docs/phase-1-foundation.md`
  - Buat direktori `docs/` dan file `docs/phase-1-foundation.md`
  - Tulis seluruh konten dalam Bahasa Indonesia, mencakup:
    - Penjelasan setup proyek (clone, install dependencies, konfigurasi `.env`, buat file SQLite, migrate, seed, serve)
    - Struktur folder proyek beserta penjelasan singkat setiap direktori utama
    - Penjelasan setiap migration (nama tabel, kolom, dan relasi)
    - Dokumentasi semua endpoint autentikasi (method, path, request body, contoh respons sukses dan gagal)
    - Kredensial default untuk pengujian (email dan password plaintext)
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

- [x] 17. Git commit dan push
  - Stage semua file yang relevan (kecuali `.env`, `database/database.sqlite`, `vendor/`, `node_modules/`)
  - Pastikan `.gitignore` sudah mengecualikan file sensitif dan generated files
  - Buat commit dengan pesan yang deskriptif, contoh: `feat: implement Phase 1 - Laravel backend foundation`
  - Push ke branch baru (jangan langsung ke `main`/`master`), contoh: `git push -u origin feat/phase-1-foundation`

- [x] 18. Checkpoint akhir — Verifikasi keseluruhan Phase 1
  - Pastikan semua tests pass, tanyakan kepada user jika ada pertanyaan.

---

## Notes

- Task yang ditandai dengan `*` bersifat opsional dan dapat dilewati untuk MVP yang lebih cepat
- Setiap task mereferensikan requirement spesifik untuk keterlacakan
- Property tests dijalankan minimal 100 iterasi menggunakan `fake()` dari Pest PHP / Faker
- Checkpoint memastikan validasi incremental sebelum melanjutkan ke tahap berikutnya
- Direktori `app/Services` sengaja dikosongkan di Phase 1 — akan diisi di Phase 2+
- Semua deskripsi task ditulis dalam Bahasa Indonesia sesuai konvensi proyek
