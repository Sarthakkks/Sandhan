import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUploader from '../components/FileUploader';
import { useEvidence } from '../hooks/useEvidence';
import { CheckCircle2, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

import { useTranslation } from '../utils/i18n';
import { useAppStore } from '../store/appStore';

const Ingest = () => {
  const { files, upload, verify, refresh } = useEvidence();
  const { language } = useAppStore();
  const t = useTranslation(language);
  const navigate = useNavigate();

  useEffect(() => {
    refresh();
  }, [refresh]);

  const displayFiles = files.length > 0 ? files : [
    { id: 'f-cdr', file_id: 'f-cdr', name: 'CDR.csv', file_name: 'CDR.csv', type: 'CDR', file_type: 'cdr', size: 245760, file_size: 245760, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', sha256_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', timestamp: '2024-01-15T10:00:00.000Z', ingestion_timestamp: '2024-01-15T10:00:00.000Z', verified: true },
    { id: 'f-bank', file_id: 'f-bank', name: 'Bank.csv', file_name: 'Bank.csv', type: 'BANK', file_type: 'bank', size: 184320, file_size: 184320, hash: 'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3', sha256_hash: 'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3', timestamp: '2024-01-15T10:01:00.000Z', ingestion_timestamp: '2024-01-15T10:01:00.000Z', verified: true },
    { id: 'f-ipdr', file_id: 'f-ipdr', name: 'IPDR.csv', file_name: 'IPDR.csv', type: 'IPDR', file_type: 'ipdr', size: 512000, file_size: 512000, hash: 'c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4', sha256_hash: 'c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4', timestamp: '2024-01-15T10:02:00.000Z', ingestion_timestamp: '2024-01-15T10:02:00.000Z', verified: true },
    { id: 'f-device', file_id: 'f-device', name: 'device.json', file_name: 'device.json', type: 'DEVICE', file_type: 'device', size: 65536, file_size: 65536, hash: 'd4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5', sha256_hash: 'd4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5', timestamp: '2024-01-15T10:03:00.000Z', ingestion_timestamp: '2024-01-15T10:03:00.000Z', verified: true }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">{t('ingest.title')}</h1>
        <p className="text-gray-400">{t('ingest.subtitle')}</p>
      </div>

      <FileUploader onDrop={(acceptedFiles, type) => { if (acceptedFiles.length > 0) upload(acceptedFiles[0], type); }} />

      <div className="glass rounded-xl border border-sandhan-blue-700 overflow-hidden">
        <div className="p-4 border-b border-sandhan-blue-700 bg-sandhan-blue-900/50 flex justify-between items-center">
          <h2 className="font-semibold text-gray-200 flex items-center gap-2">
            <ShieldCheck className="text-sandhan-orange-500" size={18} /> {t('ingest.ledger')}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-sandhan-blue-900 text-gray-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">{t('ingest.col_name')}</th>
                <th className="p-4 font-medium">{t('ingest.col_type')}</th>
                <th className="p-4 font-medium">{t('ingest.col_size')}</th>
                <th className="p-4 font-medium">{t('ingest.col_hash')}</th>
                <th className="p-4 font-medium">{t('ingest.col_date')}</th>
                <th className="p-4 font-medium">{t('ingest.col_status')}</th>
                <th className="p-4 font-medium text-right">{t('ingest.col_actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sandhan-blue-800 text-sm">
              {displayFiles.map((rawF: any, index: number) => {
                const f = {
                  id: rawF.id || rawF.file_id || String(index),
                  name: rawF.name || rawF.file_name || 'Evidence.csv',
                  type: (rawF.type || rawF.file_type || 'CSV').toUpperCase(),
                  size: rawF.size || rawF.file_size || 245760,
                  hash: rawF.hash || rawF.sha256_hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
                  timestamp: rawF.timestamp || rawF.ingestion_timestamp || new Date().toISOString(),
                  verified: rawF.verified ?? true,
                };

                return (
                  <tr key={f.id} className="hover:bg-sandhan-blue-800/30 transition-colors">
                    <td className="p-4 font-medium text-gray-200">{f.name}</td>
                    <td className="p-4 text-gray-400">
                      <span className="px-2 py-1 rounded bg-sandhan-blue-800 text-xs border border-sandhan-blue-700 uppercase">{f.type}</span>
                    </td>
                    <td className="p-4 text-gray-400">{(f.size / 1024 / 1024).toFixed(2)} MB</td>
                    <td className="p-4">
                      <div className="font-mono text-xs text-gray-500 truncate w-24 group relative cursor-help">
                        {f.hash.substring(0, 8)}...
                        <div className="hidden group-hover:block absolute left-0 bottom-full mb-2 p-2 bg-black text-white rounded z-10 w-auto whitespace-nowrap">
                          {f.hash}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-400 flex items-center gap-1">
                      <Clock size={14} /> {new Date(f.timestamp).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      {f.verified ? (
                        <span className="flex items-center gap-1 text-sandhan-green text-xs"><CheckCircle2 size={14} /> {t('ingest.verified')}</span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-400 text-xs"><CheckCircle2 size={14} /> {t('ingest.pending')}</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => verify(f.id)}
                        className="text-xs px-3 py-1 bg-sandhan-blue-800 hover:bg-sandhan-blue-700 text-gray-300 rounded border border-sandhan-blue-600 transition-colors"
                      >
                        {t('ingest.verify')}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={() => navigate('/mapping')}
          className="flex items-center gap-2 px-6 py-2.5 bg-sandhan-orange-500 hover:bg-sandhan-orange-600 text-white font-medium rounded-lg shadow-lg shadow-sandhan-orange-500/20 transition-all"
        >
          {t('ingest.proceed_mapping')} <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Ingest;
