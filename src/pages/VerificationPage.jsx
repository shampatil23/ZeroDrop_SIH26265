import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  FileCheck,
  Search,
  Filter,
  Eye,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Download,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  XCircle,
  UserCheck,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useData } from '../hooks/useDataContext';
import { verificationService, fdrService, auditService } from '../services/dataService';
import { formatINR, formatDate } from '../data/demoData';
import { animatePageEntrance } from '../animations/gsapConfig';
import Badge from '../components/ui/Badge';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import toast from 'react-hot-toast';

export default function VerificationPage() {
  const { data, refresh } = useData();
  const pageRef = useRef(null);

  const verificationDocs = data?.verificationDocuments || [];
  const fdrs = data?.fdrRecords || [];

  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Awaiting Review' | 'Verified' | 'Discrepancy' | 'Rejected'
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [reviewerNotes, setReviewerNotes] = useState('');

  // Dialog state
  const [confirmAction, setConfirmAction] = useState(null); // { type, title, message, action }

  useEffect(() => {
    animatePageEntrance(pageRef);
    if (verificationDocs.length > 0 && !selectedDocId) {
      // Default to first doc awaiting review or first doc
      const awaiting = verificationDocs.find((d) => d.status === 'Awaiting Review' || d.status === 'Discrepancy');
      setSelectedDocId(awaiting ? awaiting.id : verificationDocs[0].id);
    }
  }, [verificationDocs, selectedDocId]);

  const filteredDocs = useMemo(() => {
    if (activeTab === 'All') return verificationDocs;
    return verificationDocs.filter((d) => d.status === activeTab);
  }, [verificationDocs, activeTab]);

  const selectedDoc = useMemo(() => {
    return verificationDocs.find((d) => d.id === selectedDocId) || null;
  }, [verificationDocs, selectedDocId]);

  const linkedFdr = useMemo(() => {
    if (!selectedDoc) return null;
    return fdrs.find((f) => f.id === selectedDoc.fdrId) || null;
  }, [selectedDoc, fdrs]);

  const handleRunOcr = () => {
    if (!selectedDoc) return;
    setIsOcrLoading(true);
    setTimeout(() => {
      verificationService.runDemoOcr(selectedDoc.id);
      setIsOcrLoading(false);
      refresh();
      toast.success('Demo OCR completed — extracted fields populated');
    }, 1200);
  };

  const handleDecision = (newStatus, notes) => {
    if (!selectedDoc) return;
    verificationService.updateStatus(selectedDoc.id, newStatus, 'Sunita Verma', {
      notes: notes || reviewerNotes,
    });
    // Also update linked FDR verification status
    if (linkedFdr) {
      fdrService.update(linkedFdr.id, {
        verificationStatus: newStatus === 'Verified' ? 'Verified' : newStatus === 'Discrepancy' ? 'Discrepancy' : 'Pending',
      });
    }
    refresh();
    setConfirmAction(null);
    toast.success(`Document marked as "${newStatus}"`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Verified':
        return <Badge variant="success">Verified</Badge>;
      case 'Awaiting Review':
        return <Badge variant="warning">Awaiting Review</Badge>;
      case 'Discrepancy':
        return <Badge variant="danger">Discrepancy</Badge>;
      case 'Rejected':
        return <Badge variant="neutral">Rejected</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  // Compare submitted vs extracted fields
  const comparisonFields = [
    {
      label: 'FDR Reference Number',
      submitted: linkedFdr?.id || '—',
      extracted: selectedDoc?.extractedFields?.fdrNumber || '—',
      confidence: selectedDoc?.confidence?.fdrNumber,
      isMatch:
        !selectedDoc?.extractedFields ||
        linkedFdr?.id === selectedDoc?.extractedFields?.fdrNumber,
    },
    {
      label: 'Institution Name',
      submitted: linkedFdr?.institutionName || '—',
      extracted: selectedDoc?.extractedFields?.institutionName || '—',
      confidence: selectedDoc?.confidence?.institutionName,
      isMatch:
        !selectedDoc?.extractedFields ||
        linkedFdr?.institutionName.toLowerCase() ===
          selectedDoc?.extractedFields?.institutionName.toLowerCase(),
    },
    {
      label: 'Issuing Bank',
      submitted: linkedFdr?.bank || '—',
      extracted: selectedDoc?.extractedFields?.bankName || '—',
      confidence: selectedDoc?.confidence?.bankName,
      isMatch:
        !selectedDoc?.extractedFields ||
        linkedFdr?.bank === selectedDoc?.extractedFields?.bankName,
    },
    {
      label: 'Principal Amount',
      submitted: linkedFdr ? formatINR(linkedFdr.principalAmount) : '—',
      extracted: selectedDoc?.extractedFields
        ? formatINR(selectedDoc.extractedFields.principalAmount)
        : '—',
      confidence: selectedDoc?.confidence?.principalAmount,
      isMatch:
        !selectedDoc?.extractedFields ||
        linkedFdr?.principalAmount === selectedDoc?.extractedFields?.principalAmount,
    },
    {
      label: 'Issue Date',
      submitted: linkedFdr ? formatDate(linkedFdr.issueDate) : '—',
      extracted: selectedDoc?.extractedFields
        ? formatDate(selectedDoc.extractedFields.issueDate)
        : '—',
      confidence: selectedDoc?.confidence?.issueDate,
      isMatch:
        !selectedDoc?.extractedFields ||
        linkedFdr?.issueDate === selectedDoc?.extractedFields?.issueDate,
    },
    {
      label: 'Maturity Date',
      submitted: linkedFdr ? formatDate(linkedFdr.maturityDate) : '—',
      extracted: selectedDoc?.extractedFields
        ? formatDate(selectedDoc.extractedFields.maturityDate)
        : '—',
      confidence: selectedDoc?.confidence?.maturityDate,
      isMatch:
        !selectedDoc?.extractedFields ||
        linkedFdr?.maturityDate === selectedDoc?.extractedFields?.maturityDate,
    },
  ];

  return (
    <div ref={pageRef} className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-main">Document Verification Center</h1>
          <p className="text-xs text-text-secondary mt-1">
            Simulated optical character recognition (OCR), certificate authenticity cross-check, and officer review workspace.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-primary bg-emerald-pale px-3 py-1 rounded-full font-medium border border-emerald-primary/20">
            Automated Audit Mode
          </span>
        </div>
      </div>

      {/* Queue Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border">
        {['All', 'Awaiting Review', 'Discrepancy', 'Verified', 'Rejected'].map((tab) => {
          const count =
            tab === 'All'
              ? verificationDocs.length
              : verificationDocs.filter((d) => d.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab
                  ? 'bg-emerald-pale text-emerald-primary shadow-xs'
                  : 'text-text-secondary hover:text-text-main hover:bg-bg-secondary'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === tab ? 'bg-emerald-primary text-white' : 'bg-bg-secondary text-text-secondary'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Two-Column Review Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Document List & Document Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Quick Document Selector Row */}
          <div className="card p-3">
            <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider block mb-2">
              Verification Queue ({filteredDocs.length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    selectedDocId === doc.id
                      ? 'border-emerald-primary bg-emerald-50/30'
                      : 'border-border hover:border-emerald-primary/40 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-text-main">{doc.fdrId}</span>
                    {getStatusBadge(doc.status)}
                  </div>
                  <div className="text-[11px] text-text-secondary truncate">{doc.institutionName}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Document Preview Canvas */}
          {selectedDoc && (
            <div className="card space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <div>
                  <h3 className="text-xs font-semibold text-text-main">{selectedDoc.documentName}</h3>
                  <span className="text-[11px] text-text-secondary">Uploaded on {formatDate(selectedDoc.uploadDate)}</span>
                </div>

                {/* Canvas Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(z - 15, 70))}
                    className="p-1.5 rounded-lg border border-border hover:bg-bg-secondary text-text-secondary"
                    title="Zoom Out"
                  >
                    <ZoomOut size={14} />
                  </button>
                  <span className="text-xs font-medium text-text-secondary tabular-nums w-10 text-center">
                    {zoomLevel}%
                  </span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(z + 15, 150))}
                    className="p-1.5 rounded-lg border border-border hover:bg-bg-secondary text-text-secondary"
                    title="Zoom In"
                  >
                    <ZoomIn size={14} />
                  </button>
                  <button
                    onClick={() => toast.success('Demo certificate downloaded')}
                    className="p-1.5 rounded-lg border border-border hover:bg-bg-secondary text-text-secondary"
                    title="Download Original"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>

              {/* Certificate Graphic Simulation */}
              <div className="bg-bg-secondary/70 rounded-xl p-4 overflow-auto max-h-[460px] flex items-center justify-center border border-dashed border-border">
                <div
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                  className="w-full max-w-lg bg-white rounded-xl shadow-md border-2 border-slate-300 p-6 space-y-4 font-serif text-slate-800 transition-transform duration-150"
                >
                  {/* Certificate Header */}
                  <div className="text-center border-b-2 border-emerald-primary/40 pb-3">
                    <div className="text-[11px] font-sans font-bold text-emerald-primary uppercase tracking-widest">
                      {linkedFdr?.bank || 'SCHEDULED COMMERCIAL BANK'}
                    </div>
                    <div className="text-xs text-slate-500 font-sans mt-0.5">
                      {linkedFdr?.branch || 'Main Commercial Banking Branch'}
                    </div>
                    <h2 className="text-base font-bold text-slate-900 mt-2 uppercase tracking-wide">
                      Fixed Deposit Receipt & Lien Certificate
                    </h2>
                  </div>

                  {/* Certificate Body */}
                  <div className="space-y-3 text-xs leading-relaxed font-sans">
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-500">Receipt Ref No:</span>
                      <span className="font-bold font-mono text-slate-900">{linkedFdr?.id}</span>
                    </div>

                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-500">Beneficiary / Institution:</span>
                      <span className="font-semibold text-slate-900 text-right">{linkedFdr?.institutionName}</span>
                    </div>

                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-500">Joint Lien Holder:</span>
                      <span className="font-semibold text-emerald-primary">The Member Secretary, AICTE, New Delhi</span>
                    </div>

                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-500">Principal Deposit:</span>
                      <span className="font-bold text-slate-900 tabular-nums">
                        {selectedDoc?.extractedFields?.principalAmount
                          ? formatINR(selectedDoc.extractedFields.principalAmount)
                          : linkedFdr ? formatINR(linkedFdr.principalAmount) : '—'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-1">
                      <div>
                        <span className="text-slate-500 block">Issue Date:</span>
                        <span className="font-medium">{formatDate(linkedFdr?.issueDate)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Maturity Date:</span>
                        <span className="font-medium">{formatDate(linkedFdr?.maturityDate)}</span>
                      </div>
                    </div>

                    <div className="pt-2 text-[10px] text-slate-500 italic">
                      "Certified that the deposit cannot be liquidated, encashed or altered without explicit prior written discharge by AICTE authorities."
                    </div>
                  </div>

                  {/* Stamp & Signature simulation */}
                  <div className="pt-4 flex items-end justify-between border-t border-slate-200">
                    <div className="w-16 h-16 rounded-full border-2 border-emerald-primary/60 flex items-center justify-center text-[9px] font-sans font-bold text-emerald-primary uppercase text-center rotate-[-12deg]">
                      Bank Seal Verified
                    </div>
                    <div className="text-center font-sans">
                      <div className="w-24 border-b border-slate-400 mb-1" />
                      <span className="text-[10px] text-slate-500">Authorized Branch Officer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: OCR Comparison Workspace (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedDoc && (
            <div className="card space-y-4">
              {/* OCR Header */}
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <h3 className="text-xs font-semibold text-text-main flex items-center gap-1.5">
                    <Sparkles size={14} className="text-emerald-primary" />
                    OCR Cross-Verification Analysis
                  </h3>
                  <span className="text-[11px] text-text-secondary">Demo OCR Engine v2.4 (Simulated)</span>
                </div>

                <button
                  onClick={handleRunOcr}
                  disabled={isOcrLoading}
                  className="btn-primary text-xs px-3 py-1.5"
                >
                  {isOcrLoading ? (
                    <span className="flex items-center gap-1">
                      <RotateCcw size={13} className="animate-spin" /> Scanning...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Sparkles size={13} /> Run Demo OCR
                    </span>
                  )}
                </button>
              </div>

              {/* Status Warning if Discrepancy */}
              {selectedDoc.status === 'Discrepancy' && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-xs">
                  <ShieldAlert className="text-red-critical shrink-0 mt-0.5" size={16} />
                  <div>
                    <span className="font-bold text-red-critical block">Discrepancy Detected!</span>
                    <span className="text-red-700 leading-normal">
                      Extracted certificate values do not match submitted form data. Requires human officer review.
                    </span>
                  </div>
                </div>
              )}

              {/* Field by Field Comparison */}
              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {comparisonFields.map((field) => (
                  <div
                    key={field.label}
                    className={`p-2.5 rounded-xl border text-xs transition-colors ${
                      !field.isMatch
                        ? 'border-red-300 bg-red-50/50'
                        : 'border-border bg-bg-secondary/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-text-main">{field.label}</span>
                      <div className="flex items-center gap-1.5">
                        {field.confidence != null && (
                          <span className="text-[10px] text-text-secondary font-mono">
                            {field.confidence}% conf.
                          </span>
                        )}
                        {field.isMatch ? (
                          <CheckCircle size={14} className="text-emerald-primary" />
                        ) : (
                          <span className="text-[10px] font-bold text-red-critical flex items-center gap-0.5">
                            <AlertTriangle size={12} /> Mismatch
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-border/40">
                      <div>
                        <span className="text-text-secondary block">Form Value:</span>
                        <span className="font-medium text-text-main truncate block">{field.submitted}</span>
                      </div>
                      <div>
                        <span className="text-text-secondary block">Extracted from Certificate:</span>
                        <span
                          className={`font-semibold truncate block ${
                            !field.isMatch ? 'text-red-critical' : 'text-emerald-primary'
                          }`}
                        >
                          {field.extracted}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reviewer Decision Notes */}
              <div className="space-y-1.5 pt-2 border-t border-border/60">
                <label className="block text-xs font-medium text-text-main">Officer Review Notes</label>
                <textarea
                  rows={2}
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                  placeholder="Record verification findings, discrepancy details, or remarks..."
                  className="input-field text-xs resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() =>
                    setConfirmAction({
                      type: 'success',
                      title: 'Verify FDR Document',
                      message: `Are you sure you want to mark ${selectedDoc.fdrId} as Verified? This confirms the certificate values match AICTE records.`,
                      action: () => handleDecision('Verified'),
                    })
                  }
                  className="btn-primary text-xs justify-center py-2"
                >
                  <CheckCircle size={14} /> Mark as Verified
                </button>

                <button
                  onClick={() =>
                    setConfirmAction({
                      type: 'danger',
                      title: 'Flag Discrepancy',
                      message: `Are you sure you want to flag a Discrepancy on ${selectedDoc.fdrId}? This will alert the institution and freeze approval workflows.`,
                      action: () => handleDecision('Discrepancy'),
                    })
                  }
                  className="btn-danger text-xs justify-center py-2"
                >
                  <AlertTriangle size={14} /> Flag Discrepancy
                </button>

                <button
                  onClick={() =>
                    setConfirmAction({
                      type: 'warning',
                      title: 'Request Resubmission',
                      message: `Send an official notice to ${selectedDoc.institutionName} requesting re-upload of a clear, signed FDR certificate?`,
                      action: () => handleDecision('Awaiting Review', 'Resubmission requested by officer'),
                    })
                  }
                  className="btn-secondary text-xs justify-center py-2"
                >
                  <RotateCcw size={14} /> Request Resubmission
                </button>

                <button
                  onClick={() =>
                    setConfirmAction({
                      type: 'danger',
                      title: 'Reject Certificate',
                      message: `Reject certificate for ${selectedDoc.fdrId}? The institution will be informed of rejection.`,
                      action: () => handleDecision('Rejected', 'Document rejected by officer'),
                    })
                  }
                  className="btn-secondary text-xs text-red-critical hover:bg-red-50 justify-center py-2"
                >
                  <XCircle size={14} /> Reject with Reason
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmAction && (
        <ConfirmationDialog
          isOpen={Boolean(confirmAction)}
          onClose={() => setConfirmAction(null)}
          onConfirm={confirmAction.action}
          title={confirmAction.title}
          message={confirmAction.message}
          type={confirmAction.type}
          confirmText="Confirm Decision"
        />
      )}
    </div>
  );
}
