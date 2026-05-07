# Phase 7.5: Core CRUD Completion — Implementation Tasks

## Task 1: Create StudentForm Component
- [ ] Create `isms-ewa-frontend/src/components/students/StudentForm.jsx`
- [ ] Implement form fields: student_id, name, email, gender, birth_date, address, school_class_id
- [ ] Add client-side validation for all required fields
- [ ] Add email format validation
- [ ] Display backend validation errors (422)
- [ ] Display backend authorization errors (403)
- [ ] Display backend not found errors (404)
- [ ] Display backend server errors (500)
- [ ] Add loading state to submit button
- [ ] Follow GradeForm pattern from Phase 7
- [ ] Add JSDoc comments
- [ ] Test form submission with valid data
- [ ] Test form submission with invalid data
- [ ] Test error message display

## Task 2: Create ClassForm Component
- [ ] Create `isms-ewa-frontend/src/components/classes/ClassForm.jsx`
- [ ] Implement form fields: name, grade_level, homeroom_teacher_id
- [ ] Add client-side validation for required fields
- [ ] Display backend validation errors (422)
- [ ] Display backend authorization errors (403)
- [ ] Display backend not found errors (404)
- [ ] Display backend server errors (500)
- [ ] Add loading state to submit button
- [ ] Follow GradeForm pattern from Phase 7
- [ ] Add JSDoc comments
- [ ] Test form submission with valid data
- [ ] Test form submission with invalid data
- [ ] Test error message display

## Task 3: Integrate StudentForm into StudentsPage
- [ ] Add modal state management to StudentsPage
- [ ] Add form state management (loading, error)
- [ ] Add delete confirmation state management
- [ ] Implement `handleAddStudent()` function
- [ ] Implement `handleEditStudent(student)` function
- [ ] Implement `handleSubmitForm(formData)` function
- [ ] Implement `handleDeleteStudent(student)` function
- [ ] Implement `handleConfirmDelete()` function
- [ ] Implement `handleCloseModal()` function
- [ ] Add Modal component with StudentForm
- [ ] Add ConfirmDialog for delete confirmation
- [ ] Add "Add Student" button with role check (admin only)
- [ ] Add Edit button to table rows (admin only)
- [ ] Add Delete button to table rows (admin only)
- [ ] Ensure list refreshes after create/update/delete
- [ ] Display success message after operations
- [ ] Test create student flow
- [ ] Test update student flow
- [ ] Test delete student flow
- [ ] Test role-based visibility

## Task 4: Integrate ClassForm into ClassesPage
- [ ] Add modal state management to ClassesPage
- [ ] Add form state management (loading, error)
- [ ] Add delete confirmation state management
- [ ] Implement `handleAddClass()` function
- [ ] Implement `handleEditClass(cls)` function
- [ ] Implement `handleSubmitForm(formData)` function
- [ ] Implement `handleDeleteClass(cls)` function
- [ ] Implement `handleConfirmDelete()` function
- [ ] Implement `handleCloseModal()` function
- [ ] Add Modal component with ClassForm
- [ ] Add ConfirmDialog for delete confirmation
- [ ] Update "Add Class" button to open modal (admin only)
- [ ] Add Edit button to class cards (admin only)
- [ ] Add Delete button to class cards (admin only)
- [ ] Ensure list refreshes after create/update/delete
- [ ] Display success message after operations
- [ ] Test create class flow
- [ ] Test update class flow
- [ ] Test delete class flow
- [ ] Test role-based visibility

## Task 5: Add Success/Error Feedback
- [ ] Create or use existing Alert component for notifications
- [ ] Display success message after create student
- [ ] Display success message after update student
- [ ] Display success message after delete student
- [ ] Display success message after create class
- [ ] Display success message after update class
- [ ] Display success message after delete class
- [ ] Display error message for 422 validation errors
- [ ] Display error message for 403 authorization errors
- [ ] Display error message for 404 not found errors
- [ ] Display error message for 500 server errors
- [ ] Test all success scenarios
- [ ] Test all error scenarios

## Task 6: Manual QA Testing
- [ ] Test as admin: Create student
- [ ] Test as admin: Update student
- [ ] Test as admin: Delete student
- [ ] Test as admin: Create class
- [ ] Test as admin: Update class
- [ ] Test as admin: Delete class
- [ ] Test as teacher: Verify Add/Edit/Delete buttons hidden
- [ ] Test as homeroom teacher: Verify Add/Edit/Delete buttons hidden
- [ ] Test validation: Empty required fields
- [ ] Test validation: Invalid email format
- [ ] Test validation: Invalid date format
- [ ] Test error handling: 422 validation error
- [ ] Test error handling: 403 authorization error
- [ ] Test error handling: 404 not found error
- [ ] Test error handling: 500 server error
- [ ] Test list refresh: After create
- [ ] Test list refresh: After update
- [ ] Test list refresh: After delete
- [ ] Test UI responsiveness: Desktop
- [ ] Test UI responsiveness: Tablet
- [ ] Test UI responsiveness: Mobile

## Task 7: Build Verification
- [ ] Run `npm run build` in isms-ewa-frontend
- [ ] Verify no build errors
- [ ] Verify no build warnings
- [ ] Check bundle size is reasonable
- [ ] Verify all modules load correctly

## Task 8: Git Commits
- [ ] Commit: "feat: create StudentForm component with validation"
- [ ] Commit: "feat: create ClassForm component with validation"
- [ ] Commit: "feat: integrate StudentForm into StudentsPage with CRUD"
- [ ] Commit: "feat: integrate ClassForm into ClassesPage with CRUD"
- [ ] Commit: "feat: add success/error feedback for CRUD operations"
- [ ] Commit: "docs: add Phase 7.5 Core CRUD Completion documentation"
- [ ] Push all commits to main branch

## Task 9: Documentation
- [ ] Create `docs/phase-7-5-core-crud-completion-development-1.md`
- [ ] Document all changes made
- [ ] Document testing results
- [ ] Document any issues encountered and resolved
- [ ] Document manual QA results
- [ ] Include screenshots of new forms and modals
- [ ] Include list of all files created/modified
- [ ] Include build verification results
