import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { animateDrawerEnter, animateDrawerExit } from '../../animations/gsapConfig';

export default function Drawer({ isOpen, onClose, title, subtitle, children, width = 'max-w-xl' }) {
  const backdropRef = useRef(null);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      animateDrawerEnter(backdropRef, drawerRef);
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') handleClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const handleClose = () => {
    animateDrawerExit(backdropRef, drawerRef, onClose);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Container */}
      <div
        ref={drawerRef}
        className={`relative bg-white border-l border-border shadow-2xl h-full w-full ${width} z-10 flex flex-col overflow-hidden`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-white">
          <div>
            <h3 className="text-base font-semibold text-text-main">{title}</h3>
            {subtitle && <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-text-secondary hover:bg-bg-secondary hover:text-text-main transition-colors"
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
