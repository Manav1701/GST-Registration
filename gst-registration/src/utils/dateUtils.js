/**
 * Normalizes any date string to YYYY-MM-DD format for API submission.
 * Handles: "27/09/2011", "27-09-2011", "2011-09-27", "2011/09/27"
 * HTML date inputs always return "YYYY-MM-DD" — this handles legacy/text inputs too.
 */
export const toISODate = (val) => {
  if (!val) return null;
  const str = String(val).trim();

  // Already YYYY-MM-DD — pass through
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;

  // DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = str.match(/^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/);
  if (dmyMatch) {
    const [, d, m, y] = dmyMatch;
    return `${y}-${m}-${d}`;
  }

  // YYYY/MM/DD
  const ymdSlash = str.match(/^(\d{4})\/(\d{2})\/(\d{2})$/);
  if (ymdSlash) {
    const [, y, m, d] = ymdSlash;
    return `${y}-${m}-${d}`;
  }

  // Fallback — return as-is (let backend validate)
  return str;
};

/**
 * Converts YYYY-MM-DD to DD/MM/YYYY for backend submission.
 */
export const toBackendDate = (val) => {
  if (!val) return null;
  const str = String(val).trim();

  // YYYY-MM-DD Match
  const ymdMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (ymdMatch) {
    const [, y, m, d] = ymdMatch;
    return `${d}/${m}/${y}`;
  }

  // Already DD/MM/YYYY — pass through
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) return str;

  return str;
};

/**
 * Returns today's date as YYYY-MM-DD string.
 */
export const todayISO = () => {
  return new Date().toISOString().split("T")[0];
};
