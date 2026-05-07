# Development 2.1 — Tahun Ajaran & Semester

**Tanggal**: 7 Mei 2026  
**Status**: Implementasi Selesai (Backend)  
**Tujuan**: Membangun fondasi akademik dengan mengelola tahun ajaran dan semester

---

## Ringkasan Implementasi

Development 2.1 telah diimplementasikan dengan fitur-fitur berikut:

### Backend (Selesai)

#### Database
- ✅ Migration untuk tabel `academic_years` dengan fields: id, year (unique), start_date, end_date, is_active, timestamps
- ✅ Migration untuk tabel `semesters` dengan fields: id, academic_year_id (FK), semester_number (1 atau 2), start_date, end_date, is_active, timestamps
- ✅ Unique constraint pada (academic_year_id, semester_number)

#### Models
- ✅ `AcademicYear` model dengan relationship ke Semester
- ✅ `Semester` model dengan relationship ke AcademicYear
- ✅ Proper casting untuk date fields dan boolean fields

#### Controllers
- ✅ `AcademicYearController` dengan CRUD endpoints
- ✅ `SemesterController` dengan CRUD endpoints
- ✅ Endpoint untuk activate academic year: `POST /api/academic-years/{id}/activate`
- ✅ Endpoint untuk activate semester: `POST /api/semesters/{id}/activate`
- ✅ Endpoint untuk get active academic year: `GET /api/academic-years/active/current`
- ✅ Endpoint untuk get active semester: `GET /api/semesters/active/current`
- ✅ Endpoint untuk get semesters by academic year: `GET /api/semesters/by-academic-year?academic_year_id={id}`

#### Form Requests
- ✅ `StoreAcademicYearRequest` dengan validasi: year (required, unique), start_date, end_date (after start_date)
- ✅ `UpdateAcademicYearRequest` dengan validasi yang sama
- ✅ `StoreSemesterRequest` dengan validasi: academic_year_id, semester_number (1 atau 2, unique per academic year), start_date, end_date
- ✅ `UpdateSemesterRequest` dengan validasi yang sama

#### Resources
- ✅ `AcademicYearResource` dengan fields: id, year, start_date, end_date, is_active, semesters, timestamps
- ✅ `SemesterResource` dengan fields: id, academic_year_id, semester_number, start_date, end_date, is_active, academic_year, timestamps

#### Policies
- ✅ `AcademicYearPolicy` dengan authorization:
  - viewAny: Admin, Teacher, Homeroom Teacher
  - view: Admin, Teacher, Homeroom Teacher
  - create: Admin only
  - update: Admin only
  - delete: Admin only (tidak bisa delete yang active)
  - activate: Admin only
- ✅ `SemesterPolicy` dengan authorization yang sama

#### Service Layer
- ✅ `AcademicPeriodService` dengan methods:
  - `activateAcademicYear()`: Activate academic year dan deactivate yang lain
  - `activateSemester()`: Activate semester dan deactivate yang lain, auto-activate parent academic year
  - `getActiveAcademicYear()`: Get active academic year
  - `getActiveSemester()`: Get active semester
  - `getActiveSemesterWithYear()`: Get active semester dengan academic year
  - `canDeleteAcademicYear()`: Check apakah bisa delete
  - `canDeleteSemester()`: Check apakah bisa delete
  - `getSemestersByAcademicYear()`: Get semesters untuk academic year tertentu

#### Routes
- ✅ Semua routes terdaftar di `routes/api.php`
- ✅ Policies terdaftar di `AuthServiceProvider`

#### Tests
- ✅ `AcademicYearTest` dengan 14 test cases
- ✅ `SemesterTest` dengan 17 test cases
- ✅ Factories untuk AcademicYear dan Semester

### Business Rules (Implemented)

- ✅ Hanya satu academic year yang bisa active pada satu waktu
- ✅ Hanya satu semester yang bisa active pada satu waktu (per academic year)
- ✅ Tidak bisa delete academic year/semester yang sedang active
- ✅ Semester dates harus dalam range academic year dates (validasi di form request)
- ✅ Semester number hanya bisa 1 atau 2
- ✅ Year harus unique
- ✅ Activating semester auto-activates parent academic year

### RBAC (Implemented)

- ✅ Admin: Full CRUD + activate permissions
- ✅ Teacher: Read-only access (viewAny, view)
- ✅ Homeroom Teacher: Read-only access (viewAny, view)

---

## API Endpoints

### Academic Years

```
POST   /api/academic-years                    - Create academic year
GET    /api/academic-years                    - List academic years (paginated)
GET    /api/academic-years/{id}               - Get academic year detail
PUT    /api/academic-years/{id}               - Update academic year
DELETE /api/academic-years/{id}               - Delete academic year (only if not active)
POST   /api/academic-years/{id}/activate      - Activate academic year
GET    /api/academic-years/active/current     - Get active academic year
```

### Semesters

```
POST   /api/semesters                         - Create semester
GET    /api/semesters                         - List semesters (paginated)
GET    /api/semesters/{id}                    - Get semester detail
PUT    /api/semesters/{id}                    - Update semester
DELETE /api/semesters/{id}                    - Delete semester (only if not active)
POST   /api/semesters/{id}/activate           - Activate semester
GET    /api/semesters/active/current          - Get active semester
GET    /api/semesters/by-academic-year        - Get semesters by academic year
```

---

## Testing

### Backend Tests

**AcademicYearTest** (14 test cases):
- ✅ Admin can create academic year
- ✅ Teacher cannot create academic year
- ✅ Admin can list academic years
- ✅ Teacher can list academic years
- ✅ Admin can view academic year detail
- ✅ Admin can update academic year
- ✅ Admin cannot delete active academic year
- ✅ Admin can delete inactive academic year
- ✅ Admin can activate academic year
- ✅ Only one academic year can be active
- ✅ Get active academic year
- ✅ Get active academic year returns 404 when none active
- ✅ Year must be unique
- ✅ End date must be after start date

**SemesterTest** (17 test cases):
- ✅ Admin can create semester
- ✅ Teacher cannot create semester
- ✅ Admin can list semesters
- ✅ Teacher can list semesters
- ✅ Admin can view semester detail
- ✅ Admin can update semester
- ✅ Admin cannot delete active semester
- ✅ Admin can delete inactive semester
- ✅ Admin can activate semester
- ✅ Only one semester can be active per academic year
- ✅ Activating semester auto-activates parent academic year
- ✅ Get active semester
- ✅ Get active semester returns 404 when none active
- ✅ Get semesters by academic year
- ✅ Semester number must be 1 or 2
- ✅ Cannot have duplicate semester number in same academic year
- ✅ End date must be after start date

### Test Execution

```bash
php artisan test tests/Feature/AcademicYearTest.php tests/Feature/SemesterTest.php
```

---

## Files Created/Modified

### Backend Files Created

**Models**:
- `isms-ewa-backend/app/Models/AcademicYear.php`
- `isms-ewa-backend/app/Models/Semester.php`

**Controllers**:
- `isms-ewa-backend/app/Http/Controllers/Api/AcademicYearController.php`
- `isms-ewa-backend/app/Http/Controllers/Api/SemesterController.php`

**Form Requests**:
- `isms-ewa-backend/app/Http/Requests/AcademicYear/StoreAcademicYearRequest.php`
- `isms-ewa-backend/app/Http/Requests/AcademicYear/UpdateAcademicYearRequest.php`
- `isms-ewa-backend/app/Http/Requests/Semester/StoreSemesterRequest.php`
- `isms-ewa-backend/app/Http/Requests/Semester/UpdateSemesterRequest.php`

**Resources**:
- `isms-ewa-backend/app/Http/Resources/AcademicYearResource.php`
- `isms-ewa-backend/app/Http/Resources/SemesterResource.php`

**Policies**:
- `isms-ewa-backend/app/Policies/AcademicYearPolicy.php`
- `isms-ewa-backend/app/Policies/SemesterPolicy.php`

**Services**:
- `isms-ewa-backend/app/Services/AcademicPeriodService.php`

**Migrations**:
- `isms-ewa-backend/database/migrations/2026_05_07_035012_create_academic_years_table.php`
- `isms-ewa-backend/database/migrations/2026_05_07_035012_create_semesters_table.php`

**Factories**:
- `isms-ewa-backend/database/factories/AcademicYearFactory.php`
- `isms-ewa-backend/database/factories/SemesterFactory.php`

**Tests**:
- `isms-ewa-backend/tests/Feature/AcademicYearTest.php`
- `isms-ewa-backend/tests/Feature/SemesterTest.php`

### Backend Files Modified

- `isms-ewa-backend/routes/api.php` - Added new routes
- `isms-ewa-backend/app/Providers/AuthServiceProvider.php` - Registered policies
- `isms-ewa-backend/database/factories/UserFactory.php` - Fixed factory

---

## Frontend Implementation (Selesai)

Frontend implementation untuk Development 2.1 telah selesai dengan fitur-fitur berikut:

### Frontend Services
- ✅ `isms-ewa-frontend/src/services/academicYearService.js` - API calls untuk academic years
- ✅ `isms-ewa-frontend/src/services/semesterService.js` - API calls untuk semesters

### Frontend Hooks
- ✅ `isms-ewa-frontend/src/hooks/useAcademicYears.js` - State management untuk academic years
- ✅ `isms-ewa-frontend/src/hooks/useSemesters.js` - State management untuk semesters

### Frontend Pages
- ✅ `isms-ewa-frontend/src/pages/academic/AcademicYearsPage.jsx` - List, create, edit, delete, activate academic years
- ✅ `isms-ewa-frontend/src/pages/academic/SemestersPage.jsx` - List, create, edit, delete, activate semesters dengan filter

### Frontend Components
- ✅ `isms-ewa-frontend/src/components/academic/AcademicYearForm.jsx` - Form untuk create/edit academic year
- ✅ `isms-ewa-frontend/src/components/academic/SemesterForm.jsx` - Form untuk create/edit semester
- ✅ `isms-ewa-frontend/src/components/academic/ActivePeriodIndicator.jsx` - Indicator untuk active academic year dan semester

### Frontend Features

**Academic Years Page**:
- ✅ List academic years dengan pagination
- ✅ Search functionality
- ✅ Create, edit, delete, activate buttons (admin only)
- ✅ Active status indicator
- ✅ Modal forms untuk create/edit
- ✅ Confirmation dialogs untuk delete dan activate
- ✅ Role-based visibility (admin vs teacher)
- ✅ Error handling dan success messages
- ✅ Loading states

**Semesters Page**:
- ✅ List semesters dengan pagination
- ✅ Search functionality
- ✅ Filter by academic year
- ✅ Create, edit, delete, activate buttons (admin only)
- ✅ Active status indicator
- ✅ Modal forms untuk create/edit
- ✅ Confirmation dialogs untuk delete dan activate
- ✅ Role-based visibility (admin vs teacher)
- ✅ Error handling dan success messages
- ✅ Loading states

**Forms**:
- ✅ Academic Year Form:
  - Year field dengan format validation (YYYY/YYYY)
  - Start date dan end date fields
  - Date range validation
  - Error messages
  - Loading state
- ✅ Semester Form:
  - Academic year dropdown
  - Semester number radio buttons (1 atau 2)
  - Start date dan end date fields
  - Date range validation (harus dalam range academic year)
  - Error messages
  - Loading state

**Active Period Indicator**:
- ✅ Display active academic year dan semester
- ✅ Warning jika tidak ada active period
- ✅ Real-time updates setelah activation
- ✅ Auto-refresh setiap 30 detik

### Routing & Navigation
- ✅ Routes untuk `/academic-years` dan `/semesters` di App.jsx
- ✅ Route protection dengan ProtectedRoute component
- ✅ Menu items di Sidebar untuk "Tahun Ajaran" dan "Semester"
- ✅ Page titles di topbar

### RBAC Implementation
- ✅ Admin: Full CRUD + activate permissions
- ✅ Teacher: Read-only access (list dan view only)
- ✅ Homeroom Teacher: Read-only access (list dan view only)
- ✅ Buttons hidden untuk non-admin users
- ✅ Authorization checks di service layer

### Build & Verification
- ✅ Frontend build successful (npm run build)
- ✅ No console errors atau warnings
- ✅ All components properly imported
- ✅ All routes properly configured

---

## Known Limitations

1. ~~Frontend belum diimplementasikan~~ ✅ Frontend selesai
2. ~~Semester dates validation (harus dalam range academic year) hanya di form request, belum di frontend~~ ✅ Validation di frontend form
3. Tidak ada automatic semester creation saat membuat academic year
4. Tidak ada bulk operations untuk create multiple semesters

---

## Next Steps

1. ~~Implementasi frontend untuk Development 2.1~~ ✅ Selesai
2. ~~Manual testing untuk semua user flows~~ ✅ Selesai
3. Integration testing dengan modul lain
4. Development 2.2 - Profil Guru

---

## Catatan Teknis

### Database Schema

**academic_years**:
```sql
CREATE TABLE academic_years (
    id BIGINT PRIMARY KEY,
    year VARCHAR(10) UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

**semesters**:
```sql
CREATE TABLE semesters (
    id BIGINT PRIMARY KEY,
    academic_year_id BIGINT NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    semester_number TINYINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE(academic_year_id, semester_number)
);
```

### Service Layer Pattern

`AcademicPeriodService` mengikuti pattern:
- Centralized business logic untuk academic period management
- Atomic operations (activate academic year/semester)
- Validation dan error handling
- Reusable methods untuk controllers dan other services

---

## Kesimpulan

Development 2.1 telah selesai diimplementasikan dengan:

### Backend ✅
- ✅ Database schema yang proper
- ✅ Models dengan relationships
- ✅ Controllers dengan CRUD operations
- ✅ Form request validation
- ✅ Resource transformation
- ✅ RBAC policies
- ✅ Service layer untuk business logic
- ✅ Comprehensive test coverage (31/31 tests passing)
- ✅ Proper error handling

### Frontend ✅
- ✅ API services untuk academic years dan semesters
- ✅ Custom hooks untuk state management
- ✅ Pages untuk list, create, edit, delete, activate
- ✅ Forms dengan validation
- ✅ Active period indicator component
- ✅ Routing dan navigation
- ✅ RBAC implementation
- ✅ Error handling dan loading states
- ✅ Responsive design
- ✅ Build verification (npm run build successful)

### Overall Status: 100% Complete ✅

Development 2.1 siap untuk production deployment.
