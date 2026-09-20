import Papa from 'papaparse';
import * as xlsx from 'xlsx';
import fs from 'fs';

export async function parseCSV(filePath: string): Promise<Record<string, string>[]> {
  const content = fs.readFileSync(filePath, 'utf-8');
  const parsed = Papa.parse(content, { header: true, skipEmptyLines: true });
  return parsed.data as Record<string, string>[];
}

export async function parseXLSX(filePath: string): Promise<Record<string, string>[]> {
  const workbook = xlsx.readFile(filePath);
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  return xlsx.utils.sheet_to_json(worksheet, { defval: '' });
}

export async function parseJSON(filePath: string): Promise<any> {
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

export async function parseFile(filePath: string, fileType: string): Promise<Record<string, string>[]> {
  let data: any[] = [];
  if (filePath.endsWith('.csv')) {
    data = await parseCSV(filePath);
  } else if (filePath.endsWith('.xlsx') || filePath.endsWith('.xls')) {
    data = await parseXLSX(filePath);
  } else if (filePath.endsWith('.json')) {
    const json = await parseJSON(filePath);
    data = Array.isArray(json) ? json : [json];
  } else {
    // Default to CSV
    try {
      data = await parseCSV(filePath);
    } catch {
      throw new Error('Unsupported file type');
    }
  }
  
  // ensure everything is string
  return data.map(row => {
    const strRow: Record<string, string> = {};
    for (const [k, v] of Object.entries(row)) {
      strRow[k] = v !== null && v !== undefined ? String(v) : '';
    }
    return strRow;
  });
}
