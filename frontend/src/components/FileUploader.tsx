import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileSpreadsheet, FileJson, Database } from 'lucide-react';

interface FileUploaderProps {
  onDrop: (acceptedFiles: File[], type: string) => void;
}

const zones = [
  { id: 'cdr', label: 'Call Data Records (CDR)', icon: <Database size={24} />, accept: { 'text/csv': ['.csv'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] } },
  { id: 'bank', label: 'Bank / UPI Statements', icon: <FileSpreadsheet size={24} />, accept: { 'text/csv': ['.csv'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] } },
  { id: 'ipdr', label: 'IPDR Logs', icon: <FileJson size={24} />, accept: { 'application/json': ['.json'], 'text/csv': ['.csv'] } },
  { id: 'device', label: 'Device Extractions', icon: <Database size={24} />, accept: { 'application/json': ['.json'], 'text/csv': ['.csv'] } }
];

const DropZone = ({ zone, onDrop }: { zone: typeof zones[0], onDrop: (files: File[], type: string) => void }) => {
  const onDropCallback = useCallback((acceptedFiles: File[]) => {
    onDrop(acceptedFiles, zone.id);
  }, [zone.id, onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropCallback,
    accept: zone.accept as any
  });

  return (
    <div 
      {...getRootProps()} 
      className={`p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
        isDragActive 
          ? 'border-sandhan-orange-500 bg-sandhan-orange-500/10' 
          : 'border-sandhan-blue-700 bg-sandhan-blue-800/30 hover:border-sandhan-blue-500 hover:bg-sandhan-blue-800/50'
      }`}
    >
      <input {...getInputProps()} />
      <div className={`mb-3 p-3 rounded-full ${isDragActive ? 'bg-sandhan-orange-500/20 text-sandhan-orange-400' : 'bg-sandhan-blue-900 text-sandhan-blue-400'}`}>
        {zone.icon}
      </div>
      <h3 className="font-semibold text-gray-200 mb-1">{zone.label}</h3>
      <p className="text-xs text-gray-500 text-center">
        Drag & drop files here, or click to select
      </p>
    </div>
  );
};

const FileUploader: React.FC<FileUploaderProps> = ({ onDrop }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {zones.map((zone) => (
        <DropZone key={zone.id} zone={zone} onDrop={onDrop} />
      ))}
    </div>
  );
};

export default FileUploader;
