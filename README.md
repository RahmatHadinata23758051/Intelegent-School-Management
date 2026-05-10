# ISMS-EWA — Intelligent School Management System with Early Warning Analytics

Sistem manajemen sekolah berbasis web yang dirancang untuk mendeteksi siswa berisiko secara dini melalui analitik akademik dan perilaku.

---

## 📋 Project Overview

**ISMS-EWA** adalah platform terintegrasi untuk:
- 📚 Manajemen data siswa
- 📊 Monitoring nilai akademik
- ⚠️ Monitoring pelanggaran (behavior)
- 🎯 Sistem Early Warning berbasis risk scoring

**Tujuan:** Mendeteksi siswa berisiko (akademik & perilaku) lebih awal agar sekolah bisa melakukan intervensi.

---

## 🏗️ Project Structure

```
isms-ewa/
├── isms-ewa-backend/          # Backend Laravel 10
│   ├── app/
│   ├── database/
│   ├── routes/
│   ├── tests/
│   └── docs/
├── docs/                       # Global documentation
│   ├── 01-requirements.md      # Requirements document
│   ├── 02-design.md            # Design document
│   ├── 03-tasks.md             # Implementation tasks
│   └── phase-1-foundation.md   # Phase 1 setup guide
└── README.md                   # This file
```

---

## 🚀 Quick Start

### Prerequisites
- PHP 8.1+
- Composer
- PostgreSQL 12+
- Node.js 16+ (untuk frontend)

### Setup Backend

```bash
cd isms-ewa-backend

# Install dependencies
composer install

# Configure environment
cp .env.example .env
php artisan key:generate

# Setup database (auto-seeded on first request)
php artisan migrate

# Run server
php artisan serve
```

Server akan berjalan di `http://localhost:8000`

### Setup Frontend

```bash
cd isms-ewa-frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

---

## 🔐 Default Credentials

```
Admin:
  Email: admin@isms-ewa.local
  Password: password

Teacher:
  Email: teacher@isms-ewa.local
  Password: password

Homeroom Teacher:
  Email: homeroom@isms-ewa.local
  Password: password
```

**Note:** Database otomatis ter-seed saat request pertama di development environment.

---

## 📚 Documentation

### Phase 1 — Backend Foundation

Dokumentasi lengkap tersedia di folder `docs/`:

- **[01-requirements.md](docs/01-requirements.md)** — Requirements document dengan 7 requirements utama
- **[02-design.md](docs/02-design.md)** — Design document dengan arsitektur, komponen, dan correctness properties
- **[03-tasks.md](docs/03-tasks.md)** — Implementation plan dengan 18 tasks (semua completed)
- **[phase-1-foundation.md](isms-ewa-backend/docs/phase-1-foundation.md)** — Setup guide & API documentation

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/auth/login` | Login dengan email & password |
| POST | `/api/auth/logout` | Logout & revoke token |
| GET | `/api/auth/me` | Get current user data |

**Example Login Request:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@isms.test",
    "password": "password"
  }'
```

**Response:**
```json
{
    "token": "1|abc123...",
    "user": {
        "id": 1,
        "name": "Admin ISMS",
        "email": "admin@isms.test",
        "role": "admin"
    }
}
```

---

## 🗄️ Database Schema

### Core Tables

1. **users** — Pengguna sistem (admin, guru, staf)
2. **school_classes** — Kelas sekolah
3. **students** — Data siswa
4. **grades** — Nilai akademik siswa
5. **violations** — Catatan pelanggaran siswa
6. **risk_scores** — Skor risiko siswa

Lihat [02-design.md](docs/02-design.md) untuk ERD lengkap.

---

## ✅ Testing

### Run All Tests

```bash
cd isms-ewa-backend
php artisan test
```

**Test Coverage:**
- 183 tests — ALL PASSING ✅
- Feature tests (comprehensive)
- Unit tests
- Smoke tests
- Authorization tests
- CRUD operation tests

---

## 📖 Development Phases

### Phase 1 ✅ — Backend Foundation (COMPLETED)
- ✅ Laravel 10 setup + PostgreSQL
- ✅ Authentication (Sanctum)
- ✅ Database schema (11 tables)
- ✅ Eloquent Models
- ✅ API endpoints (login, logout, me)
- ✅ Tests (183 passing)
- ✅ Documentation

### Phase 2 ✅ — Core CRUD API (COMPLETED)
- ✅ Academic Years CRUD
- ✅ Semesters CRUD
- ✅ School Classes CRUD
- ✅ Students CRUD
- ✅ Subjects CRUD
- ✅ Teacher Profiles CRUD
- ✅ Class Subjects Assignment CRUD
- ✅ Grades & Violations CRUD
- ✅ Risk Scoring System
- ✅ Authorization Policies

### Phase 3 ✅ — Frontend Foundation (COMPLETED)
- ✅ React setup + Vite
- ✅ Authentication UI
- ✅ Layout components
- ✅ API integration
- ✅ State management (Zustand)

### Phase 4 ✅ — Dashboard & CRUD UI (IN PROGRESS)
- ✅ Dashboard page
- ✅ Academic Years management
- ✅ Semesters management
- ✅ School Classes management
- ✅ Students management
- ✅ Subjects management
- ✅ Teacher Profiles management
- ✅ Class Subjects Assignment management
- ⏳ Grades & Violations management
- ⏳ Risk Scoring dashboard

### Phase 5 (Planned)
- Advanced reporting
- Analytics dashboard
- Export functionality
- Mobile app

---

## 🛠️ Tech Stack

**Backend:**
- Laravel 10
- PHP 8.1+
- PostgreSQL 12+
- Laravel Sanctum (authentication)
- Eloquent ORM

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Zustand (state management)
- Axios (HTTP client)

**Testing:**
- PHPUnit
- Pest PHP

**Tools:**
- Composer
- npm
- Git

---

## 📝 Git Workflow

```bash
# Clone repository
git clone <repository-url>
cd isms-ewa

# Create feature branch
git checkout -b feat/your-feature

# Make changes & commit
git add .
git commit -m "feat: your feature description"

# Push to remote
git push -u origin feat/your-feature

# Create pull request
```

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feat/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feat/amazing-feature`)
5. Open Pull Request

---

## 📞 Support

Untuk pertanyaan atau issues, silakan buat issue di repository atau hubungi tim development.

---

## 📄 License

Project ini adalah proprietary software. Semua hak dilindungi.

---

## 🎯 Next Steps

1. **Review Documentation** — Baca docs/ untuk memahami arsitektur
2. **Setup Backend** — Ikuti Quick Start guide
3. **Run Tests** — Pastikan semua tests pass
4. **Explore API** — Test endpoints dengan Postman/curl
5. **Start Development** — Siap untuk Phase 2!

---

**Last Updated:** Mei 2026  
**Version:** 2.4.0 (Phase 4 In Progress)  
**Status:** Development 2.4 - Class Subjects Assignment Complete
