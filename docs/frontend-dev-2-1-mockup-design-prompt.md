# Prompt untuk Mockup Design Frontend Development 2.1

**Tujuan**: Membuat mockup design lengkap untuk frontend Development 2.1 (Tahun Ajaran & Semester) di Figma/Stitch

---

## Konteks Desain

### Aplikasi
- **Nama**: ISMS-EWA (Intelligent School Management System - Early Warning Alert)
- **Tipe**: Web application untuk manajemen sekolah
- **Target Users**: Admin, Teachers, Homeroom Teachers
- **Platform**: Desktop, Tablet, Mobile

### Warna & Branding
- **Primary Color**: Biru (gunakan dari existing design Phase 7)
- **Secondary Color**: Abu-abu
- **Accent Color**: Hijau (untuk success/active)
- **Danger Color**: Merah (untuk delete/inactive)
- **Background**: Putih/Light gray
- **Text**: Dark gray/Black

### Typography
- **Heading**: Bold, 24-32px
- **Subheading**: Semi-bold, 18-20px
- **Body**: Regular, 14-16px
- **Small**: Regular, 12-13px

### Spacing & Layout
- **Grid**: 12-column grid
- **Padding**: 16px, 24px, 32px
- **Margin**: 8px, 16px, 24px
- **Border Radius**: 4px, 8px
- **Shadow**: Subtle shadows untuk depth

---

## Halaman yang Perlu Didesain

### 1. Login Page
**Deskripsi**: Halaman login untuk semua user roles

**Elemen**:
- Logo ISMS-EWA di atas
- Form fields:
  - Email/Username input
  - Password input
  - "Remember me" checkbox
  - "Forgot password?" link
- Login button (primary color)
- Sign up link (optional)
- Footer dengan copyright

**Responsive**: 
- Desktop: Centered form, 400px width
- Mobile: Full width dengan padding

---

### 2. Dashboard/Home Page
**Deskripsi**: Landing page setelah login

**Elemen**:
- Header dengan:
  - Logo ISMS-EWA
  - Navigation menu (Tahun Ajaran, Semester, Students, Classes, dll)
  - User profile dropdown
  - Logout button
- Sidebar dengan menu items
- Main content area dengan:
  - Welcome message
  - Active academic year & semester indicator (prominent)
  - Quick stats cards (optional)
  - Recent activities (optional)
- Footer

**Active Period Indicator**:
- Show: "Tahun Ajaran Aktif: 2024/2025 | Semester Aktif: 1"
- Color: Green background dengan white text
- Position: Top right atau di topbar
- Warning state: Red background jika tidak ada active period

---

### 3. Tahun Ajaran (Academic Years) Page
**Deskripsi**: Halaman manajemen tahun ajaran

**Layout**:
- Header dengan title "Tahun Ajaran"
- Search & filter section:
  - Search input (placeholder: "Cari tahun ajaran...")
  - Sort dropdown (Year, Start Date, End Date, Active Status)
  - Create button (hanya untuk admin)
- Data table dengan columns:
  - Year (e.g., 2024/2025)
  - Start Date
  - End Date
  - Status (Active/Inactive) - dengan badge
  - Actions (View, Edit, Delete, Activate) - role-based
- Pagination (15 items per page)
- Empty state jika tidak ada data

**Table Design**:
- Header row: Light gray background
- Alternating row colors (white, very light gray)
- Hover effect pada rows
- Icons untuk actions (edit, delete, activate)
- Active badge: Green
- Inactive badge: Gray

**Responsive**:
- Desktop: Full table
- Tablet: Horizontal scroll atau collapse columns
- Mobile: Card view dengan swipe actions

---

### 4. Create/Edit Academic Year Modal
**Deskripsi**: Modal form untuk create/edit tahun ajaran

**Elemen**:
- Modal header dengan title ("Buat Tahun Ajaran" atau "Edit Tahun Ajaran")
- Close button (X)
- Form fields:
  - Year input (placeholder: "2024/2025", format validation)
  - Start Date picker
  - End Date picker
  - Validation messages (red text di bawah field)
- Buttons:
  - Cancel button (secondary)
  - Save button (primary, disabled saat loading)
- Loading state: Spinner di button

**Validation Messages**:
- "Format harus YYYY/YYYY"
- "Tahun ajaran sudah terdaftar"
- "Tanggal akhir harus setelah tanggal mulai"

**Responsive**:
- Desktop: 500px width
- Mobile: Full width dengan padding

---

### 5. Delete Confirmation Dialog
**Deskripsi**: Confirmation dialog untuk delete tahun ajaran

**Elemen**:
- Icon warning (triangle dengan exclamation mark)
- Title: "Hapus Tahun Ajaran?"
- Message: "Apakah Anda yakin ingin menghapus tahun ajaran 2024/2025? Tindakan ini tidak dapat dibatalkan."
- Buttons:
  - Cancel (secondary)
  - Delete (danger/red color)

---

### 6. Activate Confirmation Dialog
**Deskripsi**: Confirmation dialog untuk activate tahun ajaran

**Elemen**:
- Icon info (circle dengan i)
- Title: "Aktifkan Tahun Ajaran?"
- Message: "Apakah Anda yakin ingin mengaktifkan tahun ajaran 2024/2025? Tahun ajaran yang sebelumnya aktif akan dinonaktifkan."
- Buttons:
  - Cancel (secondary)
  - Activate (primary/green)

---

### 7. Semester Page
**Deskripsi**: Halaman manajemen semester

**Layout**: Sama seperti Academic Years page, dengan tambahan:
- Filter dropdown untuk Academic Year
- Table columns:
  - Academic Year
  - Semester Number (1 atau 2)
  - Start Date
  - End Date
  - Status (Active/Inactive)
  - Actions

**Responsive**: Sama seperti Academic Years page

---

### 8. Create/Edit Semester Modal
**Deskripsi**: Modal form untuk create/edit semester

**Elemen**:
- Modal header
- Form fields:
  - Academic Year dropdown (required)
  - Semester Number radio buttons (1 atau 2)
  - Start Date picker
  - End Date picker
  - Validation messages
- Buttons: Cancel, Save

**Validation Messages**:
- "Nomor semester harus 1 atau 2"
- "Semester sudah ada untuk tahun ajaran ini"
- "Tanggal harus dalam range tahun ajaran"
- "Tanggal akhir harus setelah tanggal mulai"

---

### 9. Toast Notifications
**Deskripsi**: Notification untuk success/error messages

**Success Toast**:
- Green background
- White text
- Icon: Checkmark
- Message: "Tahun ajaran berhasil dibuat"
- Auto-dismiss: 3 seconds
- Position: Top right

**Error Toast**:
- Red background
- White text
- Icon: X atau warning
- Message: "Gagal membuat tahun ajaran. Silakan coba lagi."
- Manual dismiss required
- Position: Top right

---

### 10. Loading States
**Deskripsi**: Loading indicators

**Skeleton Loading** (untuk table):
- Gray placeholder bars
- Animated shimmer effect
- 5-10 rows

**Button Loading**:
- Spinner icon
- Text: "Loading..." atau disabled state
- Button disabled

**Page Loading**:
- Full page spinner
- Centered di screen

---

### 11. Empty States
**Deskripsi**: Empty state jika tidak ada data

**Elemen**:
- Icon (empty folder atau similar)
- Title: "Tidak ada tahun ajaran"
- Message: "Mulai dengan membuat tahun ajaran baru"
- Create button

---

### 12. Error States
**Deskripsi**: Error page jika ada masalah

**Elemen**:
- Error icon
- Title: "Terjadi kesalahan"
- Message: "Gagal memuat data. Silakan coba lagi."
- Retry button

---

## Sidebar Navigation

**Menu Items**:
- Dashboard (home icon)
- **Academic** (section header)
  - Tahun Ajaran (calendar icon)
  - Semester (calendar icon)
- **Management** (section header)
  - Students
  - Classes
  - Teachers
  - Subjects
- **Grades** (section header)
  - Weekly Grades
  - Report Cards
- **Attendance** (section header)
  - Attendance
- **Settings** (section header)
  - Profile
  - Logout

**Active State**: Highlight current page
**Responsive**: Collapse to hamburger menu di mobile

---

## Header/Topbar

**Elemen**:
- Logo ISMS-EWA (left)
- Navigation menu (center, desktop only)
- Active period indicator (right)
- User profile dropdown (right)
- Hamburger menu (mobile only)

**Active Period Indicator**:
- Text: "Tahun Ajaran: 2024/2025 | Semester: 1"
- Green badge
- Clickable untuk quick access (optional)

---

## Color Palette

```
Primary Blue: #1E40AF
Secondary Blue: #3B82F6
Light Blue: #DBEAFE

Success Green: #10B981
Warning Orange: #F59E0B
Danger Red: #EF4444

Light Gray: #F3F4F6
Medium Gray: #D1D5DB
Dark Gray: #6B7280
Text Dark: #1F2937

White: #FFFFFF
```

---

## Component Library

### Buttons
- **Primary**: Blue background, white text
- **Secondary**: Gray background, dark text
- **Danger**: Red background, white text
- **Disabled**: Gray background, light text

### Inputs
- Border: 1px solid #D1D5DB
- Focus: Blue border, blue shadow
- Error: Red border, red text
- Placeholder: Light gray text

### Badges
- Active: Green background, white text
- Inactive: Gray background, dark text

### Cards
- White background
- Subtle shadow
- Border radius: 8px
- Padding: 16px

### Modals
- White background
- Shadow
- Border radius: 8px
- Overlay: Semi-transparent black

---

## Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

---

## Design Specifications Summary

| Element | Size | Color | Font |
|---------|------|-------|------|
| Page Title | 32px | Dark Gray | Bold |
| Section Title | 24px | Dark Gray | Semi-bold |
| Body Text | 14px | Dark Gray | Regular |
| Small Text | 12px | Medium Gray | Regular |
| Button | 14px | White | Semi-bold |
| Input | 14px | Dark Gray | Regular |

---

## Notes untuk Designer

1. **Consistency**: Gunakan design system yang sama dengan Phase 7
2. **Accessibility**: Ensure color contrast ratio minimal 4.5:1
3. **Spacing**: Gunakan 8px grid untuk consistency
4. **Icons**: Gunakan icon set yang sama (e.g., Feather, Material Design)
5. **Animations**: Subtle transitions (200-300ms)
6. **Mobile First**: Design untuk mobile dulu, kemudian scale up
7. **Dark Mode**: Optional, tapi pertimbangkan untuk future
8. **Prototype**: Buat interactive prototype untuk testing

---

## Deliverables

1. **Figma/Stitch File** dengan semua halaman
2. **Component Library** (buttons, inputs, modals, etc.)
3. **Design System** documentation
4. **Responsive Designs** untuk mobile, tablet, desktop
5. **Interaction Flows** (optional)
6. **Design Handoff** untuk developers

---

## Timeline

- Wireframes: 1-2 hari
- High-fidelity designs: 2-3 hari
- Prototype & testing: 1 hari
- Revisions: 1 hari

**Total**: ~5-7 hari

---

## Referensi

- Existing ISMS-EWA design dari Phase 7
- Material Design guidelines
- Accessibility guidelines (WCAG 2.1)
- Modern web design trends

---

Selamat mendesain! 🎨
