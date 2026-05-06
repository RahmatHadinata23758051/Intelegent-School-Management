# Phase 2 — Core CRUD Backend + Request Validation + API Resource Response

## Tujuan Phase 2

Membangun API CRUD inti untuk data master dan data operasional sekolah dengan struktur Laravel yang rapi, validasi request yang jelas, response API yang konsisten, dan belum masuk ke scoring logic.

Phase ini adalah lanjutan dari backend foundation (Phase 1) dan fokus pada CRUD backend yang bersih dan siap dipakai oleh frontend di phase berikutnya.

## Perubahan Struktur Dokumentasi

Dokumentasi Phase 2 dan seterusnya berada di folder root `docs/`, bukan di dalam folder backend. Ini memastikan dokumentasi global dan mudah diakses.

**Struktur yang benar:**
```
project-root/
├── backend/
├── docs/
│   ├── phase-1-backend-foundation.md
│   ├── phase-2-core-crud-api.md
│   └── ...
└── README.md
```

## Endpoint CRUD yang Tersedia

### Authentication (Public)
- `POST /api/auth/login` - Login dengan email dan password
- `POST /api/auth/logout` - Logout (protected)
- `GET /api/auth/me` - Get current user info (protected)

### School Classes (Protected)
- `GET /api/school-classes` - List semua kelas (pagination)
- `POST /api/school-classes` - Create kelas baru
- `GET /api/school-classes/{schoolClass}` - Get detail kelas
- `PUT /api/school-classes/{schoolClass}` - Update kelas
- `DELETE /api/school-classes/{schoolClass}` - Delete kelas

### Students (Protected)
- `GET /api/students` - List semua siswa (pagination, support filter & search)
- `POST /api/students` - Create siswa baru
- `GET /api/students/{student}` - Get detail siswa
- `PUT /api/students/{student}` - Update siswa
- `DELETE /api/students/{student}` - Delete siswa

**Query Parameters untuk Students:**
- `?search=nama` - Search by name, student_id, atau email
- `?school_class_id=1` - Filter by school class

### Grades (Nested under Students, Protected)
- `GET /api/students/{student}/grades` - List nilai siswa (pagination)
- `POST /api/students/{student}/grades` - Create nilai baru
- `GET /api/students/{student}/grades/{grade}` - Get detail nilai
- `PUT /api/students/{student}/grades/{grade}` - Update nilai
- `DELETE /api/students/{student}/grades/{grade}` - Delete nilai

### Violations (Nested under Students, Protected)
- `GET /api/students/{student}/violations` - List pelanggaran siswa (pagination)
- `POST /api/students/{student}/violations` - Create pelanggaran baru
- `GET /api/students/{student}/violations/{violation}` - Get detail pelanggaran
- `PUT /api/students/{student}/violations/{violation}` - Update pelanggaran
- `DELETE /api/students/{student}/violations/{violation}` - Delete pelanggaran

## Request Body Examples

### Login
```json
{
  "email": "admin@isms-ewa.local",
  "password": "password"
}
```

### Create School Class
```json
{
  "name": "X IPA 1",
  "grade_level": "X",
  "homeroom_teacher_id": 2
}
```

### Create Student
```json
{
  "school_class_id": 1,
  "student_id": "STU001",
  "name": "Ahmad Rizki",
  "email": "ahmad@example.com",
  "gender": "male",
  "birth_date": "2008-05-15",
  "address": "Jl. Merdeka No. 123"
}
```

### Create Grade
```json
{
  "subject": "Matematika",
  "score": 85.5,
  "semester": "1",
  "academic_year": "2024/2025"
}
```

### Create Violation
```json
{
  "description": "Terlambat masuk kelas",
  "severity": "minor",
  "reported_by": 2,
  "reported_date": "2024-01-15"
}
```

## Response Body Examples

### Success Response (List)
```json
{
  "success": true,
  "message": "Data siswa berhasil diambil.",
  "data": [
    {
      "id": 1,
      "student_id": "STU001",
      "name": "Ahmad Rizki",
      "email": "ahmad@example.com",
      "gender": "male",
      "birth_date": "2008-05-15",
      "address": "Jl. Merdeka No. 123",
      "school_class": {
        "id": 1,
        "name": "X IPA 1",
        "grade_level": "X"
      },
      "risk_score": null,
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Success Response (Create)
```json
{
  "success": true,
  "message": "Siswa berhasil dibuat.",
  "data": {
    "id": 1,
    "student_id": "STU001",
    "name": "Ahmad Rizki",
    "email": "ahmad@example.com",
    "gender": "male",
    "birth_date": "2008-05-15",
    "address": "Jl. Merdeka No. 123",
    "school_class": {
      "id": 1,
      "name": "X IPA 1",
      "grade_level": "X"
    },
    "risk_score": null,
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
}
```

### Validation Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "name": ["Nama siswa harus diisi."],
    "student_id": ["NIS sudah terdaftar."]
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Kredensial tidak valid."
}
```

## Validation Rules

### School Class
- `name`: required, string, max 255
- `grade_level`: required, string, max 50
- `homeroom_teacher_id`: nullable, exists in users table

### Student
- `school_class_id`: required, exists in school_classes table
- `student_id`: required, string, max 50, unique
- `name`: required, string, max 255
- `email`: nullable, email, unique
- `gender`: nullable, in: male, female
- `birth_date`: nullable, date
- `address`: nullable, string

### Grade
- `subject`: required, string, max 255
- `score`: required, numeric, min 0, max 100
- `semester`: required, string, max 10
- `academic_year`: required, string, max 20

### Violation
- `description`: required, string
- `severity`: required, in: minor, moderate, major, severe
- `reported_by`: nullable, exists in users table
- `reported_date`: required, date

## Seeder Data Testing

Seeder development tersedia di `database/seeders/DevelopmentSeeder.php` dengan data:

- **1 Admin User**: admin@isms-ewa.local / password
- **1 Teacher**: teacher@isms-ewa.local / password
- **1 Homeroom Teacher**: homeroom@isms-ewa.local / password
- **2 School Classes**: X IPA 1, X IPA 2
- **5 Students**: Dengan data lengkap (gender, birth_date, address)
- **7 Grades**: Nilai untuk berbagai siswa dan mata pelajaran
- **4 Violations**: Pelanggaran dengan severity berbeda

Jalankan seeder dengan:
```bash
php artisan migrate:fresh --seed
```

Seeder menggunakan `firstOrCreate` untuk idempotency, sehingga bisa dijalankan berkali-kali tanpa error.

## Cara Menjalankan Project

### Setup
```bash
cd isms-ewa-backend
composer install
cp .env.example .env
php artisan key:generate
```

### Database
```bash
php artisan migrate:fresh --seed
```

### Run Tests
```bash
php artisan test
```

### Run Development Server
```bash
php artisan serve
```

Server akan berjalan di `http://localhost:8000`

## Struktur File yang Dibuat

### Controllers
- `app/Http/Controllers/Api/SchoolClassController.php`
- `app/Http/Controllers/Api/StudentController.php`
- `app/Http/Controllers/Api/GradeController.php`
- `app/Http/Controllers/Api/ViolationController.php`

### Form Requests
- `app/Http/Requests/SchoolClass/StoreSchoolClassRequest.php`
- `app/Http/Requests/SchoolClass/UpdateSchoolClassRequest.php`
- `app/Http/Requests/Student/StoreStudentRequest.php`
- `app/Http/Requests/Student/UpdateStudentRequest.php`
- `app/Http/Requests/Grade/StoreGradeRequest.php`
- `app/Http/Requests/Grade/UpdateGradeRequest.php`
- `app/Http/Requests/Violation/StoreViolationRequest.php`
- `app/Http/Requests/Violation/UpdateViolationRequest.php`

### API Resources
- `app/Http/Resources/UserResource.php`
- `app/Http/Resources/SchoolClassResource.php`
- `app/Http/Resources/StudentResource.php`
- `app/Http/Resources/GradeResource.php`
- `app/Http/Resources/ViolationResource.php`
- `app/Http/Resources/RiskScoreResource.php`

### Traits
- `app/Traits/ApiResponse.php` - Standardized API response methods

### Seeders
- `database/seeders/DevelopmentSeeder.php` - Development data

### Migrations
- `2024_01_01_000006_add_fields_to_students_table.php` - Add gender, birth_date, address
- `2024_01_01_000007_make_reported_by_nullable.php` - Make reported_by nullable

## API Response Standard

Semua endpoint menggunakan format response yang konsisten:

**Success (200, 201):**
```json
{
  "success": true,
  "message": "...",
  "data": {...}
}
```

**Error (4xx, 5xx):**
```json
{
  "success": false,
  "message": "...",
  "errors": {...}
}
```

## Catatan Penting

### Scoring Logic
**Belum diimplementasikan di Phase 2.** RiskScore model dan table tetap ada, tapi tidak ada logic untuk menghitung score. Ini akan diimplementasikan di Phase 3.

### Nested Routes
Grades dan Violations menggunakan nested routes berbasis student untuk memastikan data integrity. Contoh:
- Tidak bisa akses grade dari student yang salah
- Tidak bisa akses violation dari student yang salah

### Authentication
Semua endpoint kecuali `/api/auth/login` memerlukan token Sanctum. Kirim token di header:
```
Authorization: Bearer {token}
```

### Pagination
List endpoints menggunakan pagination dengan default 15 items per page. Response mencakup:
- `data`: Array of items
- `links`: Pagination links
- `meta`: Pagination metadata

## Next Phase (Phase 3)

Phase 3 akan fokus pada:
- Risk Scoring Calculation
- Dashboard Statistics
- Report Generation
- Notification System
- Early Warning Logic

## Test Coverage

Phase 2 memiliki 48 passing tests yang mencakup:
- Unit tests untuk model relationships
- Feature tests untuk CRUD operations
- Validation tests
- Authentication tests
- Nested route tests

Jalankan tests dengan:
```bash
php artisan test
```

## Troubleshooting

### Database Error
Jika ada error saat migration, jalankan:
```bash
php artisan migrate:fresh --seed
```

### Test Failures
Pastikan database fresh sebelum menjalankan tests:
```bash
php artisan migrate:fresh --seed
php artisan test
```

### Route Not Found
Pastikan routes sudah di-register di `routes/api.php` dan middleware auth:sanctum sudah diterapkan.
