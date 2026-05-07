# Phase 7.5: Core CRUD Completion — Design

## Architecture Overview

### Component Structure
```
StudentsPage
├── Modal (for StudentForm)
│   └── StudentForm
├── ConfirmDialog (for delete)
└── Student list with action buttons

ClassesPage
├── Modal (for ClassForm)
│   └── ClassForm
├── ConfirmDialog (for delete)
└── Class list with action buttons
```

### Data Flow
1. **Create/Edit**: User clicks Add/Edit → Modal opens → Form submitted → API call → List refreshes → Success message
2. **Delete**: User clicks Delete → Confirmation dialog → API call → List refreshes → Success message
3. **Error Handling**: API error → Error message displayed → User can retry

## Component Design

### StudentForm Component
**Location**: `isms-ewa-frontend/src/components/students/StudentForm.jsx`

**Props**:
- `initialData` (object, optional): Pre-filled data for edit mode
- `onSubmit` (function): Callback when form is submitted
- `loading` (boolean): Loading state during API call
- `error` (string): Error message from backend

**Fields**:
- `student_id` (text, required): Unique student identifier
- `name` (text, required): Student full name
- `email` (email, required): Student email address
- `gender` (select, required): Male/Female
- `birth_date` (date, required): Date of birth
- `address` (textarea, optional): Student address
- `school_class_id` (select, required): Class assignment

**Validation**:
- All required fields must be filled
- Email must be valid format
- Student ID must be unique (backend validation)
- Birth date must be valid date

**Features**:
- Clear validation error messages
- Backend error display
- Loading state on submit button
- Form reset after successful submission
- Reuse Phase 7 form patterns (GradeForm structure)

### ClassForm Component
**Location**: `isms-ewa-frontend/src/components/classes/ClassForm.jsx`

**Props**:
- `initialData` (object, optional): Pre-filled data for edit mode
- `onSubmit` (function): Callback when form is submitted
- `loading` (boolean): Loading state during API call
- `error` (string): Error message from backend
- `teachers` (array): List of available teachers for homeroom assignment

**Fields**:
- `name` (text, required): Class name (e.g., "10-A", "XI-B")
- `grade_level` (select, required): Grade level (10, 11, 12)
- `homeroom_teacher_id` (select, optional): Homeroom teacher assignment

**Validation**:
- Class name must be filled
- Grade level must be selected
- Homeroom teacher must exist if assigned

**Features**:
- Clear validation error messages
- Backend error display
- Loading state on submit button
- Form reset after successful submission
- Reuse Phase 7 form patterns

## Page Integration Design

### StudentsPage Updates
**Location**: `isms-ewa-frontend/src/pages/students/StudentsPage.jsx`

**New State**:
```javascript
const [showModal, setShowModal] = useState(false);
const [editingStudent, setEditingStudent] = useState(null);
const [formLoading, setFormLoading] = useState(false);
const [formError, setFormError] = useState(null);
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
const [deletingStudent, setDeletingStudent] = useState(null);
```

**New Functions**:
- `handleAddStudent()`: Open modal with empty form
- `handleEditStudent(student)`: Open modal with student data
- `handleSubmitForm(formData)`: Create or update student
- `handleDeleteStudent(student)`: Show delete confirmation
- `handleConfirmDelete()`: Execute delete API call
- `handleCloseModal()`: Close modal and reset state

**Modal Integration**:
```jsx
<Modal
  isOpen={showModal}
  onClose={handleCloseModal}
  title={editingStudent ? 'Edit Student' : 'Add Student'}
  size="lg"
>
  <StudentForm
    initialData={editingStudent}
    onSubmit={handleSubmitForm}
    loading={formLoading}
    error={formError}
  />
</Modal>
```

**Delete Confirmation**:
```jsx
<ConfirmDialog
  isOpen={showDeleteConfirm}
  onClose={() => setShowDeleteConfirm(false)}
  onConfirm={handleConfirmDelete}
  title="Delete Student"
  message={`Are you sure you want to delete ${deletingStudent?.name}?`}
  variant="danger"
  loading={formLoading}
/>
```

**Action Buttons**:
- Add Student button: Only visible to admin
- Edit button in table: Only visible to admin
- Delete button in table: Only visible to admin

### ClassesPage Updates
**Location**: `isms-ewa-frontend/src/pages/classes/ClassesPage.jsx`

**New State**:
```javascript
const [showModal, setShowModal] = useState(false);
const [editingClass, setEditingClass] = useState(null);
const [formLoading, setFormLoading] = useState(false);
const [formError, setFormError] = useState(null);
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
const [deletingClass, setDeletingClass] = useState(null);
```

**New Functions**:
- `handleAddClass()`: Open modal with empty form
- `handleEditClass(cls)`: Open modal with class data
- `handleSubmitForm(formData)`: Create or update class
- `handleDeleteClass(cls)`: Show delete confirmation
- `handleConfirmDelete()`: Execute delete API call
- `handleCloseModal()`: Close modal and reset state

**Modal Integration**: Similar to StudentsPage

**Delete Confirmation**: Similar to StudentsPage

**Action Buttons**:
- Add Class button: Only visible to admin
- Edit button in card: Only visible to admin
- Delete button in card: Only visible to admin

## Error Handling Strategy

### HTTP Status Codes
- **422 Validation Error**: Display field-level errors from backend
- **403 Forbidden**: Display "You don't have permission to perform this action"
- **404 Not Found**: Display "Resource not found"
- **500 Server Error**: Display "Server error occurred, please try again"

### User Feedback
- **Success**: Toast notification "Student/Class created/updated/deleted successfully"
- **Error**: Modal error message with retry option
- **Loading**: Disabled submit button with loading spinner

## Data Refresh Strategy

### After Create/Update/Delete
1. Close modal/confirmation dialog
2. Call `refetch()` from useStudents/useClasses hook
3. List automatically updates with new data
4. Show success message
5. Reset form state

### No Manual Refresh Required
- User stays on same page
- List updates automatically
- No page reload needed

## Role-Based Access Control

### Admin
- Can see Add/Edit/Delete buttons
- Can perform all CRUD operations

### Teacher
- Cannot see Add/Edit/Delete buttons
- Read-only access to lists

### Homeroom Teacher
- Cannot see Add/Edit/Delete buttons
- Read-only access to their class students

### Implementation
```javascript
const canCreateStudent = user?.role === 'admin';
const canEditStudent = user?.role === 'admin';
const canDeleteStudent = user?.role === 'admin';
```

## Reusable Components & Utilities

### From Phase 7
- `Modal.jsx`: For form modals
- `ConfirmDialog.jsx`: For delete confirmations
- `Button.jsx`: For action buttons
- `Card.jsx`: For layout
- `formatters.js`: For data formatting
- `ErrorBoundary.jsx`: For error handling

### Services
- `studentService.js`: All CRUD methods exist
- `classService.js`: All CRUD methods exist

### Hooks
- `useStudents()`: Fetch and manage student list
- `useClasses()`: Fetch and manage class list
- `useAuth()`: Get user role for access control

## Implementation Sequence

1. **Create StudentForm component** with validation and error handling
2. **Create ClassForm component** with validation and error handling
3. **Integrate StudentForm into StudentsPage** with modal and delete confirmation
4. **Integrate ClassForm into ClassesPage** with modal and delete confirmation
5. **Add role-based visibility** for action buttons
6. **Test all CRUD flows** for each role
7. **Verify error handling** for all HTTP status codes
8. **Build and verify** no errors
9. **Manual QA testing** for all roles
10. **Documentation** and git commits

## Testing Strategy

### Unit Tests (if applicable)
- Form validation logic
- Error message display
- Role-based visibility

### Integration Tests
- Create student/class flow
- Update student/class flow
- Delete student/class flow
- List refresh after mutations
- Error handling for each HTTP status

### Manual QA
- Admin: Full CRUD access
- Teacher: Read-only access
- Homeroom Teacher: Read-only access
- Error scenarios: 422, 403, 404, 500
- Success scenarios: Create, update, delete
- UI responsiveness: Desktop, tablet, mobile
