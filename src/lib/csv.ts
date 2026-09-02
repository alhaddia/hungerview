export function escapeCsvCell(cell: string | number): string {
  const s = String(cell);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function rowsToCsv(rows: (string | number)[][]): string {
  return rows.map((row) => row.map(escapeCsvCell).join(',')).join('\n');
}
