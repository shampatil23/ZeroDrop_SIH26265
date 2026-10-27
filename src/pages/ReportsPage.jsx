import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Download,
  Calendar,
  Filter,
  BarChart3,
  TrendingUp,
  Coins,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useData } from '../hooks/useDataContext';
import { formatINR } from '../data/demoData';
import { reportService } from '../services/dataService';
import { animatePageEntrance } from '../animations/gsapConfig';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const { data } = useData();
  const pageRef = useRef(null);

  const fdrs = data?.fdrRecords || [];
  const institutions = data?.institutions || [];
  const renewals = data?.renewalRecords || [];

  const [institutionFilter, setInstitutionFilter] = useState('All');
  const [selectedTimeframe, setSelectedTimeframe] = useState('2026-2027');

  useEffect(() => {
    animatePageEntrance(pageRef);
  }, []);

  // Filtered dataset
  const currentFdrs = useMemo(() => {
    if (institutionFilter === 'All') return fdrs;
    return fdrs.filter((f) => f.institutionId === institutionFilter);
  }, [fdrs, institutionFilter]);

  // Chart 1: Deposit Value by Institution (Top 6)
  const depositByInstData = useMemo(() => {
    const map = {};
    fdrs.forEach((f) => {
      const shortName = f.institutionName.split(' ')[0] + ' ' + (f.institutionName.split(' ')[1] || '');
      map[shortName] = (map[shortName] || 0) + f.principalAmount;
    });
    return Object.entries(map)
      .map(([name, amount]) => ({ name, amount: Math.round(amount / 100000) })) // In Lakhs
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6);
  }, [fdrs]);

  // Chart 2: Maturities by Month
  const maturitiesByMonthData = [
    { month: 'Oct 26', count: 3, amount: 26 },
    { month: 'Nov 26', count: 4, amount: 37.5 },
    { month: 'Dec 26', count: 2, amount: 24 },
    { month: 'Jan 27', count: 2, amount: 15 },
    { month: 'Feb 27', count: 1, amount: 10 },
    { month: 'Mar 27', count: 1, amount: 8 },
  ];

  // Chart 3: Verification Turnaround
  const verificationTurnaroundData = [
    { name: '1-2 Days', count: 8, fill: '#168568' },
    { name: '3-5 Days', count: 5, fill: '#116B53' },
    { name: '6-10 Days', count: 3, fill: '#E9A23B' },
    { name: '> 10 Days', count: 2, fill: '#D94848' },
  ];

  // Chart 4: FDR Count by Lifecycle
  const lifecycleData = useMemo(() => {
    const active = currentFdrs.filter((f) => f.status === 'Active').length;
    const expired = currentFdrs.filter((f) => f.status === 'Expired').length;
    const released = currentFdrs.filter((f) => f.status === 'Released').length;
    return [
      { name: 'Active Lien', count: active, fill: '#168568' },
      { name: 'Matured / Expired', count: expired, fill: '#D94848' },
      { name: 'Discharged / Released', count: released, fill: '#748078' },
    ];
  }, [currentFdrs]);

  const handleExportFullReport = () => {
    const report = currentFdrs.map((f) => ({
      FDR_ID: f.id,
      Institution: f.institutionName,
      Bank: f.bank,
      Branch: f.branch,
      Principal_INR: f.principalAmount,
      Interest_Rate: f.interestRate,
      Issue_Date: f.issueDate,
      Maturity_Date: f.maturityDate,
      Status: f.status,
      Verification: f.verificationStatus,
    }));
    reportService.exportCSV(report, `AICTE_Compliance_Audit_Report_${new Date().toISOString().split('T')[0]}.csv`);
    toast.success('Compliance audit analytics exported to CSV');
  };

  return (
    <div ref={pageRef} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-main">Reports & Regulatory Analytics</h1>
          <p className="text-xs text-text-secondary mt-1">
            Aggregated visual metrics for institutional deposit compliance, maturity distribution, and verification performance.
          </p>
        </div>

        <button onClick={handleExportFullReport} className="btn-primary text-xs self-start sm:self-auto">
          <Download size={15} />
          <span>Download Audit Report (CSV)</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <label className="block text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-1">
              Filter by Institution
            </label>
            <select
              value={institutionFilter}
              onChange={(e) => setInstitutionFilter(e.target.value)}
              className="select-field text-xs"
            >
              <option value="All">All Registered Institutions</option>
              {institutions.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-56">
            <label className="block text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-1">
              Regulatory Fiscal Cycle
            </label>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="select-field text-xs"
            >
              <option value="2026-2027">FY 2026-2027 (Current)</option>
              <option value="2025-2026">FY 2025-2026 (Previous)</option>
              <option value="All-Time">All-Time Cumulative</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Deposit Value by Institution (Lakhs) */}
        <div className="card space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <div>
              <h3 className="text-xs font-semibold text-text-main">Deposit Value by Institution</h3>
              <p className="text-[11px] text-text-secondary">Principal security held in Lakhs (₹)</p>
            </div>
            <span className="text-xs font-medium text-emerald-primary bg-emerald-pale px-2 py-0.5 rounded-full">
              Lien Holdings
            </span>
          </div>

          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={depositByInstData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(value) => [`₹${value} Lakhs`, 'Deposit Value']}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="amount" fill="#168568" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Maturities by Month */}
        <div className="card space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <div>
              <h3 className="text-xs font-semibold text-text-main">Maturities Forecast by Month</h3>
              <p className="text-[11px] text-text-secondary">Projected maturity volume & count</p>
            </div>
            <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              Upcoming Expirations
            </span>
          </div>

          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={maturitiesByMonthData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(val, name) => [name === 'amount' ? `₹${val} Lakhs` : val, name === 'amount' ? 'Value' : 'FDR Count']}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="amount" stroke="#168568" strokeWidth={2} name="Deposit (₹ Lakhs)" />
                <Line type="monotone" dataKey="count" stroke="#E9A23B" strokeWidth={2} name="Number of FDRs" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Verification Turnaround Time */}
        <div className="card space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <div>
              <h3 className="text-xs font-semibold text-text-main">Document Verification Turnaround</h3>
              <p className="text-[11px] text-text-secondary">Average time taken for OCR & compliance sign-off</p>
            </div>
          </div>

          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={verificationTurnaroundData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="count" name="Certificates Processed" radius={[4, 4, 0, 0]}>
                  {verificationTurnaroundData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Lifecycle Breakdown */}
        <div className="card space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <div>
              <h3 className="text-xs font-semibold text-text-main">FDR Instrument Distribution</h3>
              <p className="text-[11px] text-text-secondary">Current lifecycle category breakdown</p>
            </div>
          </div>

          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={lifecycleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {lifecycleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
