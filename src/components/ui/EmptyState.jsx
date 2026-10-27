import React from 'react';
import { FolderSearch } from 'lucide-react';

export default function EmptyState({
  title = 'No records found',
  description = 'Try adjusting your search query or filter parameters to find what you are looking for.',
  action,
  icon: Icon = FolderSearch,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-border my-4">
      <div className="w-12 h-12 rounded-2xl bg-bg-secondary flex items-center justify-center text-text-secondary/60 mb-3">
        <Icon size={24} />
      </div>
      <h4 className="text-sm font-semibold text-text-main">{title}</h4>
      <p className="text-xs text-text-secondary max-w-sm mt-1">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
