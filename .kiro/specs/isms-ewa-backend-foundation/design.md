# Design Document — ISMS-EWA Backend Foundation (Phase 1)

## Overview

ISMS-EWA (Intelligent School Management System with Early Warning Analytics) adalah sistem manajemen sekolah berbasis web yang dirancang untuk mendeteksi siswa berisiko secara dini. **Phase 1** berfokus pada pembangunan fondasi backend Laravel yang bersih, terstruktur, dan siap dikembangkan ke fase berikutnya.

Fondasi ini mencakup:
- Inisialisasi proyek Laravel 10 dengan konfigurasi SQLite
- Autentikasi berbasis token menggunakan Laravel Sanctum (3 endpoint)
- 6 database migrations dengan skema inti dan foreign key constraints
- Eloquent Models dengan relasi antar entitas
- Struktur folder scalable (`app/Services`, `app/Http/Controllers`, `app/Http/Requests`)
- UserSeeder untuk data awal pengujian
- Dokumentasi teknis lengkap di `docs/phase-1-foundation.md`

**Batasan Phase 1:** Tidak ada business logic, scoring, atau kalkulasi risiko. Semua logika analitik akan diimplementasikan di fase berikutnya.

---

## Architecture

### Gambaran Arsitektur

```
┌─────────────────────────────────────────────────────────────┐
│                        HTTP Client                          │
│                  (Postman / Frontend App)                   │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP Request
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Laravel Application                      │
│                                                             │
│  routes/api.php                                             │
│       │                                                     │
│       ▼                                                     │
│  Middleware Stack                                           │
│  ├── api (throttle, etc.)                                   │
│  └── auth:sanctum (untuk protected routes)                 │
│       │                                                     │
│       ▼                                                     │
│  app/Http/Requests/LoginRequest  (validasi input)          │
│       │                                                     │
│       ▼                                                     │
│  app/Http/Controllers/AuthController                        │
│       │                                                     │
│       ▼                                                     │
│  app/Services/  (kosong, siap untuk Phase 2+)              │
│       │                                                     │
│       ▼                                                     │
│  app/Models/  (Eloquent ORM)                               │
│       │                                                     │
│       ▼                                                     │
│  Database (SQLite — database/database.sqlite)              │
└─────────────────────────────────────────────────────────────┘
```

### Pola Arsitektur

Proyek mengikuti pola **MVC (Model-View-Controller)** bawaan Laravel dengan tambahan lapisan **Services** yang dipersiapkan untuk fase berikutnya:

- **Routes** → mendefinisikan endpoint dan mengarahkan ke controller
- **Form Requests** → memvalidasi input sebelum masuk ke controller
- **Controllers** → menangani request/response, mendelegasikan logika ke Services
- **Services** → (kosong di Phase 1) akan berisi business logic di fase berikutnya
- **Models** → merepresentasikan entitas database dan relasi antar entitas
- **Database** → SQLite untuk kemudahan development dan portabilitas

### Keputusan Desain

| Keputusan | Pilihan | Alasan |
|-----------|---------|--------|
| Database | SQLite | Portabilitas tinggi, zero-config, ideal untuk development dan testing |
| Autentikasi | Laravel Sanctum | Bawaan Laravel, ringan, cocok untuk SPA dan mobile API |
| Validasi | Form Request | Memisahkan logika validasi dari controller, lebih testable |
| Struktur | Services layer | Mempersiapkan arsitektur untuk business logic di fase berikutnya |

---

## Components and Interfaces

### 1. Routes (`routes/api.php`)

```
POST   /api/auth/login    → AuthController@login   (public)
POST   /api/auth/logout   → AuthController@logout  (protected: auth:sanctum)
GET    /api/auth/me       → AuthController@me      (protected: auth:sanctum)
```

### 2. Form Request (`app/Http/Requests/LoginRequest`)

Bertanggung jawab memvalidasi input untuk endpoint login.

**Aturan validasi:**
- `email`: wajib diisi, harus berformat email yang valid
- `password`: wajib diisi

**Interface:**
```php
class LoginRequest extends FormRequest
{
    public function authorize(): bool;
    public function rules(): array;
}
```

### 3. AuthController (`app/Http/Controllers/AuthController`)

Menangani semua operasi autentikasi.

**Method:**

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `login(LoginRequest $request)` | POST /api/auth/login | Validasi kredensial, terbitkan token Sanctum |
| `logout(Request $request)` | POST /api/auth/logout | Cabut token aktif pengguna |
| `me(Request $request)` | GET /api/auth/me | Kembalikan data pengguna yang terautentikasi |

**Respons login berhasil:**
```json
{
    "token": "1|abc123...",
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

**Respons login gagal (HTTP 401):**
```json
{
    "message": "Kredensial tidak valid."
}
```

**Respons logout berhasil (HTTP 200):**
```json
{
    "message": "Berhasil logout."
}
```

**Respons me berhasil:**
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

### 4. Services Directory (`app/Services/`)

Direktori kosong yang dipersiapkan untuk business logic di fase berikutnya. Di Phase 2+, akan berisi:
- `RiskCalculationService` — kalkulasi skor risiko siswa
- `GradeAnalysisService` — analisis nilai akademik
- `ViolationService` — pengelolaan pelanggaran

### 5. UserSeeder (`database/seeders/UserSeeder`)

Membuat data awal untuk pengujian.

**Data yang dibuat:**
- 1 user dengan role `admin`
- Password di-hash menggunakan `Hash::make()`

---

## Data Models

### Entity Relationship Diagram

```mermaid
erDiagram
    users {
        bigint id PK
        string name
        string email UK
        string password
        string role
        timestamp created_at
        timestamp updated_at
    }

    school_classes {
        bigint id PK
        string name
        string grade_level
        bigint homeroom_teacher_id FK
        timestamp created_at
        timestamp updated_at
    }

    students {
        bigint id PK
        string name
        string email UK
        string student_id UK
        bigint class_id FK
        timestamp created_at
        timestamp updated_at
    }

    grades {
        bigint id PK
        bigint student_id FK
        string subject
        decimal score
        string semester
        string academic_year
        timestamp created_at
        timestamp updated_at
    }

    violations {
        bigint id PK
        bigint student_id FK
        text description
        string severity
        bigint reported_by FK
        date reported_date
        timestamp created_at
        timestamp updated_at
    }

    risk_scores {
        bigint id PK
        bigint student_id FK UK
        decimal total_score
        decimal academic_score
        decimal behavioral_score
        string risk_level
        timestamp last_updated
        timestamp created_at
        timestamp updated_at
    }

    users ||--o{ school_classes : "homeroom_teacher_id"
    users ||--o{ violations : "reported_by"
    school_classes ||--o{ students : "class_id"
    students ||--o{ grades : "student_id"
    students ||--o{ violations : "student_id"
    students ||--|| risk_scores : "student_id"
```

### Deskripsi Tabel

#### Tabel `users`
Menyimpan data pengguna sistem (admin, guru, staf).

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | bigint, PK, auto-increment | Identifikasi unik |
| `name` | string(255) | Nama lengkap pengguna |
| `email` | string(255), unique | Email untuk login |
| `password` | string(255) | Password ter-hash (bcrypt) |
| `role` | string(50) | Peran: `admin`, `teacher`, `staff` |
| `created_at` | timestamp | Waktu dibuat |
| `updated_at` | timestamp | Waktu diperbarui |

#### Tabel `school_classes`
Menyimpan data kelas sekolah.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | bigint, PK, auto-increment | Identifikasi unik |
| `name` | string(255) | Nama kelas (contoh: "X IPA 1") |
| `grade_level` | string(50) | Tingkat kelas (contoh: "X", "XI", "XII") |
| `homeroom_teacher_id` | bigint, FK → users.id | Wali kelas |
| `created_at` | timestamp | Waktu dibuat |
| `updated_at` | timestamp | Waktu diperbarui |

#### Tabel `students`
Menyimpan data siswa.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | bigint, PK, auto-increment | Identifikasi unik |
| `name` | string(255) | Nama lengkap siswa |
| `email` | string(255), unique | Email siswa |
| `student_id` | string(50), unique | NIS (Nomor Induk Siswa) |
| `class_id` | bigint, FK → school_classes.id | Kelas siswa |
| `created_at` | timestamp | Waktu dibuat |
| `updated_at` | timestamp | Waktu diperbarui |

#### Tabel `grades`
Menyimpan nilai akademik siswa per mata pelajaran.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | bigint, PK, auto-increment | Identifikasi unik |
| `student_id` | bigint, FK → students.id | Siswa pemilik nilai |
| `subject` | string(255) | Nama mata pelajaran |
| `score` | decimal(5,2) | Nilai (0.00 - 100.00) |
| `semester` | string(10) | Semester (contoh: "1", "2") |
| `academic_year` | string(20) | Tahun ajaran (contoh: "2024/2025") |
| `created_at` | timestamp | Waktu dibuat |
| `updated_at` | timestamp | Waktu diperbarui |

#### Tabel `violations`
Menyimpan catatan pelanggaran/perilaku siswa.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | bigint, PK, auto-increment | Identifikasi unik |
| `student_id` | bigint, FK → students.id | Siswa yang melanggar |
| `description` | text | Deskripsi pelanggaran |
| `severity` | string(20) | Tingkat: `low`, `medium`, `high` |
| `reported_by` | bigint, FK → users.id | Pengguna yang melaporkan |
| `reported_date` | date | Tanggal pelanggaran |
| `created_at` | timestamp | Waktu dibuat |
| `updated_at` | timestamp | Waktu diperbarui |

#### Tabel `risk_scores`
Menyimpan skor risiko siswa (akan diisi oleh Phase 2+).

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | bigint, PK, auto-increment | Identifikasi unik |
| `student_id` | bigint, FK → students.id, unique | Siswa (one-to-one) |
| `total_score` | decimal(5,2) | Skor risiko total |
| `academic_score` | decimal(5,2) | Skor komponen akademik |
| `behavioral_score` | decimal(5,2) | Skor komponen perilaku |
| `risk_level` | string(20) | Level: `low`, `medium`, `high` |
| `last_updated` | timestamp | Waktu kalkulasi terakhir |
| `created_at` | timestamp | Waktu dibuat |
| `updated_at` | timestamp | Waktu diperbarui |

### Eloquent Models dan Relasi

#### Model `User`
```php
// app/Models/User.php
$fillable = ['name', 'email', 'password', 'role'];
$hidden   = ['password', 'remember_token'];

// Relasi:
homeroomClasses() → hasMany(SchoolClass::class, 'homeroom_teacher_id')
reportedViolations() → hasMany(Violation::class, 'reported_by')
```

#### Model `SchoolClass`
```php
// app/Models/SchoolClass.php
$fillable = ['name', 'grade_level', 'homeroom_teacher_id'];

// Relasi:
homeroomTeacher() → belongsTo(User::class, 'homeroom_teacher_id')
students() → hasMany(Student::class, 'class_id')
```

#### Model `Student`
```php
// app/Models/Student.php
$fillable = ['name', 'email', 'student_id', 'class_id'];

// Relasi:
schoolClass() → belongsTo(SchoolClass::class, 'class_id')
grades() → hasMany(Grade::class)
violations() → hasMany(Violation::class)
riskScore() → hasOne(RiskScore::class)
```

#### Model `Grade`
```php
// app/Models/Grade.php
$fillable = ['student_id', 'subject', 'score', 'semester', 'academic_year'];

// Relasi:
student() → belongsTo(Student::class)
```

#### Model `Violation`
```php
// app/Models/Violation.php
$fillable = ['student_id', 'description', 'severity', 'reported_by', 'reported_date'];

// Relasi:
student() → belongsTo(Student::class)
reporter() → belongsTo(User::class, 'reported_by')
```

#### Model `RiskScore`
```php
// app/Models/RiskScore.php
$fillable = ['student_id', 'total_score', 'academic_score', 'behavioral_score', 'risk_level', 'last_updated'];

// Relasi:
student() → belongsTo(Student::class)
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Berdasarkan analisis prework, fitur ini memiliki beberapa acceptance criteria yang cocok untuk property-based testing, terutama pada lapisan autentikasi, validasi input, dan model data.

### Property 1: Login dengan kredensial valid selalu mengembalikan token dan data user

*Untuk sembarang* user yang terdaftar di database dengan email dan password yang valid, request `POST /api/auth/login` dengan kredensial tersebut SHALL selalu mengembalikan respons HTTP 200 yang mengandung field `token` (string non-kosong) dan field `user` (objek dengan `id`, `name`, `email`, `role`).

**Validates: Requirements 2.2**

---

### Property 2: Login dengan kredensial tidak valid selalu mengembalikan HTTP 401

*Untuk sembarang* kombinasi email dan password yang tidak cocok dengan data user manapun di database, request `POST /api/auth/login` SHALL selalu mengembalikan respons HTTP 401 — berlaku untuk email yang tidak terdaftar, password yang salah, maupun kombinasi keduanya.

**Validates: Requirements 2.3**

---

### Property 3: Logout mencabut token sehingga tidak dapat digunakan kembali (round-trip)

*Untuk sembarang* user yang terautentikasi, setelah melakukan `POST /api/auth/logout` dengan token yang valid, token tersebut SHALL tidak dapat digunakan kembali — request `GET /api/auth/me` menggunakan token yang sama SHALL mengembalikan HTTP 401.

**Validates: Requirements 2.4**

---

### Property 4: Endpoint /me mengembalikan data user yang sesuai dengan token

*Untuk sembarang* user yang login dan mendapatkan token, request `GET /api/auth/me` dengan token tersebut SHALL mengembalikan data user yang identik dengan user yang melakukan login (id, name, email, role cocok), dan field `password` tidak boleh muncul dalam respons.

**Validates: Requirements 2.5, 4.1**

---

### Property 5: Password user selalu disimpan dalam bentuk hash bcrypt

*Untuk sembarang* password plaintext yang diberikan saat pembuatan user (baik melalui seeder maupun proses lain), nilai yang tersimpan di kolom `password` di database SHALL tidak sama dengan plaintext, dan SHALL dapat diverifikasi menggunakan `Hash::check($plaintext, $hashed)` yang mengembalikan `true`.

**Validates: Requirements 2.7, 6.2**

---

### Property 6: LoginRequest menolak semua input yang tidak valid

*Untuk sembarang* kombinasi input yang tidak memenuhi aturan validasi (email bukan format email yang valid, atau password kosong/tidak ada), `LoginRequest` SHALL mengembalikan error validasi dan request tidak boleh mencapai controller.

**Validates: Requirements 5.5**

---

### Property 7: Mass assignment model hanya mengisi kolom yang ada di $fillable

*Untuk sembarang* data yang diberikan ke mass assignment (create/fill) pada setiap Model, hanya kolom yang terdaftar di `$fillable` yang SHALL tersimpan — kolom yang tidak ada di `$fillable` SHALL diabaikan dan tidak tersimpan ke database.

**Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6**

---

### Property 8: Relasi Eloquent mengembalikan instance yang benar

*Untuk sembarang* pasangan entitas yang terhubung melalui foreign key (contoh: Student dan SchoolClass, Grade dan Student), mengakses relasi Eloquent SHALL mengembalikan instance model yang benar dengan id yang sesuai dengan nilai foreign key yang tersimpan.

**Validates: Requirements 4.7**

---

## Error Handling

### Strategi Penanganan Error

#### 1. Error Autentikasi

| Kondisi | HTTP Status | Respons |
|---------|-------------|---------|
| Kredensial tidak valid | 401 | `{"message": "Kredensial tidak valid."}` |
| Token tidak ada / tidak valid | 401 | `{"message": "Unauthenticated."}` (default Laravel) |
| Token sudah di-revoke | 401 | `{"message": "Unauthenticated."}` |

#### 2. Error Validasi

Laravel secara otomatis mengembalikan HTTP 422 dengan detail error validasi ketika `FormRequest` gagal:

```json
{
    "message": "The email field is required.",
    "errors": {
        "email": ["The email field is required."],
        "password": ["The password field is required."]
    }
}
```

#### 3. Error Database

- Jika file `database/database.sqlite` tidak ditemukan, migrasi akan gagal dengan pesan yang jelas
- Solusi: Buat file secara manual dengan `touch database/database.sqlite` atau tambahkan script di `AppServiceProvider`

#### 4. Penanganan Exception Global

Laravel's default exception handler (`app/Exceptions/Handler.php`) menangani:
- `AuthenticationException` → HTTP 401
- `ValidationException` → HTTP 422
- `ModelNotFoundException` → HTTP 404
- Exception tidak tertangani → HTTP 500

---

## Testing Strategy

### Pendekatan Pengujian

Proyek menggunakan **dual testing approach**:
1. **Unit/Feature Tests** — menguji contoh spesifik, edge case, dan kondisi error
2. **Property-Based Tests** — menguji properti universal yang berlaku untuk semua input

### Library Property-Based Testing

Untuk PHP/Laravel, digunakan **[eris/eris](https://github.com/giorgiosironi/eris)** atau **[phpunit/phpunit](https://phpunit.de/)** dengan generator kustom. Alternatif yang lebih modern adalah **[pest-plugin-faker](https://pestphp.com/)** dengan Pest PHP untuk generasi data acak yang terstruktur.

**Rekomendasi:** Gunakan **Pest PHP** dengan helper `fake()` untuk generasi data acak, dikombinasikan dengan loop iterasi minimal 100 kali untuk mensimulasikan property-based testing.

### Konfigurasi Test

```php
// Setiap property test dijalankan minimal 100 iterasi
// Tag format: Feature: isms-ewa-backend-foundation, Property {N}: {deskripsi}
```

### Rencana Test

#### Feature Tests (PHPUnit/Pest)

| Test Class | Cakupan |
|------------|---------|
| `AuthControllerTest` | Login valid, login invalid, logout, me dengan token valid, me tanpa token |
| `LoginRequestTest` | Validasi email, validasi password, kombinasi tidak valid |
| `UserModelTest` | Mass assignment, hidden fields, relasi |
| `StudentModelTest` | Mass assignment, relasi ke SchoolClass, Grade, Violation, RiskScore |
| `MigrationTest` | Semua tabel ada, semua kolom ada, foreign key constraint |
| `UserSeederTest` | Admin user dibuat, password ter-hash |

#### Property-Based Tests

| Property | Implementasi |
|----------|-------------|
| Property 1: Login valid → token + user | Loop 100x dengan user acak berbeda, verifikasi respons |
| Property 2: Login invalid → 401 | Loop 100x dengan kredensial acak yang tidak valid |
| Property 3: Logout → token tidak valid | Loop 100x dengan user acak, login → logout → coba /me |
| Property 4: /me → data user sesuai | Loop 100x dengan user berbeda, verifikasi data cocok |
| Property 5: Password selalu di-hash | Loop 100x dengan password acak, verifikasi hash |
| Property 6: LoginRequest validasi | Loop 100x dengan input tidak valid acak |
| Property 7: Mass assignment $fillable | Loop 100x dengan data acak, verifikasi hanya fillable tersimpan |
| Property 8: Relasi Eloquent benar | Loop 100x dengan pasangan entitas acak, verifikasi relasi |

#### Smoke Tests

- Verifikasi Laravel versi 10
- Verifikasi konfigurasi SQLite
- Verifikasi Sanctum terkonfigurasi
- Verifikasi semua route terdaftar
- Verifikasi semua file model ada di `app/Models`
- Verifikasi direktori `app/Services` dan `app/Http/Requests` ada

### Perintah Menjalankan Test

```bash
# Jalankan semua test
php artisan test

# Jalankan test spesifik
php artisan test --filter AuthControllerTest

# Jalankan dengan coverage (opsional)
php artisan test --coverage
```
