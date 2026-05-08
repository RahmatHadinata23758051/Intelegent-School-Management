# Development 2.4 — Assignment Mata Pelajaran ke Kelas

**Status**: ✅ Complete  
**Date**: May 8, 2026  
**Scope**: Assignment Mata Pelajaran ke Kelas (Class Subject Assignment)

---

## Overview

Development 2.4 implements the class subject assignment module, allowing administrators to assign subjects to classes with full CRUD operations, soft deletes, RBAC, and comprehensive filtering/search capabilities.

---

## Backend Implementation

### Database

**Migration**: `database/migrations/2026_05_08_110000_create_class_subjects_table.php`

```sql
CREATE TABLE class_subjects (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  school_class_id BIGINT NOT NULL,
  subject_id BIGINT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (school_class_id) REFERENCES school_classes(id),
  FOREIGN KEY (subject_id) REFERENCES subjects(id),
  UNIQUE KEY unique_assignment (school_class_id, subject_id, deleted_at)
);
```

**Key Features**:
- Soft deletes for assignment history
- Unique constraint on (school_class_id, subject_id, deleted_at) to prevent duplicates
- Timestamps for audit trail

### Models

**ClassSubject** (`app/Models/ClassSubject.php`)
- Relationships: `schoolClass()`, `subject()`
- Scopes: `active()`, `byClass()`, `bySubject()`, `byStatus()`, `search()`
- Soft deletes enabled

**SchoolClass** (`app/Models/SchoolClass.php`)
- Updated with `classSubjects()` and `subjects()` relationships

**Subject** (`app/Models/Subject.php`)
- Updated with `classSubjects()` and `schoolClasses()` relationships

### Validation

**StoreClassSubjectRequest** (`app/Http/Requests/ClassSubject/StoreClassSubjectRequest.php`)
- `school_class_id`: required, exists in school_classes
- `subject_id`: required, exists in subjects, must be active
- `is_active`: optional, boolean

**UpdateClassSubjectRequest** (`app/Http/Requests/ClassSubject/UpdateClassSubjectRequest.php`)
- `is_active`: optional, boolean (only field that can be updated)

### Service Layer

**ClassSubjectService** (`app/Services/ClassSubjectService.php`)

Methods:
- `assignSubjectToClass(classId, subjectId, isActive)` — Create assignment
- `removeAssignment(classSubject)` — Soft delete assignment
- `restoreAssignment(classSubject)` — Restore soft-deleted assignment
- `updateAssignmentStatus(classSubject, isActive)` — Update is_active status
- `getSubjectsByClass(classId)` — Get all subjects for a class
- `getClassesBySubject(subjectId)` — Get all classes for a subject

### RBAC Policy

**ClassSubjectPolicy** (`app/Policies/ClassSubjectPolicy.php`)

| Action | Admin | Teacher | Homeroom |
|--------|-------|---------|----------|
| viewAny | ✅ | ✅ | ✅ |
| view | ✅ | ✅ | ✅ |
| create | ✅ | ❌ | ❌ |
| update | ✅ | ❌ | ❌ |
| delete | ✅ | ❌ | ❌ |

### API Endpoints

**Base URL**: `/api/class-subjects`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/class-subjects` | List with pagination, search, filter, sort | All |
| POST | `/api/class-subjects` | Create assignment | Admin |
| GET | `/api/class-subjects/{id}` | Get detail | All |
| PUT | `/api/class-subjects/{id}` | Update status | Admin |
| DELETE | `/api/class-subjects/{id}` | Delete assignment | Admin |
| GET | `/api/classes/{classId}/subjects` | Get subjects by class | All |
| GET | `/api/subjects/{subjectId}/classes` | Get classes by subject | All |
| POST | `/api/classes/{classId}/subjects/{subjectId}` | Assign subject (shortcut) | Admin |
| DELETE | `/api/classes/{classId}/subjects/{subjectId}` | Remove subject (shortcut) | Admin |

**Query Parameters** (for list endpoint):
- `search` — Search by class name, subject code, or subject name
- `school_class_id` — Filter by class
- `subject_id` — Filter by subject
- `status` — Filter by status (active/inactive/all)
- `sort` — Sort field (id, created_at, school_class_id, subject_id)
- `sort_direction` — Sort direction (asc/desc)
- `per_page` — Items per page (default: 15)
- `page` — Page number (default: 1)

### Seeding

**ClassSubjectSeeder** (`database/seeders/ClassSubjectSeeder.php`)
- Creates 30 assignments (6 classes × 5 subjects each)
- Uses `updateOrCreate` for idempotency
- All assignments are active by default

### Testing

**ClassSubjectTest** (`tests/Feature/ClassSubjectTest.php`)

Test Coverage:
- ✅ 26 tests, all passing
- ✅ CRUD operations (create, read, update, delete)
- ✅ RBAC authorization (admin, teacher, homeroom)
- ✅ Validation (required fields, inactive subjects)
- ✅ Filtering (by class, subject, status)
- ✅ Search (by class name, subject code, subject name)
- ✅ Pagination
- ✅ Shortcut endpoints (assign/remove)

**Test Results**:
```
Tests: 26 passed (58 assertions)
Duration: 3.81s
```

---

## Frontend Implementation

### Services

**classSubjectService** (`src/services/classSubjectService.js`)

Methods:
- `getClassSubjects(params)` — List with filters
- `getClassSubject(id)` — Get detail
- `createClassSubject(data)` — Create
- `updateClassSubject(id, data)` — Update
- `deleteClassSubject(id)` — Delete
- `getSubjectsByClass(classId, params)` — Get subjects by class
- `getClassesBySubject(subjectId, params)` — Get classes by subject
- `assignSubjectToClass(classId, subjectId)` — Assign (shortcut)
- `removeSubjectFromClass(classId, subjectId)` — Remove (shortcut)

### Hooks

**useClassSubjects** (`src/hooks/useClassSubjects.js`)

State:
- `classSubjects` — Array of assignments
- `loading` — Loading state
- `error` — Error message
- `pagination` — Pagination info

Methods:
- `fetchClassSubjects(params)` — Fetch with filters
- `fetchSubjectsByClass(classId, params)` — Fetch subjects for class
- `fetchClassesBySubject(subjectId, params)` — Fetch classes for subject
- `createClassSubject(data)` — Create and refresh
- `updateClassSubject(id, data)` — Update and refresh
- `deleteClassSubject(id)` — Delete and refresh
- `assignSubjectToClass(classId, subjectId)` — Assign and refresh
- `removeSubjectFromClass(classId, subjectId)` — Remove and refresh
- `setPaginationParams(params)` — Update pagination

### Components

**ClassSubjectForm** (`src/components/class-subjects/ClassSubjectForm.jsx`)

Features:
- Modal dialog for create/edit
- School class dropdown (create only)
- Subject dropdown (create only, active subjects only)
- Active checkbox (edit mode)
- Form validation
- Error handling
- Loading state

**ClassSubjectsPage** (`src/pages/class-subjects/ClassSubjectsPage.jsx`)

Features:
- Summary cards (Total, Active, Classes with Subjects, Subjects Used)
- Search by class or subject name
- Filter by class
- Filter by subject
- Filter by status (active/inactive/all)
- Clear filters button
- Responsive table with pagination
- Edit/Delete actions (admin only)
- Delete confirmation modal
- Loading and error states
- Tailwind CSS styling

### Routes

**App.jsx** — Added route:
```jsx
<Route
  path="/class-subjects"
  element={
    <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
      <ClassSubjectsPage />
    </ProtectedRoute>
  }
/>
```

### Navigation

**AppLayout.jsx** — Added menu item under "Academic Setup":
```
Academic Setup
├── Tahun Ajaran
├── Semester
└── Assignment Mapel Kelas (NEW)
```

### Build Status

```
✅ Frontend builds successfully
✅ No TypeScript errors
✅ No build warnings
```

---

## Test Results

### Backend Tests

```
PASS  Tests\Feature\ClassSubjectTest
  ✓ admin can assign subject to class
  ✓ teacher cannot assign subject to class
  ✓ homeroom cannot assign subject to class
  ✓ cannot assign duplicate subject to same class
  ✓ cannot assign inactive subject
  ✓ school class id is required
  ✓ subject id is required
  ✓ admin can list class subjects
  ✓ teacher can list class subjects
  ✓ homeroom can list class subjects
  ✓ admin can view class subject detail
  ✓ admin can update class subject status
  ✓ teacher cannot update class subject
  ✓ admin can delete class subject
  ✓ teacher cannot delete class subject
  ✓ filter by school class id
  ✓ filter by subject id
  ✓ filter by active status
  ✓ search by subject name
  ✓ search by subject code
  ✓ search by class name
  ✓ pagination works
  ✓ get subjects by class
  ✓ get classes by subject
  ✓ assign subject to class shortcut
  ✓ remove subject from class shortcut

Tests: 26 passed (58 assertions)
Duration: 3.81s
```

### Full Test Suite

```
Tests: 183 passed (506 assertions)
Duration: 24.18s
```

---

## Files Created/Modified

### Backend

**Created**:
- ✅ `database/migrations/2026_05_08_110000_create_class_subjects_table.php`
- ✅ `app/Models/ClassSubject.php`
- ✅ `app/Http/Requests/ClassSubject/StoreClassSubjectRequest.php`
- ✅ `app/Http/Requests/ClassSubject/UpdateClassSubjectRequest.php`
- ✅ `app/Http/Resources/ClassSubjectResource.php`
- ✅ `app/Policies/ClassSubjectPolicy.php`
- ✅ `app/Services/ClassSubjectService.php`
- ✅ `app/Http/Controllers/Api/ClassSubjectController.php`
- ✅ `database/seeders/ClassSubjectSeeder.php`
- ✅ `database/factories/ClassSubjectFactory.php`
- ✅ `database/factories/SchoolClassFactory.php`
- ✅ `tests/Feature/ClassSubjectTest.php`

**Modified**:
- ✅ `app/Models/SchoolClass.php` — Added relationships
- ✅ `app/Models/Subject.php` — Added relationships
- ✅ `database/seeders/DatabaseSeeder.php` — Added ClassSubjectSeeder
- ✅ `routes/api.php` — Added ClassSubjectController routes

### Frontend

**Created**:
- ✅ `src/services/classSubjectService.js`
- ✅ `src/hooks/useClassSubjects.js`
- ✅ `src/components/class-subjects/ClassSubjectForm.jsx`
- ✅ `src/pages/class-subjects/ClassSubjectsPage.jsx`

**Modified**:
- ✅ `src/App.jsx` — Added route
- ✅ `src/components/layout/AppLayout.jsx` — Added menu item

---

## Bug Fixes

### removeSubject Endpoint (Fixed)

**Issue**: DELETE `/api/classes/{classId}/subjects/{subjectId}` returned 500 error

**Root Cause**: 
1. Query didn't explicitly exclude soft-deleted records
2. Authorization was checking against class instead of instance

**Solution**:
```php
// Before
$classSubject = ClassSubject::where('school_class_id', $schoolClass->id)
    ->where('subject_id', $subject->id)
    ->firstOrFail();
$this->authorize('delete', ClassSubject::class);

// After
$classSubject = ClassSubject::where('school_class_id', $schoolClass->id)
    ->where('subject_id', $subject->id)
    ->whereNull('deleted_at')
    ->firstOrFail();
$this->authorize('delete', $classSubject);
```

**Commit**: `6d506bf` — "fix: resolve removeSubject endpoint 500 error by fixing authorization and query logic"

---

## Key Features

✅ **CRUD Operations**
- Create assignments with validation
- Read with comprehensive filtering
- Update assignment status
- Delete with soft deletes

✅ **Search & Filter**
- Search by class name, subject code, subject name
- Filter by class, subject, status
- Pagination support

✅ **RBAC**
- Admin: Full CRUD
- Teacher/Homeroom: Read-only

✅ **Data Integrity**
- Unique constraint on (class, subject, deleted_at)
- Soft deletes for history
- Active subject validation

✅ **API Design**
- RESTful endpoints
- Comprehensive query parameters
- Proper HTTP status codes
- Consistent response format

✅ **Frontend UX**
- Responsive design with Tailwind CSS
- Summary statistics
- Advanced filtering
- Pagination
- Modal forms
- Delete confirmation

---

## Database Seeding

Run seeder:
```bash
php artisan db:seed --class=ClassSubjectSeeder
```

Or with full database:
```bash
php artisan migrate:fresh --seed
```

Sample data: 6 classes × 5 subjects = 30 assignments

---

## API Usage Examples

### Create Assignment
```bash
POST /api/class-subjects
{
  "school_class_id": 1,
  "subject_id": 1,
  "is_active": true
}
```

### List with Filters
```bash
GET /api/class-subjects?search=Matematika&status=active&per_page=10
```

### Update Status
```bash
PUT /api/class-subjects/1
{
  "is_active": false
}
```

### Delete Assignment
```bash
DELETE /api/class-subjects/1
```

### Shortcut: Assign Subject
```bash
POST /api/classes/1/subjects/1
```

### Shortcut: Remove Subject
```bash
DELETE /api/classes/1/subjects/1
```

---

## Next Steps

### Out of Scope (Future Development)

- Teacher subject assignment (who teaches which subject in which class)
- Attendance tracking
- Weekly grades
- Grade components
- Report card generation
- Student promotion
- Intervention reports
- Enhanced risk scoring
- Notifications
- Parent portal
- Student portal

---

## Summary

Development 2.4 successfully implements the class subject assignment module with:
- ✅ 26 backend tests (all passing)
- ✅ 183 total tests (all passing)
- ✅ Full CRUD operations
- ✅ Comprehensive filtering and search
- ✅ RBAC authorization
- ✅ Responsive frontend UI
- ✅ Soft deletes for data integrity
- ✅ Complete API documentation

**Status**: Ready for production

---

## Commits

1. `6d506bf` — fix: resolve removeSubject endpoint 500 error by fixing authorization and query logic
2. `175c85d` — feat: add class subject assignment frontend module with services, hooks, components, and pages

---

**Documentation Date**: May 8, 2026  
**Last Updated**: May 8, 2026
