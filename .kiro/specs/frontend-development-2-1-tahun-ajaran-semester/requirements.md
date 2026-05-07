# Requirements Document

## Introduction

This document outlines the requirements for implementing the frontend user interface for **Frontend Development 2.1 — Tahun Ajaran & Semester**. The backend API is complete with all 31 tests passing, providing a solid foundation for frontend implementation. This frontend will enable administrators, teachers, and homeroom teachers to manage academic years and semesters through a comprehensive web interface.

The system manages the foundational academic periods that all other academic modules depend on, ensuring proper temporal organization of educational data.

## Glossary

- **Academic_Year**: A yearly academic period with format "YYYY/YYYY" (e.g., "2024/2025")
- **Semester**: A half-year academic period within an academic year (semester 1 or 2)
- **Active_Period**: The currently selected academic year and semester for system operations
- **Admin**: User with full CRUD and activation permissions
- **Teacher**: User with read-only access to academic periods
- **Homeroom_Teacher**: User with read-only access to academic periods
- **Frontend_App**: The React-based web application interface
- **API_Client**: Service layer for backend communication
- **Modal_Form**: Popup dialog for create/edit operations
- **Data_Table**: Paginated list component with search and sort capabilities
- **Active_Indicator**: Visual element showing current active status

## Requirements

### Requirement 1: Academic Years Management Interface

**User Story:** As an Admin, I want to manage academic years through a comprehensive web interface, so that I can create, view, edit, delete, and activate academic periods for the school system.

#### Acceptance Criteria

1. WHEN an Admin accesses the Academic Years page, THE Frontend_App SHALL display a paginated list of all academic years with search and sort capabilities
2. WHEN an Admin clicks "Create Academic Year", THE Frontend_App SHALL open a modal form with fields for year, start date, and end date
3. WHEN an Admin submits a valid academic year form, THE Frontend_App SHALL call the API and display success notification
4. WHEN an Admin clicks "Edit" on an academic year, THE Frontend_App SHALL open a pre-populated modal form
5. WHEN an Admin clicks "Delete" on an inactive academic year, THE Frontend_App SHALL show confirmation dialog and proceed with deletion
6. WHEN an Admin clicks "Activate" on an academic year, THE Frontend_App SHALL show confirmation dialog and activate the academic year
7. THE Frontend_App SHALL display active status indicator for the currently active academic year
8. WHEN an Admin tries to delete an active academic year, THE Frontend_App SHALL prevent the action and show error message
9. THE Frontend_App SHALL validate year format as "YYYY/YYYY" and ensure end date is after start date
10. THE Frontend_App SHALL display loading states during API operations

### Requirement 2: Semesters Management Interface

**User Story:** As an Admin, I want to manage semesters through a comprehensive web interface, so that I can create, view, edit, delete, and activate semester periods within academic years.

#### Acceptance Criteria

1. WHEN an Admin accesses the Semesters page, THE Frontend_App SHALL display a paginated list of all semesters with academic year information
2. WHEN an Admin clicks "Create Semester", THE Frontend_App SHALL open a modal form with fields for academic year selection, semester number, start date, and end date
3. WHEN an Admin submits a valid semester form, THE Frontend_App SHALL call the API and display success notification
4. WHEN an Admin clicks "Edit" on a semester, THE Frontend_App SHALL open a pre-populated modal form
5. WHEN an Admin clicks "Delete" on an inactive semester, THE Frontend_App SHALL show confirmation dialog and proceed with deletion
6. WHEN an Admin clicks "Activate" on a semester, THE Frontend_App SHALL show confirmation dialog and activate the semester
7. THE Frontend_App SHALL display active status indicator for the currently active semester
8. WHEN an Admin tries to delete an active semester, THE Frontend_App SHALL prevent the action and show error message
9. THE Frontend_App SHALL validate semester number as 1 or 2 and ensure dates are within academic year range
10. THE Frontend_App SHALL filter semesters by academic year when requested

### Requirement 3: Read-Only Access for Teachers

**User Story:** As a Teacher or Homeroom Teacher, I want to view academic years and semesters information, so that I can understand the current academic periods without being able to modify them.

#### Acceptance Criteria

1. WHEN a Teacher accesses the Academic Years page, THE Frontend_App SHALL display the list without create, edit, delete, or activate buttons
2. WHEN a Teacher accesses the Semesters page, THE Frontend_App SHALL display the list without create, edit, delete, or activate buttons
3. THE Frontend_App SHALL show active indicators for both academic years and semesters to Teachers
4. WHEN a Teacher clicks on an academic year or semester, THE Frontend_App SHALL display detailed information in read-only mode
5. THE Frontend_App SHALL maintain search and filter functionality for Teachers

### Requirement 4: Navigation and Menu Integration

**User Story:** As a system user, I want to access academic period management through the main navigation, so that I can easily find and navigate to these features.

#### Acceptance Criteria

1. THE Frontend_App SHALL add "Tahun Ajaran" menu item under Academic section in the main navigation
2. THE Frontend_App SHALL add "Semester" menu item under Academic section in the main navigation
3. WHEN a user clicks navigation items, THE Frontend_App SHALL route to the appropriate pages
4. THE Frontend_App SHALL display proper breadcrumbs showing current page location
5. THE Frontend_App SHALL highlight active menu items when on academic period pages

### Requirement 5: Active Period Indicator System

**User Story:** As a system user, I want to see the currently active academic year and semester prominently displayed, so that I know which period the system is currently operating in.

#### Acceptance Criteria

1. THE Frontend_App SHALL display the active academic year and semester in the top navigation bar
2. WHEN no active academic year is set, THE Frontend_App SHALL display a warning message in the header
3. WHEN no active semester is set, THE Frontend_App SHALL display a warning message in the header
4. THE Frontend_App SHALL update the active period display immediately after activation changes
5. THE Frontend_App SHALL make the active period information visible on all pages

### Requirement 6: Form Validation and Error Handling

**User Story:** As an Admin, I want comprehensive form validation and clear error messages, so that I can successfully create and edit academic periods without confusion.

#### Acceptance Criteria

1. WHEN an Admin enters invalid year format, THE Frontend_App SHALL display format error message "Format harus YYYY/YYYY"
2. WHEN an Admin selects end date before start date, THE Frontend_App SHALL display validation error "Tanggal akhir harus setelah tanggal mulai"
3. WHEN an Admin tries to create duplicate academic year, THE Frontend_App SHALL display API error message
4. WHEN an Admin tries to create duplicate semester number, THE Frontend_App SHALL display validation error
5. WHEN API calls fail, THE Frontend_App SHALL display user-friendly error messages
6. THE Frontend_App SHALL highlight invalid form fields with red borders and error text
7. THE Frontend_App SHALL disable submit buttons during form submission
8. WHEN semester dates are outside academic year range, THE Frontend_App SHALL display validation error

### Requirement 7: Data Loading and Performance

**User Story:** As a system user, I want fast and responsive data loading with clear loading indicators, so that I have a smooth user experience.

#### Acceptance Criteria

1. WHEN pages load, THE Frontend_App SHALL display skeleton loading states for data tables
2. WHEN forms submit, THE Frontend_App SHALL show loading spinners on submit buttons
3. THE Frontend_App SHALL implement pagination with 15 items per page for academic years and semesters
4. THE Frontend_App SHALL cache active academic year and semester data to reduce API calls
5. WHEN search is performed, THE Frontend_App SHALL debounce search input by 300ms
6. THE Frontend_App SHALL display "No data found" message when lists are empty
7. THE Frontend_App SHALL refresh data automatically after create, update, delete, or activate operations

### Requirement 8: Responsive Design and Accessibility

**User Story:** As a system user, I want the interface to work well on different screen sizes and be accessible, so that I can use the system effectively regardless of device or accessibility needs.

#### Acceptance Criteria

1. THE Frontend_App SHALL display properly on desktop screens (1024px and above)
2. THE Frontend_App SHALL display properly on tablet screens (768px to 1023px)
3. THE Frontend_App SHALL display properly on mobile screens (below 768px)
4. THE Frontend_App SHALL provide keyboard navigation for all interactive elements
5. THE Frontend_App SHALL use proper ARIA labels for screen readers
6. THE Frontend_App SHALL maintain color contrast ratios of at least 4.5:1
7. THE Frontend_App SHALL use semantic HTML elements for proper structure
8. WHEN on mobile, THE Frontend_App SHALL stack table columns or use horizontal scroll

### Requirement 9: API Integration and State Management

**User Story:** As a developer, I want proper API integration and state management, so that the frontend communicates reliably with the backend and maintains consistent application state.

#### Acceptance Criteria

1. THE API_Client SHALL implement all academic year endpoints: GET, POST, PUT, DELETE, and activate
2. THE API_Client SHALL implement all semester endpoints: GET, POST, PUT, DELETE, and activate
3. THE API_Client SHALL handle authentication tokens and refresh them when needed
4. THE API_Client SHALL implement proper error handling for network failures and API errors
5. THE Frontend_App SHALL use React hooks for state management of academic periods data
6. THE Frontend_App SHALL implement optimistic updates for better user experience
7. THE API_Client SHALL implement request/response interceptors for consistent error handling
8. THE Frontend_App SHALL maintain loading states for all async operations

### Requirement 10: Confirmation Dialogs and User Feedback

**User Story:** As an Admin, I want clear confirmation dialogs for destructive actions and immediate feedback for all operations, so that I can confidently manage academic periods without accidental changes.

#### Acceptance Criteria

1. WHEN an Admin clicks delete, THE Frontend_App SHALL show confirmation dialog with academic year/semester details
2. WHEN an Admin clicks activate, THE Frontend_App SHALL show confirmation dialog explaining the impact
3. WHEN operations succeed, THE Frontend_App SHALL display success toast notifications
4. WHEN operations fail, THE Frontend_App SHALL display error toast notifications with specific messages
5. THE Frontend_App SHALL auto-dismiss success notifications after 3 seconds
6. THE Frontend_App SHALL require manual dismissal for error notifications
7. WHEN activating semester, THE Frontend_App SHALL explain that parent academic year will also be activated
8. THE Frontend_App SHALL prevent multiple simultaneous operations on the same record

### Requirement 11: Search and Filter Functionality

**User Story:** As a system user, I want to search and filter academic periods, so that I can quickly find specific academic years or semesters.

#### Acceptance Criteria

1. WHEN a user types in the search box, THE Frontend_App SHALL filter academic years by year field
2. WHEN a user selects academic year filter, THE Frontend_App SHALL show only semesters for that academic year
3. THE Frontend_App SHALL implement real-time search with 300ms debounce
4. THE Frontend_App SHALL highlight search terms in results when applicable
5. THE Frontend_App SHALL maintain search and filter state during navigation
6. THE Frontend_App SHALL clear search when user clicks clear button
7. THE Frontend_App SHALL show search result count when filters are applied
8. WHEN no results match search criteria, THE Frontend_App SHALL display "No results found" message

### Requirement 12: Data Sorting and Organization

**User Story:** As a system user, I want to sort academic periods by different criteria, so that I can organize the data according to my needs.

#### Acceptance Criteria

1. THE Frontend_App SHALL allow sorting academic years by year, start date, end date, and active status
2. THE Frontend_App SHALL allow sorting semesters by academic year, semester number, start date, end date, and active status
3. WHEN a user clicks column headers, THE Frontend_App SHALL toggle sort direction (ascending/descending)
4. THE Frontend_App SHALL display sort indicators (arrows) on active sort columns
5. THE Frontend_App SHALL maintain sort preferences during session
6. THE Frontend_App SHALL default sort academic years by year descending (newest first)
7. THE Frontend_App SHALL default sort semesters by academic year and semester number
8. THE Frontend_App SHALL combine sorting with search and filter functionality
