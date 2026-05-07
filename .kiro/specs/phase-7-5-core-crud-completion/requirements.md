# Phase 7.5: Core CRUD Completion — Development 1 Closure

## Overview
Close the functional gap in Development 1 by implementing complete Create/Update/Delete flows for Students and Classes. The Add Student and Add Class buttons exist in the UI but lack functional modal forms and integration.

## Business Requirements

### 1. Student Management CRUD
- **Create Student**: Admin can add new students with required fields (student_id, name, email, gender, birth_date, address, school_class_id)
- **Update Student**: Admin can edit existing student information
- **Delete Student**: Admin can remove students with confirmation
- **List Refresh**: Student list automatically refreshes after create/update/delete without manual browser refresh
- **Error Handling**: Clear error messages for validation (422), authorization (403), not found (404), and server errors (500)
- **Success Feedback**: User receives confirmation when action succeeds

### 2. Class Management CRUD
- **Create Class**: Admin can add new classes with required fields (name, grade_level, homeroom_teacher_id)
- **Update Class**: Admin can edit existing class information
- **Delete Class**: Admin can remove classes with confirmation
- **List Refresh**: Class list automatically refreshes after create/update/delete without manual browser refresh
- **Error Handling**: Clear error messages for validation (422), authorization (403), not found (404), and server errors (500)
- **Success Feedback**: User receives confirmation when action succeeds

### 3. Role-Based Access Control
- **Admin**: Can create, edit, and delete students and classes
- **Teacher**: Cannot create/delete (read-only or per backend policy)
- **Homeroom Teacher**: Cannot create/delete (read-only scoped to their class)
- **UI Visibility**: Add/Edit/Delete buttons only visible to authorized users

### 4. User Experience
- Modal forms for create/edit operations
- Confirmation dialogs for delete operations
- Loading states during API calls
- Inline validation with clear error messages
- Success/error toast notifications
- Smooth transitions and responsive design

## Acceptance Criteria

### Student CRUD
- [ ] StudentForm component created with all required fields
- [ ] StudentsPage modal integration for create/edit
- [ ] Add Student button opens modal with empty form
- [ ] Edit Student button (in detail page) opens modal with pre-filled data
- [ ] Delete Student confirmation dialog works
- [ ] Student list refreshes after create/update/delete
- [ ] Error messages display for 422/403/404/500 responses
- [ ] Success messages display after operations
- [ ] Only admin can see Add/Edit/Delete buttons

### Class CRUD
- [ ] ClassForm component created with all required fields
- [ ] ClassesPage modal integration for create/edit
- [ ] Add Class button opens modal with empty form
- [ ] Edit Class button (in detail page) opens modal with pre-filled data
- [ ] Delete Class confirmation dialog works
- [ ] Class list refreshes after create/update/delete
- [ ] Error messages display for 422/403/404/500 responses
- [ ] Success messages display after operations
- [ ] Only admin can see Add/Edit/Delete buttons

### Quality Assurance
- [ ] Build succeeds with no errors
- [ ] Manual testing passed for admin role
- [ ] Manual testing passed for teacher role
- [ ] Manual testing passed for homeroom teacher role
- [ ] All forms validate input correctly
- [ ] All API errors handled gracefully

## Scope Boundaries

### In Scope (Development 1 Closure)
- Core CRUD operations for students and classes
- Modal forms with validation
- Error handling and user feedback
- Role-based UI visibility
- List refresh after mutations

### Out of Scope (Development 2)
- Notification system
- Parent portal
- Export PDF
- AI/ML features
- Raport generation
- Multi-school SaaS
- Advanced analytics
- Flow adjustments per owner

## Technical Constraints
- Use existing Modal and ConfirmDialog components from Phase 7
- Use existing formatters and utilities
- Follow Phase 7 form patterns (GradeForm, ViolationForm)
- Reuse existing services (studentService, classService)
- Maintain role-based access control from backend policies
- No new dependencies required

## Success Metrics
- All CRUD operations functional for students and classes
- Zero build errors
- All manual QA tests pass
- User can complete full create/edit/delete workflows without page refresh
- Error messages are clear and actionable
