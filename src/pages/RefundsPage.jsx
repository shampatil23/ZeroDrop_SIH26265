import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Undo2,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Building2,
  ChevronRight,
  ShieldCheck,
  Send,
  Download,
  AlertTriangle,
} from 'lucide-react';
import { useData } from '../hooks/useDataContext';
import { refundService } from '../services/dataService';
import { formatINR, formatDate } from '../data/demoData';
import { animatePageEntrance } from '../animations/gsapConfig';
import Badge from '../components/ui/Badge';
import Drawer from '../components/ui/Drawer';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import toast from 'react-hot-toast';

export default function RefundsPage() {
  const { data, refresh } = useData();
  const pageRef = useRef(null);

  const refundRequests = data?.refundRequests || [];
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  useEffect(() => {
    animatePageEntrance(pageRef);
  }, []);

  const handleDecision = (newStatus) => {
    if (!selectedRefund) return;
    refundService.updateStatus(selectedRefund.id, newStatus);
    refresh();
    setConfirmDialog(null);
    setSelectedRefund(null);
    toast.success(`Release request marked as "${newStatus}"`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <Badge variant="success">Completed</Badge>;
      case 'Approved':
        return <Badge variant="success">Approved</Badge>;
      case 'Under Review':
        return <Badge variant="warning">Under Review</Badge>;
      case 'Rejected':
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div ref={pageRef} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-main">Release & Refunds Management</h1>
          <p className="text-xs text-text-secondary mt-1">
            Standard operating procedure workflow for discharge of joint deposit lien and refund authorization.
          </p>
        </div>
      </div>

      {/* Overview Banner */}
      <div className="card bg-emerald-50/20 border-emerald-primary/30 flex items-start gap-3">
        <ShieldCheck className="text-emerald-primary shrink-0 mt-0.5" size={20} />
        <div className="text-xs text-text-secondary leading-relaxed">
          <strong className="text-text-main font-semibold block">Regulatory Lien Discharge Protocol</strong>
          Security deposits held in escrow under AICTE lien cannot be released without verifying the institution's complete
          compliance history, absence of pending student/faculty dues, and approval from the competent regulatory authority.
        </div>
      </div>

      {/* Refunds Table */}
      <div className="card p-0 overflow-hidden">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Institution</th>
                <th>Linked FDR</th>
                <th>Requested Amount</th>
                <th>Submission Date</th>
                <th>Reason for Release</th>
                <th>Reviewer</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {refundRequests.map((req) => (
                <tr
                  key={req.id}
                  onClick={() => setSelectedRefund(req)}
                  className="hover:bg-emerald-50/20"
                >
                  <td className="font-semibold text-xs text-text-main">{req.id}</td>
                  <td>
                    <div className="font-medium text-xs text-text-main truncate max-w-[200px]">
                      {req.institutionName}
                    </div>
                    <div className="text-[11px] text-text-secondary">{req.institutionId}</div>
                  </td>
                  <td className="text-xs font-mono text-text-main">{req.fdrId}</td>
                  <td className="font-bold text-xs tabular-nums text-text-main">
                    {formatINR(req.amount)}
                  </td>
                  <td className="text-xs text-text-secondary tabular-nums">
                    {formatDate(req.submissionDate)}
                  </td>
                  <td className="text-xs text-text-secondary truncate max-w-[200px]">
                    {req.reason}
                  </td>
                  <td className="text-xs text-text-main">{req.reviewer || 'Unassigned'}</td>
                  <td>{getStatusBadge(req.status)}</td>
                  <td className="text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRefund(req);
                      }}
                      className="p-1.5 rounded-lg text-text-secondary hover:text-emerald-primary hover:bg-emerald-pale/50 transition-colors"
                      title="Inspect Release Workflow"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Step by Step Progress Drawer */}
      <Drawer
        isOpen={Boolean(selectedRefund)}
        onClose={() => setSelectedRefund(null)}
        title={selectedRefund ? `Release Case: ${selectedRefund.id}` : 'Release Workflow'}
        subtitle={selectedRefund?.institutionName}
        width="max-w-2xl"
      >
        {selectedRefund && (
          <div className="space-y-6 text-xs">
            {/* Status bar */}
            <div className="p-4 rounded-xl bg-bg-secondary flex items-center justify-between">
              <div>
                <span className="text-[11px] text-text-secondary block">Amount to Release</span>
                <span className="text-xl font-bold text-text-main tabular-nums">
                  {formatINR(selectedRefund.amount)}
                </span>
              </div>
              <div>{getStatusBadge(selectedRefund.status)}</div>
            </div>

            {/* Step by Step Workflow Timeline */}
            <div className="space-y-3">
              <h4 className="font-semibold text-text-main uppercase tracking-wider text-[11px] border-b border-border pb-1">
                Discharge Workflow Progress
              </h4>
              <div className="space-y-3 pl-2 border-l-2 border-border ml-2">
                {selectedRefund.steps?.map((step, idx) => (
                  <div key={step.label} className="relative pl-5">
                    <div
                      className={`absolute -left-[11px] top-0.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                        step.completed
                          ? 'border-emerald-primary text-emerald-primary'
                          : step.current
                          ? 'border-amber-500 text-amber-500'
                          : 'border-slate-300 text-slate-300'
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle2 size={10} className="fill-emerald-primary text-white" />
                      ) : (
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            step.current ? 'bg-amber-500' : 'bg-slate-300'
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-semibold ${
                          step.completed
                            ? 'text-emerald-primary'
                            : step.current
                            ? 'text-amber-700 font-bold'
                            : 'text-text-secondary'
                        }`}
                      >
                        {step.label}
                      </span>
                      {step.date && (
                        <span className="text-[11px] text-text-secondary tabular-nums">
                          {formatDate(step.date)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Supporting Documents */}
            <div className="space-y-2">
              <h4 className="font-semibold text-text-main uppercase tracking-wider text-[11px] border-b border-border pb-1">
                Required Verification Documents
              </h4>
              <div className="space-y-1.5">
                {selectedRefund.documents?.map((doc) => (
                  <div
                    key={doc}
                    className="p-2.5 rounded-xl border border-border bg-white flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={15} className="text-emerald-primary" />
                      <span className="font-medium text-text-main">{doc}</span>
                    </div>
                    <button
                      onClick={() => toast.success(`Viewing ${doc}`)}
                      className="text-emerald-primary hover:underline font-medium text-[11px]"
                    >
                      Inspect
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Decision Comments */}
            <div className="space-y-2">
              <h4 className="font-semibold text-text-main uppercase tracking-wider text-[11px] border-b border-border pb-1">
                Audit & Review Comments
              </h4>
              <div className="space-y-2">
                {selectedRefund.comments?.map((c, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-bg-secondary/60 border border-border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-text-main">{c.user}</span>
                      <span className="text-[10px] text-text-secondary">{formatDate(c.date)}</span>
                    </div>
                    <p className="text-text-secondary">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            {selectedRefund.status !== 'Completed' && (
              <div className="pt-2 border-t border-border space-y-2">
                <h4 className="font-semibold text-text-main uppercase tracking-wider text-[11px]">
                  Authorized Actions
                </h4>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setConfirmDialog({
                        type: 'success',
                        title: 'Authorize Release',
                        message: `Approve release of security deposit ₹${selectedRefund.amount?.toLocaleString(
                          'en-IN'
                        )} for ${selectedRefund.institutionName}? Joint lien will be discharged.`,
                        action: () => handleDecision('Approved'),
                      })
                    }
                    className="btn-primary text-xs flex-1 justify-center py-2"
                  >
                    Authorize Release
                  </button>
                  <button
                    onClick={() =>
                      setConfirmDialog({
                        type: 'danger',
                        title: 'Reject Release Request',
                        message: `Reject release request ${selectedRefund.id}? The institution will receive formal notification.`,
                        action: () => handleDecision('Rejected'),
                      })
                    }
                    className="btn-danger text-xs flex-1 justify-center py-2"
                  >
                    Reject Request
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <ConfirmationDialog
          isOpen={Boolean(confirmDialog)}
          onClose={() => setConfirmDialog(null)}
          onConfirm={confirmDialog.action}
          title={confirmDialog.title}
          message={confirmDialog.message}
          type={confirmDialog.type}
          confirmText="Confirm Decision"
        />
      )}
    </div>
  );
}
