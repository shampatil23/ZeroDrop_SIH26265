import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import { formatINR, formatDate, getDaysUntil } from '../../data/demoData';

export default function MaturityTimeline({ renewals = [] }) {
  const navigate = useNavigate();
  const [filterDays, setFilterDays] = useState(30);

  // Filter renewals according to daysRemaining
  const filtered = renewals
    .filter((r) => {
      if (filterDays === 30) return r.daysRemaining <= 30;
      if (filterDays === 60) return r.daysRemaining <= 60;
      return r.daysRemaining <= 90;
    })
    .sort((a, b) => a.daysRemaining - b.daysRemaining);

  const getUrgencyBadge = (days) => {
    if (days < 0) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-critical bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
          <AlertCircle size={11} /> Overdue by {Math.abs(days)}d
        </span>
      );
    }
    if (days <= 7) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-critical bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
          <Clock size={11} /> Due in {days}d (Urgent)
        </span>
      );
    }
    if (days <= 30) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
          <Clock size={11} /> Due in {days}d
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-text-secondary bg-bg-secondary px-2 py-0.5 rounded-full">
        <Calendar size={11} /> In {days}d
      </span>
    );
  };

  return (
    <div className="card h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border/60 gap-2">
        <div>
          <h3 className="text-sm font-semibold text-text-main">Maturity Timeline</h3>
          <p className="text-xs text-text-secondary mt-0.5">Upcoming security deposit maturities</p>
        </div>
        <div className="flex items-center gap-1 bg-bg-secondary p-0.5 rounded-xl self-start sm:self-auto">
          {[30, 60, 90].map((d) => (
            <button
              key={d}
              onClick={() => setFilterDays(d)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                filterDays === d
                  ? 'bg-white text-emerald-primary shadow-xs font-semibold'
                  : 'text-text-secondary hover:text-text-main'
              }`}
            >
              {d} Days
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 mt-3 max-h-[300px] pr-1">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-text-secondary">
            No instruments maturing within {filterDays} days.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate('/renewals')}
              className="group p-3 rounded-xl border border-border hover:border-emerald-primary/40 bg-white hover:bg-emerald-50/20 transition-all duration-150 cursor-pointer flex items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-text-main">{item.fdrId}</span>
                  <span className="text-[11px] text-text-secondary truncate">{item.bank}</span>
                </div>
                <div className="text-xs text-text-secondary truncate mt-0.5">
                  {item.institutionName}
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-text-secondary">
                  <span>Maturity: <strong className="text-text-main font-medium">{formatDate(item.maturityDate)}</strong></span>
                  <span>Amount: <strong className="text-emerald-primary font-semibold tabular-nums">{formatINR(item.amount)}</strong></span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0">
                {getUrgencyBadge(item.daysRemaining)}
                <span className="text-xs text-emerald-primary font-medium flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  Review <ChevronRight size={13} />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pt-3 border-t border-border/60 mt-auto flex items-center justify-between text-xs">
        <span className="text-text-secondary">Showing {filtered.length} priority instruments</span>
        <button
          onClick={() => navigate('/renewals')}
          className="text-emerald-primary hover:text-emerald-hover font-medium flex items-center gap-1"
        >
          View all in Renewals <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
