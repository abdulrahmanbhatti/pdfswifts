import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Lock, Clock, ShieldCheck } from 'lucide-react';
import AdSenseSlot from './AdSenseSlot';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-auto border-t border-slate-800">
      {/* Anchor Ad Slot in Footer Area */}
      <div className="bg-slate-950 py-4 border-b border-slate-800/80 px-4">
        <AdSenseSlot slot="all-pages-anchor" className="my-1" />
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <FileText className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="font-extrabold text-lg text-white">
                PDF<span className="text-indigo-400">Swift</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Fast, private, and 100% free online PDF suite. Combine, extract, and compress your documents instantly in your browser with zero registration required.
            </p>
            <div className="flex items-center gap-4 pt-1 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                1-Hour Auto-Delete
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                No Account Needed
              </span>
            </div>
          </div>

          {/* PDF Tools */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">PDF Tools</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/merge-pdf" className="hover:text-white transition-colors">
                  Merge PDF
                </Link>
              </li>
              <li>
                <Link to="/split-pdf" className="hover:text-white transition-colors">
                  Split PDF
                </Link>
              </li>
              <li>
                <Link to="/compress-pdf" className="hover:text-white transition-colors">
                  Compress PDF
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Legal & Security</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PDFSwift. 100% Free Online PDF Tools. All rights reserved.</p>
          <p className="text-slate-500">Files are automatically purged from our servers within 60 minutes.</p>
        </div>
      </div>
    </footer>
  );
}
