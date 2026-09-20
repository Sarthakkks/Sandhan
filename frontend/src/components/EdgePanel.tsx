import React, { useEffect, useState } from 'react';
import { graphApi } from '../api/client';
import { GraphEdge } from '../types';
import { X, CheckCircle2, FileText, Clock } from 'lucide-react';
import ScoreBar from './ScoreBar';

interface EdgePanelProps {
  edgeId: string | null;
  onClose: () => void;
}

const EdgePanel: React.FC<EdgePanelProps> = ({ edgeId, onClose }) => {
  const [edge, setEdge] = useState<GraphEdge | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!edgeId) return;
    const fetchEdge = async () => {
      setLoading(true);
      try {
        const data = await graphApi.getEdge(edgeId);
        setEdge(data);
      } catch (err) {
        console.error('Failed to fetch edge details');
      } finally {
        setLoading(false);
      }
    };
    fetchEdge();
  }, [edgeId]);

  if (!edgeId) return null;

  return (
    <div className="absolute right-0 top-0 bottom-0 w-96 glass border-l border-sandhan-blue-700 animate-slide-up overflow-y-auto z-10 shadow-2xl shadow-black/50">
      <div className="p-5 border-b border-sandhan-blue-700 flex justify-between items-center sticky top-0 bg-sandhan-blue-900/90 backdrop-blur-md">
        <h2 className="font-bold text-lg text-white">Relationship Details</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      {loading ? (
        <div className="p-6 text-center text-gray-400">Loading details...</div>
      ) : edge ? (
        <div className="p-5 space-y-6">
          <div>
            <div className="inline-block px-2 py-1 rounded bg-sandhan-orange-500/20 border border-sandhan-orange-500/30 text-sandhan-orange-400 text-xs font-semibold uppercase tracking-wider mb-2">
              {edge.relation}
            </div>
            <h3 className="text-sm font-mono text-gray-300 break-all bg-black/20 p-2 rounded">
              <span className="text-white">{edge.source}</span> <br/>
              <span className="text-gray-500">→</span> <br/>
              <span className="text-white">{edge.target}</span>
            </h3>
          </div>

          <div>
            <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-2">Confidence</h4>
            <ScoreBar score={edge.confidence} label="Match Confidence" type="confidence" />
          </div>

          <div>
            <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-3">Why Linked?</h4>
            <ul className="space-y-2">
              {edge.reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300 bg-black/20 p-2 rounded">
                  <CheckCircle2 size={16} className="text-sandhan-green mt-0.5 shrink-0" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
              <FileText size={14} /> Source Files
            </h4>
            <div className="space-y-2">
              {edge.sources.map((s, i) => (
                <div key={i} className="text-xs flex justify-between items-center p-2 rounded bg-sandhan-blue-800 border border-sandhan-blue-700">
                  <span className="font-medium text-gray-200">{s.file}</span>
                  <span className="text-gray-400">Rows: {s.rows.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
              <Clock size={14} /> Occurrences
            </h4>
            <div className="text-xs text-gray-300 bg-black/20 p-2 rounded max-h-32 overflow-y-auto space-y-1">
              {edge.timestamps.map((t, i) => (
                <div key={i} className="font-mono">{t}</div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center text-gray-400">Failed to load.</div>
      )}
    </div>
  );
};

export default EdgePanel;
