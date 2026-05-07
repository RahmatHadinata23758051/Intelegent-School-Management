# Tasks — Frontend Development 2.1 Tahun Ajaran & Semester

**Status**: Implementation Phase  
**Total Tasks**: 11 main tasks + subtasks

---

## Task 1: Create API Services

- [x] 1.1 Create academicYearService.js dengan methods: getAcademicYears, getAcademicYear, createAcademicYear, updateAcademicYear, deleteAcademicYear, activateAcademicYear, getActiveAcademicYear
- [x] 1.2 Create semesterService.js dengan methods: getSemesters, getSemester, createSemester, updateSemester, deleteSemester, activateSemester, getActiveSemester, getSemestersByAcademicYear
- [x] 1.3 Implement error handling dan response transformation di services

---

## Task 2: Create Custom Hooks

- [x] 2.1 Create useAcademicYears hook dengan state management untuk list, pagination, search, sort
- [x] 2.2 Create useSemesters hook dengan state management untuk list, pagination, search, sort, filter
- [ ] 2.3 Implement loading dan error states di hooks

---

## Task 3: Create Form Components

- [x] 3.1 Create AcademicYearForm.jsx dengan fields: year, start_date, end_date
- [x] 3.2 Implement validation untuk year format (YYYY/YYYY) dan date range
- [x] 3.3 Create SemesterForm.jsx dengan fields: academic_year_id, semester_number, start_date, end_date
- [x] 3.4 Implement validation untuk semester number (1 atau 2) dan date range

---

## Task 4: Create Page Components

- [x] 4.1 Create AcademicYearsPage.jsx dengan list, pagination, search, sort
- [x] 4.2 Add create, edit, delete, activate buttons dengan role-based visibility
- [x] 4.3 Create SemestersPage.jsx dengan list, pagination, search, sort, academic year filter
- [x] 4.4 Add create, edit, delete, activate buttons dengan role-based visibility

---

## Task 5: Create Active Period Indicator

- [x] 5.1 Create ActivePeriodIndicator.jsx component
- [x] 5.2 Display active academic year dan semester di topbar
- [x] 5.3 Show warning jika tidak ada active period
- [x] 5.4 Update real-time setelah activation

---

## Task 6: Update Routing

- [x] 6.1 Add routes untuk /academic-years dan /semesters di App.jsx
- [x] 6.2 Implement route protection berdasarkan role (optional)
- [x] 6.3 Add breadcrumbs untuk navigation

---

## Task 7: Update Navigation

- [x] 7.1 Add "Tahun Ajaran" menu item di Sidebar
- [x] 7.2 Add "Semester" menu item di Sidebar
- [x] 7.3 Link menu items ke routes yang sesuai

---

## Task 8: Implement Modal Forms

- [x] 8.1 Create modal untuk create academic year
- [x] 8.2 Create modal untuk edit academic year
- [x] 8.3 Create modal untuk create semester
- [x] 8.4 Create modal untuk edit semester
- [x] 8.5 Implement confirmation dialogs untuk delete dan activate

---

## Task 9: Implement Role-Based Access Control

- [x] 9.1 Hide create, edit, delete, activate buttons untuk non-admin users
- [x] 9.2 Show read-only view untuk teachers
- [x] 9.3 Implement proper authorization checks

---

## Task 10: Manual Testing

- [x] 10.1 Test as admin: create, edit, delete, activate academic years
- [x] 10.2 Test as admin: create, edit, delete, activate semesters
- [x] 10.3 Test as teacher: verify read-only access
- [x] 10.4 Test validation errors
- [x] 10.5 Test error handling
- [x] 10.6 Test responsive design (mobile, tablet, desktop)
- [x] 10.7 Test active period indicator updates

---

## Task 11: Build & Documentation

- [x] 11.1 Run npm run build untuk verify frontend build
- [x] 11.2 Check untuk console errors dan warnings
- [x] 11.3 Update development-2-1-tahun-ajaran-semester.md dengan frontend implementation details
- [x] 11.4 Create git commit dengan message: "feat: implement frontend Development 2.1"
- [x] 11.5 Push ke main branch

---

## Acceptance Criteria

- ✅ All 11 tasks completed
- ✅ Frontend build successful (npm run build)
- ✅ No console errors atau warnings
- ✅ All CRUD operations working
- ✅ Role-based access control working
- ✅ Active period indicator working
- ✅ Responsive design working
- ✅ Manual testing passed
- ✅ Documentation updated
- ✅ Code committed dan pushed

---

## Estimated Timeline

- Task 1-2: 2 hours (services dan hooks)
- Task 3-4: 3 hours (forms dan pages)
- Task 5-7: 1.5 hours (indicator, routing, navigation)
- Task 8-9: 1.5 hours (modals dan RBAC)
- Task 10-11: 2 hours (testing dan build)

**Total**: ~10 hours

---

## Notes

- Follow existing frontend patterns dari Phase 7
- Use existing API client
- Implement proper error handling
- Test thoroughly sebelum push
- Keep code clean dan maintainable
