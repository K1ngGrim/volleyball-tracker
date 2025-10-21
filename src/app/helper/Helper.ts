export function isFrontRow(position: number): boolean {
  return [2, 3, 4].includes(position + 1);
}


export function getOrCreate<K, V>(map: Map<K, V>, key: K, create: () => V): V {
  if (!map.has(key)) {
    const value = create();
    map.set(key, value);
    return value;
  }
  return map.get(key)!; // non-null assertion, since we just checked
}

export function downloadCsv(filename: string, rows: any[]) {
  if (!rows.length) return;

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','), // Header
    ...rows.map(row =>
      headers.map(h => JSON.stringify(row[h] ?? '')).join(',')
    )
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
