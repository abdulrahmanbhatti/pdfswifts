import React, { useState, useRef } from 'react';
import { UploadCloud, FilePlus, AlertCircle, Shield } from 'lucide-react';

export default function DragDropZone({
  onFilesSelected,
  multiple = false,
  maxFiles = 10,
  maxSizeMB = 50,
  label = 'Select PDF file(s)',
  subLabel = 'or drop PDF files here',
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const validateAndHandleFiles = (fileList) => {
    setErrorMessage('');
    const files = Array.from(fileList);

    if (files.length === 0) return;

    if (!multiple && files.length > 1) {
      setErrorMessage('Please select only 1 PDF file for this tool.');
      return;
    }

    if (multiple && files.length > maxFiles) {
      setErrorMessage(`Maximum of ${maxFiles} files can be uploaded at once.`);
      return;
    }

    const validPdfs = [];
    for (const file of files) {
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      if (!isPdf) {
        setErrorMessage(`"${file.name}" is not a PDF file. Please upload PDF files only.`);
        return;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        setErrorMessage(`"${file.name}" is too large. Maximum file size allowed is ${maxSizeMB}MB.`);
        return;
      }

      validPdfs.push(file);
    }

    onFilesSelected(validPdfs);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndHandleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndHandleFiles(e.target.files);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 bg-white ${
          isDragging
            ? 'border-blue-600 bg-blue-50/70 scale-[1.01] shadow-xl shadow-blue-500/10'
            : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50/80 shadow-subtle hover:shadow-card'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Upload Icon circle */}
        <div
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-all duration-300 mb-5 ${
            isDragging
              ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-500/30'
              : 'bg-blue-50 text-blue-600 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white shadow-xs'
          }`}
        >
          <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2]" />
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-6 py-3.5 text-base font-bold text-white bg-blue-600 rounded-xl shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition active:scale-95"
        >
          <FilePlus className="w-5 h-5" />
          {label}
        </button>

        <p className="mt-3 text-sm font-medium text-slate-500">{subLabel}</p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-400">
          <span className="flex items-center gap-1.5 text-slate-500">
            <Shield className="w-3.5 h-3.5 text-emerald-500" /> Max {maxSizeMB}MB per file
          </span>
          <span>•</span>
          <span>PDF only</span>
          <span>•</span>
          <span>Auto-deleted after 1 hour</span>
        </div>
      </div>

      {/* Friendly Error Alert */}
      {errorMessage && (
        <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3 text-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Upload Notice</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
