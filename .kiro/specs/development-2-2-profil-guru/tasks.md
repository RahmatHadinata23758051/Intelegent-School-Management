# Development 2.2 — Profil Guru | Implementation Tasks

**Tanggal**: 8 Mei 2026  
**Status**: Task List  
**Bahasa**: Bahasa Indonesia

---

## Backend Tasks

### Phase 1: Database & Model (1 jam)

- [ ] 1.1 Create migration: `create_teacher_profiles_table`
  - Fields: id, user_id, nip, qualification, specialization, phone, address, employment_status, joined_date, is_active, timestamps, soft deletes
  - Foreign key: user_id → users.id
  - Indexes: user_id, is_active, created_at
  - Unique constraints: user_id, nip

- [ ] 1.2 Create model: `TeacherProfile`
  - Relationships: belongsTo(User)
  - Scopes: active(), byRole()
  - Casts: joined_date (date), is_active (boolean)
  - Use SoftDeletes trait

- [ ] 1.3 Update model: `User`
  - Add relationship: hasOne(TeacherProfile)
  - Add methods: isTeacher(), isHomeroomTeacher(), canHaveTeacherProfile()

- [ ] 1.4 Run migration
  - `php artisan migrate`
  - Verify table created

### Phase 2: Validation & Requests (45 menit)

- [ ] 2.1 Create form request: `StoreTeacherProfileRequest`
  - Validation rules untuk create
  - Custom validation: user role check
  - Authorization: admin only

- [ ] 2.2 Create form request: `UpdateTeacherProfileRequest`
  - Validation rules untuk update
  - Unique ignore current profile
  - Authorization: admin only

### Phase 3: Resources & Response (30 menit)

- [ ] 3.1 Create resource: `TeacherProfileResource`
  - Include user data (id, name, email, role)
  - Include all teacher profile fields
  - Format dates properly

### Phase 4: Policy & Authorization (30 menit)

- [ ] 4.1 Create policy: `TeacherProfilePolicy`
  - viewAny(): true (semua user)
  - view(): true (semua user)
  - create(): admin only
  - update(): admin only
  - delete(): admin only

### Phase 5: Service Layer (45 menit)

- [ ] 5.1 Create service: `TeacherProfileService`
  - validateUserRole($userId)
  - createProfile(array $data)
  - updateProfile(TeacherProfile $profile, array $data)
  - deactivateProfile(TeacherProfile $profile)
  - getDropdownList()

### Phase 6: Controller (1.5 jam)

- [ ] 6.1 Create controller: `TeacherProfileController`
  - index() — List dengan pagination, search, filter, sort
  - store() — Create dengan validation
  - show() — Detail
  - update() — Update dengan validation
  - destroy() — Delete/deactivate
  - dropdown() — Dropdown guru aktif
  - candidates() — User candidates untuk create

- [ ] 6.2 Implement search functionality
  - Search fields: user.name, user.email, nip, specialization, phone
  - Case-insensitive search

- [ ] 6.3 Implement filter functionality
  - Filter status: active, inactive, all
  - Filter role: teacher, homeroom_teacher, all

- [ ] 6.4 Implement sort functionality
  - Whitelist: id, nip, joined_date, created_at
  - Default: created_at desc

### Phase 7: Routes (15 menit)

- [ ] 7.1 Add routes di `routes/api.php`
  - GET /api/teachers/dropdown (before resource)
  - GET /api/users/teacher-candidates (before resource)
  - apiResource('teachers', TeacherProfileController)

- [ ] 7.2 Verify route order
  - /dropdown dan /teacher-candidates sebelum /{id}

### Phase 8: Seeder (45 menit)

- [ ] 8.1 Update `UserSeeder`
  - Ensure users exist: admin, teacher, homeroom, homeroom2
  - Use updateOrCreate untuk idempotent

- [ ] 8.2 Create `TeacherProfileSeeder`
  - Create profiles untuk teacher, homeroom, homeroom2
  - Use updateOrCreate untuk idempotent
  - Fill realistic data: NIP, qualification, specialization, etc.

- [ ] 8.3 Update `DatabaseSeeder`
  - Call TeacherProfileSeeder

- [ ] 8.4 Test seeder
  - `php artisan migrate:fresh --seed`
  - Verify teacher_profiles terisi
  - Run seeder lagi, pastikan no duplicate error

### Phase 9: Testing (1.5 jam)

- [ ] 9.1 Create feature test: `TeacherProfileTest`
  - Test admin can create teacher profile
  - Test admin can list teacher profiles
  - Test admin can view teacher profile detail
  - Test admin can update teacher profile
  - Test admin can delete/deactivate teacher profile
  - Test teacher can list teacher profiles (read-only)
  - Test teacher cannot create teacher profile
  - Test teacher cannot update teacher profile
  - Test teacher cannot delete teacher profile
  - Test homeroom_teacher can list teacher profiles (read-only)
  - Test cannot create teacher profile for admin user
  - Test cannot create duplicate teacher profile for same user
  - Test NIP must be unique if provided
  - Test dropdown returns active teachers only

- [ ] 9.2 Run tests
  - `php artisan test`
  - All tests pass
  - No breaking changes to Development 2.1

### Phase 10: Backend Quality Check (30 menit)

- [ ] 10.1 Code review
  - Check validation rules
  - Check authorization logic
  - Check response format
  - Check error handling

- [ ] 10.2 Manual API testing
  - Test create endpoint
  - Test list endpoint with search/filter/sort
  - Test detail endpoint
  - Test update endpoint
  - Test delete endpoint
  - Test dropdown endpoint
  - Test candidates endpoint

- [ ] 10.3 Verify no console errors
  - `php artisan config:clear`
  - `php artisan cache:clear`

---

## Frontend Tasks

### Phase 1: Service Layer (45 menit)

- [ ] 1.1 Create service: `src/services/teacherProfileService.js`
  - getTeachers(params)
  - getTeacher(id)
  - createTeacher(data)
  - updateTeacher(id, data)
  - deleteTeacher(id)
  - getTeacherDropdown()
  - getTeacherCandidates()

- [ ] 1.2 Test service methods
  - Verify API calls work
  - Check response format

### Phase 2: Custom Hook (1 jam)

- [ ] 2.1 Create hook: `src/hooks/useTeacherProfiles.js`
  - State: data, loading, error, pagination
  - Filters: search, filterStatus, filterRole, sort
  - Methods: refetch, create, update, delete

- [ ] 2.2 Implement pagination
  - Support page parameter
  - Update pagination state

- [ ] 2.3 Implement search & filter
  - Debounce search input
  - Update data on filter change

### Phase 3: Components (1.5 jam)

- [ ] 3.1 Create component: `src/components/teachers/TeacherProfileForm.jsx`
  - Fields: user_id, nip, qualification, specialization, phone, address, employment_status, joined_date, is_active
  - User dropdown (teacher candidates)
  - Form validation
  - Submit handler
  - Error display

- [ ] 3.2 Create component: `src/components/teachers/TeacherStatusBadge.jsx`
  - Display Aktif/Nonaktif status
  - Color coding

- [ ] 3.3 Create component: `src/components/teachers/TeacherDropdown.jsx`
  - Dropdown untuk select guru
  - Load dari dropdown endpoint
  - Support untuk modul berikutnya

### Phase 4: Pages (2 jam)

- [ ] 4.1 Create page: `src/pages/teachers/TeachersPage.jsx`
  - Header: title, subtitle, button tambah (admin only)
  - Summary cards: Total, Aktif, Wali Kelas, Nonaktif
  - Toolbar: search, filter status, filter role, sort
  - Table: nama, email, role, nip, spesialisasi, status, aksi
  - Pagination
  - Loading state
  - Error state
  - Empty state

- [ ] 4.2 Implement table actions
  - Edit button (admin only)
  - Delete button (admin only)
  - View detail (all users)

- [ ] 4.3 Implement modals
  - Create modal
  - Edit modal
  - Delete confirmation modal

- [ ] 4.4 Create page: `src/pages/teachers/TeacherDetailPage.jsx` (optional)
  - Detail view jika diperlukan
  - Back button
  - Edit button (admin only)

### Phase 5: Navigation & Routes (45 menit)

- [ ] 5.1 Update `src/App.jsx`
  - Add route: `/teachers` → TeachersPage
  - Add route: `/teachers/:id` → TeacherDetailPage (optional)
  - Protected routes

- [ ] 5.2 Update sidebar menu
  - Add menu item: Teachers
  - Place under Management section
  - Link to `/teachers`

- [ ] 5.3 Test navigation
  - Click menu item
  - Navigate to /teachers
  - Verify page loads

### Phase 6: Integration (1 jam)

- [ ] 6.1 Integrate TeacherProfileForm
  - Use dalam create modal
  - Use dalam edit modal
  - Handle submit

- [ ] 6.2 Integrate TeacherStatusBadge
  - Use dalam table
  - Display status correctly

- [ ] 6.3 Integrate TeacherDropdown
  - Use dalam form
  - Load candidates on mount
  - Handle selection

### Phase 7: Frontend Quality Check (1 jam)

- [ ] 7.1 Manual testing
  - Login as admin
  - Navigate to Teachers
  - Create teacher profile
  - Edit teacher profile
  - Delete teacher profile
  - Verify list updates

- [ ] 7.2 Test as teacher
  - Login as teacher
  - Navigate to Teachers
  - Verify list visible
  - Verify no create/edit/delete buttons

- [ ] 7.3 Test as homeroom
  - Login as homeroom
  - Navigate to Teachers
  - Verify read-only

- [ ] 7.4 Test validation
  - Try create without user
  - Try create with duplicate NIP
  - Verify error messages

- [ ] 7.5 Build & verify
  - `npm run build`
  - No console errors
  - No hardcoded user IDs

---

## Documentation Tasks

### Phase 1: Documentation (1 jam)

- [ ] 1.1 Create `docs/development-2-2-profil-guru.md`
  - Tujuan modul
  - Tabel yang dibuat
  - Relationship
  - Endpoint backend
  - Validation rules
  - RBAC behavior
  - Seeder update
  - Frontend pages/components
  - Manual test result
  - Hasil php artisan test
  - Hasil npm run build
  - Known limitations
  - Next module: Development 2.3

- [ ] 1.2 Document API endpoints
  - List all endpoints
  - Request/response examples
  - Error cases

- [ ] 1.3 Document RBAC
  - Admin permissions
  - Teacher permissions
  - Homeroom permissions

---

## Git Commit Tasks

### Phase 1: Backend Commits (30 menit)

- [ ] 1.1 Commit: Backend foundation
  - `git add isms-ewa-backend/database/migrations`
  - `git add isms-ewa-backend/app/Models`
  - `git commit -m "feat: add teacher profile migration and model"`

- [ ] 1.2 Commit: Backend requests & resources
  - `git add isms-ewa-backend/app/Http/Requests/TeacherProfile`
  - `git add isms-ewa-backend/app/Http/Resources/TeacherProfileResource.php`
  - `git commit -m "feat: add teacher profile form requests and resource"`

- [ ] 1.3 Commit: Backend controller & policy
  - `git add isms-ewa-backend/app/Http/Controllers/Api/TeacherProfileController.php`
  - `git add isms-ewa-backend/app/Policies/TeacherProfilePolicy.php`
  - `git commit -m "feat: add teacher profile controller and policy"`

- [ ] 1.4 Commit: Backend service & seeder
  - `git add isms-ewa-backend/app/Services/TeacherProfileService.php`
  - `git add isms-ewa-backend/database/seeders`
  - `git commit -m "feat: add teacher profile service and seeder"`

- [ ] 1.5 Commit: Backend routes & tests
  - `git add isms-ewa-backend/routes/api.php`
  - `git add isms-ewa-backend/tests`
  - `git commit -m "feat: add teacher profile routes and tests"`

### Phase 2: Frontend Commits (30 menit)

- [ ] 2.1 Commit: Frontend service & hook
  - `git add isms-ewa-frontend/src/services/teacherProfileService.js`
  - `git add isms-ewa-frontend/src/hooks/useTeacherProfiles.js`
  - `git commit -m "feat: add teacher profile service and hook"`

- [ ] 2.2 Commit: Frontend components
  - `git add isms-ewa-frontend/src/components/teachers`
  - `git commit -m "feat: add teacher profile components"`

- [ ] 2.3 Commit: Frontend pages & routes
  - `git add isms-ewa-frontend/src/pages/teachers`
  - `git add isms-ewa-frontend/src/App.jsx`
  - `git add isms-ewa-frontend/src/components/layout`
  - `git commit -m "feat: add teacher profile pages and navigation"`

### Phase 3: Documentation Commit (15 menit)

- [ ] 3.1 Commit: Documentation
  - `git add docs/development-2-2-profil-guru.md`
  - `git commit -m "docs: add development 2.2 teacher profile documentation"`

### Phase 4: Push (5 menit)

- [ ] 4.1 Push to main
  - `git push origin main`

---

## Quality Assurance Checklist

### Backend QA

- [ ] Migration runs without error
- [ ] Model relationships work
- [ ] Validation rules enforced
- [ ] Authorization policy enforced
- [ ] All tests pass
- [ ] No console errors
- [ ] Seeder idempotent
- [ ] API responses formatted correctly
- [ ] Search/filter/sort working
- [ ] Dropdown returns active teachers only

### Frontend QA

- [ ] Service methods work
- [ ] Hook state management works
- [ ] Components render correctly
- [ ] Pages load without error
- [ ] Navigation works
- [ ] Create/edit/delete flows work
- [ ] RBAC visibility correct
- [ ] Validation errors display
- [ ] Build passes
- [ ] No console errors
- [ ] No hardcoded user IDs

### Integration QA

- [ ] Backend & frontend communicate
- [ ] Data flows correctly
- [ ] Error handling works
- [ ] Loading states display
- [ ] Empty states display
- [ ] Pagination works
- [ ] Search works
- [ ] Filter works
- [ ] Sort works

---

## Acceptance Criteria

### Backend

- ✅ Migration created and runs
- ✅ Model with relationships
- ✅ CRUD API endpoints
- ✅ Validation rules enforced
- ✅ Authorization policy enforced
- ✅ Seeder with data
- ✅ All tests pass
- ✅ No breaking changes to Development 2.1

### Frontend

- ✅ Service created
- ✅ Hook created
- ✅ Components created
- ✅ Pages created
- ✅ Routes added
- ✅ Navigation updated
- ✅ Build passes
- ✅ No console errors

### Documentation

- ✅ Development 2.2 documentation created
- ✅ All endpoints documented
- ✅ RBAC documented
- ✅ Manual test results documented

---

## Estimated Timeline

| Phase | Task | Duration |
|-------|------|----------|
| 1 | Database & Model | 1 jam |
| 2 | Validation & Requests | 45 menit |
| 3 | Resources & Response | 30 menit |
| 4 | Policy & Authorization | 30 menit |
| 5 | Service Layer | 45 menit |
| 6 | Controller | 1.5 jam |
| 7 | Routes | 15 menit |
| 8 | Seeder | 45 menit |
| 9 | Testing | 1.5 jam |
| 10 | Backend QA | 30 menit |
| **Backend Total** | | **~8 jam** |
| 1 | Service Layer | 45 menit |
| 2 | Custom Hook | 1 jam |
| 3 | Components | 1.5 jam |
| 4 | Pages | 2 jam |
| 5 | Navigation & Routes | 45 menit |
| 6 | Integration | 1 jam |
| 7 | Frontend QA | 1 jam |
| **Frontend Total** | | **~8 jam** |
| 1 | Documentation | 1 jam |
| **Documentation Total** | | **~1 jam** |
| 1 | Git Commits | 1 jam |
| **Git Total** | | **~1 jam** |
| | **TOTAL** | **~18 jam** |

---

**Status**: ✅ Task List Complete

Siap untuk Implementation.
