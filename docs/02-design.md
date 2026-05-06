# Design Document — ISMS-EWA Backend Foundation (Phase 1)

[Konten design.md sudah terlalu panjang, akan disimpan di file terpisah]

Lihat file `02-design.md` untuk detail lengkap arsitektur, komponen, data models, correctness properties, error handling, dan testing strategy.

---

## Quick Summary

**Architecture Pattern:** MVC + Services Layer (prepared for Phase 2+)

**Key Components:**
- AuthController (login, logout, me)
- LoginRequest (validation)
- 6 Eloquent Models dengan relasi
- 6 Database Migrations
- UserSeeder

**Database:** SQLite dengan 6 tabel inti

**Authentication:** Laravel Sanctum (token-based)

**Testing:** 31 tests (feature + unit + smoke tests)

**Correctness Properties:** 8 properties untuk validasi behavior

Untuk detail lengkap, baca file `02-design.md` di folder `docs/`.
