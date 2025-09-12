const KEYS = ['name', 'job', 'city', 'id', 'startDate', 'salary'];

export function rowToObject(row) {
  const obj = {};
  KEYS.forEach((k, i) => {
    obj[k] = row[i] ?? null;
  });

  obj.salaryNumber = parseSalaryToNumber(obj.salary);
  obj.startDateISO = obj.startDate ? new Date(obj.startDate).toISOString() : null;
  return obj;
}

export function parseRowsToObjects(rows) {
  if (!Array.isArray(rows)) return [];
  return rows.map(rowToObject);
}

export function parseSalaryToNumber(salaryStr) {
  if (!salaryStr && salaryStr !== 0) return 0;
  const digits = String(salaryStr).replace(/[^0-9.-]+/g, '');
  const n = parseInt(digits, 10);
  return Number.isNaN(n) ? 0 : n;
}
