import { Mic, MicOff, Globe } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useBhashini } from '../hooks/useBhashini';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'mr', label: 'मराठी' },
];

import toast from 'react-hot-toast';

const BhashiniBar = () => {
  const { language, setLanguage } = useAppStore();
  const { isRecording, startRecording, stopRecording } = useBhashini();

  const handleLangChange = (code: string) => {
    setLanguage(code as any);
    const selected = languages.find(l => l.code === code);
    toast.success(`🌐 Language switched to ${selected?.label || code.toUpperCase()}`);
  };

  return (
    <div className="flex items-center gap-3 bg-sandhan-blue-900/50 p-1.5 rounded-lg border border-sandhan-blue-700/50">
      <div className="flex items-center gap-2 px-2">
        <Globe size={16} className="text-sandhan-orange-500" />
        <select
          value={language}
          onChange={(e) => handleLangChange(e.target.value)}
          className="bg-transparent text-sm text-gray-200 outline-none cursor-pointer"
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code} className="bg-sandhan-blue-800 text-white">
              {lang.label}
            </option>
          ))}
        </select>
      </div>
      
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`p-1.5 rounded-full transition-all flex items-center gap-1 ${
          isRecording 
            ? 'bg-red-500/20 text-red-500 animate-pulse' 
            : 'hover:bg-sandhan-blue-700 text-gray-400 hover:text-white'
        }`}
        title="Voice Query (Speak in English or Hindi)"
      >
        {isRecording ? <Mic size={16} className="text-red-400" /> : <MicOff size={16} />}
      </button>
    </div>
  );
};

export default BhashiniBar;
