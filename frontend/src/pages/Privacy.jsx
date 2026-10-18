import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, Lock, EyeOff } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function Privacy() {
  useSEO(
    'Privacy Policy — PDFSwift',
    'Learn how PDFSwift protects your privacy. Automated 1-hour document deletion, no account registration, and zero data sharing.'
  );

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4">
          <Link to="/" className="hover:text-indigo-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">Privacy Policy</span>
        </nav>

        <div className="border-b border-slate-200 pb-6 mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Last Updated: October 2026 • 100% Free & Private
          </p>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <Clock className="w-6 h-6 text-indigo-600 mb-2" />
            <h4 className="text-sm font-bold text-slate-900 mb-1">1-Hour Deletion</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              All files are automatically and permanently deleted 60 minutes after processing.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <Lock className="w-6 h-6 text-emerald-600 mb-2" />
            <h4 className="text-sm font-bold text-slate-900 mb-1">Zero Accounts</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              No logins, no passwords, no email collection, and no user profiles.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <EyeOff className="w-6 h-6 text-indigo-600 mb-2" />
            <h4 className="text-sm font-bold text-slate-900 mb-1">No Data Selling</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never inspect, analyze, store, or sell any contents of your documents.
            </p>
          </div>
        </div>

        {/* Policy Body */}
        <div className="prose prose-slate text-sm leading-relaxed space-y-6 text-slate-700">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">1. Overview</h2>
            <p>
              PDFSwift is designed from the ground up to respect user privacy. We believe that basic document utilities should be completely free, accessible to everyone, and completely private. We do not require registration, personal details, credit cards, or passwords.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">2. Automated 1-Hour Document Purge</h2>
            <p>
              When you upload files to PDFSwift to merge, split, or compress, your files are stored in an isolated, private server directory. Our automated server-side daemon runs continuously every 15 minutes and permanently deletes any uploaded file and any processed output file older than 1 hour (60 minutes).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">3. No Database & No User Tracking</h2>
            <p>
              PDFSwift operates without a user database. We do not maintain user accounts or persistent activity logs. Standard API rate limiting is enforced in-memory to prevent automated denial of service attacks without tracking individuals.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">4. Advertising & Google AdSense</h2>
            <p>
              To keep our tools 100% free for everyone forever without charging subscriptions, PDFSwift displays third-party advertisements via Google AdSense. Google AdSense and third-party vendors may use cookies to serve ads based on prior visits to this or other websites. You may opt out of personalized advertising by visiting Google Ads Settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">5. Contact</h2>
            <p>
              If you have any questions or feedback regarding this Privacy Policy, please contact us at support@pdfswift.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
