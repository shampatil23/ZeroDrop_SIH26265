import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, FileCheck, RefreshCw, ClipboardCheck, ChevronRight } from 'lucide-react';
import Badge from '../ui/Badge';

export default function PriorityActionPanel({
  renewalsOverdue = 0,
  docsAwaiting = 0,
  pendingApprovals = 0,
  discrepanciesCount = 0,
}) {
  const navigate = useNavigate();

  const items = [
    {
      title: 'Overdue & Urgent Renewals',
      count: renewalsOverdue,
      badgeVariant: renewalsOverdue > 0 ? 'danger' : 'neutral',
      description: 'FDRs matured or due within 7 days requiring replacement',
      icon: RefreshCw,
      route: '/renewals',
      actionLabel: 'Resolve renewals',
    },
    {
      title: 'Documents Awaiting Verification',
      count: docsAwaiting,
      badgeVariant: docsAwaiting > 0 ? 'warning' : 'neutral',
      description: 'Institutional certificates queued for compliance review',
      icon: FileCheck,
      route: '/verification',
      actionLabel: 'Open verification queue',
    },
    {
      title: 'Flagged Discrepancies',
      count: discrepanciesCount,
      badgeVariant: discrepanciesCount > 0 ? 'danger' : 'success',
      description: 'Amount or bank mismatches detected by OCR comparison',
      icon: AlertTriangle,
      route: '/verification',
      actionLabel: 'Inspect discrepancies',
    },
    {
      title: 'Pending Approval Decisions',
      count: pendingApprovals,
      badgeVariant: pendingApprovals > 0 ? 'info' : 'neutral',
      description: 'Officer recommendations waiting for authorized sign-off',
      icon: ClipboardCheck,
      route: '/approvals',
      actionLabel: 'Review approval queue',
    },
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div>
          <h3 className="text-sm font-semibold text-text-main">Priority Action Panel</h3>
          <p className="text-xs text-text-secondary mt-0.5">High-priority compliance and operational tasks</p>
        </div>
        <span className="text-xs text-emerald-primary bg-emerald-pale font-medium px-2.5 py-1 rounded-full">
          Live Prototype Status
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              onClick={() => navigate(item.route)}
              className="p-3.5 rounded-xl border border-border hover:border-emerald-primary/40 bg-bg-secondary/40 hover:bg-white transition-all duration-150 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center text-text-main group-hover:text-emerald-primary transition-colors">
                    <Icon size={16} />
                  </div>
                  <Badge variant={item.badgeVariant}>{item.count} items</Badge>
                </div>
                <h4 className="text-xs font-semibold text-text-main group-hover:text-emerald-primary transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-text-secondary mt-1 leading-normal line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-emerald-primary font-medium">
                <span>{item.actionLabel}</span>
                <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
