import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Entity } from '../types';
import { X, Activity } from 'lucide-react';
import ScoreBar from './ScoreBar';

interface NodePanelProps {
  nodeId: string | null;
  onClose: () => void;
}

const NodePanel: React.FC<NodePanelProps> = ({ nodeId, onClose }) => {
  const { analysisResult } = useAppStore();
  const [node, setNode] = useState<Entity | null>(null);

  useEffect(() => {
    if (!nodeId || !analysisResult) return;
    const found = analysisResult.entities.find(e => e.id === nodeId);
    setNode(found || null);
  }, [nodeId, analysisResult]);

  if (!nodeId || !node) return null;

  return (
    <div className="absolute right-0 top-0 bottom-0 w-96 glass border-l border-sandhan-blue-700 animate-slide-up overflow-y-auto z-10 shadow-2xl shadow-black/50">
      <div className="p-5 border-b border-sandhan-blue-700 flex justify-between items-center sticky top-0 bg-sandhan-blue-900/90 backdrop-blur-md">
        <h2 className="font-bold text-lg text-white">Entity Details</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>
      <div className="p-5 space-y-6">
        <div>
          <span className="inline-block px-2 py-1 rounded bg-sandhan-blue-800 border border-sandhan-blue-600 text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
            {node.type}
          </span>
          <h3 className="text-lg font-mono text-white break-all bg-black/20 p-3 rounded border border-sandhan-blue-800">
            {node.value}
          </h3>
        </div>
        
        <div>
          <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Activity size={14} /> Risk Analysis
          </h4>
          <ScoreBar score={node.risk_score} label="Risk Score" type="risk" />
        </div>
      </div>
    </div>
  );
};

export default NodePanel;
