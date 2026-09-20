import React, { useState } from 'react';
import { briefApi } from '../api/client';
import { useBhashini } from '../hooks/useBhashini';
import toast from 'react-hot-toast';
import { FileText, Download, Loader2, Share2 } from 'lucide-react';
import { useAppStore } from '../store/appStore';

const Brief = () => {
  const [briefHtml, setBriefHtml] = useState<string | null>(null);
  const [rawHtml, setRawHtml] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { translate } = useBhashini();
  const { language } = useAppStore();

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await briefApi.generate();
      setRawHtml(response.html);
      
      let finalHtml = response.html;
      if (language !== 'en') {
        toast.loading(`Translating brief to ${language.toUpperCase()}...`, { id: 'trans' });
        finalHtml = await translate(response.html, language);
        toast.success('Translation complete', { id: 'trans' });
      }
      setBriefHtml(finalHtml);
    } catch (err) {
      toast.error('Failed to generate brief');
    } finally {
      setIsGenerating(false);
    }
  };

  // Re-translate when language changes
  React.useEffect(() => {
    if (!rawHtml) return;
    const applyTranslation = async () => {
      if (language === 'en') {
        setBriefHtml(rawHtml);
      } else {
        toast.loading(`Translating brief to ${language.toUpperCase()}...`, { id: 'trans' });
        const translated = await translate(rawHtml, language);
        setBriefHtml(translated);
        toast.success(`Brief translated to ${language.toUpperCase()}`, { id: 'trans' });
      }
    };
    applyTranslation();
  }, [language, rawHtml, translate]);

  const handleDownload = () => {
    if (!briefHtml) return;
    const blob = new Blob([briefHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SANDHAN_Investigative_Brief_${new Date().getTime()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 animate-fade-in flex flex-col h-[calc(100vh-64px)]">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="text-sandhan-orange-500" /> Investigative Brief
          </h1>
          <p className="text-gray-400">Auto-generated chronological narrative of the investigation.</p>
        </div>
        <div className="flex gap-3">
          {!briefHtml ? (
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 px-6 py-2 bg-sandhan-orange-500 hover:bg-sandhan-orange-600 text-white font-medium rounded shadow-lg transition-all disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />}
              Generate Brief
            </button>
          ) : (
            <>
              <button className="flex items-center gap-2 px-4 py-2 bg-sandhan-blue-800 hover:bg-sandhan-blue-700 text-gray-200 border border-sandhan-blue-600 rounded transition-colors">
                <Share2 size={16} /> Share
              </button>
              <button 
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-2 bg-sandhan-green hover:bg-emerald-600 text-white font-medium rounded shadow-lg transition-all"
              >
                <Download size={18} /> Download HTML
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 glass rounded-xl border border-sandhan-blue-700 overflow-hidden relative">
        {isGenerating ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-sandhan-orange-400">
            <Loader2 className="animate-spin w-10 h-10 mb-4" />
            <p>Drafting narrative using LLM...</p>
          </div>
        ) : briefHtml ? (
          <iframe 
            srcDoc={briefHtml} 
            className="w-full h-full bg-white" 
            title="Investigative Brief"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
            <FileText size={48} className="mb-4 opacity-20" />
            <p>Click "Generate Brief" to compile findings.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Brief;
