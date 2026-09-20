import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import BhashiniBar from './BhashiniBar';
import { Shield, Database, GitGraph, FileText, Activity, LogOut } from 'lucide-react';

import { useTranslation } from '../utils/i18n';

const Navbar = () => {
  const location = useLocation();
  const { user, logout, language } = useAppStore();
  const t = useTranslation(language);

  const links = [
    { name: t('nav.dashboard'), path: '/', icon: <Activity size={18} /> },
    { name: t('nav.ingest'), path: '/ingest', icon: <Database size={18} /> },
    { name: t('nav.mapping'), path: '/mapping', icon: <GitGraph size={18} /> },
    { name: t('nav.graph'), path: '/graph', icon: <GitGraph size={18} /> },
    { name: t('nav.brief'), path: '/brief', icon: <FileText size={18} /> },
    { name: t('nav.audit'), path: '/audit', icon: <Shield size={18} /> },
  ];

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-3 flex items-center justify-between border-b border-sandhan-blue-800">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sandhan-orange-500 font-devanagari text-2xl font-bold">संधान</span>
          <div className="flex flex-col">
            <span className="text-white font-bold text-lg leading-tight tracking-wide">SANDHAN</span>
            <span className="text-gray-400 text-xs">Cyber Investigation Engine</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              location.pathname === link.path 
                ? 'text-sandhan-orange-400 border-b-2 border-sandhan-orange-400 pb-1' 
                : 'text-gray-300 hover:text-white pb-1'
            }`}
          >
            {link.icon}
            {link.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <BhashiniBar />
        {user && (
          <div className="px-3 py-1 rounded bg-sandhan-blue-800 text-xs text-sandhan-orange-300 border border-sandhan-blue-700">
            {user.role.toUpperCase()}
          </div>
        )}
        <button onClick={logout} className="text-gray-400 hover:text-red-400 transition-colors">
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
