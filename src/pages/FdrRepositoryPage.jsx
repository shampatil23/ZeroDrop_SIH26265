import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Plus,
  Download,
  Filter,
  ArrowUpDown,
  MoreVertical,
  ExternalLink,
  Edit,
  FileText,
  RefreshCw,
  Undo2,
  Calendar,
  Building,
  CheckCircle2,
  AlertTriangle,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useData } from '../hooks/useDataContext';
import { formatINR, formatDate, banks } from '../data/demoData';
import { reportService, fdrService } from '../services/dataService';
import { animatePageEntrance } from '../animations/gsapConfig';
import Badge from '../components/ui/Badge';
import Drawer from '../components/ui/Drawer';
import EmptyState from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

export default function FdrRepositoryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data, refresh } = useData();
  const pageRef = useRef(null);

  const fdrs = data?.fdrRecords || [];
  const institutions = data?.institutions || [];

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [bankFilter, setBankFilter] = useState('All');
  const [institutionFilter, setInstitutionFilter] = useState('All');
  const [sortBy, setSortBy] = useState('maturityDate'); // 'maturityDate' | 'issueDate' | 'amount'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Selected record for details drawer
  const [selectedFdr, setSelectedFdr] = useState(null);

  useEffect(() => {
    animatePageEntrance(pageRef);
    const idFromParam = searchParams.get('id');
    if (idFromParam) {
      const match = fdrs.find((f) => f.id === idFromParam);
      if (match) setSelectedFdr(match);
    }
  }, [searchParams, fdrs]);

  // Filtered and sorted data
  const filteredFdrs = useMemo(() => {
    return fdrs
      .filter((item) => {
        const matchesQuery =
          searchQuery === '' ||
          item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.bank.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
        const matchesBank = bankFilter === 'All' || item.bank === bankFilter;
        const matchesInst = institutionFilter === 'All' || item.institutionId === institutionFilter;

        return matchesQuery && matchesStatus && matchesBank && matchesInst;
      })
      .sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];
        if (sortBy === 'amount') {
          valA = a.principalAmount;
          valB = b.principalAmount;
        }
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [fdrs, searchQuery, statusFilter, bankFilter, institutionFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredFdrs.length / rowsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredFdrs.slice(start, start + rowsPerPage);
  }, [filteredFdrs, currentPage, rowsPerPage]);

  const handleExportCSV = () => {
    const exportData = filteredFdrs.map((f) => ({
      'FDR Number': f.id,
      Institution: f.institutionName,
      Bank: f.bank,
      Branch: f.branch,
      'Principal Amount (INR)': f.principalAmount,
      'Interest Rate (%)': f.interestRate,
      'Issue Date': f.issueDate,
      'Maturity Date': f.maturityDate,
      Status: f.status,
      Verification: f.verificationStatus,
    }));
    reportService.exportCSV(exportData, `AICTE_FDR_Repository_${new Date().toISOString().split('T')[0]}.csv`);
    toast.success('FDR repository exported to CSV');
  };

  const getVerificationBadge = (status) => {
    switch (status) {
      case 'Verified':
        return <Badge variant="success">Verified</Badge>;
      case 'Pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'Discrepancy':
        return <Badge variant="danger">Discrepancy</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const getLifecycleBadge = (status) => {
    switch (status) {
      case 'Active':
        return <Badge variant="success">Active</Badge>;
      case 'Expired':
        return <Badge variant="danger">Expired</Badge>;
      case 'Released':
        return <Badge variant="neutral">Released</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div ref={pageRef} className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-main">FDR Repository</h1>
          <p className="text-xs text-text-secondary mt-1">
            Centralized registry of institutional security deposits, bank lien receipts, and active instruments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleExportCSV} className="btn-secondary text-xs">
            <Download size={15} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => navigate('/fdr-repository/new')}
            className="btn-primary text-xs"
          >
            <Plus size={15} />
            <span>Add New FDR</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="card space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/60" size={16} />
            <input
              type="text"
              placeholder="Search by FDR reference, institution name or bank..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
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

          {/* Lifecycle Filter */}
          <div className="w-full md:w-44">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="select-field text-xs"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Released">Released</option>
            </select>
          </div>

          {/* Bank Filter */}
          <div className="w-full md:w-52">
            <select
              value={bankFilter}
              onChange={(e) => {
                setBankFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="select-field text-xs"
            >
              <option value="All">All Issuing Banks</option>
              {banks.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="w-full md:w-48">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-');
                setSortBy(sb);
                setSortOrder(so);
              }}
              className="select-field text-xs"
            >
              <option value="maturityDate-asc">Maturity: Soonest first</option>
              <option value="maturityDate-desc">Maturity: Furthest first</option>
              <option value="amount-desc">Amount: High to Low</option>
              <option value="amount-asc">Amount: Low to High</option>
              <option value="issueDate-desc">Issue Date: Newest first</option>
            </select>
          </div>
        </div>

        {/* Applied filters summary */}
        <div className="flex items-center justify-between pt-2 text-xs text-text-secondary border-t border-border/50">
          <span>
            Showing <strong className="text-text-main font-semibold">{filteredFdrs.length}</strong> matching records
          </span>
          {(statusFilter !== 'All' || bankFilter !== 'All' || searchQuery !== '') && (
            <button
              onClick={() => {
                setStatusFilter('All');
                setBankFilter('All');
                setSearchQuery('');
              }}
              className="text-emerald-primary hover:text-emerald-hover font-medium flex items-center gap-1"
            >
              <X size={12} /> Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="card p-0 overflow-hidden">
        {filteredFdrs.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No FDR records found"
              description="No instruments match your selected search criteria. Try modifying your filters or add a new FDR."
              action={
                <button
                  onClick={() => navigate('/fdr-repository/new')}
                  className="btn-primary text-xs"
                >
                  <Plus size={14} /> Add New FDR
                </button>
              }
            />
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>FDR Number</th>
                    <th>Institution</th>
                    <th>Issuing Bank & Branch</th>
                    <th>Principal Amount</th>
                    <th>Interest Rate</th>
                    <th>Issue Date</th>
                    <th>Maturity Date</th>
                    <th>Verification</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((fdr) => (
                    <tr
                      key={fdr.id}
                      onClick={() => setSelectedFdr(fdr)}
                      className="hover:bg-emerald-50/20"
                    >
                      <td className="font-semibold text-xs text-text-main">{fdr.id}</td>
                      <td>
                        <div className="font-medium text-xs text-text-main truncate max-w-[200px]">
                          {fdr.institutionName}
                        </div>
                        <div className="text-[11px] text-text-secondary">{fdr.institutionId}</div>
                      </td>
                      <td>
                        <span className="text-xs text-text-main">{fdr.bank}</span>
                        <span className="block text-[11px] text-text-secondary truncate max-w-[150px]">
                          {fdr.branch}
                        </span>
                      </td>
                      <td className="font-semibold text-xs tabular-nums text-text-main">
                        {formatINR(fdr.principalAmount)}
                      </td>
                      <td className="text-xs tabular-nums text-text-secondary">
                        {fdr.interestRate ? `${fdr.interestRate}%` : '—'}
                      </td>
                      <td className="text-xs text-text-secondary tabular-nums">
                        {formatDate(fdr.issueDate)}
                      </td>
                      <td className="text-xs text-text-secondary tabular-nums">
                        {formatDate(fdr.maturityDate)}
                      </td>
                      <td>{getVerificationBadge(fdr.verificationStatus)}</td>
                      <td>{getLifecycleBadge(fdr.status)}</td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedFdr(fdr)}
                            className="p-1.5 rounded-lg text-text-secondary hover:text-emerald-primary hover:bg-emerald-pale/50 transition-colors"
                            title="View Full Details"
                          >
                            <FileText size={15} />
                          </button>
                          <button
                            onClick={() => navigate(`/fdr-repository/edit/${fdr.id}`)}
                            className="p-1.5 rounded-lg text-text-secondary hover:text-text-main hover:bg-bg-secondary transition-colors"
                            title="Edit Record"
                          >
                            <Edit size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-border gap-3 text-xs text-text-secondary">
              <div className="flex items-center gap-2">
                <span>Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-border rounded-lg px-2 py-1 bg-white outline-none"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
                <span className="ml-2">
                  Page <strong className="text-text-main">{currentPage}</strong> of{' '}
                  <strong className="text-text-main">{totalPages}</strong>
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn-secondary text-xs px-2.5 py-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={14} /> Previous
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="btn-secondary text-xs px-2.5 py-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* FDR Details Drawer */}
      <Drawer
        isOpen={!!selectedFdr}
        onClose={() => setSelectedFdr(null)}
        title={selectedFdr ? `Instrument Details: ${selectedFdr.id}` : 'FDR Details'}
        subtitle={selectedFdr?.institutionName}
        width="max-w-2xl"
      >
        {selectedFdr && (
          <div className="space-y-6">
            {/* Quick Status Bar */}
            <div className="p-4 rounded-xl bg-bg-secondary flex items-center justify-between">
              <div>
                <span className="text-[11px] text-text-secondary uppercase tracking-wider block">
                  Principal Amount
                </span>
                <span className="text-xl font-bold text-text-main tabular-nums">
                  {formatINR(selectedFdr.principalAmount)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {getLifecycleBadge(selectedFdr.status)}
                {getVerificationBadge(selectedFdr.verificationStatus)}
              </div>
            </div>

            {/* Institution Information */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-text-main uppercase tracking-wider border-b border-border pb-1">
                Institution Details
              </h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-text-secondary block">Institution Name</span>
                  <span className="font-medium text-text-main">{selectedFdr.institutionName}</span>
                </div>
                <div>
                  <span className="text-text-secondary block">AICTE Identifier</span>
                  <span className="font-medium text-text-main">{selectedFdr.institutionId}</span>
                </div>
              </div>
            </div>

            {/* Banking Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-text-main uppercase tracking-wider border-b border-border pb-1">
                Banking & Deposit Information
              </h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-text-secondary block">Issuing Bank</span>
                  <span className="font-medium text-text-main">{selectedFdr.bank}</span>
                </div>
                <div>
                  <span className="text-text-secondary block">Branch</span>
                  <span className="font-medium text-text-main">{selectedFdr.branch}</span>
                </div>
                <div>
                  <span className="text-text-secondary block">Interest Rate</span>
                  <span className="font-medium text-text-main">
                    {selectedFdr.interestRate ? `${selectedFdr.interestRate}% p.a.` : 'Not specified'}
                  </span>
                </div>
                <div>
                  <span className="text-text-secondary block">Lien Status</span>
                  <span className="font-medium text-emerald-primary">Marked to AICTE Chairman</span>
                </div>
                <div>
                  <span className="text-text-secondary block">Date of Issue</span>
                  <span className="font-medium text-text-main">{formatDate(selectedFdr.issueDate)}</span>
                </div>
                <div>
                  <span className="text-text-secondary block">Maturity Date</span>
                  <span className="font-medium text-text-main">{formatDate(selectedFdr.maturityDate)}</span>
                </div>
              </div>
            </div>

            {/* Linked Document & OCR */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-text-main uppercase tracking-wider border-b border-border pb-1">
                Supporting Verification Document
              </h4>
              <div className="p-3.5 rounded-xl border border-border bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-pale text-emerald-primary flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-text-main block">
                      FDR Certificate Document ({selectedFdr.documentId || 'DOC-REF'})
                    </span>
                    <span className="text-[11px] text-text-secondary">
                      Verified via AICTE Document Service
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/verification')}
                  className="btn-secondary text-xs px-3 py-1.5"
                >
                  Inspect in OCR <ExternalLink size={13} />
                </button>
              </div>
            </div>

            {/* Lifecycle Actions */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-semibold text-text-main uppercase tracking-wider border-b border-border pb-1">
                Workflow Actions
              </h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    navigate('/renewals');
                    setSelectedFdr(null);
                  }}
                  className="btn-secondary text-xs"
                >
                  <RefreshCw size={14} /> Start Renewal Workflow
                </button>
                <button
                  onClick={() => {
                    navigate('/refunds');
                    setSelectedFdr(null);
                  }}
                  className="btn-secondary text-xs"
                >
                  <Undo2 size={14} /> Initiate Release Request
                </button>
                <button
                  onClick={() => {
                    navigate(`/fdr-repository/edit/${selectedFdr.id}`);
                    setSelectedFdr(null);
                  }}
                  className="btn-primary text-xs"
                >
                  <Edit size={14} /> Edit FDR Record
                </button>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
