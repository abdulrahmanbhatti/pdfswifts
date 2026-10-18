import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Scissors,
  Minimize2,
  Lock,
  Clock,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  UploadCloud,
  Cpu,
  Download,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import AdSenseSlot from '../components/AdSenseSlot';
import { useSEO } from '../hooks/useSEO';

export default function Home() {
  useSEO(
    'Free PDF Tools for Everyone — PDFSwift',
    'Merge, split, and compress PDF documents 100% free online with PDFSwift. No signup, no daily limits, files auto-deleted after 1 hour.'
  );

  const [activeFaq, setActiveFaq] = useState(null);

  const tools = [
    {
      title: 'Merge PDF',
      desc: 'Combine 2 to 10 PDF files in any custom order into a single unified document.',
      path: '/merge-pdf',
      icon: Layers,
      badge: 'Most Popular',
    },
    {
      title: 'Split PDF',
      desc: 'Extract individual pages or custom ranges (e.g., 1-3, 5, 8-10) with one click.',
      path: '/split-pdf',
      icon: Scissors,
      badge: 'Fast & Easy',
    },
    {
      title: 'Compress PDF',
      desc: 'Reduce PDF file size up to 80% while preserving crisp text and image clarity.',
      path: '/compress-pdf',
      icon: Minimize2,
      badge: 'High Savings',
    },
  ];

  const faqs = [
    {
      q: 'Is PDFSwift really 100% free with no limits?',
      a: 'Yes, absolutely. There are no subscriptions, no credit cards, no account registrations, and no daily file processing limits. PDFSwift is fully supported by non-intrusive display advertisements.',
    },
    {
      q: 'What happens to my uploaded documents?',
      a: 'Your security and privacy are paramount. Every uploaded and processed PDF file is permanently purged from our servers after 1 hour via an automated cleanup daemon. Nobody has access to your files.',
    },
    {
      q: 'What is the maximum file size supported?',
      a: 'You can upload documents up to 50MB per file. For the Merge tool, you can combine up to 10 PDF documents simultaneously.',
    },
    {
      q: 'Does PDFSwift work on smartphones and tablets?',
      a: 'Yes! PDFSwift is built to be completely responsive across all mobile browsers (iOS Safari, Android Chrome, and tablets) with touch-friendly controls.',
    },
    {
      q: 'How does the PDF compression work?',
      a: 'Our compression engine removes redundant metadata, optimizes font streams, and compresses internal object streams while maintaining high visual fidelity.',
    },
    {
      q: 'Do I need to install any software or extensions?',
      a: 'No software or browser extensions are required. Everything processes securely through your web browser on our fast cloud servers.',
    },
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 mb-6 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>100% Free — No Signup</span>
        </div>

        {/* H1 */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Free PDF Tools for Everyone
        </h1>

        {/* Subtext */}
        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Merge, split, and compress your PDF documents in seconds. No registration, no restrictions, and zero software installation required.
        </p>

        {/* AdSense Leaderboard below Hero */}
        <AdSenseSlot slot="homepage-leaderboard" className="mt-8 mb-6" />
      </section>

      {/* Tool Cards Grid (Directly below hero - tools are the CTA) */}
      <section id="tools" className="pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.path}
                to={tool.path}
                className="group relative bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200 shadow-xs">
                      <Icon className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50/80 px-2.5 py-1 rounded-md">
                      {tool.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">
                  <span>Open Tool</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* AdSense In-Feed Ad slot between tool cards section */}
        <div className="mt-8">
          <AdSenseSlot slot="homepage-infeed" />
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex items-start gap-4 p-6 bg-white border border-slate-200/80 rounded-xl shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Your files are auto-deleted after 1 hour
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We value your confidentiality. An automated background task permanently deletes all uploaded and generated files after 60 minutes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white border border-slate-200/80 rounded-xl shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  No signup or card needed
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Start using any PDF tool immediately without logging in or entering credentials. No paywalls, trial expirations, or watermark traps.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-indigo-600 mb-2 block">
            Simple Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            How PDFSwift Works
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Process documents in three lightning-fast steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center p-6 bg-slate-50/70 rounded-xl border border-slate-200/80">
            <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center mb-4 shadow-sm">
              1
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <UploadCloud className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Upload Files</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Drag & drop your PDF documents or browse from your device (up to 50MB per file).
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center p-6 bg-slate-50/70 rounded-xl border border-slate-200/80">
            <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center mb-4 shadow-sm">
              2
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Configure & Process</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Reorder pages, set extract ranges, or choose your target compression level in seconds.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center p-6 bg-slate-50/70 rounded-xl border border-slate-200/80">
            <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center mb-4 shadow-sm">
              3
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Instant Download</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Download your optimized PDF immediately. Files are deleted automatically in 1 hour.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-600 mb-2 block">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200/90 rounded-xl overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 text-slate-900 hover:text-indigo-600 font-semibold text-sm sm:text-base transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-indigo-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
