import { Link } from 'react-router-dom';
import { Database, GitGraph, FileText, Activity, Users, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../store/appStore';

import { useTranslation } from '../utils/i18n';

const Dashboard = () => {
  const { evidenceFiles, analysisResult, language } = useAppStore();
  const t = useTranslation(language);

  const stats = [
    { label: t('dashboard.total_files'), value: evidenceFiles.length || 4, icon: <Database className="text-sandhan-blue-400" /> },
    { label: t('dashboard.total_entities'), value: analysisResult?.entities?.length || 15, icon: <Users className="text-sandhan-green" /> },
    { label: t('dashboard.high_risk'), value: analysisResult?.entities?.filter(e => e.risk_score > 70).length || 1, icon: <AlertTriangle className="text-red-500" /> },
    { label: t('dashboard.graph_edges'), value: analysisResult?.edges?.length || 11, icon: <Activity className="text-sandhan-orange-400" /> },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="relative overflow-hidden rounded-2xl glass p-10 border border-sandhan-blue-700 bg-gradient-to-br from-sandhan-blue-900 to-sandhan-blue-800">
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold text-white mb-4 flex items-center gap-4">
            <span className="text-sandhan-orange-500 font-devanagari text-5xl">संधान</span>
            SANDHAN
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            {t('dashboard.subtitle')}
            <br/>
            <span className="text-sandhan-orange-400 font-medium">"The Quest for Truth in Fragmented Evidence"</span>
          </p>
        </div>
        <div className="absolute right-0 top-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sandhan-orange-500/20 via-transparent to-transparent opacity-50 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-6 rounded-xl border border-sandhan-blue-700 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
            </div>
            <div className="p-3 bg-sandhan-blue-900 rounded-lg">{stat.icon}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-xl border border-sandhan-blue-700">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Activity size={20} className="text-sandhan-orange-500" /> {t('dashboard.quick_actions')}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/ingest" className="p-4 bg-sandhan-blue-800 rounded-lg border border-sandhan-blue-700 hover:border-sandhan-orange-500 transition-colors flex flex-col items-center gap-3 text-center group">
              <Database className="text-gray-400 group-hover:text-sandhan-orange-400 transition-colors" />
              <span className="text-sm font-medium text-gray-200">{t('nav.ingest')}</span>
            </Link>
            <Link to="/mapping" className="p-4 bg-sandhan-blue-800 rounded-lg border border-sandhan-blue-700 hover:border-sandhan-orange-500 transition-colors flex flex-col items-center gap-3 text-center group">
              <GitGraph className="text-gray-400 group-hover:text-sandhan-orange-400 transition-colors" />
              <span className="text-sm font-medium text-gray-200">{t('nav.mapping')}</span>
            </Link>
            <Link to="/graph" className="p-4 bg-sandhan-blue-800 rounded-lg border border-sandhan-blue-700 hover:border-sandhan-orange-500 transition-colors flex flex-col items-center gap-3 text-center group">
              <Activity className="text-gray-400 group-hover:text-sandhan-orange-400 transition-colors" />
              <span className="text-sm font-medium text-gray-200">{t('dashboard.view_graph')}</span>
            </Link>
            <Link to="/brief" className="p-4 bg-sandhan-blue-800 rounded-lg border border-sandhan-blue-700 hover:border-sandhan-orange-500 transition-colors flex flex-col items-center gap-3 text-center group">
              <FileText className="text-gray-400 group-hover:text-sandhan-orange-400 transition-colors" />
              <span className="text-sm font-medium text-gray-200">{t('dashboard.view_brief')}</span>
            </Link>
          </div>
        </div>

        <div className="glass p-6 rounded-xl border border-sandhan-blue-700">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Activity size={20} className="text-sandhan-orange-500" /> {t('dashboard.suspect_trail')}
          </h2>
          <div className="flex flex-col justify-center h-40 space-y-3 bg-sandhan-blue-900/50 p-4 rounded-lg border border-sandhan-blue-800">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Anchor Time: 10:01:23 AM</span>
              <span className="text-sandhan-green font-semibold">Active Correlation</span>
            </div>
            <div className="font-mono text-sm text-sandhan-orange-400 font-bold tracking-tight">
              victim@upi ➔ mule@upi ➔ inter@upi ➔ cashout@upi
            </div>
            <div className="text-xs text-gray-300">
              Target Device IMEI: <span className="text-white font-mono font-semibold">490154203237518</span> (Risk: 75%)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
