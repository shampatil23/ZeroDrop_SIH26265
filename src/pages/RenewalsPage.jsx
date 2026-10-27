import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RefreshCw,
  Clock,
  AlertCircle,
  Calendar,
  CheckCircle,
  Link2,
  Bell,
  MessageSquare,
  ChevronRight,
  Search,
  Filter,
  Check,
  History,
  ArrowRight,
} from 'lucide-react';
import { useData } from '../hooks/useDataContext';
import { renewalService, fdrService } from '../services/dataService';
import { formatINR, formatDate } from '../data/demoData';
import { animatePageEntrance } from '../animations/gsapConfig';
import Badge from '../components/ui/Badge';
import Drawer from '../components/ui/Drawer';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

export default function RenewalsPage() {
  const navigate = useNavigate();
  const { data, refresh } = useData();
  const pageRef = useRef(null);

  const renewals = data?.renewalRecords || [];
  const fdrs = data?.fdrRecords || [];

  const [activeTab, setActiveTab] = useState('table'); // 'table' | 'timeline'
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRenewal, setSelectedRenewal] = useState(null);

  // Link Replacement Modal
  const [isLinkingModalOpen, setIsLinkingModalOpen] = useState(false);
  const [replacementFdrId, setReplacementFdrId] = useState('');

  // Add Note Modal
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    animatePageEntrance(pageRef);
  }, []);

  // Summary counts
  const due7Days = renewals.filter((r) => r.daysRemaining >= 0 && r.daysRemaining <= 7).length;
  const due30Days = renewals.filter((r) => r.daysRemaining >= 0 && r.daysRemaining <= 30).length;
  const due90Days = renewals.filter((r) => r.daysRemaining >= 0 && r.daysRemaining <= 90).length;
  const overdueCount = renewals.filter((r) => r.daysRemaining < 0 || r.renewalStatus === 'Overdue').length;

  const filteredRenewals = useMemo(() => {
    return renewals.filter((r) => {
      const matchesSearch =
        searchQuery === '' ||
        r.fdrId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.bank.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Overdue' && (r.daysRemaining < 0 || r.renewalStatus === 'Overdue')) ||
        (statusFilter === 'Urgent' && r.daysRemaining >= 0 && r.daysRemaining <= 7) ||
        (statusFilter === 'Upcoming' && r.daysRemaining > 7 && r.daysRemaining <= 30) ||
        r.renewalStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [renewals, searchQuery, statusFilter]);

  const handleMarkInitiated = (id) => {
    renewalService.updateStatus(id, 'Initiated', {
      lastReminder: new Date().toISOString().split('T')[0],
      nextAction: 'Await replacement FDR submission',
    });
    refresh();
    toast.success('Renewal marked as Initiated');
  };

  const handleLinkReplacement = () => {
    if (!selectedRenewal || !replacementFdrId) return;
    renewalService.updateStatus(selectedRenewal.id, 'Completed', {
      replacementFdr: replacementFdrId,
      nextAction: 'Lien transferred to replacement FDR',
    });
    refresh();
    setIsLinkingModalOpen(false);
    setReplacementFdrId('');
    toast.success(`Replacement FDR ${replacementFdrId} linked successfully`);
  };

  const handleSaveNote = () => {
    if (!selectedRenewal || !noteText) return;
    const existing = selectedRenewal.notes || '';
    const updated = existing ? `${existing} | ${noteText}` : noteText;
    renewalService.updateStatus(selectedRenewal.id, selectedRenewal.renewalStatus, {
      notes: updated,
    });
    refresh();
    setIsNoteModalOpen(false);
    setNoteText('');
    toast.success('Note added to renewal record');
  };

  const getStatusBadge = (item) => {
    if (item.daysRemaining < 0 || item.renewalStatus === 'Overdue') {
      return <Badge variant="danger">Overdue</Badge>;
    }
    if (item.daysRemaining <= 7 || item.renewalStatus === 'Urgent') {
      return <Badge variant="danger">Urgent (≤7d)</Badge>;
    }
    if (item.daysRemaining <= 30) {
      return <Badge variant="warning">Upcoming (≤30d)</Badge>;
    }
    if (item.renewalStatus === 'Initiated') {
      return <Badge variant="info">Initiated</Badge>;
    }
    if (item.renewalStatus === 'Completed') {
      return <Badge variant="success">Completed</Badge>;
    }
    return <Badge variant="success">Healthy</Badge>;
  };

  return (
    <div ref={pageRef} className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-main">Renewals & Maturity Lifecycle</h1>
          <p className="text-xs text-text-secondary mt-1">
            Proactive lifecycle monitoring for upcoming fixed deposit maturities, automated notices, and replacement chains.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setStatusFilter('Urgent')}
          className="card cursor-pointer hover:border-red-300 transition-all border-l-4 border-l-red-critical"
        >
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">Due in 7 Days</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-red-critical tabular-nums">{due7Days}</span>
            <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full font-medium">Critical</span>
          </div>
          <p className="text-[11px] text-text-secondary mt-1">Immediate action required before maturity date</p>
        </div>

        <div
          onClick={() => setStatusFilter('Upcoming')}
          className="card cursor-pointer hover:border-amber-300 transition-all border-l-4 border-l-amber-500"
        >
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">Due in 30 Days</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-amber-700 tabular-nums">{due30Days}</span>
            <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium">Upcoming</span>
          </div>
          <p className="text-[11px] text-text-secondary mt-1">First & second renewal notices dispatched</p>
        </div>

        <div
          onClick={() => setStatusFilter('All')}
          className="card cursor-pointer hover:border-emerald-300 transition-all border-l-4 border-l-emerald-primary"
        >
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">Due in 90 Days</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-emerald-primary tabular-nums">{due90Days}</span>
            <span className="text-xs text-emerald-primary bg-emerald-pale px-2 py-0.5 rounded-full font-medium">Under Watch</span>
          </div>
          <p className="text-[11px] text-text-secondary mt-1">Scheduled for routine compliance tracking</p>
        </div>

        <div
          onClick={() => setStatusFilter('Overdue')}
          className="card cursor-pointer hover:border-red-400 transition-all border-l-4 border-l-red-600 bg-red-50/20"
        >
          <span className="text-xs font-semibold text-red-700 uppercase tracking-wider block">Overdue Renewals</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-red-critical tabular-nums">{overdueCount}</span>
            <span className="text-xs text-red-critical bg-red-100 px-2 py-0.5 rounded-full font-bold">Lien Risk</span>
          </div>
          <p className="text-[11px] text-text-secondary mt-1">Matured deposits without replacement receipt</p>
        </div>
      </div>

      {/* View Switcher & Search Bar */}
      <div className="card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/60" size={16} />
            <input
              type="text"
              placeholder="Search by FDR number, institution or bank..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-9 text-xs"
            />
          </div>

          {/* Filter */}
          <div className="w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select-field text-xs"
            >
              <option value="All">All Categories</option>
              <option value="Urgent">Urgent (≤7 Days)</option>
              <option value="Upcoming">Upcoming (≤30 Days)</option>
              <option value="Overdue">Overdue Renewals</option>
              <option value="Initiated">Initiated</option>
            </select>
          </div>

          {/* View Mode */}
          <div className="flex items-center gap-1 bg-bg-secondary p-0.5 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('table')}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'table'
                  ? 'bg-white text-emerald-primary shadow-xs font-semibold'
                  : 'text-text-secondary hover:text-text-main'
              }`}
            >
              Registry View
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'timeline'
                  ? 'bg-white text-emerald-primary shadow-xs font-semibold'
                  : 'text-text-secondary hover:text-text-main'
              }`}
            >
              Lineage Chain
            </button>
          </div>
        </div>
      </div>

      {/* View 1: Table View */}
      {activeTab === 'table' && (
        <div className="card p-0 overflow-hidden">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>FDR Reference</th>
                  <th>Institution</th>
                  <th>Bank & Branch</th>
                  <th>Deposit Amount</th>
                  <th>Maturity Date</th>
                  <th>Days Remaining</th>
                  <th>Status</th>
                  <th>Next Action</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRenewals.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedRenewal(item)}
                    className="hover:bg-emerald-50/20"
                  >
                    <td className="font-semibold text-xs text-text-main">{item.fdrId}</td>
                    <td>
                      <div className="font-medium text-xs text-text-main truncate max-w-[180px]">
                        {item.institutionName}
                      </div>
                      <div className="text-[11px] text-text-secondary">{item.assignedTo || 'Unassigned'}</div>
                    </td>
                    <td>
                      <span className="text-xs text-text-main">{item.bank}</span>
                    </td>
                    <td className="font-bold text-xs tabular-nums text-text-main">
                      {formatINR(item.amount)}
                    </td>
                    <td className="text-xs text-text-secondary tabular-nums">
                      {formatDate(item.maturityDate)}
                    </td>
                    <td className="text-xs font-semibold tabular-nums">
                      {item.daysRemaining < 0 ? (
                        <span className="text-red-critical">Overdue ({Math.abs(item.daysRemaining)}d)</span>
                      ) : item.daysRemaining <= 7 ? (
                        <span className="text-red-critical font-bold">{item.daysRemaining} days</span>
                      ) : item.daysRemaining <= 30 ? (
                        <span className="text-amber-700 font-semibold">{item.daysRemaining} days</span>
                      ) : (
                        <span className="text-text-secondary">{item.daysRemaining} days</span>
                      )}
                    </td>
                    <td>{getStatusBadge(item)}</td>
                    <td className="text-xs text-text-secondary truncate max-w-[150px]">
                      {item.nextAction || 'Monitor maturity'}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        {item.renewalStatus !== 'Initiated' && item.renewalStatus !== 'Completed' && (
                          <button
                            onClick={() => handleMarkInitiated(item.id)}
                            className="p-1.5 rounded-lg text-emerald-primary hover:bg-emerald-pale transition-colors text-xs font-medium flex items-center gap-1"
                            title="Mark Renewal Initiated"
                          >
                            <RefreshCw size={13} />
                            <span className="hidden xl:inline">Initiate</span>
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedRenewal(item)}
                          className="p-1.5 rounded-lg text-text-secondary hover:text-emerald-primary hover:bg-bg-secondary"
                          title="View Actions"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 2: Lineage Chain View */}
      {activeTab === 'timeline' && (
        <div className="card space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-text-main">FDR Instrument Replacement Lineage</h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Deterministic lineage chain tracking security deposit rollover from original deposit to replacement certificate.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {renewals.slice(0, 4).map((r, i) => (
              <div
                key={r.id}
                className="p-4 rounded-xl border border-border bg-bg-secondary/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Step 1: Original */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {i + 1}A
                  </div>
                  <div>
                    <span className="text-[11px] text-text-secondary uppercase tracking-wider block">
                      Original Instrument
                    </span>
                    <span className="font-semibold text-xs text-text-main block">{r.fdrId}</span>
                    <span className="text-[11px] text-text-secondary">
                      {r.bank} • {formatINR(r.amount)}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex items-center justify-center text-text-secondary/60">
                  <ArrowRight size={20} />
                </div>

                {/* Step 2: Renewal Status */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-pale text-emerald-primary flex items-center justify-center font-bold text-xs shrink-0">
                    {i + 1}B
                  </div>
                  <div>
                    <span className="text-[11px] text-text-secondary uppercase tracking-wider block">
                      Rollover State
                    </span>
                    <span className="font-semibold text-xs text-emerald-primary block">
                      {r.replacementFdr ? `Linked: ${r.replacementFdr}` : r.renewalStatus}
                    </span>
                    <span className="text-[11px] text-text-secondary">
                      Maturity: {formatDate(r.maturityDate)}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => {
                    setSelectedRenewal(r);
                    setIsLinkingModalOpen(true);
                  }}
                  className="btn-secondary text-xs self-start md:self-auto"
                >
                  <Link2 size={13} /> Link Replacement
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Renewal Details & Action Drawer */}
      <Drawer
        isOpen={Boolean(selectedRenewal && !isLinkingModalOpen && !isNoteModalOpen)}
        onClose={() => setSelectedRenewal(null)}
        title={selectedRenewal ? `Renewal Workflow: ${selectedRenewal.fdrId}` : 'Renewal Details'}
        subtitle={selectedRenewal?.institutionName}
        width="max-w-xl"
      >
        {selectedRenewal && (
          <div className="space-y-6 text-xs">
            {/* Quick Status */}
            <div className="p-4 rounded-xl bg-bg-secondary flex items-center justify-between">
              <div>
                <span className="text-[11px] text-text-secondary block">Days Until Maturity</span>
                <span className="text-xl font-bold text-text-main tabular-nums">
                  {selectedRenewal.daysRemaining < 0
                    ? `Overdue (${Math.abs(selectedRenewal.daysRemaining)} days)`
                    : `${selectedRenewal.daysRemaining} days`}
                </span>
              </div>
              <div>{getStatusBadge(selectedRenewal)}</div>
            </div>

            {/* Financial Details */}
            <div className="space-y-2 border-b border-border pb-3">
              <h4 className="font-semibold text-text-main uppercase tracking-wider text-[11px]">
                Instrument Overview
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-text-secondary block">Principal Deposit:</span>
                  <span className="font-semibold text-text-main">{formatINR(selectedRenewal.amount)}</span>
                </div>
                <div>
                  <span className="text-text-secondary block">Issuing Bank:</span>
                  <span className="font-medium text-text-main">{selectedRenewal.bank}</span>
                </div>
                <div>
                  <span className="text-text-secondary block">Date of Maturity:</span>
                  <span className="font-medium text-text-main">{formatDate(selectedRenewal.maturityDate)}</span>
                </div>
                <div>
                  <span className="text-text-secondary block">Assigned Officer:</span>
                  <span className="font-medium text-text-main">{selectedRenewal.assignedTo || 'Unassigned'}</span>
                </div>
              </div>
            </div>

            {/* Compliance Notes & Reminders */}
            <div className="space-y-2 border-b border-border pb-3">
              <h4 className="font-semibold text-text-main uppercase tracking-wider text-[11px]">
                Notes & Reminders History
              </h4>
              <p className="text-text-secondary leading-relaxed">
                {selectedRenewal.notes || 'No custom notes recorded yet.'}
              </p>
              {selectedRenewal.lastReminder && (
                <div className="text-[11px] text-text-secondary">
                  Last Reminder Sent: {formatDate(selectedRenewal.lastReminder)}
                </div>
              )}
            </div>

            {/* Interactive Actions */}
            <div className="space-y-3 pt-2">
              <h4 className="font-semibold text-text-main uppercase tracking-wider text-[11px]">
                Authorized Workflow Actions
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleMarkInitiated(selectedRenewal.id)}
                  className="btn-primary text-xs justify-center py-2"
                >
                  <RefreshCw size={13} /> Mark Initiated
                </button>
                <button
                  onClick={() => setIsLinkingModalOpen(true)}
                  className="btn-secondary text-xs justify-center py-2"
                >
                  <Link2 size={13} /> Link Replacement FDR
                </button>
                <button
                  onClick={() => setIsNoteModalOpen(true)}
                  className="btn-secondary text-xs justify-center py-2"
                >
                  <MessageSquare size={13} /> Add Follow-up Note
                </button>
                <button
                  onClick={() => {
                    renewalService.updateStatus(selectedRenewal.id, 'Completed', {
                      nextAction: 'Renewal closed and verified',
                    });
                    refresh();
                    setSelectedRenewal(null);
                    toast.success('Renewal marked as completed');
                  }}
                  className="btn-secondary text-xs text-emerald-primary hover:bg-emerald-pale justify-center py-2"
                >
                  <Check size={13} /> Mark Task Complete
                </button>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Link Replacement FDR Modal */}
      <Modal
        isOpen={isLinkingModalOpen}
        onClose={() => setIsLinkingModalOpen(false)}
        title="Link Replacement FDR"
        subtitle={`Connect replacement instrument for ${selectedRenewal?.fdrId}`}
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-text-secondary">
            Select or enter the newly issued FDR reference number that extends or replaces deposit lien{' '}
            <strong className="text-text-main font-semibold">{selectedRenewal?.fdrId}</strong>.
          </p>
          <div>
            <label className="block font-medium text-text-main mb-1">Replacement FDR Number</label>
            <input
              type="text"
              placeholder="e.g. FDR-2026-105"
              value={replacementFdrId}
              onChange={(e) => setReplacementFdrId(e.target.value.toUpperCase())}
              className="input-field text-xs uppercase"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsLinkingModalOpen(false)}
              className="btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleLinkReplacement}
              disabled={!replacementFdrId}
              className="btn-primary text-xs disabled:opacity-50"
            >
              Save Lineage Link
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Note Modal */}
      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        title="Add Follow-up Note"
        subtitle={`Record regulatory observation for ${selectedRenewal?.fdrId}`}
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-text-main mb-1">Follow-up Note / Officer Remarks</label>
            <textarea
              rows={3}
              placeholder="Enter details of conversation with bank branch or college administrator..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="input-field text-xs resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setIsNoteModalOpen(false)} className="btn-secondary text-xs">
              Cancel
            </button>
            <button onClick={handleSaveNote} disabled={!noteText} className="btn-primary text-xs disabled:opacity-50">
              Save Note
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
