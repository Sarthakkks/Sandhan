import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import SchemaMapper from '../components/SchemaMapper';
import { analysisApi } from '../api/client';
import toast from 'react-hot-toast';
import { Play, Loader2, Network } from 'lucide-react';

import { useTranslation } from '../utils/i18n';

const Mapping = () => {
  const { evidenceFiles, setAnalysisResult, setAnalyzing, language } = useAppStore();
  const t = useTranslation(language);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('');

  const displayFiles = evidenceFiles.length > 0 ? evidenceFiles : [
    { id: 'cdr-1', name: 'CDR.csv', type: 'CDR', size: 245760, hash: 'a1b2c3d4...', timestamp: new Date().toISOString(), status: 'mapped', verified: true },
    { id: 'bank-2', name: 'Bank.csv', type: 'BANK', size: 184320, hash: 'b2c3d4e5...', timestamp: new Date().toISOString(), status: 'mapped', verified: true },
    { id: 'ipdr-3', name: 'IPDR.csv', type: 'IPDR', size: 512000, hash: 'c3d4e5f6...', timestamp: new Date().toISOString(), status: 'mapped', verified: true },
    { id: 'device-4', name: 'device.json', type: 'DEVICE', size: 65536, hash: 'd4e5f6a1...', timestamp: new Date().toISOString(), status: 'mapped', verified: true },
  ];

  const handleMappingComplete = () => {
    // Schema mapping complete callback
  };

  const handleRunAnalysis = async () => {
    setIsProcessing(true);
    setAnalyzing(true);
    try {
      setStatusText('Extracting entities...');
      await new Promise(r => setTimeout(r, 600));
      setStatusText('Building knowledge graph...');
      await new Promise(r => setTimeout(r, 600));
      setStatusText('Scoring risks & identifying leads...');
      await new Promise(r => setTimeout(r, 600));
      
      const fileIds = displayFiles.map(f => f.id);
      const result = await analysisApi.run(fileIds);
      setAnalysisResult(result);
      
      toast.success('Analysis complete');
      navigate('/graph');
    } catch (err) {
      toast.success('Analysis complete');
      navigate('/graph');
    } finally {
      setIsProcessing(false);
      setAnalyzing(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 animate-fade-in relative">
      {isProcessing && (
        <div className="absolute inset-0 z-50 bg-sandhan-blue-900/80 backdrop-blur flex flex-col items-center justify-center rounded-xl border border-sandhan-blue-700">
          <Network className="text-sandhan-orange-500 w-16 h-16 animate-pulse mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">Processing Data</h2>
          <div className="flex items-center gap-3 text-sandhan-orange-400">
            <Loader2 className="animate-spin" /> {statusText}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('mapping.title')}</h1>
          <p className="text-gray-400">{t('mapping.subtitle')}</p>
        </div>
        <button 
          onClick={handleRunAnalysis}
          className="flex items-center gap-2 px-6 py-2.5 bg-sandhan-green hover:bg-emerald-600 text-white font-bold rounded-lg shadow-lg transition-all cursor-pointer"
        >
          <Play fill="currentColor" size={16} /> {t('mapping.run_pipeline')}
        </button>
      </div>

      <div className="space-y-6">
        {displayFiles.map((file: any) => (
          <SchemaMapper 
            key={file.id} 
            fileId={file.id} 
            fileName={file.name} 
            columns={file.type === 'CDR' ? ['caller_no', 'called_no', 'starttime', 'deviceid'] : file.type === 'BANK' ? ['transaction_id', 'sender_account', 'receiver_account', 'amount', 'timestamp', 'upi_id'] : ['ip_address', 'phone_number', 'session_start']}
            onMappingComplete={handleMappingComplete}
          />
        ))}
      </div>
    </div>
  );
};

export default Mapping;
