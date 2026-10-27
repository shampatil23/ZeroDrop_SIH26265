import React, { useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { animateCounter, addHoverLift } from '../../animations/gsapConfig';

export default function KpiCard({
  title,
  value,
  numericValue,
  prefix = '',
  suffix = '',
  formatter,
  icon: Icon,
  description,
  trend,
  trendPositive = true,
  onClick,
}) {
  const cardRef = useRef(null);
  const valRef = useRef(null);

  useEffect(() => {
    if (numericValue != null && valRef.current) {
      animateCounter(valRef.current, numericValue, { prefix, suffix, formatter });
    }
  }, [numericValue]);

  useEffect(() => {
    if (cardRef.current) {
      return addHoverLift(cardRef.current);
    }
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`kpi-card bg-white rounded-2xl border border-border p-5 transition-shadow duration-200 ${
        onClick ? 'cursor-pointer hover:border-emerald-primary/40' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">{title}</span>
        <div className="w-9 h-9 rounded-xl bg-emerald-pale text-emerald-primary flex items-center justify-center">
          <Icon size={18} />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <h3 ref={valRef} className="text-2xl font-bold text-text-main tabular-nums">
          {value || '0'}
        </h3>
        {trend && (
          <span
            className={`inline-flex items-center text-xs font-medium ${
              trendPositive ? 'text-emerald-primary' : 'text-amber-600'
            }`}
          >
            {trendPositive ? <TrendingUp size={13} className="mr-0.5" /> : <TrendingDown size={13} className="mr-0.5" />}
            {trend}
          </span>
        )}
      </div>

      <p className="mt-2 text-xs text-text-secondary leading-normal">{description}</p>
    </div>
  );
}
