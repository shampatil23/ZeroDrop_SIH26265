import React, { useState } from 'react';
import {
  BookOpen,
  Layers,
  ShieldCheck,
  FileCode,
  Terminal,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  Server,
  Lock,
  ArrowRight,
  Code2,
} from 'lucide-react';
import Badge from '../ui/Badge';

export default function DocumentationSection() {
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedCode, setCopiedCode] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const navItems = [
    { id: 'overview', label: '1. Problem & Scope (SIH26265)', icon: BookOpen },
    { id: 'architecture', label: '2. System Architecture', icon: Layers },
    { id: 'compliance', label: '3. AICTE Regulatory Lifecycle', icon: ShieldCheck },
    { id: 'ocr', label: '4. Smart OCR Pipeline', icon: Sparkles },
    { id: 'security', label: '5. Security & RBAC', icon: Lock },
    { id: 'api', label: '6. API Specifications', icon: FileCode },
  ];

  return (
    <div id="documentation" className="w-full max-w-6xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-pale text-emerald-primary text-xs font-semibold mb-3 border border-emerald-primary/20">
          <BookOpen size={13} />
          <span>Technical Whitepaper & System Architecture</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-text-main tracking-tight">
          Comprehensive Regulatory Documentation
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary mt-2">
          Complete blueprint for AICTE technical administrators, institutional compliance deans, and evaluation juries for
          Smart India Hackathon 2026.
        </p>
      </div>

      {/* Documentation Layout: Side Nav + Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl border border-border p-4 sm:p-6 shadow-sm">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-1 border-b lg:border-b-0 lg:border-r border-border pb-4 lg:pb-0 lg:pr-6">
          <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider block px-3 mb-2">
            Table of Contents
          </span>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-emerald-pale text-emerald-primary shadow-xs'
                    : 'text-text-secondary hover:bg-bg-secondary hover:text-text-main'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="mt-8 p-4 rounded-2xl bg-bg-secondary/70 border border-border space-y-2">
            <span className="text-xs font-bold text-text-main block">Smart India Hackathon 2026</span>
            <div className="text-[11px] text-text-secondary space-y-1">
              <div><strong>Problem ID:</strong> SIH26265</div>
              <div><strong>Theme:</strong> Smart Automation</div>
              <div><strong>Team:</strong> Zero Drop</div>
            </div>
          </div>
        </div>

        {/* Documentation Content Area */}
        <div className="lg:col-span-8 lg:pl-2">
          {/* TAB 1: Problem & Scope */}
          {activeTab === 'overview' && (
            <div className="space-y-6 text-xs text-text-secondary leading-relaxed">
              <div>
                <h3 className="text-base font-bold text-text-main mb-2">
                  Problem Statement SIH26265: Streamline of Security Deposit / FDR Portal
                </h3>
                <p>
                  Technical educational institutions approved under Section 10 of the AICTE Act are legally mandated to
                  maintain a mandatory Security Deposit in the form of Fixed Deposit Receipts (FDR) held jointly with the
                  Chairman, AICTE. Currently, institutions submit physical paper receipts and manual letters, resulting in:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-red-50/50 border border-red-200">
                  <span className="font-bold text-red-critical block mb-1">Current Manual Bottlenecks</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-700">
                    <li>Dispersed Excel spreadsheets across regional offices</li>
                    <li>Untracked deposit maturity leading to lapsed liens</li>
                    <li>High administrative friction in courier correspondence</li>
                    <li>Vulnerability to fraudulent or altered bank receipts</li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200">
                  <span className="font-bold text-emerald-primary block mb-1">Zero Drop Solutions</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-700">
                    <li>Centralized cloud registry with real-time audit trail</li>
                    <li>Automated 60/30/7-day multi-channel maturity reminders</li>
                    <li>Dual-pass OCR cross-verification with bank advice</li>
                    <li>Cryptographic lineage chaining for replacement FDRs</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-text-main text-xs mb-1">Target Stakeholders</h4>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl border border-border bg-bg-secondary/40 flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-primary shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-text-main">AICTE Regulatory Officers:</strong> Real-time oversight, automated discrepancy flagging, maker-checker sign-off, and compliance audit reporting.
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl border border-border bg-bg-secondary/40 flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-primary shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-text-main">Institution Administrators:</strong> Seamless digital submission, automated maturity alerts, renewal rollover tracking, and transparent lien status.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: System Architecture */}
          {activeTab === 'architecture' && (
            <div className="space-y-6 text-xs text-text-secondary leading-relaxed">
              <div>
                <h3 className="text-base font-bold text-text-main mb-2">High-Availability Enterprise Architecture</h3>
                <p>
                  Zero Drop is engineered using a modular, decoupled microservices architecture designed to integrate with
                  National Informatics Centre (NIC) infrastructure and Scheduled Commercial Banking gateways.
                </p>
              </div>

              {/* Architecture Layer Breakdown */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl border border-border bg-bg-secondary/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-text-main">1. Presentation Layer (SPA)</span>
                    <Badge variant="success">React 19 + Vite + Tailwind</Badge>
                  </div>
                  <p>
                    Ultra-fast single-page application with GSAP micro-animations, accessible ARIA roles, responsive
                    drawer workflows, and offline-resilient local cache.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-border bg-bg-secondary/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-text-main">2. API & Business Logic Layer</span>
                    <Badge variant="info">Django REST Framework</Badge>
                  </div>
                  <p>
                    Role-Based Access Control (RBAC), multi-level approval workflows, deterministic renewal lineage calculation,
                    and rate-limited RESTful endpoints.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-border bg-bg-secondary/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-text-main">3. Data & Storage Layer</span>
                    <Badge variant="warning">PostgreSQL + Encrypted S3</Badge>
                  </div>
                  <p>
                    ACID-compliant relational storage for financial instruments, AES-256 encrypted private bucket for scanned
                    certificates, and an append-only WORM audit log.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-border bg-bg-secondary/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-text-main">4. Banking Interoperability Layer</span>
                    <Badge variant="neutral">SFMS / Open Banking API</Badge>
                  </div>
                  <p>
                    Structured Financial Messaging System (SFMS) integration with Scheduled Commercial Banks to electronically
                    validate lien notation without physical correspondence.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Regulatory Compliance Lifecycle */}
          {activeTab === 'compliance' && (
            <div className="space-y-6 text-xs text-text-secondary leading-relaxed">
              <div>
                <h3 className="text-base font-bold text-text-main mb-2">AICTE Security Deposit Standard Operating Procedure</h3>
                <p>
                  Security deposits must follow rigorous statutory compliance rules from institution registration through
                  maturity renewal or eventual lien discharge.
                </p>
              </div>

              {/* Step By Step Timeline */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-primary text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <strong className="text-text-main block">Initial Deposit Placement & Joint Lien</strong>
                    College places deposit in an approved Scheduled Commercial Bank with joint lien marked to "The Chairman, AICTE".
                    Bank issues FDR certificate and joint lien letter.
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-primary text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <strong className="text-text-main block">Digital Submission & Automated OCR Scan</strong>
                    Institution enters deposit details and uploads certificate. Zero Drop automated OCR compares submitted
                    principal, bank, and date values against certificate extraction.
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-primary text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <strong className="text-text-main block">Proactive Lifecycle Monitoring (60/30/7 Days)</strong>
                    Automated background cron notifies college 60, 30, and 7 days prior to maturity. If unaddressed by day 0,
                    status automatically transitions to "Overdue" and alerts the regional officer.
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-primary text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <strong className="text-text-main block">Renewal Lineage vs. Lien Discharge</strong>
                    The college either uploads a replacement FDR certificate (creating an unbroken lineage chain) or initiates a
                    formal Release & Refund workflow requiring No-Dues clearance.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Smart OCR Pipeline */}
          {activeTab === 'ocr' && (
            <div className="space-y-6 text-xs text-text-secondary leading-relaxed">
              <div>
                <h3 className="text-base font-bold text-text-main mb-2">Automated OCR Verification Engine</h3>
                <p>
                  Zero Drop deploys a specialized document understanding pipeline tailored for Indian bank Fixed Deposit receipts,
                  lien confirmation letters, and deposit receipts.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-bg-secondary/70 border border-border space-y-3">
                <span className="font-bold text-text-main block">Key Extraction & Validation Fields:</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div className="p-2 rounded-lg bg-white border border-border font-mono text-[11px]">FDR Reference No</div>
                  <div className="p-2 rounded-lg bg-white border border-border font-mono text-[11px]">Bank & Branch Name</div>
                  <div className="p-2 rounded-lg bg-white border border-border font-mono text-[11px]">Principal Amount (INR)</div>
                  <div className="p-2 rounded-lg bg-white border border-border font-mono text-[11px]">Date of Issue</div>
                  <div className="p-2 rounded-lg bg-white border border-border font-mono text-[11px]">Date of Maturity</div>
                  <div className="p-2 rounded-lg bg-white border border-border font-mono text-[11px]">Joint Lien Clause</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-text-main text-xs">Mismatch Threshold & Discrepancy Triaging</h4>
                <p>
                  When field confidence drops below 85% or any arithmetic difference is detected in the principal amount
                  (e.g., ₹7,50,000 vs. ₹7,25,000), the system automatically locks the instrument and creates a high-priority
                  review item in the Verification Center.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: Security & RBAC */}
          {activeTab === 'security' && (
            <div className="space-y-6 text-xs text-text-secondary leading-relaxed">
              <div>
                <h3 className="text-base font-bold text-text-main mb-2">Security, RBAC & Immutable Audit Log</h3>
                <p>
                  Financial regulatory compliance requires non-repudiation, tamper resistance, and strict separation of duties.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl border border-border bg-bg-secondary/40">
                  <strong className="text-text-main block mb-0.5">Role-Based Access Control (RBAC):</strong>
                  Institutional administrators cannot approve their own instruments. Only authorized Approving Officials
                  can sign off on refunds or renewals.
                </div>

                <div className="p-3 rounded-xl border border-border bg-bg-secondary/40">
                  <strong className="text-text-main block mb-0.5">FIDO2 & Class-3 DSC Token Support:</strong>
                  High-value transactions (such as security deposit release exceeding ₹10,00,000) mandate hardware-token
                  WebAuthn verification.
                </div>

                <div className="p-3 rounded-xl border border-border bg-bg-secondary/40">
                  <strong className="text-text-main block mb-0.5">Append-Only Cryptographic Audit Trail:</strong>
                  Every user action, status transition, and OCR comparison is sequentially hashed and timestamped to prevent
                  backdating or silent alteration.
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: API Specifications */}
          {activeTab === 'api' && (
            <div className="space-y-4 text-xs text-text-secondary">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-text-main">RESTful API Specifications</h3>
                  <p className="text-[11px] text-text-secondary">Django REST Framework Endpoint Schemas</p>
                </div>
                <Badge variant="neutral">OpenAPI 3.0</Badge>
              </div>

              {/* Code Snippet Box */}
              <div className="relative rounded-2xl bg-slate-900 text-slate-200 p-4 font-mono text-[11px] overflow-x-auto shadow-inner border border-slate-800">
                <button
                  onClick={() =>
                    copyToClipboard(
                      `POST /api/v1/fdrs/ HTTP/1.1\nHost: api.zerodrop.aicte.gov.in\nAuthorization: Bearer <TOKEN>\nContent-Type: application/json\n\n{\n  "fdr_number": "FDR-2026-099",\n  "institution_id": "INST-001",\n  "bank_name": "State Bank of India",\n  "branch_code": "SBI000456",\n  "principal_amount": 1000000.00,\n  "interest_rate": 7.10,\n  "issue_date": "2026-04-15",\n  "maturity_date": "2027-04-15",\n  "joint_lien_marked": true\n}`,
                      'api-post'
                    )
                  }
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Copy JSON"
                >
                  {copiedCode === 'api-post' ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                </button>
                <div className="text-emerald-400 font-bold mb-2"># Register New FDR Instrument</div>
                <pre className="whitespace-pre-wrap">{`POST /api/v1/fdrs/ HTTP/1.1
Host: api.zerodrop.aicte.gov.in
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "fdr_number": "FDR-2026-099",
  "institution_id": "INST-001",
  "bank_name": "State Bank of India",
  "branch_code": "SBI000456",
  "principal_amount": 1000000.00,
  "interest_rate": 7.10,
  "issue_date": "2026-04-15",
  "maturity_date": "2027-04-15",
  "joint_lien_marked": true
}`}</pre>
              </div>

              {/* Code Snippet Box 2 */}
              <div className="relative rounded-2xl bg-slate-900 text-slate-200 p-4 font-mono text-[11px] overflow-x-auto shadow-inner border border-slate-800">
                <button
                  onClick={() =>
                    copyToClipboard(
                      `POST /api/v1/verification/ocr-extract/ HTTP/1.1\nHost: api.zerodrop.aicte.gov.in\nContent-Type: multipart/form-data\n\n# Returns:\n{\n  "status": "MATCH",\n  "confidence_score": 98.4,\n  "extracted_fields": {\n    "fdr_number": "FDR-2026-001",\n    "principal_amount": 1000000,\n    "lien_clause_present": true\n  }\n}`,
                      'api-ocr'
                    )
                  }
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Copy JSON"
                >
                  {copiedCode === 'api-ocr' ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                </button>
                <div className="text-emerald-400 font-bold mb-2"># Simulated OCR Verification Endpoint</div>
                <pre className="whitespace-pre-wrap">{`POST /api/v1/verification/ocr-extract/ HTTP/1.1
Host: api.zerodrop.aicte.gov.in
Content-Type: multipart/form-data

# Response:
{
  "status": "MATCH",
  "confidence_score": 98.4,
  "extracted_fields": {
    "fdr_number": "FDR-2026-001",
    "principal_amount": 1000000,
    "lien_clause_present": true
  }
}`}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
