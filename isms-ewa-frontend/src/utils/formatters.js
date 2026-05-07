/**
 * Frontend Stability Utilities - Formatters
 * Menangani konversi dan formatting data dari API dengan aman
 * Mencegah error seperti .toFixed() pada string numeric
 */

/**
 * Konversi nilai ke number dengan aman
 * @param {number|string|null|undefined} value - Nilai yang akan dikonversi
 * @param {number} fallback - Nilai default jika konversi gagal
 * @returns {number} Nilai numeric yang aman
 */
export const safeNumber = (value, fallback = 0) => {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }

  const num = Number(value);
  return isNaN(num) ? fallback : num;
};

/**
 * Format score dengan desimal yang ditentukan
 * @param {number|string|null|undefined} value - Score value
 * @param {number} decimals - Jumlah desimal (default 2)
 * @returns {string} Score yang sudah diformat
 */
export const formatScore = (value, decimals = 2) => {
  const num = safeNumber(value, 0);
  return num.toFixed(decimals);
};

/**
 * Format persentase dengan desimal yang ditentukan
 * @param {number|string|null|undefined} value - Persentase value (0-100)
 * @param {number} decimals - Jumlah desimal (default 1)
 * @returns {string} Persentase yang sudah diformat dengan %
 */
export const formatPercentage = (value, decimals = 1) => {
  const num = safeNumber(value, 0);
  return `${num.toFixed(decimals)}%`;
};

/**
 * Format tanggal dari string ISO atau Date object
 * @param {string|Date|null|undefined} value - Tanggal yang akan diformat
 * @param {string} locale - Locale untuk formatting (default 'id-ID')
 * @returns {string} Tanggal yang sudah diformat
 */
export const formatDate = (value, locale = 'id-ID') => {
  if (!value) {
    return '-';
  }

  try {
    const date = typeof value === 'string' ? new Date(value) : value;
    if (isNaN(date.getTime())) {
      return '-';
    }
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
};

/**
 * Format tanggal dan waktu dari string ISO atau Date object
 * @param {string|Date|null|undefined} value - Tanggal yang akan diformat
 * @param {string} locale - Locale untuk formatting (default 'id-ID')
 * @returns {string} Tanggal dan waktu yang sudah diformat
 */
export const formatDateTime = (value, locale = 'id-ID') => {
  if (!value) {
    return '-';
  }

  try {
    const date = typeof value === 'string' ? new Date(value) : value;
    if (isNaN(date.getTime())) {
      return '-';
    }
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return '-';
  }
};

/**
 * Format risk level ke label yang user-friendly
 * @param {string|null|undefined} level - Risk level (safe, warning, high_risk)
 * @returns {string} Label risk level
 */
export const formatRiskLevel = (level) => {
  const levels = {
    safe: 'Aman',
    warning: 'Peringatan',
    high_risk: 'Risiko Tinggi',
  };
  return levels[level] || level || '-';
};

/**
 * Format severity ke label yang user-friendly
 * @param {string|null|undefined} severity - Severity (minor, moderate, major, severe)
 * @returns {string} Label severity
 */
export const formatSeverity = (severity) => {
  const severities = {
    minor: 'Ringan',
    moderate: 'Sedang',
    major: 'Berat',
    severe: 'Sangat Berat',
  };
  return severities[severity] || severity || '-';
};

/**
 * Format role ke label yang user-friendly
 * @param {string|null|undefined} role - Role (admin, teacher, homeroom_teacher)
 * @returns {string} Label role
 */
export const formatRole = (role) => {
  const roles = {
    admin: 'Administrator',
    teacher: 'Guru',
    homeroom_teacher: 'Wali Kelas',
  };
  return roles[role] || role || '-';
};

/**
 * Format currency (IDR)
 * @param {number|string|null|undefined} value - Nilai yang akan diformat
 * @param {string} locale - Locale untuk formatting (default 'id-ID')
 * @returns {string} Nilai yang sudah diformat sebagai currency
 */
export const formatCurrency = (value, locale = 'id-ID') => {
  const num = safeNumber(value, 0);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);
};

/**
 * Format semester ke label yang user-friendly
 * @param {number|string|null|undefined} semester - Semester (1 atau 2)
 * @returns {string} Label semester
 */
export const formatSemester = (semester) => {
  const sem = safeNumber(semester);
  if (sem === 1) return 'Semester 1';
  if (sem === 2) return 'Semester 2';
  return `-`;
};

/**
 * Format academic year (e.g., "2023/2024")
 * @param {string|null|undefined} year - Academic year
 * @returns {string} Academic year yang sudah diformat
 */
export const formatAcademicYear = (year) => {
  if (!year) return '-';
  return `${year}`;
};

/**
 * Format time duration (e.g., "2 jam 30 menit")
 * @param {number} seconds - Durasi dalam detik
 * @returns {string} Durasi yang sudah diformat
 */
export const formatDuration = (seconds) => {
  const sec = safeNumber(seconds, 0);
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const secs = sec % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours} jam`);
  if (minutes > 0) parts.push(`${minutes} menit`);
  if (secs > 0) parts.push(`${secs} detik`);

  return parts.length > 0 ? parts.join(' ') : '0 detik';
};
