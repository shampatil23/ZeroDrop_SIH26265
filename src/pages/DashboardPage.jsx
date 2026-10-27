import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Coins,
  FileCheck2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  MoreVertical,
} from 'lucide-react';
import { useData } from '../hooks/useDataContext';
import { formatINR, formatDate } from '../data/demoData';
import { animatePageEntrance, animateKpiCards } from '../animations/gsapConfig';
import KpiCard from '../components/dashboard/KpiCard';
import PortfolioChart from '../components/dashboard/PortfolioChart';
import MaturityTimeline from '../components/dashboard/MaturityTimeline';
import PriorityActionPanel from '../components/dashboard/PriorityActionPanel';
import Badge from '../components/ui/Badge';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data } = useData();
  const pageRef = useRef(null);
  const kpiContainerRef = useRef(null);

  const fdrs = data?.fdrRecords || [];
  const renewals = data?.renewalRecords || [];
  const verificationDocs = data?.verificationDocuments || [];
  const approvals = data?.approvalRequests || [];

  // Metrics computation from realistic demo records
  const totalDepositAmount = fdrs.reduce((acc, curr) => acc + (curr.principalAmount || 0), 0);
  const activeFdrsCount = fdrs.filter((f) => f.status === 'Active').length;
  const pendingVerificationCount = fdrs.filter(
    (f) => f.verificationStatus === 'Pending' || f.verificationStatus === 'Discrepancy'
  ).length;
  const expiringWithin30DaysCount = renewals.filter((r) => r.daysRemaining >= 0 && r.daysRemaining <= 30).length;

  const renewalsOverdue = renewals.filter((r) => r.daysRemaining < 0 || r.daysRemaining <= 7).length;
  const docsAwaiting = verificationDocs.filter((d) => d.status === 'Awaiting Review').length;
  const pendingApprovals = approvals.filter((a) => a.status === 'Pending').length;
  const discrepanciesCount = verificationDocs.filter((d) => d.status === 'Discrepancy').length;

  useEffect(() => {
    animatePageEntrance(pageRef);
    animateKpiCards(kpiContainerRef);
  }, []);

  const getVerificationBadge = (status) => {
    switch (status) {
      case 'Verified':
        return <Badge variant="success">Verified</Badge>;
      case 'Pending':
        return <Badge variant="warning">Pending Review</Badge>;
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
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-text-main">Good morning, Administrator</h1>
            <span className="text-[11px] bg-emerald-pale text-emerald-primary px-2.5 py-0.5 rounded-full font-medium border border-emerald-primary/20">
              Demo Portal
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Monitor institutional security deposits and FDR compliance from one place.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-medium text-text-main">28 Oct 2026</span>
            <span className="block text-[11px] text-text-secondary">Regulatory Fiscal Cycle Q3</span>
          </div>
          <button
            onClick={() => navigate('/fdr-repository/new')}
            className="btn-primary"
          >
            <Plus size={16} />
            <span>+ Add New FDR</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div ref={kpiContainerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Security Deposits"
          value={formatINR(totalDepositAmount)}
          numericValue={totalDepositAmount}
          formatter={(v) => formatINR(v)}
          icon={Coins}
          description="Cumulative value of all registered FDR instruments across institutions."
          trend="+8.4% YoY"
          trendPositive={true}
          onClick={() => navigate('/fdr-repository')}
        />

        <KpiCard
          title="Active FDRs"
          value={`${activeFdrsCount} Instruments`}
          numericValue={activeFdrsCount}
          suffix=" Instruments"
          icon={FileCheck2}
          description="Live deposits held in custodian banks under AICTE lien."
          trend={`${Math.round((activeFdrsCount / fdrs.length) * 100)}% of total`}
          trendPositive={true}
          onClick={() => navigate('/fdr-repository')}
        />

        <KpiCard
          title="Pending Verification"
          value={`${pendingVerificationCount} Submissions`}
          numericValue={pendingVerificationCount}
          suffix=" Submissions"
          icon={AlertTriangle}
          description="Certificates awaiting OCR verification or officer approval."
          trend={discrepanciesCount > 0 ? `${discrepanciesCount} discrepancies` : 'Normal pace'}
          trendPositive={discrepanciesCount === 0}
          onClick={() => navigate('/verification')}
        />

        <KpiCard
          title="Expiring Within 30 Days"
          value={`${expiringWithin30DaysCount} Instruments`}
          numericValue={expiringWithin30DaysCount}
          suffix=" Instruments"
          icon={Clock}
          description="Instruments requiring immediate renewal or replacement compliance."
          trend={renewalsOverdue > 0 ? `${renewalsOverdue} urgent/overdue` : 'On track'}
          trendPositive={renewalsOverdue === 0}
          onClick={() => navigate('/renewals')}
        />
      </div>

      {/* Priority Action Panel */}
      <PriorityActionPanel
        renewalsOverdue={renewalsOverdue}
        docsAwaiting={docsAwaiting}
        pendingApprovals={pendingApprovals}
        discrepanciesCount={discrepanciesCount}
      />

      {/* Two Column Layout: Donut Chart + Maturity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <PortfolioChart fdrs={fdrs} />
        </div>
        <div className="lg:col-span-7">
          <MaturityTimeline renewals={renewals} />
        </div>
      </div>

      {/* Recent FDR Records Table */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/60 gap-2">
          <div>
            <h3 className="text-sm font-semibold text-text-main">Recent FDR Records</h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Latest security deposit submissions and active liens
            </p>
          </div>
          <button
            onClick={() => navigate('/fdr-repository')}
            className="text-xs text-emerald-primary hover:text-emerald-hover font-semibold flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View Full Repository ({fdrs.length})</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="table-container mt-2">
          <table className="data-table">
            <thead>
              <tr>
                <th>FDR Reference</th>
                <th>Institution Name</th>
                <th>Issuing Bank</th>
                <th>Principal Amount</th>
                <th>Maturity Date</th>
                <th>Verification</th>
                <th>Lifecycle</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {fdrs.slice(0, 7).map((fdr) => (
                <tr
                  key={fdr.id}
                  onClick={() => navigate(`/fdr-repository?id=${fdr.id}`)}
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
                    <span className="block text-[11px] text-text-secondary">{fdr.branch}</span>
                  </td>
                  <td className="font-semibold text-xs tabular-nums text-text-main">
                    {formatINR(fdr.principalAmount)}
                  </td>
                  <td className="text-xs text-text-secondary tabular-nums">
                    {formatDate(fdr.maturityDate)}
                  </td>
                  <td>{getVerificationBadge(fdr.verificationStatus)}</td>
                  <td>{getLifecycleBadge(fdr.status)}</td>
                  <td className="text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/fdr-repository?id=${fdr.id}`);
                      }}
                      className="p-1.5 rounded-lg text-text-secondary hover:text-emerald-primary hover:bg-emerald-pale/50 transition-colors"
                      title="Inspect record"
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
    </div>
  );
}
