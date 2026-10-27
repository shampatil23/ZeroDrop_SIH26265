import React from 'react';
import Modal from './Modal';
import { AlertTriangle, AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning', // 'warning' | 'danger' | 'info' | 'success'
  isSubmitting = false,
}) {
  const icons = {
    warning: <AlertTriangle className="text-amber-500" size={24} />,
    danger: <AlertCircle className="text-red-500" size={24} />,
    info: <Info className="text-blue-500" size={24} />,
    success: <CheckCircle className="text-emerald-primary" size={24} />,
  };

  const confirmBtnStyles = {
    warning: 'bg-amber-600 hover:bg-amber-700 text-white',
    danger: 'bg-red-critical hover:bg-red-700 text-white',
    info: 'bg-blue-600 hover:bg-blue-700 text-white',
    success: 'btn-primary',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex gap-4 items-start py-2">
        <div className="p-2.5 rounded-full bg-bg-secondary shrink-0">{icons[type]}</div>
        <div className="flex-1">
          <p className="text-sm text-text-secondary leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-border">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="btn-secondary text-xs px-3.5 py-2"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting}
          className={`px-4 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
            confirmBtnStyles[type] || 'btn-primary'
          }`}
        >
          {isSubmitting ? 'Processing...' : confirmText}
        </button>
      </div>
    </Modal>
  );
}
