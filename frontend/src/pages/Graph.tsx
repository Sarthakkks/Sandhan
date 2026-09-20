import { useEffect } from 'react';
import GraphCanvas from '../components/GraphCanvas';
import LeadsPanel from '../components/LeadsPanel';
import EdgePanel from '../components/EdgePanel';
import NodePanel from '../components/NodePanel';
import { useGraph } from '../hooks/useGraph';
import { Filter, Layers, Zap } from 'lucide-react';

import { useTranslation } from '../utils/i18n';
import { useAppStore } from '../store/appStore';

const Graph = () => {
  const { fetchGraph, graph, selectedEdge, selectedNode, selectEdge, selectNode } = useGraph();
  const { language } = useAppStore();
  const t = useTranslation(language);

  useEffect(() => {
    fetchGraph();
  }, [fetchGraph]);

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-sandhan-blue-900">
      {/* Top Toolbar */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <div className="glass px-3 py-1.5 rounded-lg flex items-center gap-2 border border-sandhan-blue-700">
          <Layers size={14} className="text-gray-400" />
          <select className="bg-transparent text-xs text-gray-200 outline-none">
            <option value="cose-bilkent">Cose Bilkent</option>
            <option value="grid">Grid</option>
            <option value="circle">Circle</option>
          </select>
        </div>
        <button className="glass px-3 py-1.5 rounded-lg flex items-center gap-2 border border-sandhan-blue-700 text-xs text-gray-200 hover:border-sandhan-orange-500 transition-colors">
          <Filter size={14} /> {t('mapping.auto_map')}
        </button>
      </div>

      <LeadsPanel />
      
      <GraphCanvas />

      <EdgePanel edgeId={selectedEdge} onClose={() => selectEdge(null)} />
      <NodePanel nodeId={selectedNode} onClose={() => selectNode(null)} />

      {/* Bottom Status Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 glass px-6 py-2 rounded-full border border-sandhan-blue-700 flex items-center gap-6 shadow-lg">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full bg-sandhan-green animate-pulse"></div>
          <span className="text-gray-300">{t('graph.live_graph')}</span>
        </div>
        <div className="w-px h-4 bg-sandhan-blue-700"></div>
        <div className="flex gap-4 text-xs font-mono">
          <span className="text-gray-400">{t('graph.entities')}: <span className="text-white font-bold">{graph?.entities?.length || 15}</span></span>
          <span className="text-gray-400">{t('graph.relations')}: <span className="text-white font-bold">{graph?.edges?.length || 11}</span></span>
        </div>
        <div className="w-px h-4 bg-sandhan-blue-700"></div>
        <div className="text-xs text-gray-400 flex items-center gap-1">
          <Zap size={12} className="text-sandhan-orange-500" /> {t('graph.anchor')}: {graph?.anchor_time ? new Date(graph.anchor_time).toLocaleTimeString() : '10:01:23 AM'}
        </div>
      </div>
    </div>
  );
};

export default Graph;
