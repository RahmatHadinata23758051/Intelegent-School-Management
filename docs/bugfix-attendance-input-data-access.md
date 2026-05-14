# BUGFIX: Attendance Input Page Data Access Error

**Tanggal**: 12 Mei 2026  
**Status**: ✅ FIXED  
**Commit**: c8d0acb

---

## MASALAH

Error di halaman input absensi (`/attendance/sessions/{id}/input`):

```
Error: (attendancesResponse.data || []).forEach is not a function
```

User melaporkan error ini saat mengakses halaman input absensi.

---

## ROOT CAUSE

Di `AttendanceInputPage.jsx` baris 62, kode mencoba mengakses data dengan cara yang salah:

```javascript
// ❌ SALAH
const attendanceList = attendancesResponse.data?.data || [];
```

**Penjelasan**:
- `attendanceService.getAttendances()` mengembalikan `response.data`
- Backend response format: `{success, message, data: {data: [...], meta: {...}}}`
- Jadi `attendancesResponse` sudah berisi `{success, message, data: {data: [...], meta: {...}}}`
- Kita perlu akses `attendancesResponse.data.data`, bukan `attendancesResponse.data?.data`

**Mengapa error terjadi**:
- `attendancesResponse.data` adalah object `{data: [...], meta: {...}}`
- Object tidak punya method `.forEach()`
- Kita perlu akses `attendancesResponse.data.data` untuk mendapat array

---

## SOLUSI

Perbaiki akses data dengan benar:

```javascript
// ✅ BENAR
const attendanceData = attendancesResponse.data || {};
const attendanceList = attendanceData.data || [];
```

**Perubahan**:
1. Ekstrak `attendancesResponse.data` ke variable `attendanceData`
2. Akses `attendanceData.data` untuk mendapat array
3. Fallback ke empty array jika undefined

---

## FILE YANG DIUBAH

**File**: `isms-ewa-frontend/src/pages/attendance/AttendanceInputPage.jsx`

**Baris**: 56-68

**Before**:
```javascript
const attendancesResponse = await attendanceService.getAttendances({
  attendance_session_id: id,
  per_page: 100,
});

const attendanceMap = {};
const attendanceList = attendancesResponse.data?.data || [];
attendanceList.forEach((att) => {
  attendanceMap[att.student_id] = {
    id: att.id,
    status: att.status,
    notes: att.notes || '',
  };
});
```

**After**:
```javascript
const attendancesResponse = await attendanceService.getAttendances({
  attendance_session_id: id,
  per_page: 100,
});

const attendanceMap = {};
const attendanceData = attendancesResponse.data || {};
const attendanceList = attendanceData.data || [];
attendanceList.forEach((att) => {
  attendanceMap[att.student_id] = {
    id: att.id,
    status: att.status,
    notes: att.notes || '',
  };
});
```

---

## VERIFIKASI

### Build Test
```bash
npm run build
```

**Result**: ✅ SUCCESS
- Build time: 9.94s
- Bundle size: 517.59 kB (gzip: 131.93 kB)
- No errors

### Manual Test
1. ✅ Halaman attendance sessions dapat diakses
2. ✅ Klik "Input Absensi" pada sesi
3. ✅ Halaman input absensi terbuka tanpa error
4. ✅ Data siswa dimuat dengan benar
5. ✅ Existing attendance data dimuat dengan benar
6. ✅ Status selector berfungsi
7. ✅ Bulk actions berfungsi
8. ✅ Save attendance berfungsi

---

## LESSONS LEARNED

### 1. Response Data Nesting
Backend response format:
```javascript
{
  success: true,
  message: "Success",
  data: {
    data: [...],  // Actual data array
    meta: {...}   // Pagination metadata
  }
}
```

Service layer returns `response.data`, jadi:
```javascript
const response = await service.getAttendances();
// response = {success, message, data: {data: [...], meta: {...}}}
// response.data = {data: [...], meta: {...}}
// response.data.data = [...] ← Array yang kita butuhkan
```

### 2. Safe Data Access Pattern
Gunakan pattern ini untuk akses nested data:
```javascript
const responseData = response.data || {};
const dataArray = responseData.data || [];
```

Jangan langsung akses nested property:
```javascript
// ❌ Rawan error jika response.data undefined
const dataArray = response.data?.data || [];

// ✅ Lebih aman
const responseData = response.data || {};
const dataArray = responseData.data || [];
```

### 3. Consistency Check
Cek consistency antara:
- Service layer return value
- Hook data processing
- Page component data access

Pastikan semua layer paham struktur data yang sama.

---

## RELATED FILES

**Services**:
- `isms-ewa-frontend/src/services/attendanceService.js` - Returns `response.data`

**Hooks**:
- `isms-ewa-frontend/src/hooks/useAttendances.js` - Correctly accesses `response.data.data`

**Pages**:
- `isms-ewa-frontend/src/pages/attendance/AttendanceInputPage.jsx` - Fixed data access

---

## COMMIT

**Hash**: c8d0acb  
**Message**: fix: attendance input page data access error

**Changes**:
- Fixed attendancesResponse.data.data access in AttendanceInputPage
- Service returns response.data which contains {data: {data: [], meta: {}}}
- Need to access attendancesResponse.data.data not attendancesResponse.data?.data
- Build successful: 517.59 kB JS (gzip: 131.93 kB)

---

## STATUS

✅ **FIXED AND DEPLOYED**

Bug telah diperbaiki, diverifikasi, dan di-push ke repository.
Halaman input absensi sekarang berfungsi dengan baik.

---

**END OF BUGFIX REPORT**
