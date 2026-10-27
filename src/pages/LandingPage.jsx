import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowRight,
  Smartphone,
  Monitor,
  BookOpen,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  RefreshCw,
  Coins,
  FileCheck2,
  ExternalLink,
  ChevronRight,
  Building2,
  Scale,
} from 'lucide-react';
import VirtualDeviceSimulator from '../components/landing/VirtualDeviceSimulator';
import DocumentationSection from '../components/landing/DocumentationSection';
import { animatePageEntrance } from '../animations/gsapConfig';

export default function LandingPage() {
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const [viewMode, setViewMode] = useState('web'); // 'web' | 'mobile'

  useEffect(() => {
    animatePageEntrance(pageRef);
  }, []);

  const scrollToDocs = () => {
    document.getElementById('documentation')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSimulator = () => {
    setViewMode('mobile');
    setTimeout(() => {
      document.getElementById('device-simulator')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-bg-secondary text-text-main flex flex-col font-sans">
      {/* Top Public Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-primary rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-sm text-text-main leading-tight">Zero Drop</div>
              <div className="text-[10px] text-text-secondary leading-tight">AICTE Security Deposit & FDR Portal</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-text-secondary">
            <a href="#features" className="hover:text-emerald-primary transition-colors">Features</a>
            <a href="#simulator" onClick={scrollToSimulator} className="hover:text-emerald-primary transition-colors">
              Mobile Simulator
            </a>
            <button onClick={scrollToDocs} className="hover:text-emerald-primary transition-colors cursor-pointer">
              Documentation
            </button>
            <span className="text-border">|</span>
            <span className="text-emerald-primary bg-emerald-pale px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-emerald-primary/20">
              SIH 2026 • SIH26265
            </span>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setViewMode('mobile');
                scrollToSimulator();
              }}
              className="btn-secondary text-xs hidden sm:inline-flex"
            >
              <Smartphone size={14} />
              <span>Mobile View</span>
            </button>

            <button
              onClick={() => navigate('/overview')}
              className="btn-primary text-xs"
            >
              <span>Access Web App</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-border shadow-xs text-xs font-medium text-text-secondary">
            <span className="w-2 h-2 rounded-full bg-emerald-primary animate-pulse" />
            <strong className="text-text-main">Smart India Hackathon 2026</strong> • Problem Statement SIH26265
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl font-extrabold text-text-main tracking-tight leading-tight">
            Streamlining AICTE Security Deposit & <br />
            <span className="text-emerald-primary">Fixed Deposit Receipt (FDR) Management</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-sm sm:text-base text-text-secondary leading-relaxed">
            Replace manual spreadsheets and physical bank correspondence with an enterprise regulatory portal.
            Automated OCR verification, proactive maturity notifications, cryptographic rollover lineage, and
            transparent maker-checker sign-offs.
          </p>

          {/* View Mode Switcher Toggle */}
          <div className="pt-2 flex items-center justify-center">
            <div className="inline-flex p-1 bg-white border border-border rounded-2xl shadow-xs">
              <button
                onClick={() => setViewMode('web')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  viewMode === 'web'
                    ? 'bg-emerald-primary text-white shadow-xs'
                    : 'text-text-secondary hover:text-text-main'
                }`}
              >
                <Monitor size={15} />
                <span>Access Web App (Desktop Portal)</span>
              </button>

              <button
                onClick={() => setViewMode('mobile')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  viewMode === 'mobile'
                    ? 'bg-emerald-primary text-white shadow-xs'
                    : 'text-text-secondary hover:text-text-main'
                }`}
              >
                <Smartphone size={15} />
                <span>Interactive Mobile Device View</span>
              </button>
            </div>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/overview')}
              className="btn-primary px-6 py-3 text-sm shadow-md hover:shadow-lg"
            >
              <span>Launch Live Portal</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={scrollToDocs}
              className="btn-secondary px-5 py-3 text-sm"
            >
              <BookOpen size={16} />
              <span>Read Architecture Documentation</span>
            </button>
          </div>
        </div>

        {/* Dynamic Display: Web Portal Preview vs Virtual Mobile Device Simulator */}
        <div id="device-simulator" className="max-w-6xl mx-auto mt-12 transition-all duration-300">
          {viewMode === 'web' ? (
            /* Desktop Web App Preview Banner */
            <div className="relative rounded-3xl border border-border bg-white shadow-xl overflow-hidden p-6 sm:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-border/60">
                <div className="space-y-1 text-left">
                  <span className="text-xs font-bold text-emerald-primary uppercase tracking-wider">
                    Full Web Enterprise Interface
                  </span>
                  <h3 className="text-xl font-bold text-text-main">
                    Production Regulatory Management Suite
                  </h3>
                  <p className="text-xs text-text-secondary max-w-xl">
                    Experience the complete portal featuring all 11 modules: Overview Dashboard, FDR Repository,
                    OCR Document Verification, Renewals & Lineage Tracking, Approval Queue, and Analytics.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setViewMode('mobile')}
                    className="btn-secondary text-xs"
                  >
                    <Smartphone size={15} />
                    <span>Switch to Mobile View</span>
                  </button>
                  <button
                    onClick={() => navigate('/overview')}
                    className="btn-primary text-xs"
                  >
                    <span>Enter Live Portal</span>
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>

              {/* Quick Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 text-left">
                <div
                  onClick={() => navigate('/overview')}
                  className="p-4 rounded-2xl bg-bg-secondary/60 hover:bg-emerald-50/30 border border-border/80 transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-border flex items-center justify-center text-emerald-primary mb-2 shadow-2xs">
                    <Coins size={16} />
                  </div>
                  <h4 className="text-xs font-bold text-text-main group-hover:text-emerald-primary">
                    Portfolio & Lien Dashboard
                  </h4>
                  <p className="text-[11px] text-text-secondary mt-1">
                    Live tracking of ₹100M+ active technical education deposit receipts under AICTE lien.
                  </p>
                </div>

                <div
                  onClick={() => navigate('/verification')}
                  className="p-4 rounded-2xl bg-bg-secondary/60 hover:bg-emerald-50/30 border border-border/80 transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-border flex items-center justify-center text-emerald-primary mb-2 shadow-2xs">
                    <Sparkles size={16} />
                  </div>
                  <h4 className="text-xs font-bold text-text-main group-hover:text-emerald-primary">
                    Dual-Pass OCR Engine
                  </h4>
                  <p className="text-[11px] text-text-secondary mt-1">
                    Automated certificate verification cross-checked against submitted form parameters.
                  </p>
                </div>

                <div
                  onClick={() => navigate('/renewals')}
                  className="p-4 rounded-2xl bg-bg-secondary/60 hover:bg-emerald-50/30 border border-border/80 transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-border flex items-center justify-center text-emerald-primary mb-2 shadow-2xs">
                    <RefreshCw size={16} />
                  </div>
                  <h4 className="text-xs font-bold text-text-main group-hover:text-emerald-primary">
                    Lineage Rollover Chaining
                  </h4>
                  <p className="text-[11px] text-text-secondary mt-1">
                    Deterministic instrument rollover tracking connecting original deposits to replacements.
                  </p>
                </div>

                <div
                  onClick={() => navigate('/approvals')}
                  className="p-4 rounded-2xl bg-bg-secondary/60 hover:bg-emerald-50/30 border border-border/80 transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-border flex items-center justify-center text-emerald-primary mb-2 shadow-2xs">
                    <Lock size={16} />
                  </div>
                  <h4 className="text-xs font-bold text-text-main group-hover:text-emerald-primary">
                    FIDO2 & Cryptographic Audit
                  </h4>
                  <p className="text-[11px] text-text-secondary mt-1">
                    Maker-checker approvals backed by an immutable, append-only sequential ledger.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Virtual Mobile Device Simulator */
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <div>
                  <span className="text-xs font-bold text-emerald-primary uppercase tracking-wider">
                    Interactive Virtual Device Frame
                  </span>
                  <h3 className="text-lg font-bold text-text-main">
                    Live Mobile Application Simulation
                  </h3>
                </div>
                <button
                  onClick={() => setViewMode('web')}
                  className="btn-secondary text-xs"
                >
                  <Monitor size={14} /> Switch to Desktop View
                </button>
              </div>

              <VirtualDeviceSimulator initialUrl="/overview" />
            </div>
          )}
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section id="features" className="py-16 px-4 sm:px-6 bg-white border-y border-border">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-emerald-primary uppercase tracking-wider">
              Smart Automation Pillars
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-main">
              Built Specifically for AICTE Regulatory Operations
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary">
              Addressing every operational bottleneck identified in Smart India Hackathon problem statement SIH26265.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-border bg-bg-secondary/30 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-pale text-emerald-primary flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <h3 className="text-sm font-bold text-text-main">Simulated OCR Document Verification</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Extracts certificate data automatically, calculates confidence scores, and flags discrepancies
                between form inputs and bank documents before officer sign-off.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-bg-secondary/30 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <RefreshCw size={20} />
              </div>
              <h3 className="text-sm font-bold text-text-main">Proactive Maturity Radar</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Categorizes deposits into 7-day (Critical), 30-day (Upcoming), and 90-day warning buckets, preventing
                unintentional maturity and expired joint liens.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-bg-secondary/30 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Scale size={20} />
              </div>
              <h3 className="text-sm font-bold text-text-main">Authorized Release & Refunds</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Multi-stage regulatory workflow for discharging AICTE liens with complete No-Dues validation and
                formal confirmation checkpoints.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Technical Documentation Section */}
      <DocumentationSection />

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 border-t border-slate-800 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
              ZD
            </div>
            <div>
              <div className="text-white font-semibold">Zero Drop — AICTE FDR Portal</div>
              <div className="text-[11px] text-slate-500">Smart India Hackathon 2026 • Problem ID: SIH26265</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/overview')} className="text-slate-300 hover:text-white transition-colors">
              Access Web App
            </button>
            <button onClick={scrollToSimulator} className="text-slate-300 hover:text-white transition-colors">
              Mobile Simulator
            </button>
            <button onClick={scrollToDocs} className="text-slate-300 hover:text-white transition-colors">
              Documentation
            </button>
            <a
              href="https://github.com/shampatil23/ZeroDrop_SIH26265"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 font-medium"
            >
              GitHub Repository <ExternalLink size={12} />
            </a>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-slate-800 text-center text-[11px] text-slate-500">
          Designed and built for AICTE Financial Regulatory Operations • Prototype Demonstration Build
        </div>
      </footer>
    </div>
  );
}
