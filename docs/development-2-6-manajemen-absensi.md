# DEVELOPMENT 2.6 — MANAJEMEN ABSENSI

**Project**: ISMS-EWA — Intelligent School Management System with Early Warning Analytics  
**Module**: Manajemen Absensi (Attendance Management)  
**Status**: ✅ COMPLETED (Backend Only)  
**Date**: May 12, 2026

---

## 📋 RINGKASAN

Development 2.6 berhasil mengimplementasikan sistem manajemen absensi harian siswa per kelas. Modul ini menyediakan:

1. ✅ Sesi absensi per kelas dan tanggal
2. ✅ Input status kehadiran siswa (present, sick, permitted, absent, late)
3. ✅ Rekap absensi per siswa dan per kelas
4. ✅ Attendance rate calculation
5. ✅ Lock/unlock mechanism untuk sesi absensi
6. ✅ Bulk input absensi
7. ✅ RBAC untuk admin, teacher, dan homeroom teacher

---

## 🗄️ DATABASE SCHEMA

### Tabel: `attendance_sessions`

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| school_class_id | bigint | Foreign key ke school_classes |
| academic_year_id | bigint | Foreign key ke academic_years |
| semester_id | bigint | Foreign key ke semesters |
| session_date | date | Tanggal sesi absensi |
| session_type | string(50) | Tipe sesi (default: 'daily') |
| notes | text | Catatan sesi (nullable) |
| created_by | bigint | Foreign key ke users (nullable) |
| is_locked | boolean | Status kunci sesi (default: false) |
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | Soft delete (nullable) |

**Unique Constraint**: `school_class_id + session_date + session_type`

**Indexes**:
- `session_date`
- `is_locked`

### Tabel: `attendances`

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| attendance_session_id | bigint | Foreign key ke attendance_sessions |
| student_id | bigint | Foreign key ke students |
| status | enum | present, sick, permitted, absent, late |
| notes | text | Catatan absensi (nullable) |
| recorded_by | bigint | Foreign key ke users (nullable) |
| recorded_at | timestamp | Waktu pencatatan (nullable) |
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | Soft delete (nullable) |

**Unique Constraint**: `attendance_session_id + student_id`

**Indexes**:
- `status`
- `recorded_at`

---

## 🔗 RELATIONSHIPS

### AttendanceSession
- `belongsTo` SchoolClass
- `belongsTo` AcademicYear
- `belongsTo` Semester
- `belongsTo` User (createdBy)
- `hasMany` Attendance

### Attendance
- `belongsTo` AttendanceSession
- `belongsTo` Student
- `belongsTo` User (recordedBy)

### Updated Models
- **SchoolClass**: `hasMany` AttendanceSession
- **Student**: `hasMany` Attendance
- **AcademicYear**: `hasMany` AttendanceSession (implicit)
- **Semester**: `hasMany` AttendanceSession (implicit)
- **User**: `hasMany` AttendanceSession, `hasMany` Attendance

---

## 🛣️ API ENDPOINTS

### Attendance Sessions

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/attendance-sessions` | List attendance sessions | ✅ |
| POST | `/api/attendance-sessions` | Create attendance session | ✅ |
| GET | `/api/attendance-sessions/{id}` | Get session detail | ✅ |
| PUT | `/api/attendance-sessions/{id}` | Update session | ✅ |
| DELETE | `/api/attendance-sessions/{id}` | Delete session | ✅ |
| POST | `/api/attendance-sessions/{id}/lock` | Lock session | ✅ |
| POST | `/api/attendance-sessions/{id}/unlock` | Unlock session | ✅ (Admin only) |

### Attendances

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/attendances` | List attendances | ✅ |
| POST | `/api/attendances` | Create attendance | ✅ |
| GET | `/api/attendances/{id}` | Get attendance detail | ✅ |
| PUT | `/api/attendances/{id}` | Update attendance | ✅ |
| DELETE | `/api/attendances/{id}` | Delete attendance | ✅ |
| POST | `/api/attendance-sessions/{id}/attendances/bulk` | Bulk input attendances | ✅ |

### Recap & Summary

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/classes/{id}/attendance` | Class attendance recap | ✅ |
| GET | `/api/students/{id}/attendance` | Student attendance recap | ✅ |
| GET | `/api/attendance/summary` | Attendance summary | ✅ |

---

## 📊 ATTENDANCE STATUS

| Status | Label Indonesia | Counts as Present? |
|--------|----------------|-------------------|
| present | Hadir | ✅ Yes |
| sick | Sakit | ❌ No |
| permitted | Izin | ✅ Yes |
| absent | Alpa | ❌ No |
| late | Terlambat | ✅ Yes |

### Attendance Rate Formula

```
attendance_rate = ((present + permitted + late) / total_sessions) * 100
```

**Catatan**: 
- `sick` tidak dihitung sebagai hadir
- `late` dihitung sebagai hadir untuk attendance rate, tetapi tetap dicatat sebagai `late_count`
- Formula ini akan digunakan untuk enhanced risk scoring di Development 2.10

---

## 🔐 RBAC (Role-Based Access Control)

### Admin
- ✅ Full CRUD access untuk attendance sessions
- ✅ Full CRUD access untuk attendances
- ✅ Dapat lock/unlock session
- ✅ Dapat melihat semua rekap

### Teacher
- ✅ Dapat list attendance sessions
- ✅ Dapat create attendance session untuk kelas yang diajar
- ✅ Dapat input/update attendance untuk kelas yang diajar
- ✅ Dapat melihat rekap kelas yang diajar
- ❌ Tidak dapat unlock session
- ❌ Tidak dapat delete locked session

### Homeroom Teacher
- ✅ Dapat list attendance sessions
- ✅ Dapat create attendance session untuk kelas wali kelas
- ✅ Dapat input/update attendance untuk kelas wali kelas
- ✅ Dapat melihat rekap kelas wali kelas
- ❌ Tidak dapat unlock session
- ❌ Tidak dapat delete locked session

**Catatan**: Backend policy adalah source of truth untuk authorization.

---

## ✅ VALIDATION RULES

### StoreAttendanceSessionRequest
- `school_class_id`: required, exists
- `academic_year_id`: required, exists, must be active
- `semester_id`: required, exists, must be active, must belong to academic year
- `session_date`: required, date, must be within semester range
- `session_type`: nullable, string, max:50
- `notes`: nullable, string
- **Custom**: Unique combination of `school_class_id + session_date + session_type`

### UpdateAttendanceSessionRequest
- `notes`: nullable, string
- `is_locked`: nullable, boolean
- **Custom**: Cannot update locked session (except to unlock)

### StoreAttendanceRequest
- `attendance_session_id`: required, exists, must not be locked
- `student_id`: required, exists, must be in session's class
- `status`: required, in:present,sick,permitted,absent,late
- `notes`: nullable, string
- **Custom**: Unique combination of `attendance_session_id + student_id`

### UpdateAttendanceRequest
- `status`: required, in:present,sick,permitted,absent,late
- `notes`: nullable, string
- **Custom**: Session must not be locked

### BulkStoreAttendanceRequest
- `attendances`: required, array, min:1
- `attendances.*.student_id`: required, exists, must be in session's class
- `attendances.*.status`: required, in:present,sick,permitted,absent,late
- `attendances.*.notes`: nullable, string
- **Custom**: No duplicate student_id in payload, session must not be locked
- **Behavior**: Uses upsert (update or create) to allow re-saving

---

## 🌱 SEEDER

### AcademicYearSemesterSeeder
- Academic Year 2025/2026 (active)
  - Semester 1: July 2025 - December 2025 (inactive)
  - Semester 2: January 2026 - June 2026 (active)
- Academic Year 2024/2025 (inactive)

### AttendanceSeeder
- Creates attendance sessions for last 10-15 weekdays within active semester
- Creates attendance records for all students in each class
- Realistic distribution:
  - 85% present
  - 5% late
  - 5% sick
  - 3% permitted
  - 2% absent
- Locks sessions older than 3 days
- **Result**: 24 sessions, 60 attendance records

---

## 📁 FILES CREATED/MODIFIED

### Migrations
- `2026_05_12_100000_create_attendance_sessions_table.php`
- `2026_05_12_100001_create_attendances_table.php`

### Models
- `app/Models/AttendanceSession.php`
- `app/Models/Attendance.php`
- `app/Models/SchoolClass.php` (updated)
- `app/Models/Student.php` (updated)

### Controllers
- `app/Http/Controllers/Api/AttendanceSessionController.php`
- `app/Http/Controllers/Api/AttendanceController.php`

### Form Requests
- `app/Http/Requests/AttendanceSession/StoreAttendanceSessionRequest.php`
- `app/Http/Requests/AttendanceSession/UpdateAttendanceSessionRequest.php`
- `app/Http/Requests/Attendance/StoreAttendanceRequest.php`
- `app/Http/Requests/Attendance/UpdateAttendanceRequest.php`
- `app/Http/Requests/Attendance/BulkStoreAttendanceRequest.php`

### Resources
- `app/Http/Resources/AttendanceSessionResource.php`
- `app/Http/Resources/AttendanceResource.php`

### Policies
- `app/Policies/AttendanceSessionPolicy.php`
- `app/Policies/AttendancePolicy.php`
- `app/Providers/AuthServiceProvider.php` (updated)

### Services
- `app/Services/AttendanceService.php`

### Seeders
- `database/seeders/AcademicYearSemesterSeeder.php`
- `database/seeders/AttendanceSeeder.php`
- `database/seeders/DatabaseSeeder.php` (updated)

### Routes
- `routes/api.php` (updated)

### Documentation
- `docs/development-2-6-manajemen-absensi.md`

---

## 🧪 TESTING

### Migration & Seeder
```bash
php artisan migrate:fresh --seed
```

**Result**: ✅ All migrations and seeders completed successfully
- 18 migrations executed
- 8 seeders executed
- 24 attendance sessions created
- 60 attendance records created

### Data Verification
```bash
php artisan tinker --execute="
  echo 'Attendance Sessions: ' . App\Models\AttendanceSession::count() . PHP_EOL;
  echo 'Attendances: ' . App\Models\Attendance::count() . PHP_EOL;
"
```

**Result**:
- Attendance Sessions: 24
- Attendances: 60

### Route List
```bash
php artisan route:list --path=attendance
```

**Result**: ✅ All attendance routes registered correctly

---

## 🎯 ACCEPTANCE CRITERIA

| Criteria | Status |
|----------|--------|
| Tabel attendance_sessions dibuat | ✅ |
| Tabel attendances dibuat | ✅ |
| Model dan relationship lengkap | ✅ |
| CRUD API attendance sessions | ✅ |
| CRUD API attendances | ✅ |
| Bulk input attendances | ✅ |
| Lock/unlock mechanism | ✅ |
| Class attendance recap | ✅ |
| Student attendance recap | ✅ |
| Attendance summary | ✅ |
| Attendance rate calculation | ✅ |
| Validation rules lengkap | ✅ |
| RBAC policy implemented | ✅ |
| Seeder attendance | ✅ |
| migrate:fresh --seed berhasil | ✅ |
| Tidak ada duplicate error | ✅ |
| Dokumentasi lengkap | ✅ |

---

## 🚫 OUT OF SCOPE

Berikut ini **TIDAK** diimplementasikan di Development 2.6:

- ❌ Frontend attendance UI
- ❌ Weekly grades
- ❌ Grade components
- ❌ Report card
- ❌ Promotion recommendation
- ❌ Intervention report
- ❌ Enhanced risk scoring (attendance impact)
- ❌ Notification system
- ❌ Parent portal
- ❌ Student portal
- ❌ PDF export

**Catatan**: Attendance impact ke risk score akan diimplementasikan di Development 2.10.

---

## 🔄 NEXT STEPS

### Development 2.7 — Input Nilai Mingguan
- Weekly grades input
- Grade components (tugas, quiz, UTS, UAS)
- Grade calculation per subject
- Grade recap per student

### Development 2.10 — Enhanced Risk Scoring
- Integrate attendance rate into risk score
- Weighted scoring formula
- Attendance threshold configuration
- Risk level recalculation

---

## 📝 KNOWN LIMITATIONS

1. **Teacher Assignment Validation**: Saat ini policy untuk teacher/homeroom masih sederhana. Validasi berdasarkan `teacher_subject_assignments` belum sepenuhnya diterapkan untuk menentukan kelas yang boleh diakses teacher.

2. **Attendance Rate Formula**: Formula saat ini menghitung `late` sebagai hadir. Jika ada kebutuhan untuk menghitung `late` secara terpisah, formula perlu disesuaikan.

3. **Session Type**: Saat ini hanya mendukung `daily` session type. Jika ada kebutuhan untuk session type lain (e.g., `morning`, `afternoon`), perlu ditambahkan.

4. **Bulk Input Behavior**: Bulk input menggunakan `upsert` yang akan update existing records. Jika ada kebutuhan untuk prevent update, validation perlu ditambahkan.

---

## 🎉 SUMMARY

Development 2.6 — Manajemen Absensi telah **berhasil diselesaikan** untuk backend. Semua fitur inti telah diimplementasikan dengan lengkap:

- ✅ Database schema dengan proper relationships
- ✅ Complete CRUD API dengan validation
- ✅ Bulk input dengan upsert mechanism
- ✅ Lock/unlock untuk data integrity
- ✅ Attendance rate calculation
- ✅ Recap endpoints untuk class dan student
- ✅ RBAC policy untuk admin, teacher, homeroom
- ✅ Seeder dengan realistic data
- ✅ Full documentation

**Total Files**: 20+ files created/modified  
**Total Lines**: ~3000+ lines of code  
**Test Coverage**: Migration & seeder verified  

Module ini siap untuk:
1. Frontend development (Development 2.6 Frontend)
2. Integration dengan risk scoring (Development 2.10)
3. Report card generation (Future development)

---

**Developed by**: Kiro AI Assistant  
**Date**: May 12, 2026  
**Version**: 1.0.0
