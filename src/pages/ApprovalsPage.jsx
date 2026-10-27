import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ClipboardCheck,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  User,
  ShieldCheck,
  FileText,
  RotateCcw,
  KeyRound,
  Filter,
  Search,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useData } from '../hooks/useDataContext';
import { approvalService } from '../services/dataService';
import { formatINR, formatDate } from '../data/demoData';
import { animatePageEntrance } from '../animations/gsapConfig';
import Badge from '../components/ui/Badge';
import Drawer from '../components/ui/Drawer';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import toast from 'react-hot-toast';

export default function ApprovalsPage() {
  const { data, refresh } = useData();
  const pageRef = useRef(null);

  const approvalRequests = data?.approvalRequests || [];

  const [typeFilter, setTypeFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Dialog State
  const [confirmDialog, setConfirmDialog] = useState(null);

  useEffect(() => {
    animatePageEntrance(pageRef);
  }, []);

  const filteredRequests = useMemo(() => {
    return approvalRequests.filter((item) => {
      const matchesType = typeFilter === 'All' || item.type === typeFilter;
      const matchesPriority = priorityFilter === 'All' || item.priority === priorityFilter;
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesType && matchesPriority && matchesStatus;
    });
  }, [approvalRequests, typeFilter, priorityFilter, statusFilter]);

  const handleAction = (status, notes) => {
    if (!selectedRequest) return;
    approvalService.updateStatus(selectedRequest.id, status, notes);
    refresh();
    setConfirmDialog(null);
    setSelectedRequest(null);
    toast.success(`Request ${selectedRequest.id} marked as "${status}"`);
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'High':
        return <Badge variant="danger">High Priority</Badge>;
      case 'Medium':
        return <Badge variant="warning">Medium</Badge>;
      case 'Low':
        return <Badge variant="neutral">Low</Badge>;
      default:
        return <Badge variant="neutral">{p}</Badge>;
    }
  };

  const getStatusBadge = (s) => {
    switch (s) {
      case 'Approved':
        return <Badge variant="success">Approved</Badge>;
      case 'Rejected':
        return <Badge variant="danger">Rejected</Badge>;
      case 'Under Review':
        return <Badge variant="warning">Under Review</Badge>;
      case 'Pending':
        return <Badge variant="info">Pending Sign-off</Badge>;
      default:
        return <Badge variant="neutral">{s}</Badge>;
    }
  };

  return (
    <div ref={pageRef} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-main">Approval Queue</h1>
          <p className="text-xs text-text-secondary mt-1">
            Authorized sign-off workflow for FDR verification recommendations, renewals, and lien release requests.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-700 bg-amber-50 px-3 py-1 rounded-full font-medium border border-amber-200">
            FIDO2 / Digital Signature Mode (Demo Simulation)
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="w-full sm:w-56">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="select-field text-xs"
            >
              <option value="All">All Request Types</option>
              <option value="FDR Verification">FDR Verification</option>
              <option value="Renewal Approval">Renewal Approval</option>
              <option value="Release Request">Release Request</option>
              <option value="Resubmission">Resubmission</option>
            </select>
          </div>

          <div className="w-full sm:w-44">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="select-field text-xs"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="w-full sm:w-44">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select-field text-xs"
            >
              <option value="All">All Decisions</option>
              <option value="Pending">Pending Sign-off</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="sm:ml-auto text-xs text-text-secondary">
            Showing <strong className="text-text-main">{filteredRequests.length}</strong> items in queue
          </div>
        </div>
      </div>

      {/* Queue Table */}
      <div className="card p-0 overflow-hidden">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Request ID & Type</th>
                <th>Institution</th>
                <th>Amount</th>
                <th>Submission Date</th>
                <th>Reviewer</th>
                <th>Priority</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className="hover:bg-emerald-50/20"
                >
                  <td>
                    <div className="font-semibold text-xs text-text-main">{req.id}</div>
                    <div className="text-[11px] text-text-secondary">{req.type}</div>
                  </td>
                  <td>
                    <div className="font-medium text-xs text-text-main truncate max-w-[190px]">
                      {req.institutionName}
                    </div>
                    <div className="text-[11px] text-text-secondary">{req.fdrId}</div>
                  </td>
                  <td className="font-bold text-xs tabular-nums text-text-main">
                    {req.amount ? formatINR(req.amount) : '—'}
                  </td>
                  <td className="text-xs text-text-secondary tabular-nums">
                    {formatDate(req.submissionDate)}
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-xs text-text-main">
                      <User size={13} className="text-text-secondary" />
                      <span>{req.reviewer || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td>{getPriorityBadge(req.priority)}</td>
                  <td>{getStatusBadge(req.status)}</td>
                  <td className="text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRequest(req);
                      }}
                      className="p-1.5 rounded-lg text-text-secondary hover:text-emerald-primary hover:bg-emerald-pale/50 transition-colors"
                      title="Review Decision"
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

      {/* Approval Details Drawer */}
      <Drawer
        isOpen={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
        title={selectedRequest ? `Review Request: ${selectedRequest.id}` : 'Approval Review'}
        subtitle={selectedRequest?.type}
        width="max-w-xl"
      >
        {selectedRequest && (
          <div className="space-y-6 text-xs">
            {/* Status overview */}
            <div className="p-4 rounded-xl bg-bg-secondary flex items-center justify-between">
              <div>
                <span className="text-[11px] text-text-secondary block">Lien Deposit Value</span>
                <span className="text-xl font-bold text-text-main tabular-nums">
                  {selectedRequest.amount ? formatINR(selectedRequest.amount) : '—'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {getPriorityBadge(selectedRequest.priority)}
                {getStatusBadge(selectedRequest.status)}
              </div>
            </div>

            {/* Institution & Instrument Info */}
            <div className="space-y-2 border-b border-border pb-3">
              <h4 className="font-semibold text-text-main uppercase tracking-wider text-[11px]">
                Case Overview
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-text-secondary block">Institution:</span>
                  <span className="font-semibold text-text-main">{selectedRequest.institutionName}</span>
                </div>
                <div>
                  <span className="text-text-secondary block">Linked FDR:</span>
                  <span className="font-medium text-text-main">{selectedRequest.fdrId}</span>
                </div>
                <div>
                  <span className="text-text-secondary block">Date of Submission:</span>
                  <span className="font-medium text-text-main">{formatDate(selectedRequest.submissionDate)}</span>
                </div>
                <div>
                  <span className="text-text-secondary block">Assigned Reviewer:</span>
                  <span className="font-medium text-text-main">{selectedRequest.reviewer || 'Not assigned'}</span>
                </div>
              </div>
            </div>

            {/* Officer Observation */}
            <div className="space-y-2 border-b border-border pb-3">
              <h4 className="font-semibold text-text-main uppercase tracking-wider text-[11px]">
                Reviewer Observations & Notes
              </h4>
              <p className="text-text-secondary leading-relaxed bg-bg-secondary/50 p-3 rounded-xl border border-border">
                {selectedRequest.notes || 'No review notes provided.'}
              </p>
            </div>

            {/* Regulatory Notice */}
            <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200 flex items-start gap-2">
              <KeyRound className="text-amber-700 shrink-0 mt-0.5" size={16} />
              <div className="text-[11px] text-amber-800 leading-relaxed">
                <strong>Digital Signature Simulation:</strong> Approval registers a cryptographically simulated sign-off
                token in the audit trail. In a live system, this invokes DSC token or WebAuthn hardware-key verification.
              </div>
            </div>

            {/* Sign-off Actions */}
            <div className="space-y-3 pt-2">
              <h4 className="font-semibold text-text-main uppercase tracking-wider text-[11px]">
                Officer Decision
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() =>
                    setConfirmDialog({
                      type: 'success',
                      title: 'Approve Request',
                      message: `Authorize and approve ${selectedRequest.type} for ${selectedRequest.institutionName}?`,
                      action: () => handleAction('Approved', 'Approved by Competent Authority'),
                    })
                  }
                  className="btn-primary text-xs justify-center py-2"
                >
                  <CheckCircle size={14} /> Approve
                </button>

                <button
                  onClick={() =>
                    setConfirmDialog({
                      type: 'warning',
                      title: 'Request Changes',
                      message: `Send this request back to the reviewing officer with instructions to request revised documentation?`,
                      action: () => handleAction('Under Review', 'Changes requested by Competent Authority'),
                    })
                  }
                  className="btn-secondary text-xs justify-center py-2"
                >
                  <RotateCcw size={14} /> Request Changes
                </button>

                <button
                  onClick={() =>
                    setConfirmDialog({
                      type: 'danger',
                      title: 'Reject Request',
                      message: `Reject ${selectedRequest.type} for ${selectedRequest.institutionName}? The case will be marked rejected.`,
                      action: () => handleAction('Rejected', 'Rejected with regulatory justification'),
                    })
                  }
                  className="btn-danger text-xs justify-center py-2"
                >
                  <XCircle size={14} /> Reject
                </button>
              </div>
            </div>
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
