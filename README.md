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
- SQLite (built-in)

### Setup Backend

```bash
cd isms-ewa-backend

# Install dependencies
composer install

# Configure environment
cp .env.example .env
php artisan key:generate

# Setup database
touch database/database.sqlite
php artisan migrate
php artisan db:seed

# Run server
php artisan serve
```

Server akan berjalan di `http://localhost:8000`

---

## 🔐 Default Credentials

```
Email: admin@isms.test
Password: password
Role: admin
```

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
- 31 tests — ALL PASSING ✅
- Feature tests (13)
- Unit tests (8)
- Smoke tests (10)

---

## 📖 Development Phases

### Phase 1 ✅ — Backend Foundation (COMPLETED)
- ✅ Laravel 10 setup + SQLite
- ✅ Authentication (Sanctum)
- ✅ Database schema (6 tables)
- ✅ Eloquent Models
- ✅ API endpoints (login, logout, me)
- ✅ Tests (31 passing)
- ✅ Documentation

### Phase 2 (Planned)
- Risk scoring calculation
- Grade analysis service
- Violation tracking service
- Early warning alerts

### Phase 3 (Planned)
- Dashboard & reporting
- Admin panel
- Teacher interface
- Student portal

---

## 🛠️ Tech Stack

**Backend:**
- Laravel 10
- PHP 8.1+
- SQLite
- Laravel Sanctum (authentication)

**Testing:**
- PHPUnit
- Pest PHP (optional)

**Tools:**
- Composer
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

**Last Updated:** Januari 2024  
**Version:** 1.0.0 (Phase 1 Complete)
