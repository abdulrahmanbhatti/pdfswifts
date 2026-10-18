import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Scissors,
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  Download,
  RotateCcw,
  AlertCircle,
  Loader2,
  Check,
} from 'lucide-react';
import AdSenseSlot from '../components/AdSenseSlot';
import { useSEO } from '../hooks/useSEO';
import { API_BASE, BACKEND_URL } from '../api/config';

export default function SplitPdf() {
  useSEO(
    'Split PDF Online Free — Extract Pages from PDF | PDFSwift',
    'Extract specific pages or page ranges from any PDF document for free. Fast, secure, no signup required, files deleted after 1 hour.'
  );

  const [file, setFile] = useState(null); // { file, name, size, pageCount, fileId }
  const [dragOver, setDragOver] = useState(false);
  const [step, setStep] = useState(1); // 1: Upload, 2: Range Selection, 3: Result
  const [pageRange, setPageRange] = useState('');
  const [selectedPages, setSelectedPages] = useState([]); // Array of 1-based page numbers
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

    setIsProcessing(true);
    setProgress(30);

    try {
      const formData = new FormData();
      formData.append('files', selectedFile);

      setProgress(60);
      const res = await axios.post(`${API_BASE}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploaded = res.data.files[0];
      setFile({
        raw: selectedFile,
        name: uploaded.originalName,
        size: uploaded.size,
        pageCount: uploaded.pageCount || 1,
        fileId: uploaded.fileId,
      });

      // Default range to all pages or first page
      setPageRange(`1-${uploaded.pageCount || 1}`);
      const initialPages = Array.from({ length: uploaded.pageCount || 1 }, (_, i) => i + 1);
      setSelectedPages(initialPages);

      setProgress(100);
      setTimeout(() => {
        setIsProcessing(false);
        setStep(2);
      }, 200);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      setError(err.response?.data?.error || 'Failed to upload and analyze PDF file.');
    }
  };

  // Sync visual selection with text range
  const togglePageSelection = (pageNum) => {
    let updated;
    if (selectedPages.includes(pageNum)) {
      updated = selectedPages.filter((p) => p !== pageNum);
    } else {
      updated = [...selectedPages, pageNum].sort((a, b) => a - b);
    }
    setSelectedPages(updated);
    // Convert array to concise range string (e.g. [1,2,3,5] -> "1-3, 5")
    setPageRange(pagesToRangeString(updated));
  };

  const pagesToRangeString = (pages) => {
    if (!pages || pages.length === 0) return '';
    const sorted = [...pages].sort((a, b) => a - b);
    const ranges = [];
    let start = sorted[0];
    let end = start;

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === end + 1) {
        end = sorted[i];
      } else {
        ranges.push(start === end ? `${start}` : `${start}-${end}`);
        start = sorted[i];
        end = start;
      }
    }
    ranges.push(start === end ? `${start}` : `${start}-${end}`);
    return ranges.join(', ');
  };

  const handleTextRangeChange = (val) => {
    setPageRange(val);
    // Attempt parse to update visual selection
    if (!file) return;
    try {
      const parts = val.split(',').map((p) => p.trim()).filter(Boolean);
      const set = new Set();
      for (const part of parts) {
        if (part.includes('-')) {
          const [s, e] = part.split('-').map((n) => parseInt(n.trim(), 10));
          if (!isNaN(s) && !isNaN(e)) {
            const min = Math.max(1, Math.min(s, e));
            const max = Math.min(file.pageCount, Math.max(s, e));
            for (let i = min; i <= max; i++) set.add(i);
          }
        } else {
          const num = parseInt(part, 10);
          if (!isNaN(num) && num >= 1 && num <= file.pageCount) {
            set.add(num);
          }
        }
      }
      setSelectedPages(Array.from(set).sort((a, b) => a - b));
    } catch (e) {}
  };

  const selectAllPages = () => {
    if (!file) return;
    const all = Array.from({ length: file.pageCount }, (_, i) => i + 1);
    setSelectedPages(all);
    setPageRange(`1-${file.pageCount}`);
  };

  const clearPages = () => {
    setSelectedPages([]);
    setPageRange('');
  };

  const handleSplit = async () => {
    if (!file) return;
    if (!pageRange.trim()) {
      setError('Please select at least one page or enter a page range.');
      return;
    }

    setError(null);
    setIsProcessing(true);
    setProgress(20);

    try {
      setProgress(50);
      const res = await axios.post(`${API_BASE}/split`, {
        fileId: file.fileId,
        pages: pageRange.trim(),
      });

      setProgress(100);
      setTimeout(() => {
        setIsProcessing(false);
        setResult(res.data);
        setStep(3);
      }, 300);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      setProgress(0);
      setError(err.response?.data?.error || 'Failed to split PDF. Please check your page ranges.');
    }
  };

  const resetTool = () => {
    setFile(null);
    setStep(1);
    setPageRange('');
    setSelectedPages([]);
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
            <span className="text-slate-900 font-medium">Split PDF</span>
          </nav>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Scissors className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Split PDF Pages Online Free
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">
                Extract single pages, multiple sections, or custom ranges into a fresh PDF file.
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
            <span>Select Pages</span>
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
                  Reading document structure ({progress}%)...
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

        {/* STEP 2: Configure Page Ranges & Visual Grid */}
        {step === 2 && file && (
          <div className="space-y-6">
            {/* File Info Bar */}
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
                    Total: <strong className="text-slate-800">{file.pageCount} pages</strong> • {formatFileSize(file.size)}
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

            {/* Range Configuration Card */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Enter Page Ranges to Extract
                </label>
                <input
                  type="text"
                  value={pageRange}
                  onChange={(e) => handleTextRangeChange(e.target.value)}
                  placeholder="e.g. 1-3, 5, 8-10"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Example: <strong>1-3, 5, 8-10</strong> or click the page tiles below to toggle pages.
                </p>
              </div>

              {/* Quick Select Buttons */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-medium text-slate-600">
                  Selected: <strong>{selectedPages.length}</strong> of {file.pageCount} pages
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={selectAllPages}
                    className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={clearPages}
                    className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Interactive Page Tiles Grid */}
              <div className="max-h-60 overflow-y-auto pr-1">
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5">
                  {Array.from({ length: file.pageCount }, (_, i) => i + 1).map((pageNum) => {
                    const isSelected = selectedPages.includes(pageNum);
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => togglePageSelection(pageNum)}
                        className={`relative aspect-[3/4] rounded-lg border flex flex-col items-center justify-center transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 shadow-2xs scale-[1.02]'
                            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                        <FileText className={`w-5 h-5 mb-1 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold">
                          {pageNum}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Button / Progress */}
              <div className="pt-4 border-t border-slate-100">
                {isProcessing ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                        Extracting selected pages...
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
                    onClick={handleSplit}
                    disabled={selectedPages.length === 0}
                    className="w-full py-3.5 px-6 rounded-lg text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed btn-lift shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>Split & Extract {selectedPages.length} Pages →</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Result Card */}
        {step === 3 && result && (
          <div className="bg-white border border-slate-200/90 rounded-xl p-8 text-center max-w-xl mx-auto shadow-sm animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-1">
              Your Split PDF is Ready!
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              Extracted {result.extractedPagesCount} pages ({formatFileSize(result.size)}) from original {result.totalPages} pages.
            </p>

            <div className="space-y-3">
              <a
                href={`${BACKEND_URL}${result.downloadUrl}`}
                download={result.filename}
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-lg text-base font-bold bg-indigo-600 text-white hover:bg-indigo-700 btn-lift shadow-sm transition"
              >
                <Download className="w-5 h-5" />
                <span>Download Split PDF</span>
              </a>

              <button
                type="button"
                onClick={resetTool}
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Split Another PDF</span>
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
