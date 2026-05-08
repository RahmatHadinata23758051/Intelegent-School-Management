# Development 2.2 — Profil Guru | Requirements

**Tanggal**: 8 Mei 2026  
**Status**: Requirements Definition  
**Bahasa**: Bahasa Indonesia

---

## Tujuan Modul

Membangun modul **Profil Guru** sebagai fondasi sebelum assignment guru ke mata pelajaran dan kelas.

Modul ini bertujuan untuk:
1. Menyimpan data detail guru (NIP, kualifikasi, spesialisasi, kontak, dll)
2. Menghubungkan user dengan teacher profile (relasi 1:1)
3. Menyediakan daftar guru untuk kebutuhan dropdown di modul berikutnya
4. Menyiapkan fondasi untuk assignment guru ke mata pelajaran/kelas pada Development 2.5

---

## Scope Development 2.2

### Backend
- Tabel `teacher_profiles` dengan fields lengkap
- Model `TeacherProfile` dengan relationship ke `User`
- CRUD API teacher profiles
- Endpoint dropdown/list guru
- Validation rules
- Resource untuk response formatting
- Policy/RBAC untuk authorization
- Feature tests

### Frontend
- Service `teacherProfileService` untuk API calls
- Hook `useTeacherProfiles` untuk state management
- Halaman **Manajemen Guru** (`/teachers`)
- Form tambah/edit profil guru
- Modal create/edit
- Delete confirmation dialog
- Teacher dropdown support untuk modul berikutnya
- Sidebar menu untuk Guru / Teachers

### Dokumentasi
- `docs/development-2-2-profil-guru.md` dengan ringkasan lengkap

---

## Out of Scope

Jangan implementasikan:
- ❌ Assignment guru ke mata pelajaran
- ❌ Assignment guru ke kelas
- ❌ Class subject assignment
- ❌ Subject management
- ❌ Attendance
- ❌ Weekly grades
- ❌ Report card
- ❌ Promotion
- ❌ Intervention report
- ❌ Enhanced risk scoring
- ❌ Parent portal
- ❌ Student portal
- ❌ Notification system
- ❌ AI/ML

**Development 2.2 hanya untuk Profil Guru.**

---

## Database Design

### Tabel: teacher_profiles

```sql
CREATE TABLE teacher_profiles (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL UNIQUE,
  nip VARCHAR(50) NULLABLE UNIQUE,
  qualification VARCHAR(255) NULLABLE,
  specialization VARCHAR(255) NULLABLE,
  phone VARCHAR(30) NULLABLE,
  address TEXT NULLABLE,
  employment_status VARCHAR(50) NULLABLE,
  joined_date DATE NULLABLE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP NULLABLE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Field Descriptions

| Field | Type | Nullable | Unique | Catatan |
|-------|------|----------|--------|---------|
| id | BIGINT | ❌ | ✅ | Primary key |
| user_id | BIGINT | ❌ | ✅ | FK ke users, harus role teacher/homeroom_teacher |
| nip | VARCHAR(50) | ✅ | ✅ | Nomor Induk Pegawai, boleh nullable untuk fleksibilitas awal |
| qualification | VARCHAR(255) | ✅ | ❌ | Kualifikasi pendidikan (S1, S2, dll) |
| specialization | VARCHAR(255) | ✅ | ❌ | Spesialisasi/bidang studi |
| phone | VARCHAR(30) | ✅ | ❌ | Nomor telepon |
| address | TEXT | ✅ | ❌ | Alamat |
| employment_status | VARCHAR(50) | ✅ | ❌ | Status: permanent, contract, honorary, intern |
| joined_date | DATE | ✅ | ❌ | Tanggal bergabung |
| is_active | BOOLEAN | ❌ | ❌ | Default TRUE, untuk soft deactivate |
| created_at | TIMESTAMP | ❌ | ❌ | Audit trail |
| updated_at | TIMESTAMP | ❌ | ❌ | Audit trail |
| deleted_at | TIMESTAMP | ✅ | ❌ | Soft delete untuk data historis |

### Catatan Field

- **user_id**: Wajib merujuk ke user dengan role `teacher` atau `homeroom_teacher`
- **nip**: Boleh nullable untuk fleksibilitas awal, tetapi jika diisi harus unique
- **is_active**: Dipakai agar profil guru bisa dinonaktifkan tanpa menghapus data historis
- **deleted_at**: Hindari hard delete jika guru sudah terkait data akademik di masa depan

---

## Model & Relationship

### Model: TeacherProfile

```php
class TeacherProfile extends Model {
  protected $fillable = [
    'user_id',
    'nip',
    'qualification',
    'specialization',
    'phone',
    'address',
    'employment_status',
    'joined_date',
    'is_active',
  ];

  public function user() {
    return $this->belongsTo(User::class);
  }

  public function scopeActive($query) {
    return $query->where('is_active', true);
  }
}
```

### Relationship: User

```php
class User extends Model {
  public function teacherProfile() {
    return $this->hasOne(TeacherProfile::class);
  }

  public function isTeacher() {
    return $this->role === 'teacher';
  }

  public function isHomeroomTeacher() {
    return $this->role === 'homeroom_teacher';
  }

  public function canHaveTeacherProfile() {
    return $this->isTeacher() || $this->isHomeroomTeacher();
  }
}
```

### Helper Methods

- `TeacherProfile::active()` — Scope untuk filter guru aktif
- `User::isTeacher()` — Check apakah user adalah guru
- `User::isHomeroomTeacher()` — Check apakah user adalah wali kelas
- `User::canHaveTeacherProfile()` — Check apakah user bisa punya teacher profile

---

## Validation Rules

### StoreTeacherProfileRequest

```php
[
  'user_id' => 'required|exists:users,id|unique:teacher_profiles,user_id',
  'nip' => 'nullable|string|max:50|unique:teacher_profiles,nip',
  'qualification' => 'nullable|string|max:255',
  'specialization' => 'nullable|string|max:255',
  'phone' => 'nullable|string|max:30',
  'address' => 'nullable|string',
  'employment_status' => 'nullable|string|in:permanent,contract,honorary,intern',
  'joined_date' => 'nullable|date',
  'is_active' => 'nullable|boolean',
]
```

**Validasi Tambahan:**
- `user_id` hanya boleh milik user dengan role `teacher` atau `homeroom_teacher`
- User dengan role `admin` tidak boleh dibuatkan teacher_profile

### UpdateTeacherProfileRequest

```php
[
  'nip' => 'nullable|string|max:50|unique:teacher_profiles,nip,' . $this->teacherProfile->id,
  'qualification' => 'nullable|string|max:255',
  'specialization' => 'nullable|string|max:255',
  'phone' => 'nullable|string|max:30',
  'address' => 'nullable|string',
  'employment_status' => 'nullable|string|in:permanent,contract,honorary,intern',
  'joined_date' => 'nullable|date',
  'is_active' => 'nullable|boolean',
]
```

**Catatan:**
- `user_id` tidak perlu bisa diubah setelah profile dibuat agar data aman
- `nip` unique harus ignore current profile

---

## Backend Endpoints

### Protected Routes (auth:sanctum)

```
GET    /api/teachers                    — List semua teacher profiles (paginated)
POST   /api/teachers                    — Create teacher profile
GET    /api/teachers/dropdown           — Dropdown list guru aktif
GET    /api/teachers/{teacherProfile}   — View detail teacher profile
PUT    /api/teachers/{teacherProfile}   — Update teacher profile
DELETE /api/teachers/{teacherProfile}   — Delete/deactivate teacher profile

Optional:
POST   /api/teachers/{teacherProfile}/activate   — Activate teacher profile
POST   /api/teachers/{teacherProfile}/deactivate — Deactivate teacher profile
GET    /api/users/teacher-candidates    — Dropdown user untuk create profile (admin only)
```

### Route Ordering

Letakkan `/dropdown` dan `/teacher-candidates` sebelum `/{teacherProfile}` agar tidak bentrok route model binding.

### Response Format

**List Response (Paginated):**
```json
{
  "success": true,
  "message": "Teacher profiles retrieved successfully",
  "data": [
    {
      "id": 1,
      "user": {
        "id": 2,
        "name": "Budi Santoso",
        "email": "budi@isms-ewa.local",
        "role": "teacher"
      },
      "nip": "198501151234567",
      "qualification": "S1 Pendidikan Matematika",
      "specialization": "Matematika",
      "phone": "081234567890",
      "address": "Jl. Merdeka No. 123",
      "employment_status": "permanent",
      "joined_date": "2020-01-15",
      "is_active": true,
      "created_at": "2026-05-08T10:00:00Z",
      "updated_at": "2026-05-08T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 10,
    "per_page": 15,
    "current_page": 1,
    "last_page": 1
  }
}
```

**Dropdown Response:**
```json
{
  "success": true,
  "message": "Teacher dropdown retrieved successfully",
  "data": [
    {
      "id": 1,
      "user": {
        "id": 2,
        "name": "Budi Santoso",
        "email": "budi@isms-ewa.local"
      },
      "nip": "198501151234567",
      "specialization": "Matematika"
    }
  ]
}
```

### Search & Filter

**Search Fields:**
- `user.name`
- `user.email`
- `nip`
- `specialization`
- `phone`

**Filter:**
- `status` — active, inactive, all (default: all)
- `role` — teacher, homeroom_teacher, all (default: all)

**Sort Whitelist:**
- `id`
- `nip`
- `joined_date`
- `created_at`

---

## RBAC (Role-Based Access Control)

### Admin
- ✅ List semua teacher profiles
- ✅ Create teacher profile
- ✅ Update teacher profile
- ✅ Delete/deactivate teacher profile
- ✅ Access dropdown

### Teacher
- ✅ List guru (read-only)
- ✅ View detail guru
- ✅ View profil sendiri
- ❌ Create teacher profile
- ❌ Update teacher profile
- ❌ Delete teacher profile

### Homeroom Teacher
- ✅ List guru (read-only)
- ✅ View detail guru
- ✅ View profil sendiri
- ❌ Create teacher profile
- ❌ Update teacher profile
- ❌ Delete teacher profile

**Catatan:**
- Frontend visibility hanya untuk UX
- Backend policy tetap source of truth

---

## Seeder Update

### Users

Minimal harus ada:
- `admin@isms-ewa.local` / password / role: admin
- `teacher@isms-ewa.local` / password / role: teacher
- `homeroom@isms-ewa.local` / password / role: homeroom_teacher
- `homeroom2@isms-ewa.local` / password / role: homeroom_teacher

### Teacher Profiles

Minimal harus ada profil untuk:
- `teacher@isms-ewa.local`
- `homeroom@isms-ewa.local`
- `homeroom2@isms-ewa.local`

**Gunakan `updateOrCreate` agar idempotent.**

### Acceptance Criteria

- ✅ `migrate:fresh --seed` berhasil
- ✅ `teacher_profiles` terisi dengan data
- ✅ Tidak ada duplicate error jika seeder dijalankan ulang

---

## Frontend Pages

### Halaman: Manajemen Guru (`/teachers`)

**Header:**
- Title: "Manajemen Guru"
- Subtitle: "Kelola profil guru dan wali kelas"
- Button: "+ Tambah Profil Guru" (admin only)

**Summary Cards:**
- Total Guru
- Guru Aktif
- Wali Kelas
- Guru Nonaktif

**Toolbar:**
- Search input
- Filter status: Semua / Aktif / Nonaktif
- Filter role: Teacher / Homeroom Teacher
- Sort dropdown

**Table/List:**

Kolom:
- Nama
- Email
- Role
- NIP
- Spesialisasi
- Status
- Aksi

**Actions:**

Admin:
- Edit
- Hapus / Nonaktifkan

Teacher/Homeroom:
- View only (no actions)

---

## Frontend Components

### Service: teacherProfileService

Methods:
- `getTeachers(params)` — List dengan pagination, search, filter, sort
- `getTeacher(id)` — Detail
- `createTeacher(data)` — Create
- `updateTeacher(id, data)` — Update
- `deleteTeacher(id)` — Delete/deactivate
- `getTeacherDropdown()` — Dropdown guru aktif
- `getTeacherCandidates()` — Dropdown user untuk create profile (optional)

### Hook: useTeacherProfiles

Support:
- `data` — List teacher profiles
- `loading` — Loading state
- `error` — Error state
- `pagination` — Pagination info
- `search` — Search query
- `filterStatus` — Status filter
- `filterRole` — Role filter
- `sort` — Sort field
- `refetch()` — Refresh data
- `create(data)` — Create profile
- `update(id, data)` — Update profile
- `delete(id)` — Delete/deactivate profile

### Components

- `TeacherProfileForm.jsx` — Form untuk create/edit
- `TeacherStatusBadge.jsx` — Status badge (optional)
- `TeacherDropdown.jsx` — Dropdown untuk select guru (optional)

---

## Navigation

### Sidebar Menu

Tambahkan atau update menu:
```
Management
├── Students
├── Classes
├── Teachers ← NEW
└── Subjects (placeholder)
```

### Routes

- `/teachers` — Manajemen Guru (protected)
- `/teachers/:id` — Detail Guru (optional, protected)

---

## Testing Requirements

### Backend Feature Tests

Minimal test cases:
- ✅ Admin can create teacher profile
- ✅ Admin can list teacher profiles
- ✅ Admin can view teacher profile detail
- ✅ Admin can update teacher profile
- ✅ Admin can delete or deactivate teacher profile
- ✅ Teacher can list teacher profiles (read-only)
- ✅ Teacher cannot create teacher profile
- ✅ Teacher cannot update teacher profile
- ✅ Teacher cannot delete teacher profile
- ✅ Homeroom teacher can list teacher profiles (read-only)
- ✅ Cannot create teacher profile for admin user
- ✅ Cannot create duplicate teacher profile for same user
- ✅ NIP must be unique if provided
- ✅ Dropdown returns active teachers only

**Acceptance Criteria:**
- Semua test lama tetap pass
- Test baru pass
- Tidak merusak Development 2.1

---

## Quality Checklist

### Backend
- ✅ Migration created
- ✅ Model with relationships
- ✅ Controller with CRUD
- ✅ Form requests with validation
- ✅ Resource for response
- ✅ Policy for authorization
- ✅ Seeder with data
- ✅ Feature tests pass
- ✅ `php artisan test` pass
- ✅ No console errors

### Frontend
- ✅ Service created
- ✅ Hook created
- ✅ Components created
- ✅ Pages created
- ✅ Routes added
- ✅ Sidebar menu updated
- ✅ `npm run build` pass
- ✅ No console errors
- ✅ No hardcoded user IDs

### Documentation
- ✅ `docs/development-2-2-profil-guru.md` created
- ✅ All endpoints documented
- ✅ All validation rules documented
- ✅ RBAC behavior documented
- ✅ Manual test results documented

---

## Next Module

**Development 2.3 — Mata Pelajaran**
- Tabel subjects
- Subject management CRUD
- Subject dropdown untuk assignment

---

## Catatan Penting

1. **Jangan hardcode user ID** di frontend
2. **Gunakan updateOrCreate** di seeder agar idempotent
3. **Hindari hard delete** untuk data guru yang sudah punya relasi
4. **Soft delete** dengan `deleted_at` untuk audit trail
5. **RBAC di backend** adalah source of truth
6. **Jangan masuk scope** assignment guru ke mapel/kelas (Development 2.5)

---

**Status**: ✅ Requirements Definition Complete

Siap untuk Design Phase.
