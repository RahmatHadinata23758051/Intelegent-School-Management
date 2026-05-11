# Development 2 — Modular Roadmap

**Tanggal**: 7 Mei 2026  
**Status**: Fase Perencanaan Modular  
**Tujuan**: Memecah Development 2 menjadi 10 modul kecil yang aman untuk dieksekusi bertahap

---

## Pendahuluan

Development 2 adalah fase besar yang menambahkan 10 modul akademik baru ke ISMS-EWA. Untuk menghindari kompleksitas dan risiko, Development 2 dipecah menjadi 10 modul kecil yang bisa dikerjakan secara bertahap. Setiap modul memiliki scope terbatas, dependency yang jelas, dan acceptance criteria yang terukur.

**Prinsip Modular Development**:
- Setiap modul berdiri sendiri dengan scope terbatas
- Dependency antar modul dipetakan dengan jelas
- Modul bisa dikerjakan paralel jika tidak ada dependency
- Setiap modul harus bisa di-test secara independen
- Tidak ada fitur yang "half-baked" di akhir modul

---

## Development 2.1 — Tahun Ajaran & Semester

**Tujuan**: Membangun fondasi akademik dengan mengelola tahun ajaran dan semester. Modul ini adalah fondasi untuk semua modul lain.

**Entity/Tabel**: academic_years, semesters

**Dependency**: Tidak ada (foundational)

**Backend Endpoint**:
- POST /api/academic-years - Buat tahun ajaran
- GET /api/academic-years - List tahun ajaran
- GET /api/academic-years/{id} - Detail tahun ajaran
- PUT /api/academic-years/{id} - Update tahun ajaran
- DELETE /api/academic-years/{id} - Delete tahun ajaran
- POST /api/academic-years/{id}/activate - Set active
- POST /api/semesters - Buat semester
- GET /api/semesters - List semester
- GET /api/semesters/{id} - Detail semester
- PUT /api/semesters/{id} - Update semester
- DELETE /api/semesters/{id} - Delete semester
- POST /api/semesters/{id}/activate - Set active
- GET /api/academic-years/active - Get active year
- GET /api/semesters/active - Get active semester

**Frontend Page**:
- Manajemen Tahun Ajaran (list, create, edit, delete, activate)
- Manajemen Semester (list, create, edit, delete, activate)
- Indicator tahun ajaran dan semester yang sedang aktif

**Acceptance Criteria**:
- ✅ Admin bisa membuat tahun ajaran dengan format "2024/2025"
- ✅ Admin bisa membuat 2 semester per tahun ajaran
- ✅ Hanya satu tahun ajaran yang bisa active pada satu waktu
- ✅ Hanya satu semester yang bisa active pada satu waktu
- ✅ Tidak bisa delete tahun ajaran/semester yang sedang active
- ✅ Sistem menampilkan active year dan semester di dashboard
- ✅ API mengembalikan active academic year dan semester

**Out of Scope**:
- ❌ Teacher management
- ❌ Subject management
- ❌ Attendance
- ❌ Weekly grades
- ❌ Report card
- ❌ Promotion
- ❌ Academic calendar (holiday management)

**Risiko Teknis**:
- Tahun ajaran yang sedang active tidak bisa dihapus → Validasi di backend, warning di frontend
- Semester bisa dibuat dengan tanggal yang overlap → Validasi tanggal di backend
- Jika tidak ada active academic year, modul lain tidak bisa berjalan → Pastikan selalu ada active year

---

## Development 2.2 — Profil Guru

**Tujuan**: Membangun sistem profil guru yang lebih detail dari user biasa dengan NIP, kualifikasi, spesialisasi.

**Entity/Tabel**: teacher_profiles, users (relasi 1:1)

**Dependency**: Development 1 (users dengan role 'teacher' atau 'homeroom_teacher')

**Backend Endpoint**:
- POST /api/teachers - Buat profil guru
- GET /api/teachers - List guru
- GET /api/teachers/{id} - Detail guru
- PUT /api/teachers/{id} - Update guru
- DELETE /api/teachers/{id} - Delete guru
- GET /api/teachers/by-user/{user_id} - Get profil berdasarkan user_id
- GET /api/teachers/dropdown - Get list guru untuk dropdown

**Frontend Page**:
- Manajemen Guru (list, create, edit, delete)
- Detail guru dengan semua informasi
- Dropdown guru untuk assignment berikutnya

**Acceptance Criteria**:
- ✅ Admin bisa membuat profil guru dari user yang sudah ada
- ✅ Setiap guru hanya punya satu profil
- ✅ NIP harus unik untuk setiap guru
- ✅ Admin bisa update data guru (kualifikasi, spesialisasi, kontak, alamat)
- ✅ Admin bisa delete profil guru
- ✅ Sistem menampilkan list guru dengan filter dan search
- ✅ Dropdown guru tersedia untuk modul assignment berikutnya

**Out of Scope**:
- ❌ Assignment guru ke mata pelajaran
- ❌ Assignment guru ke kelas
- ❌ Attendance recording
- ❌ Weekly grade input
- ❌ Teacher dashboard
- ❌ Teacher performance metrics

**Risiko Teknis**:
- User dengan role 'teacher' bisa punya multiple profil → Unique constraint di database
- Delete profil guru bisa meninggalkan orphan data → Soft delete atau cegah delete jika ada assignment
- NIP duplikat dari input user → Validasi NIP unik di backend

---

## Development 2.3 — Mata Pelajaran

**Tujuan**: Membangun data master mata pelajaran sekolah yang digunakan untuk assignment ke kelas dan guru.

**Entity/Tabel**: subjects

**Dependency**: Tidak ada (foundational)

**Backend Endpoint**:
- POST /api/subjects - Buat mata pelajaran
- GET /api/subjects - List mata pelajaran
- GET /api/subjects/{id} - Detail mata pelajaran
- PUT /api/subjects/{id} - Update mata pelajaran
- DELETE /api/subjects/{id} - Delete mata pelajaran
- GET /api/subjects/dropdown - Get list untuk dropdown
- GET /api/subjects/active - Get list yang aktif

**Frontend Page**:
- Manajemen Mata Pelajaran (list, create, edit, delete)
- Detail mata pelajaran
- Dropdown mata pelajaran untuk assignment berikutnya

**Acceptance Criteria**:
- ✅ Admin bisa membuat mata pelajaran dengan kode unik
- ✅ Setiap mata pelajaran punya nama, kode, deskripsi, jam kredit
- ✅ Admin bisa update dan delete mata pelajaran
- ✅ Sistem menampilkan list dengan filter dan search
- ✅ Dropdown mata pelajaran tersedia untuk modul assignment
- ✅ Kode mata pelajaran harus unik
- ✅ Mata pelajaran bisa diaktifkan/dinonaktifkan

**Out of Scope**:
- ❌ Assignment mata pelajaran ke kelas
- ❌ Assignment guru ke mata pelajaran
- ❌ Grade components
- ❌ Weekly grades
- ❌ Subject prerequisites

**Risiko Teknis**:
- Kode mata pelajaran duplikat → Validasi kode unik di backend
- Delete mata pelajaran yang sudah di-assign → Soft delete atau cegah delete
- Mata pelajaran yang sudah digunakan tidak boleh dihapus → Cek apakah ada di class_subjects

---

## Development 2.4 — Assignment Mata Pelajaran ke Kelas

**Tujuan**: Menentukan mata pelajaran apa saja yang diajarkan di setiap kelas melalui relasi M:M.

**Entity/Tabel**: class_subjects, school_classes (Dev 1), subjects (Dev 2.3)

**Dependency**: Development 1 (school_classes), Development 2.3 (subjects)

**Backend Endpoint**:
- POST /api/class-subjects - Assign mata pelajaran ke kelas
- GET /api/class-subjects - List assignment
- GET /api/class-subjects/{id} - Detail assignment
- PUT /api/class-subjects/{id} - Update assignment
- DELETE /api/class-subjects/{id} - Delete assignment
- GET /api/classes/{class_id}/subjects - Get mata pelajaran per kelas
- GET /api/subjects/{subject_id}/classes - Get kelas per mata pelajaran

**Frontend Page**:
- Assignment Mata Pelajaran ke Kelas (list, assign, remove)
- Detail kelas dengan daftar mata pelajaran
- Multi-select untuk assign banyak mata pelajaran sekaligus

**Acceptance Criteria**:
- ✅ Admin bisa assign satu atau lebih mata pelajaran ke kelas
- ✅ Satu kelas bisa punya banyak mata pelajaran
- ✅ Satu mata pelajaran bisa diajarkan di banyak kelas
- ✅ Tidak bisa assign mata pelajaran yang sama dua kali ke kelas yang sama
- ✅ Admin bisa remove mata pelajaran dari kelas
- ✅ Sistem menampilkan list mata pelajaran per kelas
- ✅ Sistem menampilkan list kelas per mata pelajaran

**Out of Scope**:
- ❌ Assignment guru ke mata pelajaran/kelas
- ❌ Weekly grades
- ❌ Attendance
- ❌ Report card

**Risiko Teknis**:
- Duplikat assignment mata pelajaran ke kelas → Unique constraint (class_id, subject_id)
- Delete mata pelajaran yang sudah di-assign → Cegah delete atau soft delete
- Delete kelas yang sudah punya assignment → Cegah delete atau cascade delete

---

## Development 2.5 — Assignment Guru ke Mata Pelajaran/Kelas

**Tujuan**: Menentukan guru mana yang mengajar mata pelajaran apa di kelas mana pada tahun ajaran tertentu.

**Entity/Tabel**: teacher_subject_assignments, teacher_profiles (Dev 2.2), class_subjects (Dev 2.4), academic_years (Dev 2.1)

**Dependency**: Development 2.1 (academic_years), Development 2.2 (teacher_profiles), Development 2.4 (class_subjects)

**Backend Endpoint**:
- POST /api/teacher-subject-assignments - Assign guru
- GET /api/teacher-subject-assignments - List assignment
- GET /api/teacher-subject-assignments/{id} - Detail assignment
- PUT /api/teacher-subject-assignments/{id} - Update assignment
- DELETE /api/teacher-subject-assignments/{id} - Delete assignment
- GET /api/teachers/{teacher_id}/assignments - Get assignment per guru
- GET /api/class-subjects/{class_subject_id}/teachers - Get guru per mata pelajaran/kelas
- GET /api/teachers/{teacher_id}/subjects - Get list mata pelajaran yang diajar guru

**Frontend Page**:
- Assignment Guru ke Mata Pelajaran/Kelas (list, assign, remove)
- Detail assignment dengan guru, mata pelajaran, kelas, tahun ajaran
- Multi-select untuk assign banyak guru sekaligus

**Acceptance Criteria**:
- ✅ Admin bisa assign guru ke mata pelajaran tertentu di kelas tertentu pada tahun ajaran tertentu
- ✅ Satu guru bisa mengajar banyak mata pelajaran di banyak kelas
- ✅ Satu mata pelajaran di satu kelas bisa diajarkan oleh banyak guru
- ✅ Tidak bisa assign guru yang sama dua kali ke mata pelajaran yang sama di kelas yang sama pada tahun ajaran yang sama
- ✅ Admin bisa remove assignment
- ✅ Sistem menampilkan list assignment per guru
- ✅ Sistem menampilkan list guru per mata pelajaran/kelas
- ✅ Assignment hanya bisa dibuat untuk tahun ajaran yang active

**Out of Scope**:
- ❌ Weekly grade input
- ❌ Attendance recording
- ❌ Validation bahwa guru hanya input nilai mata pelajaran yang dia ajar (akan di-implement di Dev 2.7)

**Risiko Teknis**:
- Duplikat assignment guru → Unique constraint (teacher_id, class_subject_id, academic_year_id)
- Assignment untuk tahun ajaran yang tidak active → Validasi academic_year_id harus active
- Delete guru yang sudah punya assignment → Cegah delete atau soft delete

---

## Development 2.6 — Manajemen Absensi

**Tujuan**: Membangun sistem pencatatan absensi harian siswa per kelas dengan status: present, sick, permitted, absent, late.

**Entity/Tabel**: attendance_sessions, attendances, academic_years (Dev 2.1), semesters (Dev 2.1), school_classes (Dev 1), students (Dev 1)

**Dependency**: Development 1 (school_classes, students), Development 2.1 (academic_years, semesters)

**Backend Endpoint**:
- POST /api/attendance-sessions - Buat sesi absensi
- GET /api/attendance-sessions - List sesi absensi
- GET /api/attendance-sessions/{id} - Detail sesi absensi
- POST /api/attendances - Input absensi siswa
- GET /api/attendances - List absensi
- PUT /api/attendances/{id} - Update absensi siswa
- GET /api/classes/{class_id}/attendance - Rekap absensi per kelas
- GET /api/students/{student_id}/attendance - Rekap absensi per siswa
- GET /api/attendance/summary - Summary absensi (attendance rate per siswa)

**Frontend Page**:
- Halaman Absensi Harian (pilih kelas dan tanggal, input status per siswa)
- Rekap Absensi (list siswa dengan jumlah hadir, sakit, izin, alpa, terlambat)
- Attendance rate per siswa (%)
- Filter by kelas, semester

**Acceptance Criteria**:
- ✅ Wali kelas atau guru bisa membuat sesi absensi per kelas per hari
- ✅ Wali kelas atau guru bisa input status absensi untuk setiap siswa
- ✅ Sistem mencegah duplikat absensi untuk siswa yang sama di sesi yang sama
- ✅ Sistem menampilkan rekap absensi per siswa
- ✅ Sistem menghitung attendance rate = (hadir + izin) / total hari × 100
- ✅ Absensi bisa diupdate setelah diinput
- ✅ Sistem menampilkan warning jika ada siswa yang belum diinput absensinya

**Out of Scope**:
- ❌ Report card
- ❌ Promotion
- ❌ PDF export
- ❌ Attendance impact pada risk score (akan di-implement di Dev 2.10)
- ❌ Automatic attendance calculation

**Risiko Teknis**:
- Duplikat sesi absensi untuk kelas yang sama pada tanggal yang sama → Unique constraint (class_id, session_date, session_type)
- Absensi untuk siswa yang tidak ada di kelas → Validasi student_id harus ada di school_class
- Attendance rate calculation yang salah → Hitung di backend, buat unit test

---

## Development 2.7 — Input Nilai Mingguan

**Tujuan**: Membangun sistem input nilai mingguan siswa berbasis komponen (tugas, quiz, UTS, UAS, weekly assessment).

**Entity/Tabel**: grade_components, weekly_grades, subjects (Dev 2.3), teacher_subject_assignments (Dev 2.5), academic_years (Dev 2.1), semesters (Dev 2.1), students (Dev 1)

**Dependency**: Development 2.1 (academic_years, semesters), Development 2.3 (subjects), Development 2.5 (teacher_subject_assignments)

**Backend Endpoint**:
- POST /api/grade-components - Buat komponen nilai (admin only)
- GET /api/grade-components - List komponen nilai
- PUT /api/grade-components/{id} - Update komponen nilai (admin only)
- POST /api/weekly-grades - Input nilai mingguan
- GET /api/weekly-grades - List nilai mingguan
- PUT /api/weekly-grades/{id} - Update nilai mingguan
- DELETE /api/weekly-grades/{id} - Delete nilai mingguan
- GET /api/students/{student_id}/grades - Get nilai per siswa
- GET /api/classes/{class_id}/grades - Get nilai per kelas
- GET /api/subjects/{subject_id}/grades - Get nilai per mata pelajaran

**Frontend Page**:
- Halaman Input Nilai Mingguan (pilih mata pelajaran, kelas, minggu, komponen; input nilai per siswa)
- Halaman Rekap Nilai Mingguan (list siswa dengan nilai per komponen)
- Filter by kelas, mata pelajaran, minggu, semester
- Validasi nilai 0-100

**Acceptance Criteria**:
- ✅ Guru bisa input nilai mingguan untuk mata pelajaran yang dia ajar
- ✅ Guru hanya bisa input nilai untuk siswa di kelas yang dia ajar
- ✅ Nilai harus dalam range 0-100
- ✅ Sistem mencegah duplikat nilai untuk siswa yang sama di minggu yang sama untuk komponen yang sama
- ✅ Guru bisa update nilai yang sudah diinput
- ✅ Sistem menampilkan list nilai mingguan dengan filter
- ✅ Sistem menampilkan warning jika ada siswa yang belum diinput nilainya
- ✅ Komponen nilai default: tugas, quiz, UTS, UAS, weekly_assessment

**Out of Scope**:
- ❌ Raport final
- ❌ Promotion
- ❌ Nilai akhir (akan di-calculate di Dev 2.8)
- ❌ PDF export
- ❌ Grade locking (akan di-implement di Dev 2.8)

**Risiko Teknis**:
- Guru input nilai untuk siswa yang bukan di kelasnya → Validasi di backend, cek apakah guru mengajar di kelas tersebut
- Duplikat nilai mingguan → Unique constraint (student_id, subject_id, grade_component_id, academic_year_id, semester_id, week_number)
- Nilai di luar range 0-100 → Validasi di frontend dan backend

---

## Development 2.8 — Rekap Akademik & Preview Raport

**Tujuan**: Membangun sistem agregasi nilai mingguan menjadi nilai akhir per mata pelajaran dan preview raport siswa.

**Entity/Tabel**: student_academic_summaries, report_cards, weekly_grades (Dev 2.7), attendances (Dev 2.6), violations (Dev 1), risk_scores (Dev 1)

**Dependency**: Development 1 (violations, risk_scores), Development 2.6 (attendances), Development 2.7 (weekly_grades)

**Backend Endpoint**:
- POST /api/academic-summaries/generate - Generate rekap akademik (admin only)
- GET /api/academic-summaries - List rekap akademik
- GET /api/academic-summaries/{id} - Detail rekap akademik
- GET /api/report-cards - List raport
- GET /api/report-cards/{id} - Detail raport (preview)
- POST /api/report-cards/generate - Generate raport (admin only)
- GET /api/students/{student_id}/report-card - Get raport siswa
- GET /api/classes/{class_id}/report-cards - Get raport semua siswa di kelas

**Frontend Page**:
- Halaman Rekap Akademik (list siswa dengan nilai akhir per mata pelajaran, GPA, filter by kelas/semester)
- Halaman Preview Raport (tampilan raport web dengan informasi siswa, nilai, GPA, attendance, behavior, risk level)
- Button print (untuk print dari browser)

**Acceptance Criteria**:
- ✅ Admin bisa generate rekap akademik dari nilai mingguan
- ✅ Sistem menghitung nilai akhir = (tugas × bobot + quiz × bobot + UTS × bobot + UAS × bobot + weekly × bobot) / 100
- ✅ Sistem menghitung GPA = rata-rata nilai akhir semua mata pelajaran
- ✅ Sistem menghitung attendance rate = (hadir + izin) / total hari × 100
- ✅ Sistem menghitung behavior score = 100 - (jumlah violations × severity_weight)
- ✅ Admin bisa generate raport dari rekap akademik
- ✅ Raport menampilkan semua informasi siswa, nilai, GPA, attendance, behavior, risk level
- ✅ Raport bisa di-preview di web
- ✅ Raport bisa di-print dari browser

**Out of Scope**:
- ❌ PDF export (akan di-implement di fase berikutnya)
- ❌ Digital signature
- ❌ Email distribution
- ❌ Parent portal access
- ❌ Automatic raport generation

**Risiko Teknis**:
- Nilai akhir calculation yang salah → Hitung di backend, buat unit test untuk formula
- GPA calculation yang salah → Hitung di backend, buat unit test
- Attendance rate calculation yang salah → Hitung di backend, buat unit test
- Raport untuk siswa yang tidak punya nilai lengkap → Tampilkan warning, hitung dengan nilai yang ada

---

## Development 2.9 — Rekomendasi Kenaikan Kelas

**Tujuan**: Membangun sistem rekomendasi kenaikan kelas berdasarkan nilai dan absensi dengan approval manual.

**Entity/Tabel**: promotion_records, student_academic_summaries (Dev 2.8), report_cards (Dev 2.8), attendances (Dev 2.6)

**Dependency**: Development 2.6 (attendances), Development 2.8 (student_academic_summaries, report_cards)

**Backend Endpoint**:
- POST /api/promotion-records/generate - Generate rekomendasi (admin only)
- GET /api/promotion-records - List rekomendasi
- GET /api/promotion-records/{id} - Detail rekomendasi
- PUT /api/promotion-records/{id}/approve - Approve rekomendasi (admin only)
- PUT /api/promotion-records/{id}/reject - Reject rekomendasi (admin only)
- GET /api/students/{student_id}/promotion - Get status promotion siswa
- GET /api/classes/{class_id}/promotions - Get promotion status semua siswa di kelas

**Frontend Page**:
- Halaman Rekomendasi Kenaikan Kelas (list siswa dengan rekomendasi status, alasan, kelas yang direkomendasikan)
- Button approve/reject rekomendasi dengan form catatan
- Halaman Promotion History (list siswa dengan status promotion, tanggal approval, siapa yang approve, catatan)

**Acceptance Criteria**:
- ✅ Admin bisa generate rekomendasi kenaikan kelas berdasarkan GPA dan attendance
- ✅ Rekomendasi status: promoted (GPA ≥ 70 dan attendance ≥ 80%), conditional (GPA 60-69 atau attendance 70-79%), not_promoted (GPA < 60 atau attendance < 70%)
- ✅ Admin bisa approve atau reject rekomendasi
- ✅ Approval tetap manual, tidak otomatis
- ✅ Sistem menampilkan alasan rekomendasi (GPA, attendance, violations)
- ✅ Sistem menampilkan kelas yang direkomendasikan
- ✅ Sistem menyimpan history approval (siapa, kapan, catatan)
- ✅ Satu siswa hanya punya satu promotion record per tahun ajaran

**Out of Scope**:
- ❌ Automatic promotion tanpa approval
- ❌ Bulk promotion
- ❌ Promotion reversal
- ❌ Custom promotion criteria (akan di-implement di fase berikutnya)

**Risiko Teknis**:
- Rekomendasi untuk siswa yang tidak punya nilai lengkap → Tampilkan warning, hitung dengan nilai yang ada
- Duplikat rekomendasi untuk siswa yang sama → Unique constraint (student_id, academic_year_id)
- Approval untuk tahun ajaran yang tidak active → Validasi academic_year_id harus active

---

## Development 2.10 — Laporan Intervensi & Enhanced Risk Scoring

**Tujuan**: Membangun sistem laporan intervensi untuk siswa berisiko dan evolusi risk scoring dengan memasukkan data absensi.

**Entity/Tabel**: intervention_reports, risk_scores (update dari Dev 1), attendances (Dev 2.6), weekly_grades (Dev 2.7), violations (Dev 1)

**Dependency**: Development 1 (violations, risk_scores), Development 2.6 (attendances), Development 2.7 (weekly_grades)

**Backend Endpoint**:
- POST /api/intervention-reports - Buat laporan intervensi
- GET /api/intervention-reports - List laporan intervensi
- GET /api/intervention-reports/{id} - Detail laporan intervensi
- PUT /api/intervention-reports/{id} - Update laporan intervensi
- GET /api/students/{student_id}/interventions - Get laporan intervensi per siswa
- GET /api/risk-scores/breakdown - Get breakdown alasan risiko per siswa
- PUT /api/risk-scores/{id}/recalculate - Recalculate risk score dengan attendance

**Frontend Page**:
- Halaman Laporan Intervensi (list siswa berisiko dengan alasan risiko, rekomendasi tindakan)
- Detail laporan intervensi dengan breakdown alasan risiko
- Form create/edit laporan intervensi
- Halaman Risk Score Breakdown (visualisasi alasan risiko: low_grades, poor_attendance, violations, trend_decline)

**Acceptance Criteria**:
- ✅ Guru atau wali kelas bisa membuat laporan intervensi untuk siswa berisiko
- ✅ Laporan intervensi menampilkan alasan risiko (low_grades, poor_attendance, violations, trend_decline)
- ✅ Laporan intervensi menampilkan rekomendasi tindakan (remedial, tutoring, counseling, parent_meeting, dll)
- ✅ Sistem menampilkan breakdown alasan risiko per siswa
- ✅ Risk score dihitung ulang dengan memasukkan attendance data
- ✅ Risk score formula: academic_risk (40%) + behavioral_risk (30%) + attendance_risk (30%)
- ✅ Attendance risk = 100 - (attendance_rate × 100) jika attendance_rate < 80%
- ✅ Sistem menampilkan list laporan intervensi dengan filter dan search

**Out of Scope**:
- ❌ AI/ML untuk prediksi risiko
- ❌ Notification system
- ❌ Parent portal access
- ❌ Automatic intervention recommendation
- ❌ Intervention effectiveness tracking

**Risiko Teknis**:
- Risk score calculation yang kompleks → Hitung di backend, buat unit test untuk formula
- Attendance data yang tidak lengkap → Tampilkan warning, hitung dengan data yang ada
- Laporan intervensi untuk siswa yang tidak berisiko → Validasi risk_level harus warning atau high_risk
- Multiple laporan intervensi untuk siswa yang sama → Unique constraint (student_id, academic_year_id, semester_id, created_by)

---

## Rekomendasi Eksekusi

### Modul Pertama: Development 2.1 — Tahun Ajaran & Semester

**Alasan**:
1. **Foundational**: Semua data akademik harus terikat tahun ajaran dan semester
2. **Scope Kecil**: Hanya 2 tabel, endpoint sederhana, tidak ada dependency kompleks
3. **Aman untuk Mulai**: Tidak ada risiko teknis yang signifikan
4. **Blocking**: Modul ini adalah blocker untuk semua modul lain

**Urutan Eksekusi Rekomendasi**:
1. Development 2.1 — Tahun Ajaran & Semester (Weeks 1-2)
2. Development 2.2 — Profil Guru (Weeks 2-3)
3. Development 2.3 — Mata Pelajaran (Weeks 3-4)
4. Development 2.4 — Assignment Mata Pelajaran ke Kelas (Weeks 4-5)
5. Development 2.5 — Assignment Guru ke Mata Pelajaran/Kelas (Weeks 5-6)
6. Development 2.6 — Manajemen Absensi (Weeks 6-8)
7. Development 2.7 — Input Nilai Mingguan (Weeks 8-10)
8. Development 2.8 — Rekap Akademik & Preview Raport (Weeks 10-12)
9. Development 2.9 — Rekomendasi Kenaikan Kelas (Weeks 12-13)
10. Development 2.10 — Laporan Intervensi & Enhanced Risk Scoring (Weeks 13-15)

**Total Timeline**: ~15 minggu (3-4 bulan)

---

## Kesimpulan

Development 2 dipecah menjadi 10 modul yang bisa dieksekusi secara bertahap dengan risiko minimal. Setiap modul memiliki scope terbatas, dependency yang jelas, dan acceptance criteria yang terukur. Mulai dari Development 2.1 (Tahun Ajaran & Semester) sebagai fondasi, kemudian lanjutkan ke modul berikutnya sesuai urutan rekomendasi.

**Prinsip Penting**:
- Jangan skip modul
- Jangan mulai modul baru sebelum modul sebelumnya selesai (kecuali tidak ada dependency)
- Setiap modul harus di-test secara independen sebelum lanjut ke modul berikutnya
- Dokumentasi harus selalu update seiring dengan implementasi
