import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Layers,
  UploadCloud,
  FileText,
  X,
  ArrowUp,
  ArrowDown,
  GripVertical,
  CheckCircle2,
  Download,
  RotateCcw,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import AdSenseSlot from '../components/AdSenseSlot';
import { useSEO } from '../hooks/useSEO';
import { mergePDFsClient } from '../services/clientPdfService';

export default function MergePdf() {
  useSEO(
    'Merge PDF Online Free — Combine PDF Files | PDFSwift',
    'Combine 2 to 10 PDF documents into one single file online for free. Drag and drop reordering, no signup, no limits, instant download.'
  );

  const [files, setFiles] = useState([]); // Array of { file, name, size, fileId }
  const [dragOver, setDragOver] = useState(false);
  const [step, setStep] = useState(1); // 1: Upload, 2: Options/Reorder, 3: Result
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const fileInputRef = useRef(null);
  const draggedItemRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const handleFilesSelected = (newFileList) => {
    setError(null);
    const validPdfs = [];

    for (let i = 0; i < newFileList.length; i++) {
      const file = newFileList[i];
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        if (file.size > 50 * 1024 * 1024) {
          setError(`File "${file.name}" exceeds 50MB maximum limit.`);
          return;
        }
        validPdfs.push({
          id: `${Date.now()}-${Math.random()}`,
          file,
          name: file.name,
          size: file.size,
        });
      } else {
        setError(`"${file.name}" is not a PDF. Only PDF files are supported.`);
        return;
      }
    }

    if (files.length + validPdfs.length > 10) {
      setError('You can merge up to 10 PDF files at a time.');
      return;
    }

    const updated = [...files, ...validPdfs];
    setFiles(updated);
    if (updated.length >= 2) {
      setStep(2);
    }
  };

  const removeFile = (index) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    if (updated.length < 2 && step === 2) {
      setStep(1);
    }
  };

  const moveFile = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= files.length) return;
    const updated = [...files];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setFiles(updated);
  };

  // Drag and drop sorting in list
  const onDragStart = (e, index) => {
    draggedItemRef.current = index;
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOverItem = (e, index) => {
    e.preventDefault();
    if (draggedItemRef.current === null || draggedItemRef.current === index) return;
    moveFile(draggedItemRef.current, index);
    draggedItemRef.current = index;
  };

  const onDragEnd = () => {
    draggedItemRef.current = null;
  };

  // Handle Dropzone Drag Events
  const handleDropzoneDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please add at least 2 PDF files to merge.');
      return;
    }

    setError(null);
    setIsProcessing(true);
    setProgress(30);

    try {
      setProgress(60);
      const mergeRes = await mergePDFsClient(files);
      setProgress(100);

      setTimeout(() => {
        setIsProcessing(false);
        setResult(mergeRes);
        setStep(3);
      }, 300);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      setProgress(0);
      setError(
        err.message || 'Failed to merge documents. Please check your files and try again.'
      );
    }
  };

  const resetTool = () => {
    setFiles([]);
    setStep(1);
    setIsProcessing(false);
    setProgress(0);
    setError(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Top Header & Breadcrumbs */}
      <div className="bg-slate-50 border-b border-slate-200/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-3">
            <Link to="/" className="hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">Merge PDF</span>
          </nav>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Merge PDF Online Free
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">
                Combine multiple PDF documents into one single file in the exact order you want.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* AdSense Leaderboard Above Tool */}
        <AdSenseSlot slot="tool-leaderboard" className="mb-6" />

        {/* Steps Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8 text-xs font-semibold select-none">
          <div
            className={`flex items-center gap-2 pb-1 border-b-2 transition-all ${
              step >= 1
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-400'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              1
            </span>
            <span>Upload</span>
          </div>

          <span className="text-slate-300">→</span>

          <div
            className={`flex items-center gap-2 pb-1 border-b-2 transition-all ${
              step >= 2
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-400'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              2
            </span>
            <span>Reorder & Options</span>
          </div>

          <span className="text-slate-300">→</span>

          <div
            className={`flex items-center gap-2 pb-1 border-b-2 transition-all ${
              step === 3
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-400'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 3 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              3
            </span>
            <span>Download</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-3 animate-fade-in text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
            <div className="flex-1">
              <span className="font-semibold">Error: </span>
              {error}
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-500 hover:text-rose-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 1 & 2: Upload Zone & Reorder List */}
        {step < 3 && (
          <div className="space-y-6">
            {/* Large Dashed Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDropzoneDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`min-h-[220px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all duration-200 ${
                dragOver
                  ? 'border-indigo-600 bg-indigo-50/60 scale-[1.01]'
                  : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFilesSelected(e.target.files);
                  }
                }}
              />
              <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 shadow-2xs">
                <UploadCloud className="w-7 h-7 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Drag & drop your PDF files here
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Upload 2 to 10 files. Maximum 50MB per file.
              </p>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 btn-lift shadow-xs"
              >
                or browse files
              </button>
            </div>

            {/* Selected Files List & Reorder */}
            {files.length > 0 && (
              <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs animate-fade-in">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Files to Merge ({files.length} of 10)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Drag files or use arrows to adjust page order before merging
                    </p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={files.length >= 10}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                  >
                    + Add More Files
                  </button>
                </div>

                <div className="space-y-2">
                  {files.map((item, index) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, index)}
                      onDragOver={(e) => onDragOverItem(e, index)}
                      onDragEnd={onDragEnd}
                      className="group flex items-center justify-between gap-3 p-3 bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/70 rounded-lg transition-colors cursor-move"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <GripVertical className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0" />
                        <span className="text-xs font-bold text-slate-400 w-4">
                          {index + 1}.
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatFileSize(item.size)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {/* Move Up/Down Controls for Mobile/Desktop */}
                        <button
                          type="button"
                          onClick={() => moveFile(index, index - 1)}
                          disabled={index === 0}
                          className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-30 transition"
                          title="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveFile(index, index + 1)}
                          disabled={index === files.length - 1}
                          className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-30 transition"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Remove file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Processing State or Action Button */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  {isProcessing ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                          Processing & Merging PDFs...
                        </span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleMerge}
                      disabled={files.length < 2}
                      className="w-full py-3.5 px-6 rounded-lg text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed btn-lift shadow-sm flex items-center justify-center gap-2"
                    >
                      <span>Merge {files.length} PDFs →</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Result Card */}
        {step === 3 && result && (
          <div className="bg-white border border-slate-200/90 rounded-xl p-8 text-center max-w-xl mx-auto shadow-sm animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-1">
              Your Merged PDF is Ready!
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              Successfully combined {files.length} documents ({formatFileSize(result.size)}).
            </p>

            <div className="space-y-3">
              <a
                href={result.downloadUrl}
                download={result.filename}
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-lg text-base font-bold bg-indigo-600 text-white hover:bg-indigo-700 btn-lift shadow-sm transition"
              >
                <Download className="w-5 h-5" />
                <span>Download Merged PDF</span>
              </a>

              <button
                type="button"
                onClick={resetTool}
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Process Another PDF</span>
              </button>
            </div>

            {/* AdSense Rectangle ad below result */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <AdSenseSlot slot="tool-rectangle" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
