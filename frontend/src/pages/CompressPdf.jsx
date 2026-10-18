import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Minimize2,
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  Download,
  RotateCcw,
  AlertCircle,
  Loader2,
  Zap,
  TrendingDown,
} from 'lucide-react';
import AdSenseSlot from '../components/AdSenseSlot';
import { useSEO } from '../hooks/useSEO';
import { compressPDFClient } from '../services/clientPdfService';

export default function CompressPdf() {
  useSEO(
    'Compress PDF Online Free — Reduce PDF File Size | PDFSwift',
    'Reduce PDF document file size online for free while maintaining crisp quality. 3 compression levels, instant download, 100% free with no limits.'
  );

  const [file, setFile] = useState(null); // { file, name, size, fileId }
  const [dragOver, setDragOver] = useState(false);
  const [step, setStep] = useState(1); // 1: Upload, 2: Quality Select, 3: Result
  const [quality, setQuality] = useState('medium'); // 'high' | 'medium' | 'low'
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const qualityOptions = [
    {
      id: 'high',
      title: 'High Compression',
      desc: 'Smallest file size with good overall quality',
      savings: '~50-70% reduction',
      badge: 'Maximum Space Saved',
    },
    {
      id: 'medium',
      title: 'Medium Compression',
      desc: 'Balanced compression with standard quality (Recommended)',
      savings: '~30-45% reduction',
      badge: 'Recommended',
    },
    {
      id: 'low',
      title: 'Low Compression',
      desc: 'Light compression with maximum high-fidelity quality',
      savings: '~15-25% reduction',
      badge: 'High Quality',
    },
  ];

  const handleFile = async (selectedFile) => {
    setError(null);
    if (!selectedFile) return;

    if (!selectedFile.type.includes('pdf') && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a valid PDF document.');
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setError('File exceeds 50MB maximum size limit.');
      return;
    }

    setFile({
      raw: selectedFile,
      name: selectedFile.name,
      size: selectedFile.size,
    });
    setStep(2);
  };

  const handleCompress = async () => {
    if (!file) return;

    setError(null);
    setIsProcessing(true);
    setProgress(30);

    try {
      setProgress(70);
      const res = await compressPDFClient(file.raw, quality);
      setProgress(100);

      setTimeout(() => {
        setIsProcessing(false);
        setResult(res);
        setStep(3);
      }, 300);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      setProgress(0);
      setError(err.message || 'Failed to compress PDF. Please try again.');
    }
  };

  const resetTool = () => {
    setFile(null);
    setStep(1);
    setQuality('medium');
    setIsProcessing(false);
    setProgress(0);
    setError(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-3">
            <Link to="/" className="hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">Compress PDF</span>
          </nav>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Minimize2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Compress PDF Online Free
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">
                Optimize and reduce PDF document size with custom quality levels.
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
            <span>Quality Level</span>
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

        {/* STEP 1: Upload Zone */}
        {step === 1 && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files?.[0]) {
                handleFile(e.dataTransfer.files[0]);
              }
            }}
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
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
            {isProcessing ? (
              <div className="space-y-3">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                <p className="text-sm font-semibold text-slate-800">
                  Uploading and inspecting document ({progress}%)...
                </p>
              </div>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 shadow-2xs">
                  <UploadCloud className="w-7 h-7 stroke-[2.2]" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Drag & drop your PDF file here
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Upload 1 PDF file. Maximum 50MB.
                </p>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 btn-lift shadow-xs"
                >
                  or browse files
                </button>
              </>
            )}
          </div>
        )}

        {/* STEP 2: Configure Quality */}
        {step === 2 && file && (
          <div className="space-y-6">
            {/* File Info Bar with Original Size */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-4 flex items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    Original File Size: <strong className="text-slate-800">{formatFileSize(file.size)}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={resetTool}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 shrink-0"
              >
                Change File
              </button>
            </div>

            {/* Quality Options Selection Grid */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Select Compression Level
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {qualityOptions.map((opt) => {
                  const isSelected = quality === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setQuality(opt.id)}
                      className={`relative rounded-xl border p-4 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-xs scale-[1.01]'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {opt.badge}
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 mb-1">
                        {opt.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        {opt.desc}
                      </p>
                      <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                        <TrendingDown className="w-3.5 h-3.5" />
                        {opt.savings}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Action Button / Progress */}
              <div className="pt-4 border-t border-slate-100">
                {isProcessing ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                        Compressing document...
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
                    onClick={handleCompress}
                    className="w-full py-3.5 px-6 rounded-lg text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 btn-lift shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>Compress PDF Now →</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Result Card with New Size & % Saved */}
        {step === 3 && result && (
          <div className="bg-white border border-slate-200/90 rounded-xl p-8 text-center max-w-xl mx-auto shadow-sm animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-1">
              Your PDF is Compressed!
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              File size has been reduced successfully.
            </p>

            {/* Before / After Metrics Card */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80 mb-6 text-center">
              <div>
                <span className="text-[11px] uppercase font-bold text-slate-400 block mb-0.5">
                  Original
                </span>
                <span className="text-sm font-bold text-slate-700">
                  {formatFileSize(result.originalSize)}
                </span>
              </div>
              <div className="border-x border-slate-200">
                <span className="text-[11px] uppercase font-bold text-slate-400 block mb-0.5">
                  Compressed
                </span>
                <span className="text-sm font-bold text-indigo-600">
                  {formatFileSize(result.newSize)}
                </span>
              </div>
              <div>
                <span className="text-[11px] uppercase font-bold text-slate-400 block mb-0.5">
                  Savings
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600">
                  <TrendingDown className="w-3.5 h-3.5" />
                  -{result.percentSaved}%
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href={result.downloadUrl}
                download={result.filename}
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-lg text-base font-bold bg-indigo-600 text-white hover:bg-indigo-700 btn-lift shadow-sm transition"
              >
                <Download className="w-5 h-5" />
                <span>Download Compressed PDF</span>
              </a>

              <button
                type="button"
                onClick={resetTool}
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Compress Another PDF</span>
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
