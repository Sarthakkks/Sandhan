import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';
import { useGraph } from '../hooks/useGraph';
import { Loader2 } from 'lucide-react';

cytoscape.use(coseBilkent);

const GraphCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const { graph, isLoading, error, selectNode, selectEdge } = useGraph();

  useEffect(() => {
    if (!containerRef.current) return;

    const rawEntities = (graph?.entities && graph.entities.length > 0) ? graph.entities : [
      { id: 'imei_490154203237518', value: '490154203237518', type: 'imei', risk_score: 75, is_flagged: true },
      { id: 'phone_9820000002', value: '9820000002', type: 'phone', risk_score: 65, is_flagged: false },
      { id: 'phone_9830000003', value: '9830000003', type: 'phone', risk_score: 65, is_flagged: false },
      { id: 'phone_9810000001', value: '9810000001', type: 'phone', risk_score: 65, is_flagged: false },
      { id: 'upi_victim_upi', value: 'victim@upi', type: 'upi', risk_score: 20, is_flagged: false },
      { id: 'upi_mule_upi', value: 'mule@upi', type: 'upi', risk_score: 65, is_flagged: false },
      { id: 'upi_inter_upi', value: 'inter@upi', type: 'upi', risk_score: 65, is_flagged: false },
      { id: 'upi_cashout_upi', value: 'cashout@upi', type: 'upi', risk_score: 65, is_flagged: false },
      { id: 'ip_192_168_10_42', value: '192.168.10.42', type: 'ip', risk_score: 45, is_flagged: false },
    ];

    const rawEdges = (graph?.edges && graph.edges.length > 0) ? graph.edges : [
      { id: 'edge-1', source: 'phone_9810000001', target: 'imei_490154203237518', relation: 'USES', confidence: 90, evidence_count: 3 },
      { id: 'edge-2', source: 'phone_9820000002', target: 'imei_490154203237518', relation: 'USES', confidence: 90, evidence_count: 2 },
      { id: 'edge-3', source: 'upi_victim_upi', target: 'upi_mule_upi', relation: 'TRANSFERRED_TO', confidence: 95, evidence_count: 1 },
      { id: 'edge-4', source: 'upi_mule_upi', target: 'upi_inter_upi', relation: 'TRANSFERRED_TO', confidence: 95, evidence_count: 1 },
      { id: 'edge-5', source: 'upi_inter_upi', target: 'upi_cashout_upi', relation: 'TRANSFERRED_TO', confidence: 95, evidence_count: 1 },
      { id: 'edge-6', source: 'phone_9810000001', target: 'ip_192_168_10_42', relation: 'CONNECTED_FROM', confidence: 80, evidence_count: 4 },
      { id: 'edge-7', source: 'phone_9820000002', target: 'ip_192_168_10_42', relation: 'CONNECTED_FROM', confidence: 80, evidence_count: 2 },
    ];

    const elements: cytoscape.ElementDefinition[] = [
      ...rawEntities.map((e: any) => ({
        data: {
          id: e.id,
          label: e.value || e.id,
          type: e.type || 'phone',
          risk_score: e.risk_score || 20
        }
      })),
      ...rawEdges.map((e: any) => ({
        data: {
          id: e.id,
          source: e.source,
          target: e.target,
          relation: e.relation || 'LINKED',
          confidence: e.confidence || 80,
          evidence_count: e.evidence_count || 1
        }
      }))
    ];

    cyRef.current = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'color': '#F1F5F9',
            'text-valign': 'bottom',
            'text-halign': 'center',
            'text-margin-y': 5,
            'font-size': '10px',
            'background-color': (ele: any) => {
              const score = ele.data('risk_score');
              return score > 70 ? '#EF4444' : score > 40 ? '#F59E0B' : '#10B981';
            },
            'shape': (ele: any) => {
              const t = ele.data('type');
              if (t === 'phone') return 'ellipse';
              if (t === 'imei') return 'rectangle';
              if (t === 'upi') return 'diamond';
              if (t === 'ip') return 'hexagon';
              return 'round-rectangle';
            },
            'width': 30,
            'height': 30,
            'border-width': 2,
            'border-color': '#1E293B'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': ((ele: any) => Math.max(1, Math.min(ele.data('evidence_count') / 2, 5))) as any,
            'line-color': '#475569',
            'target-arrow-color': '#475569',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'opacity': ((ele: any) => Math.max(0.3, ele.data('confidence') / 100)) as any,
            'label': 'data(relation)',
            'font-size': '8px',
            'color': '#94A3B8',
            'text-background-color': '#0F172A',
            'text-background-opacity': 0.8,
            'text-background-padding': 2 as any
          }
        },
        {
          selector: ':selected',
          style: {
            'border-color': '#F97316',
            'border-width': 3,
            'line-color': '#F97316',
            'target-arrow-color': '#F97316'
          }
        }
      ],
      layout: {
        name: 'cose-bilkent',
        nodeRepulsion: 4500,
        idealEdgeLength: 100
      } as any
    });

    cyRef.current.on('tap', 'node', (evt) => {
      selectNode(evt.target.id());
    });

    cyRef.current.on('tap', 'edge', (evt) => {
      selectEdge(evt.target.id());
    });

    cyRef.current.on('tap', (evt) => {
      if (evt.target === cyRef.current) {
        selectNode(null);
        selectEdge(null);
      }
    });

    return () => {
      if (cyRef.current) cyRef.current.destroy();
    };
  }, [graph, selectNode, selectEdge]);

  if (isLoading) return <div className="w-full h-full flex items-center justify-center"><Loader2 className="animate-spin text-sandhan-orange-500 w-10 h-10" /></div>;
  if (error) return <div className="w-full h-full flex items-center justify-center text-red-400">{error}</div>;

  return <div ref={containerRef} id="cy" className="w-full h-full bg-sandhan-blue-900" />;
};

export default GraphCanvas;
