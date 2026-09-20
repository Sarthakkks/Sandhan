import { NormalizedRow, ColumnMapping } from '../types';

export function normalizeRows(rows: Record<string, string>[], mappings: ColumnMapping[], sourceFile: string): NormalizedRow[] {
  return rows.map((row, index) => {
    const normalized: NormalizedRow = {
      raw: row,
      source_file: sourceFile,
      row_index: index
    };
    
    for (const mapping of mappings) {
      if (row[mapping.source_col] !== undefined) {
        let val = row[mapping.source_col].trim();
        (normalized as any)[mapping.target_field] = val;
      }
    }
    
    return normalized;
  });
}

export function suggestMappings(columns: string[]): ColumnMapping[] {
  const mappings: ColumnMapping[] = [];
  for (const col of columns) {
    const lower = col.toLowerCase();
    if (lower.includes('phone') || lower.includes('mobile') || lower.includes('msisdn') || lower.includes('caller')) {
      mappings.push({ source_col: col, target_field: 'source_phone' });
    } else if (lower.includes('called') || lower.includes('receiver')) {
      mappings.push({ source_col: col, target_field: 'dest_phone' });
    } else if (lower.includes('time') || lower.includes('date')) {
      mappings.push({ source_col: col, target_field: 'timestamp' });
    } else if (lower.includes('imei') || lower.includes('device')) {
      mappings.push({ source_col: col, target_field: 'imei' });
    } else if (lower.includes('upi')) {
      mappings.push({ source_col: col, target_field: 'upi_id' });
    } else if (lower.includes('ip')) {
      mappings.push({ source_col: col, target_field: 'ip_address' });
    } else if (lower.includes('amount') || lower.includes('amt')) {
      mappings.push({ source_col: col, target_field: 'amount' });
    } else if (lower.includes('account') || lower.includes('acc')) {
      mappings.push({ source_col: col, target_field: 'account_no' });
    }
  }
  return mappings;
}
