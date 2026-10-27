import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Smartphone,
  Globe,
  BookOpen,
  Download,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Coins,
  FileCheck2,
  Lock,
  ArrowRight,
  Layers,
  Scale,
  CheckCircle2,
} from 'lucide-react';
import { animatePageEntrance } from '../animations/gsapConfig';
import toast from 'react-hot-toast';

export default function LandingPage() {
  const pageRef = useRef(null);

  useEffect(() => {
    animatePageEntrance(pageRef);
  }, []);

  const handleDownload = () => {
    toast.success('Zero Drop Regulatory Architecture Package (.zip) downloaded');
  };

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#0C1318] text-white flex flex-col font-sans selection:bg-emerald-500 selection:text-black overflow-x-hidden"
    >
      {/* Background Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-emerald-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-48 left-1/4 w-[350px] h-[350px] bg-teal-500/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Top Navbar matching Image 1 */}
      <header className="relative z-50 max-w-7xl w-full mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5 leading-none">
              <span>Zero</span>
              <span className="text-emerald-400">Drop</span>
            </div>
            <div className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold leading-none mt-1">
              AICTE FDR & Security Deposit Platform
            </div>
          </div>
        </Link>

        {/* Action Buttons in Header matching Image 1 */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Documentation Button */}
          <Link
            to="/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 transition-all flex items-center gap-1.5"
          >
            <BookOpen size={14} className="text-slate-400" />
            <span className="hidden sm:inline">Documentation</span>
          </Link>

          {/* View WebView Prototype */}
          <Link
            to="/overview"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 transition-all flex items-center gap-1.5"
          >
            <Globe size={14} className="text-emerald-400" />
            <span className="hidden md:inline">View WebView Prototype</span>
            <span className="md:hidden">Web View</span>
          </Link>

          {/* View Mobile App Prototype */}
          <Link
            to="/mobile"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 transition-all flex items-center gap-1.5"
          >
            <Smartphone size={14} className="text-emerald-400" />
            <span className="hidden md:inline">View Mobile App Prototype</span>
            <span className="md:hidden">Mobile</span>
          </Link>

          {/* Download APK / Package Button */}
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Download APK</span>
          </button>
        </div>
      </header>

      {/* Hero Section matching Image 1 */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-10 pb-16">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-emerald-500/30 text-xs font-semibold text-emerald-400 shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI-Powered Security Deposit & FDR Management Platform</span>
          </div>

          {/* Huge Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Streamline Security Deposits with <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
              ZeroDrop AI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300/90 leading-relaxed font-normal">
            Real-time FDR lifecycle monitoring, automated dual-pass OCR document verification, and proactive
            maturity tracking. Get advance alerts 30–90 days before maturity occurs.
          </p>

          {/* 3 Call to Action Buttons matching Image 1 */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
            {/* View Mobile App Prototype (Glowing Primary Button) */}
            <Link
              to="/mobile"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm flex items-center gap-2 transition-all shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:scale-[1.02]"
            >
              <Smartphone size={17} />
              <span>View Mobile App Prototype</span>
            </Link>

            {/* View WebView Prototype */}
            <Link
              to="/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700/80 hover:border-slate-600 transition-all flex items-center gap-2"
            >
              <Globe size={17} className="text-emerald-400" />
              <span>View WebView Prototype</span>
            </Link>

            {/* Documentation (in new tab) */}
            <Link
              to="/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700/80 hover:border-slate-600 transition-all flex items-center gap-2"
            >
              <BookOpen size={17} className="text-slate-400" />
              <span>Documentation</span>
              <ExternalLink size={13} className="text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Hero Graphic: Dual Device Showcase Preview */}
        <div className="w-full max-w-5xl mx-auto mt-12 relative">
          <div className="relative rounded-3xl p-1 bg-gradient-to-b from-slate-700/50 via-slate-800/30 to-transparent shadow-2xl">
            <div className="rounded-[22px] bg-slate-950/80 backdrop-blur-xl border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Left text */}
              <div className="text-left space-y-2 max-w-md">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
                  Enterprise Financial Operations
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Live Regulatory Dashboard & Mobile Bezel Sandbox
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Both responsive web and mobile app interfaces are fully running live. Click any prototype button above
                  to open the respective experience in a dedicated new tab.
                </p>
                <div className="pt-2 flex items-center gap-3 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span>SIH Problem ID: SIH26265</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span>Pure White & Emerald Design</span>
                  </div>
                </div>
              </div>

              {/* Right Mockup Previews */}
              <div className="flex items-center gap-4 shrink-0">
                {/* Desktop Mockup Preview Card */}
                <Link
                  to="/overview"
                  target="_blank"
                  className="group relative w-48 sm:w-56 p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all text-left shadow-lg"
                >
                  <div className="h-28 rounded-xl bg-slate-800/80 border border-slate-700/60 p-2 flex flex-col justify-between overflow-hidden">
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-[8px] text-slate-400 ml-1 font-mono">Overview Dashboard</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 my-auto">
                      <div className="h-6 rounded bg-slate-700/60" />
                      <div className="h-6 rounded bg-emerald-950/60 border border-emerald-500/30" />
                    </div>
                    <div className="h-4 rounded bg-slate-700/40" />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs font-semibold text-slate-200 group-hover:text-emerald-400">
                    <span>Web Portal</span>
                    <ExternalLink size={12} />
                  </div>
                </Link>

                {/* Mobile Mockup Preview Card */}
                <Link
                  to="/mobile"
                  target="_blank"
                  className="group relative w-32 sm:w-36 p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all text-left shadow-lg"
                >
                  <div className="h-28 rounded-xl bg-slate-800/80 border border-slate-700/60 p-1.5 flex flex-col items-center justify-between overflow-hidden">
                    <div className="w-6 h-1 rounded-full bg-slate-700" />
                    <div className="w-full space-y-1">
                      <div className="h-4 rounded bg-emerald-500/20 border border-emerald-500/40" />
                      <div className="h-3 rounded bg-slate-700/60" />
                      <div className="h-3 rounded bg-slate-700/40" />
                    </div>
                    <div className="w-8 h-0.5 rounded-full bg-slate-600" />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs font-semibold text-slate-200 group-hover:text-emerald-400">
                    <span>Mobile App</span>
                    <ExternalLink size={12} />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="relative z-10 py-16 px-4 sm:px-6 border-t border-slate-800 bg-slate-950/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Core Technical Features
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Solving Problem Statement SIH26265
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Sparkles size={20} />
              </div>
              <h3 className="text-base font-bold text-white">Automated OCR Verification</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Simulated dual-pass optical character recognition extracts FDR reference, bank name, principal deposit,
                and maturity date, cross-checking submitted values to detect discrepancy risks automatically.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <RefreshCw size={20} />
              </div>
              <h3 className="text-base font-bold text-white">Proactive 60/30/7-Day Radar</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Prevents lapsed AICTE joint liens by automatically triaging fixed deposits into healthy, upcoming,
                urgent, and overdue categories with automated multi-channel reminder dispatch.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
                <Scale size={20} />
              </div>
              <h3 className="text-base font-bold text-white">Cryptographic Lineage Tracking</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Maintains an unbroken audit chain connecting original deposit receipts to replacement FDRs, ensuring
                continuous regulatory compliance without manual spreadsheet cross-referencing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black/80 border-t border-slate-900 py-8 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-bold text-white">Zero Drop</span>
            <span>•</span>
            <span>Smart India Hackathon 2026</span>
            <span>•</span>
            <span className="text-emerald-400 font-mono">SIH26265</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/overview" target="_blank" className="hover:text-white transition-colors">
              Web Portal
            </Link>
            <Link to="/mobile" target="_blank" className="hover:text-white transition-colors">
              Mobile App Prototype
            </Link>
            <Link to="/docs" target="_blank" className="hover:text-white transition-colors">
              Documentation
            </Link>
            <a
              href="https://github.com/shampatil23/ZeroDrop_SIH26265"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 font-semibold"
            >
              GitHub <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
