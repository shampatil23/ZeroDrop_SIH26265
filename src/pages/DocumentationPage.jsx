import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Sun,
  Info,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Copy,
  Check,
  Layers,
  ShieldCheck,
  Database,
  Server,
  FileCheck2,
  RefreshCw,
  Coins,
  Lock,
  Smartphone,
  Globe,
  ArrowRight,
} from 'lucide-react';

export default function DocumentationPage() {
  const [activeItem, setActiveItem] = useState('introduction');
  const [activeTopTab, setActiveTopTab] = useState('Docs');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const navSections = [
    {
      title: 'GET STARTED',
      items: [
        { id: 'introduction', label: 'Introduction' },
        { id: 'what-is-zerodrop', label: 'What is Zero Drop?' },
        { id: 'how-it-works', label: 'How It Works' },
        { id: 'quick-start', label: 'Quick Start' },
        { id: 'system-requirements', label: 'System Requirements' },
        { id: 'core-concepts', label: 'Core Concepts' },
        { id: 'smart-ocr-setup', label: 'Smart OCR & Sensor Setup' },
        { id: 'compliance-scores', label: 'Compliance & Risk Scores' },
        { id: 'guided-onboarding', label: 'Guided Onboarding' },
        { id: 'deployment-options', label: 'Deployment Options' },
        { id: 'security-compliance', label: 'Security & Compliance' },
        { id: 'migration-guide', label: 'Migration Guide' },
      ],
    },
    {
      title: 'PLATFORM',
      items: [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'fdr-repository', label: 'FDR Repository' },
        { id: 'institution-mgmt', label: 'Institution Management' },
        { id: 'verification-center', label: 'Verification Center' },
        { id: 'renewals-radar', label: 'Renewals & Maturity' },
        { id: 'approval-queue', label: 'Approval Queue' },
        { id: 'release-refunds', label: 'Release & Refunds' },
        { id: 'reports-analytics', label: 'Reports & Analytics' },
        { id: 'audit-trail', label: 'Audit Trail' },
      ],
    },
    {
      title: 'API & ARCHITECTURE',
      items: [
        { id: 'api-architecture', label: 'System Architecture' },
        { id: 'api-fdr', label: 'FDR Endpoints' },
        { id: 'api-ocr', label: 'OCR Extraction API' },
        { id: 'api-auth', label: 'Authentication & RBAC' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#202824] flex flex-col font-sans">
      {/* Top Navbar matching Image 2 */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8E4] h-16 flex items-center px-4 sm:px-6 justify-between gap-4">
        {/* Left: Brand & Title */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-[#E8F5EF] flex items-center justify-center text-[#168568] group-hover:scale-105 transition-transform">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            </div>
            <div>
              <div className="font-extrabold text-sm text-[#202824] tracking-wider leading-none">
                ZERO DROP
              </div>
              <div className="text-[10px] text-[#68736D] leading-none mt-0.5">
                AICTE FDR & Security Deposit Intelligence
              </div>
            </div>
          </Link>

          {/* Top Tabs */}
          <nav className="hidden md:flex items-center gap-1 ml-4 text-xs font-semibold">
            {['Docs', 'Guides', 'Architecture & DRF', 'Compliance', 'API Reference'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTopTab(tab);
                  if (tab === 'API Reference') setActiveItem('api-fdr');
                  if (tab === 'Architecture & DRF') setActiveItem('api-architecture');
                  if (tab === 'Docs') setActiveItem('introduction');
                }}
                className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                  activeTopTab === tab
                    ? 'bg-[#E8F5EF] text-[#168568] font-bold'
                    : 'text-[#68736D] hover:text-[#202824] hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Nav Utilities */}
        <div className="flex items-center gap-2.5">
          {/* Search box with Ctrl K shortcut */}
          <div className="hidden sm:flex items-center gap-2 bg-[#F5F7F6] border border-[#E2E8E4] rounded-full px-3 py-1.5 text-xs text-[#68736D] w-56">
            <Search size={14} className="text-[#68736D]/60 shrink-0" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none w-full text-xs text-[#202824] placeholder:text-[#68736D]/60"
            />
            <span className="text-[10px] bg-white border border-[#E2E8E4] px-1.5 py-0.5 rounded font-mono shadow-2xs">
              Ctrl K
            </span>
          </div>

          <button
            className="p-2 rounded-xl text-[#68736D] hover:bg-[#F5F7F6] transition-colors"
            title="Theme Toggle"
            aria-label="Theme Toggle"
          >
            <Sun size={17} />
          </button>

          <a
            href="https://github.com/shampatil23/ZeroDrop_SIH26265"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-[#68736D] hover:bg-[#F5F7F6] transition-colors"
            title="GitHub Repository"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          <span className="text-xs font-bold text-[#68736D] px-2 py-1 rounded bg-[#F5F7F6] border border-[#E2E8E4]">
            EN
          </span>

          <Link
            to="/overview"
            target="_blank"
            className="ml-2 px-3 py-1.5 rounded-full bg-[#168568] hover:bg-[#116B53] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span>Live Prototype</span>
            <ExternalLink size={12} />
          </Link>
        </div>
      </header>

      {/* Main Documentation Body: Sidebar + Article */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Documentation Sidebar matching Image 2 */}
        <aside
          className={`
            border-r border-[#E2E8E4] bg-white transition-all duration-200 shrink-0
            ${isSidebarOpen ? 'w-64' : 'w-12'}
            hidden md:block py-6 pr-2 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto
          `}
        >
          {/* Collapse Button Header */}
          <div className="flex items-center justify-between px-4 pb-4 border-b border-[#E2E8E4] mb-4">
            <span
              className={`text-[11px] font-bold text-[#68736D] uppercase tracking-wider ${
                !isSidebarOpen && 'hidden'
              }`}
            >
              Documentation
            </span>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-full border border-[#E2E8E4] hover:bg-[#F5F7F6] text-[#68736D] cursor-pointer"
              title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {isSidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>
          </div>

          {isSidebarOpen && (
            <div className="space-y-6 px-2">
              {navSections.map((sec) => (
                <div key={sec.title} className="space-y-1">
                  <div className="text-[11px] font-bold text-[#68736D] uppercase tracking-wider px-3 py-1">
                    {sec.title}
                  </div>
                  <ul className="space-y-0.5">
                    {sec.items.map((item) => {
                      const isActive = activeItem === item.id;
                      return (
                        <li key={item.id}>
                          <button
                            onClick={() => setActiveItem(item.id)}
                            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                              isActive
                                ? 'bg-[#E8F5EF] text-[#168568] font-bold'
                                : 'text-[#68736D] hover:bg-[#F5F7F6] hover:text-[#202824]'
                            }`}
                          >
                            <span>{item.label}</span>
                            {isActive && (
                              <div className="w-1.5 h-1.5 rounded-full bg-[#168568]" />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Right Article Content Area matching Image 2 */}
        <main className="flex-1 px-6 sm:px-12 py-8 max-w-4xl overflow-y-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs text-[#68736D] mb-4">
            <span>Docs</span>
            <span>/</span>
            <span>Get Started</span>
            <span>/</span>
            <span className="bg-[#E8F5EF] text-[#168568] px-2.5 py-0.5 rounded-full font-bold text-[11px]">
              {navSections.flatMap((s) => s.items).find((i) => i.id === activeItem)?.label || 'Introduction'}
            </span>
          </div>

          {/* Badge Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5EF] text-[#168568] text-xs font-semibold mb-3 border border-[#168568]/20">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
            <span>AICTE Security Deposit & FDR Management Platform</span>
          </div>

          {/* Heading 1 */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#202824] tracking-tight mb-4">
            {activeItem === 'introduction'
              ? 'Zero Drop Documentation'
              : navSections.flatMap((s) => s.items).find((i) => i.id === activeItem)?.label}
          </h1>

          {/* Lead Paragraph */}
          <p className="text-sm sm:text-base text-[#68736D] leading-relaxed mb-6">
            AI-powered institutional security deposit and Fixed Deposit Receipt (FDR) lifecycle intelligence for modern
            AICTE regulatory operations. Zero Drop unifies institution compliance data, scheduled commercial bank joint liens,
            automated dual-pass OCR certificate verification, and proactive maturity warning signals into actionable
            regulatory workflows up to 90 days before maturity occurs.
          </p>

          {/* About this Documentation Callout Box matching Image 2 */}
          <div className="bg-[#F0F7FF] border border-[#BFDBFE] rounded-2xl p-5 mb-8 flex items-start gap-3.5">
            <div className="p-1.5 rounded-full bg-[#DBEAFE] text-[#2563EB] shrink-0 mt-0.5">
              <Info size={18} />
            </div>
            <div className="space-y-1 text-xs sm:text-sm text-[#1E3A8A] leading-relaxed">
              <strong className="font-bold text-[#1E40AF] block text-sm">About this Documentation</strong>
              <p>
                This comprehensive documentation suite details the Zero Drop platform architecture, automated OCR discrepancy
                detection engine, Scheduled Commercial Bank lien integration, REST APIs, and regulatory deployment operations.
                It is designed for AICTE regulatory officials, technical education deans, and software engineers.
              </p>
            </div>
          </div>

          {/* Dynamic Content Sections based on Sidebar Selection */}
          {activeItem === 'introduction' && (
            <div className="space-y-8 text-xs sm:text-sm text-[#202824] leading-relaxed">
              <div>
                <h2 className="text-xl font-bold text-[#202824] mb-3">Platform Mission & Scope (SIH26265)</h2>
                <p className="text-[#68736D] mb-4">
                  Mandatory institutional security deposits held under Section 10 of the AICTE Act protect students and faculty
                  in approved engineering, polytechnic, and management institutions across India. Currently, institutions submit
                  physical paper receipts and manual letters, causing severe oversight lapses:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-red-200 bg-red-50/40">
                    <span className="font-bold text-red-600 block mb-1 text-xs uppercase tracking-wider">
                      Current Manual Vulnerabilities
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700">
                      <li>Spreadsheet fragmentation across 8 regional AICTE directorates</li>
                      <li>Unmonitored maturity dates leading to silent deposit liquidation</li>
                      <li>High processing latency in courier-based verification correspondence</li>
                      <li>Risks of fraudulent, forged, or unendorsed bank deposit receipts</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl border border-[#168568]/30 bg-[#E8F5EF]/50">
                    <span className="font-bold text-[#168568] block mb-1 text-xs uppercase tracking-wider">
                      Zero Drop Solution Suite
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700">
                      <li>Centralized cloud registry with real-time audit ledger</li>
                      <li>Automated 60/30/7-day proactive multi-channel maturity notices</li>
                      <li>Dual-pass OCR cross-verification against bank certificates</li>
                      <li>Cryptographic lineage rollover chaining for replacement FDRs</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#202824] mb-3">Core Operational Capabilities</h2>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl border border-[#E2E8E4] flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-[#168568] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#202824]">Real-Time Lien Monitoring:</strong> Tracks over ₹100 Crore in cumulative technical education deposits held across scheduled commercial banks under joint lien with the Member Secretary, AICTE.
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl border border-[#E2E8E4] flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-[#168568] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#202824]">Simulated OCR Extraction:</strong> Automatically isolates receipt numbers, principal deposits, issuing banks, branches, and joint lien endorsements, calculating field-by-field confidence metrics.
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl border border-[#E2E8E4] flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-[#168568] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#202824]">Maker-Checker Approval Workflows:</strong> Mandates two-stage verification where reviewing officers audit discrepancies before approving officials authorize renewals or refunds.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeItem === 'what-is-zerodrop' && (
            <div className="space-y-6 text-xs sm:text-sm text-[#202824] leading-relaxed">
              <h2 className="text-xl font-bold text-[#202824]">What is Zero Drop?</h2>
              <p className="text-[#68736D]">
                Zero Drop is an end-to-end financial operations platform engineered for regulatory oversight. The name
                "Zero Drop" represents our primary objective: <strong>zero dropped FDR liens, zero lost revenue, and zero compliance lapses</strong>.
              </p>
              <div className="p-5 rounded-2xl bg-[#F5F7F6] border border-[#E2E8E4] space-y-2">
                <span className="font-bold text-[#202824] block">Key Platform Deliverables:</span>
                <p className="text-[#68736D]">
                  1. Centralized repository of all institution security deposit instruments.<br />
                  2. Automated verification engine cross-checking bank certificates against AICTE parameters.<br />
                  3. Lineage tracking system maintaining audit chains across deposit rollovers and replacements.<br />
                  4. Secure digital refund and release procedure with statutory No-Dues clearance.
                </p>
              </div>
            </div>
          )}

          {activeItem === 'how-it-works' && (
            <div className="space-y-6 text-xs sm:text-sm text-[#202824] leading-relaxed">
              <h2 className="text-xl font-bold text-[#202824]">How It Works: 4-Stage Regulatory Pipeline</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-[#E2E8E4] bg-white flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#168568] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-[#202824]">Institution Placement & Registration</h3>
                    <p className="text-[#68736D] mt-1">
                      The approved college deposits mandatory funds in an authorized Scheduled Commercial Bank. The joint lien
                      is endorsed to AICTE. The administrator uploads the certificate into the Zero Drop portal.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-[#E2E8E4] bg-white flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#168568] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-[#202824]">Automated OCR & Discrepancy Flagging</h3>
                    <p className="text-[#68736D] mt-1">
                      The document verification center extracts fields. If any mismatch in principal amount or maturity date is
                      detected, the system flags a discrepancy and triggers human review.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-[#E2E8E4] bg-white flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#168568] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-[#202824]">Maturity Lifecycle & Automated Reminders</h3>
                    <p className="text-[#68736D] mt-1">
                      Automated background monitors track days to maturity. At 60, 30, and 7 days, automated reminder notices
                      are dispatched to the college principal and finance dean.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-[#E2E8E4] bg-white flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#168568] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-bold text-[#202824]">Renewal Chaining vs. Lien Release</h3>
                    <p className="text-[#68736D] mt-1">
                      Upon maturity, colleges either link a replacement FDR (preserving lien continuity) or request a formal
                      release requiring statutory No-Dues clearance and authorized sign-off.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeItem === 'api-architecture' && (
            <div className="space-y-6 text-xs sm:text-sm text-[#202824] leading-relaxed">
              <h2 className="text-xl font-bold text-[#202824]">System Architecture & Integration Topology</h2>
              <p className="text-[#68736D]">
                Zero Drop deploys an enterprise-grade decoupled stack designed for high availability and zero data loss.
              </p>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[#F5F7F6] border border-[#E2E8E4]">
                  <strong className="text-[#202824] block">Frontend Client (SPA):</strong>
                  React 19, Vite, Tailwind CSS v4, GSAP 3 animations, Recharts, and React Hook Form.
                </div>
                <div className="p-4 rounded-xl bg-[#F5F7F6] border border-[#E2E8E4]">
                  <strong className="text-[#202824] block">Backend API:</strong>
                  Django REST Framework with Celery asynchronous task queues, Redis cache, and JWT authentication.
                </div>
                <div className="p-4 rounded-xl bg-[#F5F7F6] border border-[#E2E8E4]">
                  <strong className="text-[#202824] block">Database & Document Vault:</strong>
                  PostgreSQL with ACID transactions and AWS S3 AES-256 encrypted storage for certificate blobs.
                </div>
                <div className="p-4 rounded-xl bg-[#F5F7F6] border border-[#E2E8E4]">
                  <strong className="text-[#202824] block">Banking SFMS Gateway:</strong>
                  Scheduled Commercial Bank Structured Financial Messaging System (SFMS) for electronic lien endorsement.
                </div>
              </div>
            </div>
          )}

          {activeItem === 'api-fdr' && (
            <div className="space-y-4 text-xs font-mono">
              <h2 className="text-lg font-bold text-[#202824] font-sans">FDR REST API Specification</h2>
              <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 border border-slate-800 space-y-2">
                <div className="text-emerald-400 font-bold"># GET /api/v1/fdrs/</div>
                <pre className="text-xs whitespace-pre-wrap">{`HTTP/1.1 200 OK
Content-Type: application/json

{
  "count": 18,
  "results": [
    {
      "id": "FDR-2026-001",
      "institution_id": "INST-001",
      "institution_name": "Rajiv Gandhi Institute of Technology",
      "bank": "State Bank of India",
      "principal_amount": 1000000,
      "interest_rate": 7.1,
      "issue_date": "2025-04-15",
      "maturity_date": "2026-11-15",
      "status": "Active",
      "verification_status": "Verified"
    }
  ]
}`}</pre>
              </div>
            </div>
          )}

          {/* Bottom Navigation */}
          <div className="mt-12 pt-6 border-t border-[#E2E8E4] flex items-center justify-between">
            <Link
              to="/overview"
              target="_blank"
              className="text-xs font-semibold text-[#168568] hover:text-[#116B53] flex items-center gap-1.5"
            >
              <span>Explore Web Prototype</span>
              <ExternalLink size={13} />
            </Link>

            <Link
              to="/mobile"
              target="_blank"
              className="text-xs font-semibold text-[#168568] hover:text-[#116B53] flex items-center gap-1.5"
            >
              <span>Launch Virtual Mobile Device</span>
              <Smartphone size={13} />
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
