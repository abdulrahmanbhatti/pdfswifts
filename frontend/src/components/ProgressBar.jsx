import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProgressBar({
  progress = 0,
  message = 'Processing your PDF...',
  submessage = 'Please do not close this window',
}) {
  const [displayProgress, setDisplayProgress] = useState(progress);

  useEffect(() => {
    if (progress > displayProgress) {
      const timer = setTimeout(() => {
        setDisplayProgress(progress);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [progress, displayProgress]);

  return (
    <div className="w-full max-w-lg mx-auto p-8 bg-white rounded-3xl border border-slate-200/80 shadow-card text-center space-y-5 animate-fadeIn">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center animate-spin">
        <Loader2 className="w-8 h-8 stroke-[2.5]" />
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-900">{message}</h3>
        <p className="text-sm text-slate-500 mt-1">{submessage}</p>
      </div>

      <div className="space-y-2">
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, Math.max(5, displayProgress))}%` }}
          />
        </div>
        <div className="flex justify-between text-xs font-semibold text-slate-400 px-1">
          <span>In progress</span>
          <span className="text-blue-600 font-bold">{Math.round(displayProgress)}%</span>
        </div>
      </div>
    </div>
  );
}
