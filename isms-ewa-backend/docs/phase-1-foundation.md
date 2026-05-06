# Dokumentasi Phase 1 — Fondasi Backend ISMS-EWA

## Pengenalan

Dokumen ini menjelaskan setup, struktur, dan cara menjalankan backend ISMS-EWA Phase 1. Phase 1 berfokus pada pembangunan fondasi backend Laravel yang bersih dan scalable, dengan autentikasi berbasis token menggunakan Laravel Sanctum.

**Catatan:** Phase 1 tidak mengimplementasikan business logic scoring. Semua logika analitik akan diimplementasikan di fase berikutnya.

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

#### 7. Jalankan Seeder (Opsional)

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
│   └── phase-1-foundation.md               # Dokumentasi ini
├── .env                                    # Environment configuration
├── .env.example                            # Template environment
├── composer.json                           # Dependency management
└── phpunit.xml                             # Test configuration
```

### Penjelasan Direktori Utama

- **app/Http/Controllers/** — Berisi controller yang menangani request HTTP
- **app/Http/Requests/** — Berisi Form Request untuk validasi input
- **app/Models/** — Berisi Eloquent Models yang merepresentasikan tabel database
- **app/Services/** — Direktori untuk business logic (kosong di Phase 1, akan diisi di Phase 2+)
- **database/migrations/** — File migrasi yang mendefinisikan struktur database
- **database/seeders/** — File seeder untuk mengisi data awal
- **routes/api.php** — Definisi semua route API
- **tests/** — Test suite (feature tests dan unit tests)
- **docs/** — Dokumentasi proyek

---

## Database Migrations

Semua tabel database didefinisikan melalui migrations. Berikut penjelasan setiap tabel:

### 1. Tabel `users`

Menyimpan data pengguna sistem (admin, guru, staf).

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | bigint, PK | Identifikasi unik |
| `name` | string(255) | Nama lengkap pengguna |
| `email` | string(255), unique | Email untuk login |
| `password` | string(255) | Password ter-hash (bcrypt) |
| `role` | string(50) | Peran: `admin`, `teacher`, `staff` |
| `created_at` | timestamp | Waktu dibuat |
| `updated_at` | timestamp | Waktu diperbarui |

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
| `class_id` | bigint, FK | Kelas siswa (referensi ke `school_classes.id`) |
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
| `severity` | string(20) | Tingkat: `low`, `medium`, `high` |
| `reported_by` | bigint, FK | Pengguna yang melaporkan (referensi ke `users.id`) |
| `reported_date` | date | Tanggal pelanggaran |
| `created_at` | timestamp | Waktu dibuat |
| `updated_at` | timestamp | Waktu diperbarui |

### 6. Tabel `risk_scores`

Menyimpan skor risiko siswa (akan diisi oleh Phase 2+).

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | bigint, PK | Identifikasi unik |
| `student_id` | bigint, FK, unique | Siswa (one-to-one) |
| `total_score` | decimal(5,2) | Skor risiko total |
| `academic_score` | decimal(5,2) | Skor komponen akademik |
| `behavioral_score` | decimal(5,2) | Skor komponen perilaku |
| `risk_level` | string(20) | Level: `low`, `medium`, `high` |
| `last_updated` | timestamp | Waktu kalkulasi terakhir |
| `created_at` | timestamp | Waktu dibuat |
| `updated_at` | timestamp | Waktu diperbarui |

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
    "email": "admin@isms.test",
    "password": "password"
}
```

**Response Sukses (HTTP 200):**

```json
{
    "token": "1|abc123def456...",
    "user": {
        "id": 1,
        "name": "Admin ISMS",
        "email": "admin@isms.test",
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

**Response Validasi Gagal (HTTP 422):**

```json
{
    "message": "The email field is required.",
    "errors": {
        "email": ["The email field is required."],
        "password": ["The password field is required."]
    }
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

**Response Gagal — Tanpa Token (HTTP 401):**

```json
{
    "message": "Unauthenticated."
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
    "name": "Admin ISMS",
    "email": "admin@isms.test",
    "role": "admin",
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
}
```

**Response Gagal — Tanpa Token (HTTP 401):**

```json
{
    "message": "Unauthenticated."
}
```

---

## Kredensial Default untuk Pengujian

Setelah menjalankan seeder, user admin default tersedia dengan kredensial:

| Field | Nilai |
|-------|-------|
| Email | `admin@isms.test` |
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

---

## Catatan untuk Phase Berikutnya

- Direktori `app/Services` sudah disiapkan untuk business logic di Phase 2+
- Tabel `risk_scores` sudah ada tapi belum diisi dengan data
- Semua model sudah memiliki relasi yang benar
- Struktur database sudah scalable untuk menambah fitur baru

---

## Referensi

- [Laravel 10 Documentation](https://laravel.com/docs/10.x)
- [Laravel Sanctum Documentation](https://laravel.com/docs/10.x/sanctum)
- [Eloquent ORM Documentation](https://laravel.com/docs/10.x/eloquent)

---

**Terakhir diperbarui:** Januari 2024  
**Versi:** 1.0.0
