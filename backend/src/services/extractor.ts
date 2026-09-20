import { NormalizedRow, Entity } from '../types';

export function generateEntityId(type: string, value: string): string {
  return `${type}_${value.replace(/[^a-zA-Z0-9]/g, '_')}`;
}

export function extractEntities(rows: NormalizedRow[]): Entity[] {
  const entityMap = new Map<string, Entity>();

  const patterns = {
    phone: /^[6-9]\d{9}$/,
    imei: /^\d{15}$/,
    upi: /^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/,
    ip: /^(\d{1,3}\.){3}\d{1,3}$/,
    account: /^\d{9,18}$/
  };

  const addEntity = (type: Entity['type'], value: string, source: string, rowRef: number) => {
    if (!value) return;
    const id = generateEntityId(type, value);
    if (!entityMap.has(id)) {
      entityMap.set(id, {
        id,
        type,
        value,
        sources: [source],
        row_refs: [rowRef],
        risk_score: 0,
        confidence: 0,
        properties: {}
      });
    } else {
      const e = entityMap.get(id)!;
      if (!e.sources.includes(source)) e.sources.push(source);
      if (!e.row_refs.includes(rowRef)) e.row_refs.push(rowRef);
    }
  };

  for (const row of rows) {
    if (row.source_phone && patterns.phone.test(row.source_phone)) {
      addEntity('phone', row.source_phone, row.source_file, row.row_index);
    }
    if (row.dest_phone && patterns.phone.test(row.dest_phone)) {
      addEntity('phone', row.dest_phone, row.source_file, row.row_index);
    }
    if (row.imei && patterns.imei.test(row.imei)) {
      addEntity('imei', row.imei, row.source_file, row.row_index);
    }
    if (row.upi_id && patterns.upi.test(row.upi_id)) {
      addEntity('upi', row.upi_id, row.source_file, row.row_index);
    }
    if (row.ip_address && patterns.ip.test(row.ip_address)) {
      addEntity('ip', row.ip_address, row.source_file, row.row_index);
    }
    if (row.account_no && patterns.account.test(row.account_no)) {
      addEntity('account', row.account_no, row.source_file, row.row_index);
    }
  }

  return Array.from(entityMap.values());
}
