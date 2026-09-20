import React, { useState } from 'react';
import { ColumnMapping } from '../types';
import { analysisApi } from '../api/client';
import toast from 'react-hot-toast';

interface SchemaMapperProps {
  fileId: string;
  fileName: string;
  columns: string[];
  onMappingComplete: (mappings: ColumnMapping[]) => void;
}

const canonicalFields = [
  'source_phone', 'dest_phone', 'timestamp', 'imei', 'upi_id', 
  'ip_address', 'amount', 'account_no', 'transaction_id', 'skip'
];

const SchemaMapper: React.FC<SchemaMapperProps> = ({ fileId, fileName, columns, onMappingComplete }) => {
  const [mappings, setMappings] = useState<ColumnMapping[]>(
    columns.map(c => ({ original: c, mappedTo: 'skip' }))
  );
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleSuggest = async () => {
    setIsSuggesting(true);
    try {
      const suggested = await analysisApi.suggestMappings(fileId, columns);
      setMappings(suggested);
      toast.success('Auto-mapping complete');
    } catch (err) {
      toast.error('Failed to auto-suggest mappings');
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleConfirm = () => {
    onMappingComplete(mappings);
  };

  const updateMapping = (original: string, mappedTo: string) => {
    setMappings(prev => prev.map(m => m.original === original ? { ...m, mappedTo } : m));
  };

  return (
    <div className="bg-sandhan-blue-800 rounded-lg overflow-hidden border border-sandhan-blue-700">
      <div className="flex justify-between items-center p-4 border-b border-sandhan-blue-700 bg-sandhan-blue-900/50">
        <h3 className="font-semibold text-gray-200">{fileName}</h3>
        <div className="space-x-3">
          <button 
            onClick={handleSuggest} 
            disabled={isSuggesting}
            className="px-3 py-1.5 text-sm bg-sandhan-blue-700 hover:bg-sandhan-blue-600 text-white rounded transition-colors disabled:opacity-50"
          >
            {isSuggesting ? 'Analyzing...' : 'Auto-Suggest'}
          </button>
          <button 
            onClick={handleConfirm}
            className="px-3 py-1.5 text-sm bg-sandhan-orange-500 hover:bg-sandhan-orange-600 text-white rounded transition-colors"
          >
            Confirm Mapping
          </button>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-sandhan-blue-900 text-gray-400 text-xs uppercase tracking-wider">
              <th className="p-3 font-medium">Original Column</th>
              <th className="p-3 font-medium">Mapped Entity Type</th>
            </tr>
          </thead>
          <tbody>
            {mappings.map((mapping, idx) => (
              <tr key={idx} className="border-b border-sandhan-blue-700/50 hover:bg-sandhan-blue-700/20">
                <td className="p-3 text-sm text-gray-300 font-mono">{mapping.original}</td>
                <td className="p-3">
                  <select 
                    value={mapping.mappedTo}
                    onChange={(e) => updateMapping(mapping.original, e.target.value)}
                    className="w-full bg-sandhan-blue-900 border border-sandhan-blue-600 rounded p-1.5 text-sm text-gray-200 outline-none focus:border-sandhan-orange-500"
                  >
                    {canonicalFields.map(field => (
                      <option key={field} value={field}>{field}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SchemaMapper;
