# Dokumentasi Phase 1 — Backend Foundation ISMS-EWA

## Pengenalan

Dokumen ini menjelaskan setup, struktur, dan cara menjalankan backend ISMS-EWA Phase 1. Phase 1 berfokus pada pembangunan fondasi backend Laravel yang bersih dan scalable, dengan autentikasi berbasis token menggunakan Laravel Sanctum.

**Catatan Penting:** Phase 1 tidak mengimplementasikan business logic scoring, dashboard, atau reporting. Semua logika analitik akan diimplementasikan di fase berikutnya.

---

## Tujuan Phase 1

Membangun fondasi backend yang:
- ✅ Clean dan scalable
- ✅ Menggunakan naming convention yang konsisten
- ✅ Memiliki autentikasi berbasis token (Sanctum)
- ✅ Memiliki skema database inti yang siap untuk scoring
- ✅ Memiliki test coverage yang baik
- ✅ Terdokumentasi dengan baik

---

## Tech Stack Backend

- **Framework:** Laravel 10
- **Language:** PHP 8.1+
- **Database:** SQLite
- **Authentication:** Laravel Sanctum (token-based)
- **Testing:** PHPUnit + Pest PHP
- **ORM:** Eloquent

---

## Setup Proyek

### Prasyarat

- PHP 8.1 atau lebih tinggi
- Composer
- SQLite (sudah built-in di PHP)

### Langkah-Langkah Setup

#### 1. Clone Repository

```bash
git clone <repository-url>
cd isms-ewa-backend
```

#### 2. Install Dependencies

```bash
composer install
```

#### 3. Konfigurasi Environment

Copy file `.env.example` ke `.env`:

```bash
cp .env.example .env
```

Pastikan konfigurasi database di `.env` sudah benar:

```env
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

#### 4. Generate Application Key

```bash
php artisan key:generate
```

#### 5. Buat File SQLite Database

```bash
touch database/database.sqlite
```

#### 6. Jalankan Migrations

```bash
php artisan migrate
```

#### 7. Jalankan Seeder

Untuk membuat user admin default:

```bash
php artisan db:seed
```

#### 8. Jalankan Development Server

```bash
php artisan serve
```

Server akan berjalan di `http://localhost:8000`

---

## Struktur Folder

```
isms-ewa-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── AuthController.php          # Controller autentikasi
│   │   └── Requests/
│   │       └── LoginRequest.php            # Form request validasi login
│   ├── Models/
│   │   ├── User.php                        # Model pengguna
│   │   ├── SchoolClass.php                 # Model kelas sekolah
│   │   ├── Student.php                     # Model siswa
│   │   ├── Grade.php                       # Model nilai akademik
│   │   ├── Violation.php                   # Model pelanggaran
│   │   └── RiskScore.php                   # Model skor risiko
│   └── Services/                           # Direktori untuk business logic (kosong di Phase 1)
├── database/
│   ├── migrations/                         # File migrasi database
│   ├── seeders/
│   │   ├── DatabaseSeeder.php              # Seeder utama
│   │   └── UserSeeder.php                  # Seeder untuk user admin
│   └── database.sqlite                     # File database SQLite
├── routes/
│   └── api.php                             # Definisi route API
├── tests/
│   ├── Feature/                            # Feature tests
│   │   ├── AuthControllerTest.php
│   │   ├── LoginRequestTest.php
│   │   └── SmokeTest.php
│   └── Unit/                               # Unit tests
│       ├── UserModelTest.php
│       └── StudentModelTest.php
├── docs/
│   └── phase-1-foundation.md               # Dokumentasi backend
├── .env                                    # Environment configuration
├── .env.example                            # Template environment
├── composer.json                           # Dependency management
└── phpunit.xml                             # Test configuration
```

---

## Database Migrations

Semua tabel database didefinisikan melalui migrations. Berikut penjelasan setiap tabel:

### 1. Tabel `users`

Menyimpan data pengguna sistem (admin, guru, wali kelas).

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | bigint, PK | Identifikasi unik |
| `name` | string(255) | Nama lengkap pengguna |
| `email` | string(255), unique | Email untuk login |
| `password` | string(255) | Password ter-hash (bcrypt) |
| `role` | string(50) | Peran: `admin`, `teacher`, `homeroom_teacher` |
| `created_at` | timestamp | Waktu dibuat |
| `updated_at` | timestamp | Waktu diperbarui |

**Role yang tersedia:**
- `admin` — Administrator sistem
- `teacher` — Guru (pengajar)
- `homeroom_teacher` — Wali kelas

### 2. Tabel `school_classes`

Menyimpan data kelas sekolah.

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | bigint, PK | Identifikasi unik |
| `name` | string(255) | Nama kelas (contoh: "X IPA 1") |
| `grade_level` | string(50) | Tingkat kelas (contoh: "X", "XI", "XII") |
| `homeroom_teacher_id` | bigint, FK | Wali kelas (referensi ke `users.id`) |
| `created_at` | timestamp | Waktu dibuat |
| `updated_at` | timestamp | Waktu diperbarui |

### 3. Tabel `students`

Menyimpan data siswa.

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | bigint, PK | Identifikasi unik |
| `name` | string(255) | Nama lengkap siswa |
| `email` | string(255), unique | Email siswa |
| `student_id` | string(50), unique | NIS (Nomor Induk Siswa) |
| `school_class_id` | bigint, FK | Kelas siswa (referensi ke `school_classes.id`) |
| `created_at` | timestamp | Waktu dibuat |
| `updated_at` | timestamp | Waktu diperbarui |

### 4. Tabel `grades`

Menyimpan nilai akademik siswa per mata pelajaran.

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | bigint, PK | Identifikasi unik |
| `student_id` | bigint, FK | Siswa pemilik nilai (referensi ke `students.id`) |
| `subject` | string(255) | Nama mata pelajaran |
| `score` | decimal(5,2) | Nilai (0.00 - 100.00) |
| `semester` | string(10) | Semester (contoh: "1", "2") |
| `academic_year` | string(20) | Tahun ajaran (contoh: "2024/2025") |
| `created_at` | timestamp | Waktu dibuat |
| `updated_at` | timestamp | Waktu diperbarui |

### 5. Tabel `violations`

Menyimpan catatan pelanggaran/perilaku siswa.

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | bigint, PK | Identifikasi unik |
| `student_id` | bigint, FK | Siswa yang melanggar (referensi ke `students.id`) |
| `description` | text | Deskripsi pelanggaran |
| `severity` | string(20) | Tingkat: `minor`, `moderate`, `major`, `severe` |
| `reported_by` | bigint, FK | Pengguna yang melaporkan (referensi ke `users.id`) |
| `reported_date` | date | Tanggal pelanggaran |
| `created_at` | timestamp | Waktu dibuat |
| `updated_at` | timestamp | Waktu diperbarui |

**Severity yang tersedia:**
- `minor` — Pelanggaran ringan
- `moderate` — Pelanggaran sedang
- `major` — Pelanggaran berat
- `severe` — Pelanggaran sangat berat

### 6. Tabel `risk_scores`

Menyimpan skor risiko siswa (akan diisi oleh Phase 2+).

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | bigint, PK | Identifikasi unik |
| `student_id` | bigint, FK, unique | Siswa (one-to-one) |
| `total_score` | decimal(5,2) | Skor risiko total |
| `academic_score` | decimal(5,2) | Skor komponen akademik |
| `behavioral_score` | decimal(5,2) | Skor komponen perilaku |
| `risk_level` | string(20) | Level: `safe`, `warning`, `high_risk` |
| `last_updated` | timestamp | Waktu kalkulasi terakhir |
| `created_at` | timestamp | Waktu dibuat |
| `updated_at` | timestamp | Waktu diperbarui |

**Risk Level yang tersedia:**
- `safe` — Siswa aman (tidak berisiko)
- `warning` — Siswa perlu diperhatikan
- `high_risk` — Siswa berisiko tinggi

---

## Eloquent Models dan Relasi

Setiap tabel memiliki Eloquent Model yang merepresentasikannya. Berikut relasi antar model:

### Model Relationships

```
User
├── homeroomClasses() → hasMany(SchoolClass)
└── reportedViolations() → hasMany(Violation)

SchoolClass
├── homeroomTeacher() → belongsTo(User)
└── students() → hasMany(Student)

Student
├── schoolClass() → belongsTo(SchoolClass)
├── grades() → hasMany(Grade)
├── violations() → hasMany(Violation)
└── riskScore() → hasOne(RiskScore)

Grade
└── student() → belongsTo(Student)

Violation
├── student() → belongsTo(Student)
└── reporter() → belongsTo(User)

RiskScore
└── student() → belongsTo(Student)
```

---

## API Endpoints — Autentikasi

Semua endpoint autentikasi tersedia di bawah prefix `/api/auth`.

### 1. Login

**Endpoint:** `POST /api/auth/login`

**Deskripsi:** Login dengan email dan password untuk mendapatkan token akses.

**Request Body:**

```json
{
    "email": "admin@isms-ewa.local",
    "password": "password"
}
```

**Response Sukses (HTTP 200):**

```json
{
    "token": "1|abc123def456...",
    "user": {
        "id": 1,
        "name": "Admin ISMS-EWA",
        "email": "admin@isms-ewa.local",
        "role": "admin",
        "created_at": "2024-01-01T00:00:00.000000Z",
        "updated_at": "2024-01-01T00:00:00.000000Z"
    }
}
```

**Response Gagal (HTTP 401):**

```json
{
    "message": "Kredensial tidak valid."
}
```

---

### 2. Logout

**Endpoint:** `POST /api/auth/logout`

**Deskripsi:** Logout dan cabut token akses yang sedang digunakan.

**Header:**

```
Authorization: Bearer {token}
```

**Response Sukses (HTTP 200):**

```json
{
    "message": "Berhasil logout."
}
```

---

### 3. Get Current User

**Endpoint:** `GET /api/auth/me`

**Deskripsi:** Mendapatkan data pengguna yang sedang terautentikasi.

**Header:**

```
Authorization: Bearer {token}
```

**Response Sukses (HTTP 200):**

```json
{
    "id": 1,
    "name": "Admin ISMS-EWA",
    "email": "admin@isms-ewa.local",
    "role": "admin",
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
}
```

---

## Kredensial Default untuk Pengujian

Setelah menjalankan seeder, user admin default tersedia dengan kredensial:

| Field | Nilai |
|-------|-------|
| Email | `admin@isms-ewa.local` |
| Password | `password` |
| Role | `admin` |

Gunakan kredensial ini untuk login dan mendapatkan token akses.

---

## Menjalankan Tests

### Jalankan Semua Tests

```bash
php artisan test
```

### Jalankan Tests Spesifik

```bash
# Jalankan hanya feature tests
php artisan test tests/Feature

# Jalankan hanya unit tests
php artisan test tests/Unit

# Jalankan test spesifik
php artisan test tests/Feature/AuthControllerTest
```

### Test Coverage

Proyek mencakup:

- **Feature Tests:** Menguji endpoint API dan validasi input
- **Unit Tests:** Menguji model, relasi, dan mass assignment
- **Smoke Tests:** Menguji konfigurasi dan struktur proyek

Total: 31 tests yang semuanya pass.

---

## Menjalankan Migration Fresh dan Seeder

Untuk reset database dan menjalankan semua migrations + seeder:

```bash
php artisan migrate:fresh --seed
```

Perintah ini akan:
1. Drop semua tabel
2. Menjalankan semua migrations
3. Menjalankan seeder (membuat admin user default)

---

## Catatan untuk Phase Berikutnya

- ❌ **Phase 1 TIDAK mengimplementasikan:**
  - Scoring logic
  - Dashboard
  - Reporting
  - Frontend
  - Business logic di Services layer

- ✅ **Phase 1 HANYA menyediakan:**
  - Fondasi database yang clean
  - Authentication API
  - Model dan relasi yang benar
  - Test coverage
  - Dokumentasi

- 📋 **Phase 2 akan mengimplementasikan:**
  - Risk scoring calculation
  - Grade analysis service
  - Violation tracking service
  - Early warning alerts

---

## Troubleshooting

### Error: "SQLSTATE[HY000]: General error: 1 unable to open database file"

**Solusi:** Pastikan file `database/database.sqlite` ada dan memiliki permission yang benar.

```bash
touch database/database.sqlite
chmod 666 database/database.sqlite
```

### Error: "No application encryption key has been generated"

**Solusi:** Jalankan `php artisan key:generate` untuk generate APP_KEY.

### Error: "Class not found" saat menjalankan tests

**Solusi:** Jalankan `composer dump-autoload` untuk refresh autoloader.

### Error: Duplicate entry saat menjalankan seeder berkali-kali

**Solusi:** Gunakan `php artisan migrate:fresh --seed` untuk reset database, atau seeder sudah menggunakan `firstOrCreate` untuk idempotency.

---

## Referensi

- [Laravel 10 Documentation](https://laravel.com/docs/10.x)
- [Laravel Sanctum Documentation](https://laravel.com/docs/10.x/sanctum)
- [Eloquent ORM Documentation](https://laravel.com/docs/10.x/eloquent)

---

**Terakhir diperbarui:** Januari 2024  
**Versi:** 1.0.1 (Phase 1 Revision)
