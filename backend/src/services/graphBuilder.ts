import { CaseGraph, Entity, NormalizedRow, GraphNode, GraphEdge } from '../types';
import { generateEntityId } from './extractor';

export function buildGraph(entities: Entity[], rows: NormalizedRow[]): CaseGraph {
  const nodes = new Map<string, GraphNode>();
  const edges = new Map<string, GraphEdge>();

  // Add nodes
  for (const entity of entities) {
    nodes.set(entity.id, { entity, edges: [] });
  }

  const addEdge = (sourceId: string, targetId: string, relation: GraphEdge['relation'], row: NormalizedRow, confidence: number) => {
    if (!sourceId || !targetId || sourceId === targetId) return;
    // Ensure both nodes exist in the graph before adding edge
    if (!nodes.has(sourceId) || !nodes.has(targetId)) return;

    const edgeId = `${sourceId}-${relation}-${targetId}`;
    if (!edges.has(edgeId)) {
      edges.set(edgeId, {
        id: edgeId,
        source: sourceId,
        target: targetId,
        relation,
        confidence,
        evidence_count: 1,
        timestamps: row.timestamp ? [row.timestamp] : [],
        source_files: [row.source_file],
        row_refs: [row.row_index],
        reasons: [`Found together in ${row.source_file}`]
      });
      nodes.get(sourceId)?.edges.push(edgeId);
      nodes.get(targetId)?.edges.push(edgeId);
    } else {
      const e = edges.get(edgeId)!;
      e.evidence_count++;
      if (row.timestamp && !e.timestamps.includes(row.timestamp)) e.timestamps.push(row.timestamp);
      if (!e.source_files.includes(row.source_file)) e.source_files.push(row.source_file);
      if (!e.row_refs.includes(row.row_index)) e.row_refs.push(row.row_index);
      e.reasons = [`${e.evidence_count} co-occurrences in files`];
    }
  };

  // Build edges based on normalized rows
  for (const row of rows) {
    const phoneId = row.source_phone ? generateEntityId('phone', row.source_phone) : null;
    const destPhoneId = row.dest_phone ? generateEntityId('phone', row.dest_phone) : null;
    const imeiId = row.imei ? generateEntityId('imei', row.imei) : null;
    const upiId = row.upi_id ? generateEntityId('upi', row.upi_id) : null;
    const accId = row.account_no ? generateEntityId('account', row.account_no) : null;
    const ipId = row.ip_address ? generateEntityId('ip', row.ip_address) : null;

    if (phoneId && imeiId) addEdge(phoneId, imeiId, 'USES', row, 90);
    if (phoneId && destPhoneId) addEdge(phoneId, destPhoneId, 'CALLED', row, 100);
    if (phoneId && ipId) addEdge(phoneId, ipId, 'CONNECTED_FROM', row, 80);
    if (upiId && phoneId) addEdge(phoneId, upiId, 'USES', row, 85);
    if (upiId && destPhoneId) addEdge(upiId, destPhoneId, 'TRANSFERRED_TO', row, 95);
    if (accId && upiId) addEdge(accId, upiId, 'OWNS', row, 90);
    if (accId && phoneId) addEdge(accId, phoneId, 'OWNS', row, 85);
  }

  return { nodes, edges };
}

export function getEdgeExplanation(edge: GraphEdge): { relationship: string, confidence: number, reasons: string[], sources: {file: string, rows: number[]}[] } {
  return {
    relationship: edge.relation,
    confidence: edge.confidence,
    reasons: edge.reasons,
    sources: [{ file: edge.source_files[0] || 'Unknown', rows: edge.row_refs }]
  };
}

export function exportGraphJSON(graph: CaseGraph): { nodes: any[], edges: any[] } {
  const elements = {
    nodes: Array.from(graph.nodes.values()).map(n => ({
      data: { id: n.entity.id, label: n.entity.value, type: n.entity.type }
    })),
    edges: Array.from(graph.edges.values()).map(e => ({
      data: { id: e.id, source: e.source, target: e.target, label: e.relation }
    }))
  };
  return elements;
}
