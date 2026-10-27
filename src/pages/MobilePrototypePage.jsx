import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Smartphone,
  Tablet,
  RotateCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Home,
  FileCheck,
  FolderOpen,
  ClipboardCheck,
  ArrowLeft,
  Download,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import VirtualDeviceSimulator from '../components/landing/VirtualDeviceSimulator';

export default function MobilePrototypePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 h-16 flex items-center px-4 sm:px-6 justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
            title="Back to Landing Page"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-sm">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-white leading-tight">
                Zero Drop Mobile Prototype
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                Virtual Hardware Sandbox • SIH 2026 (SIH26265)
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/docs"
            target="_blank"
            className="hidden sm:inline-flex px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold items-center gap-1.5 transition-colors"
          >
            <span>Documentation</span>
            <ExternalLink size={12} />
          </Link>

          <Link
            to="/overview"
            target="_blank"
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>Open Full Web Portal</span>
            <ExternalLink size={13} />
          </Link>
        </div>
      </header>

      {/* Main Viewport containing the Virtual Device Simulator */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl">
          <VirtualDeviceSimulator initialUrl="#/overview" />
        </div>
      </main>
    </div>
  );
}
