import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ScrollText,
  Search,
  Filter,
  Shield,
  Clock,
  User,
  CheckCircle,
  AlertTriangle,
  FileText,
  RefreshCw,
  Undo2,
  ChevronRight,
  X,
  Lock,
} from 'lucide-react';
import { useData } from '../hooks/useDataContext';
import { formatDate } from '../data/demoData';
import { animatePageEntrance } from '../animations/gsapConfig';
import Badge from '../components/ui/Badge';
import Drawer from '../components/ui/Drawer';

export default function AuditTrailPage() {
  const { data } = useData();
  const pageRef = useRef(null);

  const auditEvents = data?.auditEvents || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState('All');
  const [outcomeFilter, setOutcomeFilter] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    animatePageEntrance(pageRef);
  }, []);

  const filteredEvents = useMemo(() => {
    return auditEvents.filter((ev) => {
      const matchesSearch =
        searchQuery === '' ||
        ev.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.entityRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.action.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesEntity = entityFilter === 'All' || ev.entityType === entityFilter;
      const matchesOutcome = outcomeFilter === 'All' || ev.outcome === outcomeFilter;

      return matchesSearch && matchesEntity && matchesOutcome;
    });
  }, [auditEvents, searchQuery, entityFilter, outcomeFilter]);

  const getOutcomeBadge = (outcome) => {
    switch (outcome) {
      case 'Success':
        return <Badge variant="success">Success</Badge>;
      case 'Warning':
        return <Badge variant="warning">Warning</Badge>;
      case 'In Progress':
        return <Badge variant="info">In Progress</Badge>;
      case 'Submitted':
        return <Badge variant="neutral">Submitted</Badge>;
      case 'Rejected':
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="neutral">{outcome}</Badge>;
    }
  };

  return (
    <div ref={pageRef} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-main">Audit Trail & Compliance Log</h1>
          <p className="text-xs text-text-secondary mt-1">
            Chronological, immutable ledger of all FDR registrations, document verifications, renewals, and release authorizations.
          </p>
        </div>
      </div>

      {/* Security Notice */}
      <div className="card bg-bg-secondary/70 border-border flex items-start gap-3">
        <Lock className="text-emerald-primary shrink-0 mt-0.5" size={18} />
        <div className="text-xs text-text-secondary leading-relaxed">
          <strong className="text-text-main font-semibold block">Regulatory Integrity Notice</strong>
          All system activities, automated OCR findings, and regulatory officer decisions are sequentially appended. In production,
          this layer is backed by write-once-read-many (WORM) storage with cryptographic hash chaining.
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/60" size={16} />
            <input
              type="text"
              placeholder="Search by action, user, entity reference, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-9 text-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-main"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="w-full sm:w-44">
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="select-field text-xs"
            >
              <option value="All">All Entity Types</option>
              <option value="FDR">FDR Instruments</option>
              <option value="Document">Documents / OCR</option>
              <option value="Renewal">Renewals</option>
              <option value="Refund">Release Requests</option>
              <option value="Approval">Approvals</option>
            </select>
          </div>

          <div className="w-full sm:w-44">
            <select
              value={outcomeFilter}
              onChange={(e) => setOutcomeFilter(e.target.value)}
              className="select-field text-xs"
            >
              <option value="All">All Outcomes</option>
              <option value="Success">Success</option>
              <option value="Warning">Warning</option>
              <option value="In Progress">In Progress</option>
              <option value="Submitted">Submitted</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 text-xs text-text-secondary border-t border-border/50">
          <span>
            Displaying <strong className="text-text-main font-semibold">{filteredEvents.length}</strong> logged events
          </span>
          {(entityFilter !== 'All' || outcomeFilter !== 'All' || searchQuery !== '') && (
            <button
              onClick={() => {
                setEntityFilter('All');
                setOutcomeFilter('All');
                setSearchQuery('');
              }}
              className="text-emerald-primary hover:text-emerald-hover font-medium flex items-center gap-1"
            >
              <X size={12} /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Main Audit Table */}
      <div className="card p-0 overflow-hidden">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Event ID & Timestamp</th>
                <th>User / Operator</th>
                <th>Role</th>
                <th>Action Performed</th>
                <th>Entity Target</th>
                <th>Outcome</th>
                <th>Details</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((ev) => (
                <tr
                  key={ev.id}
                  onClick={() => setSelectedEvent(ev)}
                  className="hover:bg-emerald-50/20"
                >
                  <td>
                    <span className="font-semibold text-xs text-text-main block">{ev.id}</span>
                    <span className="text-[11px] text-text-secondary tabular-nums">
                      {formatDate(ev.timestamp)} {ev.timestamp.split('T')[1]?.substring(0, 5) || ''}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-text-main">
                      <User size={13} className="text-text-secondary" />
                      <span>{ev.user}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-[11px] text-text-secondary bg-bg-secondary px-2 py-0.5 rounded-md">
                      {ev.role}
                    </span>
                  </td>
                  <td className="font-semibold text-xs text-text-main">{ev.action}</td>
                  <td>
                    <span className="text-xs font-mono text-emerald-primary">{ev.entityRef}</span>
                    <span className="block text-[10px] text-text-secondary uppercase">{ev.entityType}</span>
                  </td>
                  <td>{getOutcomeBadge(ev.outcome)}</td>
                  <td className="text-xs text-text-secondary max-w-[280px] truncate">{ev.details}</td>
                  <td className="text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(ev);
                      }}
                      className="p-1.5 rounded-lg text-text-secondary hover:text-emerald-primary hover:bg-emerald-pale/50 transition-colors"
                      title="Inspect Event"
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

      {/* Audit Detail Drawer */}
      <Drawer
        isOpen={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent ? `Event Record: ${selectedEvent.id}` : 'Audit Record'}
        subtitle={selectedEvent?.action}
        width="max-w-xl"
      >
        {selectedEvent && (
          <div className="space-y-6 text-xs">
            {/* Overview */}
            <div className="p-4 rounded-xl bg-bg-secondary flex items-center justify-between">
              <div>
                <span className="text-[11px] text-text-secondary block">Recorded Timestamp</span>
                <span className="text-sm font-bold text-text-main tabular-nums">
                  {formatDate(selectedEvent.timestamp)} at{' '}
                  {selectedEvent.timestamp.split('T')[1]?.substring(0, 8) || '00:00:00'} IST
                </span>
              </div>
              <div>{getOutcomeBadge(selectedEvent.outcome)}</div>
            </div>

            {/* Operator details */}
            <div className="space-y-2 border-b border-border pb-3">
              <h4 className="font-semibold text-text-main uppercase tracking-wider text-[11px]">
                Operator Attribution
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-text-secondary block">User Name:</span>
                  <span className="font-semibold text-text-main">{selectedEvent.user}</span>
                </div>
                <div>
                  <span className="text-text-secondary block">Assigned Role:</span>
                  <span className="font-medium text-text-main">{selectedEvent.role}</span>
                </div>
                <div>
                  <span className="text-text-secondary block">Entity Type:</span>
                  <span className="font-medium text-text-main">{selectedEvent.entityType}</span>
                </div>
                <div>
                  <span className="text-text-secondary block">Entity Reference ID:</span>
                  <span className="font-mono text-emerald-primary font-bold">{selectedEvent.entityRef}</span>
                </div>
              </div>
            </div>

            {/* Full Details */}
            <div className="space-y-2 border-b border-border pb-3">
              <h4 className="font-semibold text-text-main uppercase tracking-wider text-[11px]">
                Event Payload & Description
              </h4>
              <p className="p-3 rounded-xl bg-bg-secondary/70 border border-border leading-relaxed text-text-main font-mono text-[11px]">
                {selectedEvent.details}
              </p>
            </div>

            {/* Before / After Diff (if available) */}
            {(selectedEvent.before || selectedEvent.after) && (
              <div className="space-y-2">
                <h4 className="font-semibold text-text-main uppercase tracking-wider text-[11px]">
                  Before & After Snapshot
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-red-50/50 border border-red-200">
                    <span className="text-[10px] font-bold text-red-critical uppercase block mb-1">Before</span>
                    <pre className="text-[10px] font-mono text-red-900 whitespace-pre-wrap">
                      {JSON.stringify(selectedEvent.before || {}, null, 2)}
                    </pre>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200">
                    <span className="text-[10px] font-bold text-emerald-primary uppercase block mb-1">After</span>
                    <pre className="text-[10px] font-mono text-emerald-900 whitespace-pre-wrap">
                      {JSON.stringify(selectedEvent.after || {}, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
