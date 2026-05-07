# Design — Frontend Development 2.1 Tahun Ajaran & Semester

**Tanggal**: 7 Mei 2026  
**Status**: Design Phase  
**Tujuan**: Desain teknis frontend untuk manajemen tahun ajaran dan semester

---

## Arsitektur Sistem

### Struktur Folder
```
isms-ewa-frontend/src/
├── services/
│   ├── academicYearService.js
│   └── semesterService.js
├── hooks/
│   ├── useAcademicYears.js
│   └── useSemesters.js
├── pages/
│   └── academic/
│       ├── AcademicYearsPage.jsx
│       └── SemestersPage.jsx
├── components/
│   └── academic/
│       ├── AcademicYearForm.jsx
│       ├── SemesterForm.jsx
│       └── ActivePeriodIndicator.jsx
└── App.jsx (update routing)
```

---

## Service Layer

### academicYearService.js
```javascript
// Methods:
- getAcademicYears(page, search, sort)
- getAcademicYear(id)
- createAcademicYear(data)
- updateAcademicYear(id, data)
- deleteAcademicYear(id)
- activateAcademicYear(id)
- getActiveAcademicYear()
```

### semesterService.js
```javascript
// Methods:
- getSemesters(page, search, sort)
- getSemester(id)
- createSemester(data)
- updateSemester(id, data)
- deleteSemester(id)
- activateSemester(id)
- getActiveSemester()
- getSemestersByAcademicYear(academicYearId)
```

---

## Custom Hooks

### useAcademicYears()
```javascript
// Returns:
{
  academicYears: [],
  loading: false,
  error: null,
  pagination: { page, total, perPage },
  search: '',
  sort: { by, dir },
  
  // Methods:
  setSearch(value),
  setSort(by, dir),
  setPage(page),
  create(data),
  update(id, data),
  delete(id),
  activate(id),
  refetch()
}
```

### useSemesters()
```javascript
// Same structure as useAcademicYears
// Plus:
- filterByAcademicYear(academicYearId)
```

---

## Pages

### AcademicYearsPage.jsx
- List academic years dengan pagination, search, sort
- Buttons: Create, Edit, Delete, Activate (role-based)
- Active indicator
- Modal forms untuk create/edit
- Confirmation dialogs untuk delete/activate

### SemestersPage.jsx
- List semesters dengan academic year filter
- Same features sebagai AcademicYearsPage
- Filter dropdown untuk academic year

---

## Components

### AcademicYearForm.jsx
- Fields: year, start_date, end_date
- Validation: format YYYY/YYYY, end_date > start_date
- Submit button dengan loading state

### SemesterForm.jsx
- Fields: academic_year_id (dropdown), semester_number (1 atau 2), start_date, end_date
- Validation: semester_number 1 atau 2, dates dalam range academic year
- Submit button dengan loading state

### ActivePeriodIndicator.jsx
- Display active academic year dan semester di topbar
- Warning jika tidak ada active period
- Update real-time setelah activation

---

## Routing

```javascript
// Add to App.jsx:
<Route path="/academic-years" element={<AcademicYearsPage />} />
<Route path="/semesters" element={<SemestersPage />} />
```

---

## Navigation Integration

Update Sidebar.jsx:
```javascript
// Add menu items under Academic section:
- Tahun Ajaran → /academic-years
- Semester → /semesters
```

---

## State Management

- Use React hooks (useState, useEffect, useContext)
- Custom hooks untuk data fetching dan caching
- Context API untuk active period (optional)
- Local state untuk form, pagination, search

---

## API Integration

- Use existing API client dari project
- Implement error handling dengan try-catch
- Show toast notifications untuk success/error
- Implement loading states untuk semua async operations

---

## Role-Based Access

```javascript
// Admin: Full access
- Show all buttons (create, edit, delete, activate)

// Teacher & Homeroom Teacher: Read-only
- Hide create, edit, delete, activate buttons
- Show list dan detail only
```

---

## Validation Rules

### Academic Year
- Year format: YYYY/YYYY (e.g., 2024/2025)
- Year must be unique
- End date must be after start date

### Semester
- Semester number: 1 atau 2
- Cannot have duplicate semester number per academic year
- Start date dan end date harus dalam range academic year
- End date must be after start date

---

## UI/UX Patterns

- Use existing modal patterns dari project
- Use existing table/list patterns
- Use existing form patterns
- Use existing notification/toast patterns
- Responsive design (mobile, tablet, desktop)
- Loading skeletons untuk data tables
- Confirmation dialogs untuk destructive actions

---

## Performance Considerations

- Pagination: 15 items per page
- Search debounce: 300ms
- Cache active period data
- Lazy load pages
- Optimize re-renders dengan React.memo

---

## Error Handling

- Display user-friendly error messages
- Show validation errors di form fields
- Handle network errors gracefully
- Retry mechanism untuk failed requests
- Log errors untuk debugging

---

## Testing Strategy

- Unit tests untuk services
- Component tests untuk forms dan pages
- Integration tests untuk API calls
- Manual testing untuk user flows

---

## Implementation Order

1. Create services (academicYearService, semesterService)
2. Create custom hooks (useAcademicYears, useSemesters)
3. Create form components (AcademicYearForm, SemesterForm)
4. Create pages (AcademicYearsPage, SemestersPage)
5. Create ActivePeriodIndicator component
6. Update routing di App.jsx
7. Update navigation di Sidebar.jsx
8. Manual testing
9. Build verification

---

## Kesimpulan

Design ini menyediakan blueprint teknis untuk implementasi frontend Development 2.1 dengan:
- Clear folder structure
- Reusable services dan hooks
- Component-based architecture
- Role-based access control
- Proper error handling
- Performance optimization
- Responsive design

Siap untuk fase implementation.
