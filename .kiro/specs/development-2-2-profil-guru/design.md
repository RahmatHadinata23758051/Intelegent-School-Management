# Development 2.2 — Profil Guru | Design

**Tanggal**: 8 Mei 2026  
**Status**: Architecture & Design  
**Bahasa**: Bahasa Indonesia

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
├─────────────────────────────────────────────────────────────┤
│  Pages                                                       │
│  ├── TeachersPage.jsx (List & Management)                   │
│  └── TeacherDetailPage.jsx (Optional Detail View)           │
│                                                              │
│  Components                                                  │
│  ├── TeacherProfileForm.jsx (Create/Edit Form)              │
│  ├── TeacherStatusBadge.jsx (Status Indicator)              │
│  └── TeacherDropdown.jsx (Select Component)                 │
│                                                              │
│  Hooks & Services                                            │
│  ├── useTeacherProfiles.js (State Management)               │
│  └── teacherProfileService.js (API Integration)             │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Laravel)                         │
├─────────────────────────────────────────────────────────────┤
│  Routes (api.php)                                            │
│  ├── GET    /api/teachers                                    │
│  ├── POST   /api/teachers                                    │
│  ├── GET    /api/teachers/dropdown                           │
│  ├── GET    /api/teachers/{id}                               │
│  ├── PUT    /api/teachers/{id}                               │
│  ├── DELETE /api/teachers/{id}                               │
│  └── GET    /api/users/teacher-candidates                    │
│                                                              │
│  Controller                                                  │
│  └── TeacherProfileController.php                            │
│      ├── index()      → List with pagination                 │
│      ├── store()      → Create                               │
│      ├── show()       → Detail                               │
│      ├── update()     → Update                               │
│      ├── destroy()    → Delete/Deactivate                    │
│      ├── dropdown()   → Dropdown list                        │
│      └── candidates() → User candidates                      │
│                                                              │
│  Requests (Validation)                                       │
│  ├── StoreTeacherProfileRequest.php                          │
│  └── UpdateTeacherProfileRequest.php                         │
│                                                              │
│  Resources (Response Formatting)                             │
│  └── TeacherProfileResource.php                              │
│                                                              │
│  Policy (Authorization)                                      │
│  └── TeacherProfilePolicy.php                                │
│                                                              │
│  Service (Business Logic)                                    │
│  └── TeacherProfileService.php                               │
│      ├── validateUserRole()                                  │
│      ├── createProfile()                                     │
│      ├── updateProfile()                                     │
│      ├── deactivateProfile()                                 │
│      └── getDropdownList()                                   │
│                                                              │
│  Model                                                       │
│  └── TeacherProfile.php                                      │
│      ├── belongsTo(User)                                     │
│      └── scopeActive()                                       │
│                                                              │
│  Database                                                    │
│  └── teacher_profiles table                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Design

### Migration: create_teacher_profiles_table

```php
Schema::create('teacher_profiles', function (Blueprint $table) {
    $table->id();
    $table->unsignedBigInteger('user_id')->unique();
    $table->string('nip', 50)->nullable()->unique();
    $table->string('qualification', 255)->nullable();
    $table->string('specialization', 255)->nullable();
    $table->string('phone', 30)->nullable();
    $table->text('address')->nullable();
    $table->enum('employment_status', ['permanent', 'contract', 'honorary', 'intern'])->nullable();
    $table->date('joined_date')->nullable();
    $table->boolean('is_active')->default(true);
    $table->timestamps();
    $table->softDeletes();
    
    $table->foreign('user_id')
        ->references('id')
        ->on('users')
        ->onDelete('cascade');
});
```

### Indexes

```php
$table->index('user_id');
$table->index('is_active');
$table->index('employment_status');
$table->index('created_at');
```

---

## Backend Implementation

### 1. Model: TeacherProfile

**File**: `app/Models/TeacherProfile.php`

```php
class TeacherProfile extends Model {
    use SoftDeletes;
    
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
    
    protected $casts = [
        'joined_date' => 'date',
        'is_active' => 'boolean',
    ];
    
    // Relationships
    public function user() {
        return $this->belongsTo(User::class);
    }
    
    // Scopes
    public function scopeActive($query) {
        return $query->where('is_active', true);
    }
    
    public function scopeByRole($query, $role) {
        return $query->whereHas('user', function ($q) use ($role) {
            $q->where('role', $role);
        });
    }
}
```

### 2. Update Model: User

**File**: `app/Models/User.php`

```php
class User extends Model {
    // ... existing code ...
    
    // Relationships
    public function teacherProfile() {
        return $this->hasOne(TeacherProfile::class);
    }
    
    // Helper Methods
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

### 3. Controller: TeacherProfileController

**File**: `app/Http/Controllers/Api/TeacherProfileController.php`

Methods:
- `index()` — List dengan pagination, search, filter, sort
- `store()` — Create dengan validation
- `show()` — Detail
- `update()` — Update dengan validation
- `destroy()` — Delete/deactivate
- `dropdown()` — Dropdown guru aktif
- `candidates()` — User candidates untuk create

### 4. Form Requests

**File**: `app/Http/Requests/TeacherProfile/StoreTeacherProfileRequest.php`

```php
class StoreTeacherProfileRequest extends FormRequest {
    public function authorize() {
        return $this->user()->role === 'admin';
    }
    
    public function rules() {
        return [
            'user_id' => 'required|exists:users,id|unique:teacher_profiles,user_id',
            'nip' => 'nullable|string|max:50|unique:teacher_profiles,nip',
            'qualification' => 'nullable|string|max:255',
            'specialization' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:30',
            'address' => 'nullable|string',
            'employment_status' => 'nullable|string|in:permanent,contract,honorary,intern',
            'joined_date' => 'nullable|date',
            'is_active' => 'nullable|boolean',
        ];
    }
    
    public function withValidator($validator) {
        $validator->after(function ($validator) {
            $user = User::find($this->user_id);
            if ($user && !$user->canHaveTeacherProfile()) {
                $validator->errors()->add('user_id', 'User harus memiliki role teacher atau homeroom_teacher');
            }
        });
    }
}
```

**File**: `app/Http/Requests/TeacherProfile/UpdateTeacherProfileRequest.php`

```php
class UpdateTeacherProfileRequest extends FormRequest {
    public function authorize() {
        return $this->user()->role === 'admin';
    }
    
    public function rules() {
        return [
            'nip' => 'nullable|string|max:50|unique:teacher_profiles,nip,' . $this->teacherProfile->id,
            'qualification' => 'nullable|string|max:255',
            'specialization' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:30',
            'address' => 'nullable|string',
            'employment_status' => 'nullable|string|in:permanent,contract,honorary,intern',
            'joined_date' => 'nullable|date',
            'is_active' => 'nullable|boolean',
        ];
    }
}
```

### 5. Resource: TeacherProfileResource

**File**: `app/Http/Resources/TeacherProfileResource.php`

```php
class TeacherProfileResource extends JsonResource {
    public function toArray($request) {
        return [
            'id' => $this->id,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
                'role' => $this->user->role,
            ],
            'nip' => $this->nip,
            'qualification' => $this->qualification,
            'specialization' => $this->specialization,
            'phone' => $this->phone,
            'address' => $this->address,
            'employment_status' => $this->employment_status,
            'joined_date' => $this->joined_date?->format('Y-m-d'),
            'is_active' => $this->is_active,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
```

### 6. Policy: TeacherProfilePolicy

**File**: `app/Policies/TeacherProfilePolicy.php`

```php
class TeacherProfilePolicy {
    public function viewAny(User $user) {
        return true; // Semua user bisa list
    }
    
    public function view(User $user, TeacherProfile $teacherProfile) {
        return true; // Semua user bisa view detail
    }
    
    public function create(User $user) {
        return $user->role === 'admin';
    }
    
    public function update(User $user, TeacherProfile $teacherProfile) {
        return $user->role === 'admin';
    }
    
    public function delete(User $user, TeacherProfile $teacherProfile) {
        return $user->role === 'admin';
    }
}
```

### 7. Service: TeacherProfileService

**File**: `app/Services/TeacherProfileService.php`

```php
class TeacherProfileService {
    public function validateUserRole($userId) {
        $user = User::find($userId);
        if (!$user || !$user->canHaveTeacherProfile()) {
            throw new \Exception('User harus memiliki role teacher atau homeroom_teacher');
        }
    }
    
    public function createProfile(array $data) {
        $this->validateUserRole($data['user_id']);
        return TeacherProfile::create($data);
    }
    
    public function updateProfile(TeacherProfile $profile, array $data) {
        return $profile->update($data);
    }
    
    public function deactivateProfile(TeacherProfile $profile) {
        return $profile->update(['is_active' => false]);
    }
    
    public function getDropdownList() {
        return TeacherProfile::active()
            ->with('user')
            ->get();
    }
}
```

### 8. Routes

**File**: `routes/api.php`

```php
Route::middleware('auth:sanctum')->group(function () {
    // Teacher Profiles
    Route::get('/teachers/dropdown', [TeacherProfileController::class, 'dropdown']);
    Route::get('/users/teacher-candidates', [TeacherProfileController::class, 'candidates']);
    Route::apiResource('teachers', TeacherProfileController::class);
});
```

---

## Frontend Implementation

### 1. Service: teacherProfileService

**File**: `src/services/teacherProfileService.js`

```javascript
import api from './api';

export const teacherProfileService = {
  async getTeachers(params = {}) {
    const response = await api.get('/teachers', { params });
    return response.data;
  },

  async getTeacher(id) {
    const response = await api.get(`/teachers/${id}`);
    return response.data;
  },

  async createTeacher(data) {
    const response = await api.post('/teachers', data);
    return response.data;
  },

  async updateTeacher(id, data) {
    const response = await api.put(`/teachers/${id}`, data);
    return response.data;
  },

  async deleteTeacher(id) {
    const response = await api.delete(`/teachers/${id}`);
    return response.data;
  },

  async getTeacherDropdown() {
    const response = await api.get('/teachers/dropdown');
    return response.data;
  },

  async getTeacherCandidates() {
    const response = await api.get('/users/teacher-candidates');
    return response.data;
  },
};
```

### 2. Hook: useTeacherProfiles

**File**: `src/hooks/useTeacherProfiles.js`

```javascript
import { useState, useCallback, useEffect } from 'react';
import { teacherProfileService } from '../services/teacherProfileService';

export const useTeacherProfiles = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [sort, setSort] = useState('created_at');

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await teacherProfileService.getTeachers({
        search,
        status: filterStatus,
        role: filterRole,
        sort,
      });
      setData(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, filterRole, sort]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const create = useCallback(async (formData) => {
    try {
      await teacherProfileService.createTeacher(formData);
      await refetch();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [refetch]);

  const update = useCallback(async (id, formData) => {
    try {
      await teacherProfileService.updateTeacher(id, formData);
      await refetch();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [refetch]);

  const delete_ = useCallback(async (id) => {
    try {
      await teacherProfileService.deleteTeacher(id);
      await refetch();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [refetch]);

  return {
    data,
    loading,
    error,
    pagination,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    filterRole,
    setFilterRole,
    sort,
    setSort,
    refetch,
    create,
    update,
    delete: delete_,
  };
};
```

### 3. Components

**TeacherProfileForm.jsx** — Form untuk create/edit dengan fields:
- User dropdown (teacher candidates)
- NIP
- Qualification
- Specialization
- Phone
- Address
- Employment Status
- Joined Date
- Is Active checkbox

**TeacherStatusBadge.jsx** — Status badge (Aktif/Nonaktif)

**TeacherDropdown.jsx** — Dropdown untuk select guru (untuk modul berikutnya)

### 4. Pages

**TeachersPage.jsx** — Manajemen Guru dengan:
- Header dengan title dan button tambah (admin only)
- Summary cards (Total, Aktif, Wali Kelas, Nonaktif)
- Toolbar (search, filter, sort)
- Table dengan kolom: Nama, Email, Role, NIP, Spesialisasi, Status, Aksi
- Pagination

**TeacherDetailPage.jsx** (optional) — Detail view jika diperlukan

---

## Data Flow

### Create Teacher Profile

```
Frontend Form
    ↓
TeacherProfileForm.jsx
    ↓
useTeacherProfiles.create()
    ↓
teacherProfileService.createTeacher()
    ↓
POST /api/teachers
    ↓
TeacherProfileController::store()
    ↓
StoreTeacherProfileRequest (validation)
    ↓
TeacherProfileService::createProfile()
    ↓
TeacherProfile::create()
    ↓
Database: teacher_profiles
    ↓
Response: TeacherProfileResource
    ↓
Frontend: refetch() → update state
```

### List Teacher Profiles

```
TeachersPage.jsx
    ↓
useTeacherProfiles (initial load)
    ↓
teacherProfileService.getTeachers()
    ↓
GET /api/teachers?search=...&status=...&sort=...
    ↓
TeacherProfileController::index()
    ↓
Query with filters, search, sort
    ↓
Response: paginated TeacherProfileResource[]
    ↓
Frontend: render table
```

---

## UI/UX Design

### TeachersPage Layout

```
┌─────────────────────────────────────────────────────────┐
│ Manajemen Guru                                          │
│ Kelola profil guru dan wali kelas                       │
│                                    [+ Tambah Profil Guru]│
├─────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│ │ Total    │ │ Aktif    │ │ Wali     │ │ Nonaktif │    │
│ │ Guru     │ │          │ │ Kelas    │ │          │    │
│ │ 10       │ │ 9        │ │ 3        │ │ 1        │    │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘    │
├─────────────────────────────────────────────────────────┤
│ [Search...] [Status ▼] [Role ▼] [Sort ▼]               │
├─────────────────────────────────────────────────────────┤
│ Nama          │ Email              │ Role    │ NIP      │
├───────────────┼────────────────────┼─────────┼──────────┤
│ Budi Santoso  │ budi@isms-ewa.local│ Teacher │ 198501.. │
│ [Edit] [Hapus]                                          │
├───────────────┼────────────────────┼─────────┼──────────┤
│ Siti Nurhaliza│ siti@isms-ewa.local│ Homeroom│ 198602.. │
│ [Edit] [Hapus]                                          │
├─────────────────────────────────────────────────────────┤
│ Showing 1-10 of 10 | [< Prev] [1] [Next >]              │
└─────────────────────────────────────────────────────────┘
```

### TeacherProfileForm Modal

```
┌─────────────────────────────────────────────────────────┐
│ Tambah Profil Guru                                  [×]  │
├─────────────────────────────────────────────────────────┤
│ User *                                                  │
│ [Pilih User ▼]                                          │
│                                                         │
│ NIP                                                     │
│ [________________]                                      │
│                                                         │
│ Qualification                                           │
│ [________________]                                      │
│                                                         │
│ Specialization                                          │
│ [________________]                                      │
│                                                         │
│ Phone                                                   │
│ [________________]                                      │
│                                                         │
│ Address                                                 │
│ [_____________________________]                         │
│                                                         │
│ Employment Status                                       │
│ [Permanent ▼]                                           │
│                                                         │
│ Joined Date                                             │
│ [2026-05-08]                                            │
│                                                         │
│ ☐ Is Active                                             │
│                                                         │
│                                    [Cancel] [Save]      │
└─────────────────────────────────────────────────────────┘
```

---

## Error Handling

### Validation Errors

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "user_id": ["User harus memiliki role teacher atau homeroom_teacher"],
    "nip": ["NIP sudah digunakan"]
  }
}
```

### Authorization Errors

```json
{
  "success": false,
  "message": "Unauthorized",
  "status": 403
}
```

### Not Found Errors

```json
{
  "success": false,
  "message": "Teacher profile not found",
  "status": 404
}
```

---

## Performance Considerations

1. **Pagination**: Default 15 per page
2. **Lazy Loading**: Load user data dengan teacher profile
3. **Caching**: Cache dropdown list di frontend
4. **Indexes**: Index pada user_id, is_active, created_at
5. **Soft Delete**: Gunakan soft delete untuk audit trail

---

## Security Considerations

1. **RBAC**: Policy di backend adalah source of truth
2. **Validation**: Validasi user role di backend
3. **Authorization**: Check policy sebelum action
4. **Unique Constraints**: NIP dan user_id unique di database
5. **Soft Delete**: Hindari hard delete untuk data historis

---

**Status**: ✅ Design Complete

Siap untuk Implementation Phase.
