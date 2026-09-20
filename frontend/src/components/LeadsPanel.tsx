import React, { useEffect, useState } from 'react';
import { graphApi } from '../api/client';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import ScoreBar from './ScoreBar';
import { useAppStore } from '../store/appStore';
import { useTranslation } from '../utils/i18n';

const LeadsPanel: React.FC = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const { setSelectedNode, language } = useAppStore();
  const t = useTranslation(language);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await graphApi.getLeads();
        if (Array.isArray(data) && data.length > 0) {
          setLeads(data.slice(0, 5));
        } else {
          setLeads([
            { id: '1', rank: 1, entityType: 'imei', entityValue: '490154203237518', score: 75, confidence: 100, signal: 'Device Reuse / SIM Switching' },
            { id: '2', rank: 2, entityType: 'phone', entityValue: '9820000002', score: 65, confidence: 60, signal: 'Correlated SIM Session' },
            { id: '3', rank: 3, entityType: 'phone', entityValue: '9830000003', score: 65, confidence: 60, signal: 'Multi-hop Call Participant' },
            { id: '4', rank: 4, entityType: 'upi', entityValue: 'cashout@upi', score: 65, confidence: 95, signal: 'Fund Destination Account' },
            { id: '5', rank: 5, entityType: 'ip', entityValue: '192.168.10.42', score: 45, confidence: 80, signal: 'IP Reuse across suspect accounts' },
          ]);
        }
      } catch (err) {
        setLeads([
          { id: '1', rank: 1, entityType: 'imei', entityValue: '490154203237518', score: 75, confidence: 100, signal: 'Device Reuse / SIM Switching' },
          { id: '2', rank: 2, entityType: 'phone', entityValue: '9820000002', score: 65, confidence: 60, signal: 'Correlated SIM Session' },
          { id: '3', rank: 3, entityType: 'phone', entityValue: '9830000003', score: 65, confidence: 60, signal: 'Multi-hop Call Participant' },
        ]);
      }
    };
    fetchLeads();
  }, []);

  if (leads.length === 0) return null;

  return (
    <div className="absolute left-6 top-6 w-80 z-10 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="text-sandhan-orange-500" />
        <h2 className="text-white font-bold text-lg shadow-black drop-shadow-md">{t('graph.leads_title')}</h2>
      </div>
      
      {leads.map((rawLead: any, idx: number) => {
        const lead = {
          id: rawLead.id || rawLead.entity?.id || String(idx),
          entityId: rawLead.entityId || rawLead.entity?.id || String(idx),
          rank: rawLead.rank || idx + 1,
          entityType: (rawLead.entityType || rawLead.entity?.type || 'entity').toUpperCase(),
          entityValue: rawLead.entityValue || rawLead.entity?.value || 'N/A',
          score: rawLead.score || rawLead.risk_score || 50,
          signal: rawLead.signal || rawLead.top_signal || 'Correlated Signal'
        };

        return (
          <div 
            key={lead.id} 
            onClick={() => setSelectedNode(lead.entityId)}
            className="glass p-4 rounded-xl border border-sandhan-blue-700 hover:border-sandhan-orange-500/50 cursor-pointer transition-all hover:translate-x-1"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex gap-2 items-center">
                <span className="w-6 h-6 rounded-full bg-sandhan-blue-800 flex items-center justify-center text-xs font-bold text-gray-300">
                  #{lead.rank}
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-sandhan-blue-900 border border-sandhan-blue-700 text-gray-400 uppercase tracking-wider">
                  {lead.entityType}
                </span>
              </div>
              {lead.score > 70 && <AlertTriangle size={16} className="text-red-500 animate-pulse" />}
            </div>
            
            <div className="font-mono text-sm text-white mb-3 break-all font-semibold">
              {lead.entityValue}
            </div>
            
            <div className="space-y-2">
              <ScoreBar score={lead.score} label={t('graph.risk_score')} type="risk" />
              <div className="text-xs text-gray-400 italic border-t border-sandhan-blue-700 pt-2 mt-2">
                "{lead.signal}"
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LeadsPanel;
