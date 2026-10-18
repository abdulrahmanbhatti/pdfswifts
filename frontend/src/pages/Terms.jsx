import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';

export default function Terms() {
  useSEO(
    'Terms of Service — PDFSwift',
    'Terms of service for PDFSwift free online PDF suite. 100% free service terms, file deletion policy, and acceptable use guidelines.'
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
          <span className="text-slate-900 font-medium">Terms of Service</span>
        </nav>

        <div className="border-b border-slate-200 pb-6 mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Last Updated: October 2026 • 100% Free Tools
          </p>
        </div>

        {/* Terms Body */}
        <div className="prose prose-slate text-sm leading-relaxed space-y-6 text-slate-700">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">1. Agreement to Terms</h2>
            <p>
              By accessing or using PDFSwift (the "Service"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">2. Free Service Description</h2>
            <p>
              PDFSwift provides free web-based PDF utility tools including PDF merging, splitting, and compressing. The Service is provided free of charge to all users and is supported through digital display advertisements.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">3. Acceptable Use</h2>
            <p>
              You agree not to upload any documents that contain malicious software, exploit code, viruses, or illegal materials. You retain full ownership and copyright of all documents uploaded to PDFSwift. We do not claim any ownership over your files.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">4. Document Retention and Deletion</h2>
            <p>
              Uploaded and processed files are temporary and are automatically deleted after 60 minutes. PDFSwift is not a backup service, and we recommend that you always retain original copies of any files submitted.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">5. Disclaimer of Warranties</h2>
            <p>
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis. While we strive for high conversion quality and fidelity, PDFSwift makes no warranties that the service will be uninterrupted or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">6. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these terms at any time. Any changes will be posted on this page with an updated date.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
