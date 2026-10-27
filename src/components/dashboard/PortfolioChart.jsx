import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatINR } from '../../data/demoData';

const COLORS = {
  Active: '#168568',
  Pending: '#E9A23B',
  Expired: '#D94848',
  Released: '#748078',
};

export default function PortfolioChart({ fdrs = [] }) {
  // Aggregate lifecycle counts
  const activeCount = fdrs.filter((f) => f.status === 'Active' && f.verificationStatus === 'Verified').length;
  const pendingCount = fdrs.filter((f) => f.verificationStatus === 'Pending' || f.verificationStatus === 'Discrepancy').length;
  const expiredCount = fdrs.filter((f) => f.status === 'Expired').length;
  const releasedCount = fdrs.filter((f) => f.status === 'Released').length;
  const total = fdrs.length || 1;

  const data = [
    { name: 'Active', value: activeCount, color: COLORS.Active },
    { name: 'Pending Verification', value: pendingCount, color: COLORS.Pending },
    { name: 'Expired', value: expiredCount, color: COLORS.Expired },
    { name: 'Released', value: releasedCount, color: COLORS.Released },
  ].filter((d) => d.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const pct = ((item.value / total) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 rounded-xl border border-border shadow-lg text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-text-main">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.payload.color }} />
            {item.name}
          </div>
          <div className="mt-1 text-text-secondary">
            Count: <span className="font-semibold text-text-main">{item.value}</span> ({pct}%)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div>
          <h3 className="text-sm font-semibold text-text-main">FDR Portfolio Overview</h3>
          <p className="text-xs text-text-secondary mt-0.5">Distribution across deposit lifecycle stages</p>
        </div>
        <span className="text-xs text-text-secondary font-medium tabular-nums">
          Total: {total} records
        </span>
      </div>

      <div className="flex-1 min-h-[220px] flex items-center justify-center my-2">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              innerRadius={65}
              outerRadius={88}
              paddingAngle={3}
              dataKey="value"
              stroke="#fff"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend with counts and percentages */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/60">
        {data.map((item) => {
          const pct = ((item.value / total) * 100).toFixed(0);
          return (
            <div key={item.name} className="flex items-center justify-between p-2 rounded-xl bg-bg-secondary/60">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-text-secondary truncate max-w-[100px]">{item.name}</span>
              </div>
              <div className="text-xs font-semibold text-text-main tabular-nums">
                {item.value} <span className="text-text-secondary font-normal">({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
