# CLAUDE.md — ISMS-EWA Project Guide

## Project Identity

Project ini bernama **ISMS-EWA**.

Singkatan dari:

**Intelligent School Management System with Early Warning Analytics**

Project ini bukan hanya dashboard monitoring risiko siswa. Visi akhirnya adalah sistem manajemen sekolah yang mencakup:

- Manajemen siswa
- Manajemen kelas
- Manajemen guru
- Manajemen mata pelajaran
- Tahun ajaran dan semester
- Assignment mata pelajaran ke kelas
- Assignment guru ke mata pelajaran dan kelas
- Absensi harian
- Input nilai mingguan
- Rekap nilai akhir
- Preview raport
- Rekomendasi kenaikan kelas
- Laporan intervensi guru/wali kelas
- Early Warning / Risk Scoring berbasis data akademik, absensi, dan perilaku

Development dilakukan bertahap dan disiplin per phase/module.

---

## Main Tech Stack

Backend:

- Laravel 10
- PostgreSQL
- Laravel Sanctum
- Policy-based authorization
- Service layer
- Form Request validation
- API Resource formatting
- Feature tests

Frontend:

- React + Vite
- Tailwind CSS
- Axios API client
- Zustand auth store
- Protected routes
- Component-based UI
- Premium SaaS dashboard style

Database:

- PostgreSQL lokal untuk development
- Supabase PostgreSQL boleh dipakai nanti untuk staging/demo, bukan pengganti backend Laravel

---

## Current Development Direction

Development 1 sudah menjadi MVP awal:

- Authentication
- Student management
- Class management
- Grades sederhana
- Violations
- Risk scoring
- Dashboard monitoring
- Frontend core UI

Development 2 adalah perluasan menuju full academic management system.

Urutan Development 2:

1. **Development 2.1 — Tahun Ajaran & Semester**
2. **Development 2.2 — Profil Guru**
3. **Development 2.3 — Mata Pelajaran**
4. **Development 2.4 — Assignment Mata Pelajaran ke Kelas**
5. **Development 2.5 — Assignment Guru ke Mata Pelajaran/Kelas**
6. **Development 2.6 — Manajemen Absensi**
7. **Development 2.7 — Input Nilai Mingguan**
8. **Development 2.8 — Rekap Akademik & Preview Raport**
9. **Development 2.9 — Rekomendasi Kenaikan Kelas**
10. **Development 2.10 — Laporan Intervensi & Enhanced Risk Scoring**

Jangan melompat phase tanpa instruksi eksplisit.

---

## Development Rules

### 1. Kerjakan Scope Sesuai Phase

Jangan menambahkan fitur di luar scope phase saat ini.

Contoh:

Jika sedang mengerjakan **Development 2.6 — Manajemen Absensi**, jangan implement:

- Weekly grades
- Report card
- Promotion
- Intervention report
- Enhanced risk scoring
- Notification
- Parent portal
- Student portal

Jika fitur terasa berkaitan tapi belum masuk phase, cukup dokumentasikan sebagai future scope.

---

### 2. Backend Dulu, Frontend Setelah Backend Clear

Untuk modul besar, lakukan urutan:

1. Backend design
2. Migration
3. Model
4. Relationship
5. Service
6. Form Request
7. Resource
8. Policy
9. Controller
10. Routes
11. Seeder
12. Feature tests
13. `php artisan test`
14. Frontend implementation

Jangan lanjut frontend jika backend test belum clear.

---

### 3. Wajib Pakai Test

Setiap backend module wajib punya feature tests.

Minimal test harus mencakup:

- Admin allowed actions
- Teacher/Homeroom read-only atau scoped actions
- Validation error
- Duplicate prevention
- Search/filter/sort jika ada
- Pagination jika ada
- Important business rules
- Endpoint tambahan
- Full test suite tidak boleh regression

Sebelum klaim complete, jalankan:

```bash
php artisan test

Jangan hanya jalankan test spesifik kecuali sedang debug.

4. Jangan Klaim Complete Kalau Belum Full Verified

Sebuah phase baru boleh dianggap clear jika:

Migration berhasil
Seeder berhasil
Feature tests pass
Full test suite pass
Frontend build pass jika ada frontend
Manual test utama dilakukan
Dokumentasi dibuat/update
Tidak ada known critical issue

Jika masih ada failing test, jangan klaim production-ready.

Backend Architecture Rules
Laravel Structure

Gunakan struktur konsisten:

app/Models
app/Http/Controllers/Api
app/Http/Requests
app/Http/Resources
app/Policies
app/Services
database/migrations
database/seeders
database/factories
tests/Feature
API Response

Gunakan format response yang sudah ada di project.

Jangan membuat format response baru yang tidak konsisten.

Validation

Gunakan Form Request untuk validasi.

Business validation boleh di:

Form Request withValidator
Service layer
Controller hanya jika sederhana

Jangan taruh business logic kompleks langsung di controller.

Authorization

Backend policy adalah source of truth.

Frontend role visibility hanya untuk UX.

Semua action penting harus dilindungi policy.

Soft Delete

Gunakan soft delete untuk data akademik penting, seperti:

Teacher profile
Subject
Class subject assignment
Teacher subject assignment
Attendance session
Attendance

Jangan hard delete data yang nanti dipakai untuk histori akademik, raport, promotion, atau audit.

Frontend Architecture Rules
Structure

Gunakan struktur seperti ini:

frontend/src/
├── app/
├── components/
│   ├── common/
│   ├── layout/
│   ├── ui/
│   └── module-name/
├── hooks/
├── pages/
├── services/
├── store/
├── utils/
└── constants/

Untuk setiap module frontend, buat minimal:

Service
Hook
Page
Form component
Status badge jika ada status
Table/list component jika kompleks
API Service

Semua API call harus lewat service.

Jangan hardcode URL di page/component.

Gunakan API client yang sudah ada.

Hooks

Gunakan hooks untuk:

data
loading
error
pagination
filter
search
refetch
create/update/delete action

Page jangan terlalu penuh logic API.

UI/UX Rules — NO AI SLOP
Prinsip Utama

Tampilan project ini tidak boleh terlihat seperti AI slop.

AI slop maksudnya:

Layout generik
Card terlalu polos
Table default
Form mentah
Icon tempelan
Spacing asal
Warna random
Hierarchy visual lemah
Halaman terasa kosong
Semua komponen terlihat seperti hasil generate cepat
Dashboard seperti template admin lama
Banyak teks tanpa struktur visual yang jelas

UI harus terasa seperti produk SaaS modern untuk sekolah.

Visual Direction

Tampilan harus:

Premium
Modern
Clean
Rapi
Professional
Konsisten
Mudah dipakai harian oleh admin/guru
Cocok untuk school management system
Cocok untuk early warning analytics

Mood:

Smart
Calm
Trustworthy
Academic
Data-driven
Professional
Layout Rules

Gunakan:

Sidebar dark navy/slate
Main background soft gray/slate-50
Card putih dengan rounded-2xl
Border subtle
Shadow halus
Spacing lega
Typography jelas
Header page yang punya title dan subtitle
Toolbar yang rapi
Empty/loading/error state yang didesain

Jangan:

Menempelkan semua elemen ke kiri tanpa spacing
Membuat halaman terlalu kosong
Membuat card kotak polos tanpa karakter
Membuat table HTML default
Membuat button random warna
Menggunakan icon terlalu banyak
Membuat form modal polos tanpa visual hierarchy
Typography

Gunakan font modern seperti:

Inter
Plus Jakarta Sans
Manrope

Hierarchy:

Page title: besar, bold
Section title: medium, semibold
Body text: readable
Caption: muted
Error/helper text: jelas tapi tidak berlebihan

Jangan semua text bold.

Jangan semua ukuran font sama.

Color System

Gunakan warna konsisten:

Base:

slate-950
slate-900
slate-100
slate-50
white

Primary:

blue
indigo
cyan

Success:

emerald / green

Warning:

amber / orange

Danger:

rose / red

Neutral:

slate / gray

Jangan pakai warna random di setiap halaman.

Card Design

Card harus punya:

rounded-2xl
padding cukup
border subtle
shadow ringan
title jelas
value/content jelas
icon badge jika relevan
hover state jika clickable

Jangan buat card polos seperti kotak kosong.

Table Design

Table harus premium.

Wajib ada:

header row jelas
spacing nyaman
row hover
status badge
action button rapi
empty state
loading skeleton
pagination rapi

Mobile:

table boleh horizontal scroll
atau berubah menjadi card list

Jangan table default browser.

Forms & Modals

Form harus terasa matang.

Wajib:

label jelas
helper text jika field butuh format
validation error per field
loading state pada submit
cancel button
modal title dan description
spacing rapi
focus state jelas

Jangan membuat form seperti HTML mentah.

Status Badge

Gunakan badge premium:

rounded-full
dot indicator
background soft
text readable
warna sesuai konteks

Contoh status absensi:

present / Hadir: emerald
late / Terlambat: amber
sick / Sakit: sky/blue
permitted / Izin: indigo
absent / Alpa: rose/red
Empty, Loading, Error State

Setiap page/list wajib punya:

Loading
skeleton table/card
loading spinner kecil pada button
Empty
icon/illustration sederhana
title
description
action button jika role allowed
Error
pesan jelas
retry button
bedakan 403, 422, 500/network

Jangan biarkan halaman blank.

Icon Rules

Gunakan icon seperlunya.

Icon harus:

relevan
diberi container/badge jika perlu
ukuran konsisten
warna sesuai konteks

Jangan pakai icon default asal tempel.

Responsive Design

Setiap page harus aman untuk:

Desktop
Tablet
Mobile

Mobile rules:

sidebar collapse/hamburger
table jadi scroll/card
modal full width dengan margin
button tidak pecah
filter toolbar stack vertical
Development Workflow
Sebelum Coding

Pastikan:

Scope phase jelas
Entity jelas
Endpoint jelas
RBAC jelas
Out of scope jelas

Jika requirement ambigu, buat asumsi kecil dan dokumentasikan.

Jangan membuat fitur besar tanpa konfirmasi.

Saat Coding

Wajib:

Ikuti pattern project yang sudah ada
Gunakan service layer
Gunakan form request
Gunakan policy
Gunakan resource
Gunakan seeder idempotent
Gunakan test
Gunakan UI component reusable

Jangan:

Hardcode ID
Hardcode API URL
Bypass authorization
Menaruh business logic besar di controller
Membuat UI asal jalan
Menghapus test agar pass
Force push sembarangan
Setelah Coding

Jalankan backend:

php artisan config:clear
php artisan cache:clear
php artisan migrate:fresh --seed
php artisan test
php artisan route:list

Jalankan frontend:

npm install
npm run build
npm run dev

Lakukan manual test sesuai role:

admin
teacher
homeroom_teacher
Git Rules

Buat commit granular.

Contoh:

git add backend
git commit -m "add attendance backend module"

git add frontend/src/services frontend/src/hooks
git commit -m "add attendance frontend services and hooks"

git add frontend/src/components/attendance
git commit -m "add attendance ui components"

git add frontend/src/pages/attendance frontend/src/App.jsx
git commit -m "build attendance management frontend"

git add docs/development-2-6-frontend-manajemen-absensi.md
git commit -m "document attendance frontend module"

Jangan 1 commit besar untuk semua perubahan jika bisa dipecah.

Jangan commit:

.env
.env.local
node_modules
vendor
dist
cache files
temporary debug files
Documentation Rules

Setiap phase/module harus punya dokumentasi di root docs/.

Contoh:

docs/development-2-6-manajemen-absensi.md
docs/development-2-6-frontend-manajemen-absensi.md

Jangan membuat docs di:

backend/docs
frontend/docs

Isi dokumentasi minimal:

tujuan modul
scope
tabel yang dibuat
endpoint
validation
RBAC
frontend pages/components jika ada
test result
build result
manual QA
known limitations
next module
Current Important Modules
Development 2.1 — Tahun Ajaran & Semester

Sudah menjadi fondasi academic period.

Digunakan oleh:

attendance
weekly grades
report card
promotion
Development 2.2 — Profil Guru

Menyimpan detail guru.

Digunakan oleh:

teacher assignment
weekly grades
attendance scope
Development 2.3 — Mata Pelajaran

Menyimpan data master mata pelajaran.

Digunakan oleh:

class subject assignment
teacher assignment
weekly grades
report card
Development 2.4 — Assignment Mata Pelajaran ke Kelas

Menghubungkan kelas dengan mata pelajaran.

Digunakan oleh:

teacher assignment
weekly grades
Development 2.5 — Assignment Guru ke Mata Pelajaran/Kelas

Menghubungkan guru dengan class_subject dan tahun ajaran.

Digunakan oleh:

validasi guru input nilai
validasi guru input absensi jika diperlukan
filter kelas/mapel berdasarkan guru
Development 2.6 — Manajemen Absensi

Mengelola sesi absensi dan status kehadiran siswa.

Digunakan oleh:

report card
promotion
enhanced risk scoring
Attendance Module Rules

Status absensi:

present = Hadir
sick = Sakit
permitted = Izin
absent = Alpa
late = Terlambat

Attendance rate:

attendance_rate = ((present + permitted + late) / total_sessions) * 100

Rules:

present dihitung hadir
permitted dihitung hadir
late dihitung hadir
sick tidak dihitung hadir
absent tidak dihitung hadir

Locked attendance session:

tidak boleh update attendance
tidak boleh delete attendance
tidak boleh bulk input ulang
hanya admin boleh unlock
Security Rules

Jangan expose:

database password
Supabase connection string
.env
token
secret key

Jangan taruh credential di frontend.