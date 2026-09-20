import { useState, useCallback } from 'react';
import { graphApi } from '../api/client';
import { useAppStore } from '../store/appStore';
import { AnalysisResult } from '../types';
import toast from 'react-hot-toast';

export const useGraph = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { analysisResult, setAnalysisResult, setSelectedEdge, setSelectedNode, selectedEdgeId, selectedNodeId } = useAppStore();

  const fetchGraph = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data: AnalysisResult = await graphApi.getGraph();
      setAnalysisResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch graph data');
      toast.error('Failed to load investigation graph');
    } finally {
      setIsLoading(false);
    }
  }, [setAnalysisResult]);

  const selectEdge = useCallback((id: string | null) => {
    setSelectedEdge(id);
  }, [setSelectedEdge]);

  const selectNode = useCallback((id: string | null) => {
    setSelectedNode(id);
  }, [setSelectedNode]);

  return {
    graph: analysisResult,
    isLoading,
    error,
    fetchGraph,
    selectEdge,
    selectNode,
    selectedEdge: selectedEdgeId,
    selectedNode: selectedNodeId
  };
};
