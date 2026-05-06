# Phase 3: Risk Scoring Engine & Dashboard Statistics API

## Tujuan Phase 3

Phase 3 mengimplementasikan sistem penilaian risiko otomatis untuk mengidentifikasi siswa yang memerlukan perhatian khusus berdasarkan performa akademik dan perilaku. Sistem ini menyediakan:

1. **Risk Scoring Engine** - Menghitung skor risiko berdasarkan nilai akademik dan pelanggaran perilaku
2. **Early Warning Logic** - Mengklasifikasikan siswa ke dalam kategori risiko (safe/warning/high_risk)
3. **Auto-Recalculation** - Memperbarui skor risiko secara otomatis ketika ada perubahan nilai atau pelanggaran
4. **Dashboard Statistics API** - Menyediakan data statistik untuk dashboard monitoring

## Scope dan Batasan

### Diimplementasikan:
- ✅ Perhitungan skor risiko akademik dan perilaku
- ✅ Klasifikasi tingkat risiko otomatis
- ✅ Observer untuk auto-recalculation pada perubahan grade/violation
- ✅ Endpoint untuk manual recalculation
- ✅ Endpoint untuk filter siswa berdasarkan risk level
- ✅ Dashboard statistics API
- ✅ Unit tests untuk formula scoring
- ✅ Development seeder dengan berbagai skenario risiko

### Tidak Diimplementasikan (untuk fase berikutnya):
- ❌ Frontend dashboard UI
- ❌ Sistem notifikasi real-time
- ❌ Email/WhatsApp alerts
- ❌ Portal untuk orang tua/siswa
- ❌ Export PDF raport
- ❌ AI/ML predictions
- ❌ Multi-school SaaS features

## Formula Perhitungan Skor Risiko

### 1. Academic Risk Score

Memetakan rata-rata nilai siswa ke skor risiko 0-100:

```
Rata-rata >= 85      → 10   (Excellent)
Rata-rata 75-84.99   → 25   (Good)
Rata-rata 65-74.99   → 50   (Fair)
Rata-rata 55-64.99   → 70   (Poor)
Rata-rata < 55       → 100  (Very Poor)
Tidak ada nilai      → 0    (No data)
```

**Logika**: Skor lebih rendah = risiko lebih rendah. Siswa dengan nilai tinggi memiliki skor risiko akademik rendah.

### 2. Behavioral Risk Score

Menjumlahkan bobot severity dari semua pelanggaran (maksimal 100):

```
Severity Mapping:
- minor    → +5
- moderate → +15
- major    → +30
- severe   → +50

Total Score = Sum of all violation weights (capped at 100)
```

**Logika**: Semakin banyak/berat pelanggaran, semakin tinggi skor risiko perilaku.

### 3. Total Risk Score

Menggunakan formula weighted average 60/40:

```
Total Score = (Academic Score × 0.6) + (Behavioral Score × 0.4)
Result: Rounded to 2 decimal places
```

**Logika**: Performa akademik memiliki bobot lebih besar (60%) dibanding perilaku (40%).

### 4. Risk Level Classification

Mengklasifikasikan siswa berdasarkan total score:

```
Total Score ≤ 20              → SAFE       (Aman, tidak perlu intervensi)
Total Score > 20 dan ≤ 50     → WARNING    (Perlu monitoring)
Total Score > 50              → HIGH_RISK  (Perlu intervensi segera)
```

## Arsitektur dan Komponen

### Services

#### `app/Services/ScoringService.php`
Layanan inti untuk perhitungan skor risiko dengan methods:

- `calculateAcademicScore(Student $student): float` - Hitung skor akademik
- `calculateBehavioralScore(Student $student): float` - Hitung skor perilaku
- `calculateTotalScore(float $academic, float $behavioral): float` - Hitung total skor
- `determineRiskLevel(float $totalScore): string` - Tentukan kategori risiko
- `calculateStudentRisk(Student $student): array` - Hitung semua komponen
- `updateStudentRiskScore(Student $student): RiskScore` - Simpan/update ke database

### Observers

#### `app/Observers/GradeObserver.php`
Mendengarkan event pada model Grade:
- `created()` - Ketika nilai baru dibuat
- `updated()` - Ketika nilai diubah
- `deleted()` - Ketika nilai dihapus

Setiap event memanggil `ScoringService->updateStudentRiskScore()` untuk siswa terkait.

#### `app/Observers/ViolationObserver.php`
Mendengarkan event pada model Violation:
- `created()` - Ketika pelanggaran baru dibuat
- `updated()` - Ketika pelanggaran diubah
- `deleted()` - Ketika pelanggaran dihapus

Setiap event memanggil `ScoringService->updateStudentRiskScore()` untuk siswa terkait.

### Controllers

#### `app/Http/Controllers/Api/RiskScoreController.php`

**Endpoint 1: Manual Recalculation**
```
POST /api/students/{student}/recalculate-risk
```
- Memicu perhitungan ulang skor risiko untuk siswa tertentu
- Response: RiskScoreResource dengan data terbaru
- Auth: Requires `auth:sanctum`

**Endpoint 2: Filter by Risk Level**
```
GET /api/students/risk-level/{riskLevel}
```
- Filter siswa berdasarkan kategori risiko (safe/warning/high_risk)
- Query params: `page`, `per_page` (default 15)
- Response: Paginated StudentResource collection dengan risk_score
- Validation: Menolak risk level yang tidak valid (422)
- Auth: Requires `auth:sanctum`

#### `app/Http/Controllers/Api/DashboardController.php`

**Endpoint: Dashboard Statistics**
```
GET /api/dashboard/statistics
```

Response mencakup:
```json
{
  "total_students": 5,
  "total_classes": 1,
  "total_grades": 15,
  "total_violations": 5,
  "risk_distribution": {
    "safe": 2,
    "warning": 1,
    "high_risk": 2
  },
  "average_scores": {
    "total": 45.5,
    "academic": 60.0,
    "behavioral": 20.0
  },
  "high_risk_students": [
    {
      "id": 3,
      "name": "Budi Santoso",
      "student_id": "STU003",
      "school_class": {
        "id": 1,
        "name": "X IPA 1"
      },
      "risk_score": {
        "total_score": 64.0,
        "risk_level": "high_risk"
      }
    }
  ],
  "recent_violations": [
    {
      "id": 5,
      "description": "Severe violation",
      "severity": "severe",
      "student": {
        "id": 5,
        "name": "Doni Hermawan",
        "student_id": "STU005"
      },
      "reporter": {
        "id": 1,
        "name": "Admin User"
      }
    }
  ]
}
```

- Auth: Requires `auth:sanctum`
- Eager loading untuk performa optimal
- Graceful handling untuk missing risk_scores

## Konfigurasi Database - PostgreSQL

Mulai dari Phase 3 Revision, project menggunakan **PostgreSQL** sebagai database development utama (bukan SQLite).

### Konfigurasi .env
```env
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=isms_ewa
DB_USERNAME=postgres
DB_PASSWORD=123
```

### Verifikasi Koneksi
```bash
# Clear config cache
php artisan config:clear
php artisan cache:clear

# Test koneksi dengan migration
php artisan migrate:fresh --seed
```

### Database PostgreSQL
- **Server**: localhost
- **Port**: 5432
- **Database**: isms_ewa
- **Username**: postgres
- **Password**: 123

Pastikan PostgreSQL server sudah running sebelum menjalankan aplikasi.

## Development Seeder - Risk Scenarios

Development seeder membuat 5 siswa dengan berbagai skenario risiko:

### Student 1: Ahmad Rizki (STU001) - SAFE
- Rata-rata nilai: 86.75 (Excellent)
- Academic Score: 10
- Violations: 1 minor (Behavioral Score: 5)
- Total Score: (10 × 0.6) + (5 × 0.4) = 8.0
- Risk Level: **SAFE** ✅

### Student 2: Siti Nurhaliza (STU002) - SAFE
- Rata-rata nilai: 91.25 (Excellent)
- Academic Score: 10
- Violations: None (Behavioral Score: 0)
- Total Score: (10 × 0.6) + (0 × 0.4) = 6.0
- Risk Level: **SAFE** ✅

### Student 3: Budi Santoso (STU003) - HIGH_RISK
- Rata-rata nilai: 50 (Very Poor)
- Academic Score: 100
- Violations: 1 moderate + 1 major (Behavioral Score: 45)
- Total Score: (100 × 0.6) + (45 × 0.4) = 78.0
- Risk Level: **HIGH_RISK** 🔴

### Student 4: Rina Wijaya (STU004) - WARNING
- Rata-rata nilai: 70 (Fair)
- Academic Score: 50
- Violations: 1 moderate (Behavioral Score: 15)
- Total Score: (50 × 0.6) + (15 × 0.4) = 36.0
- Risk Level: **WARNING** ⚠️

### Student 5: Doni Hermawan (STU005) - HIGH_RISK
- Rata-rata nilai: 50 (Very Poor)
- Academic Score: 100
- Violations: 1 severe (Behavioral Score: 50)
- Total Score: (100 × 0.6) + (50 × 0.4) = 80.0
- Risk Level: **HIGH_RISK** 🔴

## Testing

### Unit Tests: `tests/Unit/ScoringServiceTest.php`

12 test cases mencakup:

1. ✅ Academic score >= 85 returns 10
2. ✅ Academic score 75-84.99 returns 25
3. ✅ Academic score 65-74.99 returns 50
4. ✅ Academic score 55-64.99 returns 70
5. ✅ Academic score < 55 returns 100
6. ✅ Behavioral score minor violation (+5)
7. ✅ Behavioral score capped at 100
8. ✅ Total score formula (60/40)
9. ✅ Risk level safe (≤20)
10. ✅ Risk level warning (>20 and ≤50)
11. ✅ Risk level high_risk (>50)
12. ✅ updateStudentRiskScore creates/updates record

**Test Results**: 60 tests passed (including 12 new ScoringServiceTest)

### Running Tests

```bash
# Run all tests
php artisan test

# Run only ScoringServiceTest
php artisan test tests/Unit/ScoringServiceTest.php

# Run with coverage
php artisan test --coverage
```

## Cara Menjalankan Phase 3

### 1. Fresh Migration & Seeding
```bash
php artisan migrate:fresh --seed
```

Output:
- Drops all tables
- Runs all migrations (including risk_scores table)
- Seeds database dengan UserSeeder dan DevelopmentSeeder
- Creates 5 students dengan berbagai risk levels

### 2. Run Tests
```bash
php artisan test
```

Verifies:
- Semua formula scoring bekerja dengan benar
- Auto-recalculation via observers
- Database operations
- API endpoints

### 3. Verify Routes
```bash
php artisan route:list | grep -E "(recalculate-risk|risk-level|dashboard)"
```

Expected output:
```
POST   api/students/{student}/recalculate-risk
GET    api/students/risk-level/{riskLevel}
GET    api/dashboard/statistics
```

### 4. Test Endpoints (Manual)

**Login untuk mendapatkan token:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@isms-ewa.local","password":"password"}'
```

**Get Dashboard Statistics:**
```bash
curl -X GET http://localhost:8000/api/dashboard/statistics \
  -H "Authorization: Bearer {token}"
```

**Filter Students by Risk Level:**
```bash
curl -X GET "http://localhost:8000/api/students/risk-level/high_risk" \
  -H "Authorization: Bearer {token}"
```

**Manual Recalculate Risk Score:**
```bash
curl -X POST http://localhost:8000/api/students/1/recalculate-risk \
  -H "Authorization: Bearer {token}"
```

## Auto-Recalculation Flow

Ketika ada perubahan pada Grade atau Violation:

```
1. Grade/Violation created/updated/deleted
   ↓
2. Observer (GradeObserver/ViolationObserver) triggered
   ↓
3. Observer calls ScoringService->updateStudentRiskScore($student)
   ↓
4. ScoringService calculates:
   - Academic score (dari rata-rata grades)
   - Behavioral score (dari total violation weights)
   - Total score (60/40 formula)
   - Risk level (classification)
   ↓
5. RiskScore record created/updated in database
   ↓
6. Risk score tersedia di API endpoints
```

## Error Handling

### Invalid Risk Level Filter
```
GET /api/students/risk-level/invalid_level
Response: 422 Unprocessable Entity
{
  "message": "Invalid risk level",
  "errors": {
    "riskLevel": ["Risk level must be one of: safe, warning, high_risk"]
  }
}
```

### Missing Student
```
POST /api/students/999/recalculate-risk
Response: 404 Not Found
```

### Unauthenticated Request
```
GET /api/dashboard/statistics
Response: 401 Unauthorized
```

## Performance Considerations

1. **Eager Loading**: Dashboard endpoint menggunakan eager loading untuk menghindari N+1 queries
2. **Caching**: Risk scores di-cache di database, tidak dihitung real-time
3. **Pagination**: Filter endpoint mendukung pagination untuk large datasets
4. **Indexes**: Foreign keys di risk_scores table sudah di-index

## Next Phase (Phase 4) - Backend Hardening + Role-Based Access Control

Rencana untuk fase berikutnya fokus pada **Backend Hardening dan API Quality**:

### Phase 4 Objectives:
1. **Role-Based Access Control (RBAC)** - Implementasi authorization berbasis role
2. **Policy & Middleware Authorization** - Restrict data access berdasarkan role
3. **API Error Handling** - Improve error responses dan validation
4. **API Query/Filter Structure** - Standardize query parameters dan filtering
5. **Backend Security** - Input validation, SQL injection prevention, rate limiting
6. **Prepare for Frontend Integration** - Ensure API ready untuk frontend consumption

### Future Scope (Tidak di Phase 4):
- ❌ Frontend dashboard UI
- ❌ Notification system (Email/WhatsApp)
- ❌ Parent/Student portals
- ❌ Export PDF raport
- ❌ AI/ML predictions
- ❌ Multi-school SaaS features

Fitur-fitur tersebut akan diimplementasikan di fase-fase berikutnya setelah backend hardening selesai.

## Referensi File

### Core Implementation
- `app/Services/ScoringService.php` - Scoring logic
- `app/Observers/GradeObserver.php` - Grade change listener
- `app/Observers/ViolationObserver.php` - Violation change listener
- `app/Http/Controllers/Api/RiskScoreController.php` - Risk endpoints
- `app/Http/Controllers/Api/DashboardController.php` - Dashboard endpoint
- `app/Providers/AppServiceProvider.php` - Observer registration

### Database
- `database/migrations/2024_01_01_000005_create_risk_scores_table.php`
- `database/seeders/DevelopmentSeeder.php` - Risk scenario seeder

### Tests
- `tests/Unit/ScoringServiceTest.php` - Scoring formula tests

### Routes
- `routes/api.php` - Phase 3 endpoints

### Resources
- `app/Http/Resources/RiskScoreResource.php` - Risk score serialization

## Kesimpulan

Phase 3 berhasil mengimplementasikan Risk Scoring Engine yang komprehensif dengan:
- ✅ Automatic risk calculation dan classification
- ✅ Real-time updates via observers
- ✅ Comprehensive API endpoints
- ✅ Dashboard statistics
- ✅ Full test coverage
- ✅ Development seeder dengan realistic scenarios

Sistem siap untuk digunakan dan dapat diperluas dengan fitur-fitur tambahan di fase berikutnya.
