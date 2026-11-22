import React, { useState, useRef } from 'react';
import { UploadCloud, FileCheck, AlertCircle, X } from 'lucide-react';

const FileUpload = ({
  id,
  label,
  accept = '.pdf,.doc,.docx',
  maxSizeMB = 5,
  helperText = 'PDF, DOC, or DOCX (up to 5MB)',
  onFileSelect,
  existingFileName = '',
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds maximum allowed limit of ${maxSizeMB}MB.`);
      return;
    }

    setError('');
    setSelectedFile(file);
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    setError('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-xs font-bold text-slate-700">
          {label}
        </label>
      )}

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-emerald-500 bg-emerald-50/50'
            : 'border-slate-300 hover:border-slate-400 bg-white'
        }`}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        {selectedFile || existingFileName ? (
          <div className="flex items-center justify-between p-2 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-center gap-2 overflow-hidden text-left">
              <FileCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-semibold text-emerald-900 truncate">
                  {selectedFile ? selectedFile.name : existingFileName}
                </p>
                {selectedFile && (
                  <p className="text-[10px] text-emerald-600">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-emerald-100 rounded-md text-emerald-700"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="py-2 space-y-1">
            <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-medium text-slate-700">
              <span className="text-emerald-600 font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-[11px] text-slate-400">{helperText}</p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-[11px] text-red-600 flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
