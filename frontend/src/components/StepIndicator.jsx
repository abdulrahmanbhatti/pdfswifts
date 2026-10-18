import React from 'react';
import { Check, UploadCloud, Sliders, Download } from 'lucide-react';

export default function StepIndicator({ currentStep = 1, step2Label = 'Configure Options' }) {
  const steps = [
    { num: 1, label: 'Upload Files', icon: UploadCloud },
    { num: 2, label: step2Label, icon: Sliders },
    { num: 3, label: 'Download PDF', icon: Download },
  ];

  return (
    <div className="w-full max-w-xl mx-auto mb-8 px-4">
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-slate-200 z-0">
          <div
            className="h-full bg-blue-600 transition-all duration-300 ease-out"
            style={{
              width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
            }}
          />
        </div>

        {/* Steps */}
        {steps.map((s) => {
          const isDone = currentStep > s.num;
          const isCurrent = currentStep === s.num;
          const Icon = s.icon;

          return (
            <div key={s.num} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm ${
                  isDone
                    ? 'bg-blue-600 text-white shadow-blue-500/20'
                    : isCurrent
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-blue-500/30'
                    : 'bg-white text-slate-400 border-2 border-slate-200'
                }`}
              >
                {isDone ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Icon className="w-4 h-4" />}
              </div>
              <span
                className={`mt-2 text-xs font-semibold tracking-wide whitespace-nowrap transition ${
                  isCurrent ? 'text-blue-600 font-bold' : isDone ? 'text-slate-800' : 'text-slate-400'
                }`}
              >
                {s.num}. {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
