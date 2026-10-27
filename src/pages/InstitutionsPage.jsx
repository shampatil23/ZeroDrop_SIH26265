import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Coins,
  FileText,
  History,
  X,
  ChevronRight,
} from 'lucide-react';
import { useData } from '../hooks/useDataContext';
import { formatINR, formatDate } from '../data/demoData';
import { animatePageEntrance } from '../animations/gsapConfig';
import Badge from '../components/ui/Badge';
import Drawer from '../components/ui/Drawer';
import EmptyState from '../components/ui/EmptyState';

export default function InstitutionsPage() {
  const navigate = useNavigate();
  const { data } = useData();
  const pageRef = useRef(null);

  const institutions = data?.institutions || [];
  const fdrs = data?.fdrRecords || [];
  const auditEvents = data?.auditEvents || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [complianceFilter, setComplianceFilter] = useState('All');
  const [selectedInst, setSelectedInst] = useState(null);
  const [drawerTab, setDrawerTab] = useState('overview'); // 'overview' | 'fdrs' | 'activity'

  useEffect(() => {
    animatePageEntrance(pageRef);
  }, []);

  const types = useMemo(() => {
    const s = new Set(institutions.map((i) => i.type));
    return ['All', ...Array.from(s)];
  }, [institutions]);

  const filteredInstitutions = useMemo(() => {
    return institutions.filter((inst) => {
      const matchesSearch =
        searchQuery === '' ||
        inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.state.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === 'All' || inst.type === typeFilter;
      const matchesCompliance = complianceFilter === 'All' || inst.complianceStatus === complianceFilter;

      return matchesSearch && matchesType && matchesCompliance;
    });
  }, [institutions, searchQuery, typeFilter, complianceFilter]);

  const getComplianceBadge = (status) => {
    switch (status) {
      case 'Compliant':
        return <Badge variant="success">Compliant</Badge>;
      case 'Pending Review':
        return <Badge variant="warning">Pending Review</Badge>;
      case 'Non-Compliant':
        return <Badge variant="danger">Non-Compliant</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const getInstFdrs = (instId) => {
    return fdrs.filter((f) => f.institutionId === instId);
  };

  return (
    <div ref={pageRef} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-main">Institution Management</h1>
          <p className="text-xs text-text-secondary mt-1">
            Directory of approved colleges, technical universities, and polytechnics with active security deposit liens.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/60" size={16} />
            <input
              type="text"
              placeholder="Search by institution name, ID, city or state..."
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

          <div className="w-full md:w-48">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="select-field text-xs"
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t === 'All' ? 'All Disciplines' : t}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-48">
            <select
              value={complianceFilter}
              onChange={(e) => setComplianceFilter(e.target.value)}
              className="select-field text-xs"
            >
              <option value="All">All Compliance Statuses</option>
              <option value="Compliant">Compliant</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Non-Compliant">Non-Compliant</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 text-xs text-text-secondary border-t border-border/50">
          <span>
            Displaying <strong className="text-text-main font-semibold">{filteredInstitutions.length}</strong> institutions
          </span>
          {(typeFilter !== 'All' || complianceFilter !== 'All' || searchQuery !== '') && (
            <button
              onClick={() => {
                setTypeFilter('All');
                setComplianceFilter('All');
                setSearchQuery('');
              }}
              className="text-emerald-primary hover:text-emerald-hover font-medium flex items-center gap-1"
            >
              <X size={12} /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Institutions Table */}
      <div className="card p-0 overflow-hidden">
        {filteredInstitutions.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No institutions match your search"
              description="Try adjusting your filters or search keywords."
            />
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Institution Name & ID</th>
                  <th>Discipline</th>
                  <th>Location</th>
                  <th>Linked FDRs</th>
                  <th>Total Security Deposit</th>
                  <th>Compliance</th>
                  <th>Last Activity</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredInstitutions.map((inst) => {
                  const instFdrs = getInstFdrs(inst.id);
                  const totalDep = instFdrs.reduce((sum, f) => sum + f.principalAmount, 0);

                  return (
                    <tr
                      key={inst.id}
                      onClick={() => {
                        setSelectedInst(inst);
                        setDrawerTab('overview');
                      }}
                      className="hover:bg-emerald-50/20"
                    >
                      <td>
                        <div className="font-semibold text-xs text-text-main">{inst.name}</div>
                        <div className="text-[11px] text-text-secondary">{inst.id}</div>
                      </td>
                      <td>
                        <span className="text-xs text-text-secondary bg-bg-secondary px-2 py-0.5 rounded-md">
                          {inst.type}
                        </span>
                      </td>
                      <td>
                        <span className="text-xs text-text-main">{inst.city}</span>
                        <span className="block text-[11px] text-text-secondary">{inst.state}</span>
                      </td>
                      <td className="text-xs font-semibold tabular-nums text-text-main">
                        {instFdrs.length} Instruments
                      </td>
                      <td className="text-xs font-bold tabular-nums text-emerald-primary">
                        {formatINR(totalDep)}
                      </td>
                      <td>{getComplianceBadge(inst.complianceStatus)}</td>
                      <td className="text-xs text-text-secondary tabular-nums">
                        {formatDate(inst.lastActivity)}
                      </td>
                      <td className="text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedInst(inst);
                            setDrawerTab('overview');
                          }}
                          className="p-1.5 rounded-lg text-text-secondary hover:text-emerald-primary hover:bg-emerald-pale/50 transition-colors"
                          title="View Institution Profile"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Institution Detail Drawer */}
      <Drawer
        isOpen={!!selectedInst}
        onClose={() => setSelectedInst(null)}
        title={selectedInst ? selectedInst.name : 'Institution Profile'}
        subtitle={selectedInst ? `${selectedInst.id} • ${selectedInst.city}, ${selectedInst.state}` : ''}
        width="max-w-2xl"
      >
        {selectedInst && (
          <div className="space-y-6">
            {/* Drawer Tabs */}
            <div className="flex border-b border-border gap-4">
              <button
                onClick={() => setDrawerTab('overview')}
                className={`pb-2.5 text-xs font-semibold transition-colors border-b-2 cursor-pointer ${
                  drawerTab === 'overview'
                    ? 'border-emerald-primary text-emerald-primary'
                    : 'border-transparent text-text-secondary hover:text-text-main'
                }`}
              >
                Overview & Contact
              </button>
              <button
                onClick={() => setDrawerTab('fdrs')}
                className={`pb-2.5 text-xs font-semibold transition-colors border-b-2 cursor-pointer ${
                  drawerTab === 'fdrs'
                    ? 'border-emerald-primary text-emerald-primary'
                    : 'border-transparent text-text-secondary hover:text-text-main'
                }`}
              >
                FDR Instruments ({getInstFdrs(selectedInst.id).length})
              </button>
              <button
                onClick={() => setDrawerTab('activity')}
                className={`pb-2.5 text-xs font-semibold transition-colors border-b-2 cursor-pointer ${
                  drawerTab === 'activity'
                    ? 'border-emerald-primary text-emerald-primary'
                    : 'border-transparent text-text-secondary hover:text-text-main'
                }`}
              >
                Activity Log
              </button>
            </div>

            {/* TAB 1: Overview */}
            {drawerTab === 'overview' && (
              <div className="space-y-5">
                {/* Summary Card */}
                <div className="p-4 rounded-xl bg-bg-secondary grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] text-text-secondary uppercase tracking-wider block">
                      Total Lien Deposit
                    </span>
                    <span className="text-xl font-bold text-emerald-primary tabular-nums">
                      {formatINR(
                        getInstFdrs(selectedInst.id).reduce((sum, f) => sum + f.principalAmount, 0)
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-text-secondary uppercase tracking-wider block">
                      Compliance Status
                    </span>
                    <div className="mt-1">{getComplianceBadge(selectedInst.complianceStatus)}</div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-text-main uppercase tracking-wider border-b border-border pb-1">
                    Authorized Regulatory Contact
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-text-secondary w-28">Contact Person:</span>
                      <span className="font-semibold text-text-main">{selectedInst.contact}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-text-secondary w-28">Official Email:</span>
                      <a
                        href={`mailto:${selectedInst.contactEmail}`}
                        className="text-emerald-primary hover:underline font-medium"
                      >
                        {selectedInst.contactEmail}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-text-secondary w-28">Phone Number:</span>
                      <span className="text-text-main font-medium">{selectedInst.contactPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-text-secondary w-28">Discipline Type:</span>
                      <span className="text-text-main">{selectedInst.type}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      navigate(`/fdr-repository/new?instId=${selectedInst.id}`);
                      setSelectedInst(null);
                    }}
                    className="btn-primary text-xs w-full justify-center"
                  >
                    + Register New FDR for this Institution
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: Linked FDRs */}
            {drawerTab === 'fdrs' && (
              <div className="space-y-3">
                {getInstFdrs(selectedInst.id).map((fdr) => (
                  <div
                    key={fdr.id}
                    className="p-3.5 rounded-xl border border-border bg-white space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-text-main">{fdr.id}</span>
                      <span className="font-bold text-xs text-emerald-primary tabular-nums">
                        {formatINR(fdr.principalAmount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-text-secondary">
                      <span>{fdr.bank}</span>
                      <span>Matures: {formatDate(fdr.maturityDate)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-border/50 text-xs">
                      <Badge variant={fdr.status === 'Active' ? 'success' : 'danger'}>{fdr.status}</Badge>
                      <button
                        onClick={() => {
                          navigate(`/fdr-repository?id=${fdr.id}`);
                          setSelectedInst(null);
                        }}
                        className="text-emerald-primary hover:text-emerald-hover font-medium flex items-center gap-0.5"
                      >
                        Details <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: Activity History */}
            {drawerTab === 'activity' && (
              <div className="space-y-3">
                {auditEvents
                  .filter((a) => a.entityRef.includes(selectedInst.id) || a.details.includes(selectedInst.name))
                  .map((ev) => (
                    <div key={ev.id} className="p-3 rounded-xl border border-border bg-bg-secondary/40 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-text-main">{ev.action}</span>
                        <span className="text-[11px] text-text-secondary">{formatDate(ev.timestamp)}</span>
                      </div>
                      <p className="text-text-secondary">{ev.details}</p>
                      <div className="text-[11px] text-text-secondary/70">By {ev.user} ({ev.role})</div>
                    </div>
                  ))}
                {auditEvents.filter((a) => a.entityRef.includes(selectedInst.id) || a.details.includes(selectedInst.name)).length === 0 && (
                  <p className="text-xs text-text-secondary text-center py-6">
                    No recent audit events logged for this institution.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
