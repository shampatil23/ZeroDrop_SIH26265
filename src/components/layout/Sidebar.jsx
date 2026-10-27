import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderOpen,
  Building2,
  FileCheck,
  RefreshCw,
  ClipboardCheck,
  Undo2,
  BarChart3,
  ScrollText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Globe,
  X,
} from 'lucide-react';
import { gsap } from 'gsap';

const navItems = [
  { path: '/overview', label: 'Overview', icon: LayoutDashboard },
  { path: '/fdr-repository', label: 'FDR Repository', icon: FolderOpen },
  { path: '/institutions', label: 'Institutions', icon: Building2 },
  { path: '/verification', label: 'Document Verification', icon: FileCheck },
  { path: '/renewals', label: 'Renewals & Maturity', icon: RefreshCw },
  { path: '/approvals', label: 'Approval Queue', icon: ClipboardCheck },
  { path: '/refunds', label: 'Release & Refunds', icon: Undo2 },
  { path: '/reports', label: 'Reports & Analytics', icon: BarChart3 },
  { path: '/audit', label: 'Audit Trail', icon: ScrollText },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ expanded, setExpanded, isMobile, mobileOpen, setMobileOpen }) {
  const sidebarRef = useRef(null);
  const location = useLocation();

  // Animate sidebar width on desktop
  useEffect(() => {
    if (isMobile || !sidebarRef.current) return;
    gsap.to(sidebarRef.current, {
      width: expanded ? 260 : 72,
      duration: 0.35,
      ease: 'power2.out',
    });
  }, [expanded, isMobile]);

  // Mobile slide animation
  useEffect(() => {
    if (!isMobile || !sidebarRef.current) return;
    gsap.to(sidebarRef.current, {
      x: mobileOpen ? 0 : '-100%',
      duration: 0.35,
      ease: 'power2.out',
    });
  }, [mobileOpen, isMobile]);

  const handleNavClick = () => {
    if (isMobile) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 h-screen bg-white border-r border-border z-50
          flex flex-col overflow-hidden
          ${isMobile ? 'w-[260px]' : ''}
        `}
        style={isMobile ? { transform: 'translateX(-100%)' } : { width: expanded ? 260 : 72 }}
      >
        {/* Brand */}
        <Link
          to="/overview"
          className="flex items-center gap-3 px-4 h-16 border-b border-border shrink-0 hover:bg-bg-secondary/40 transition-colors"
        >
          <div className="w-9 h-9 bg-emerald-primary rounded-xl flex items-center justify-center shrink-0">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div
            className={`overflow-hidden transition-all duration-200 ${
              expanded || isMobile ? 'opacity-100 w-auto' : 'opacity-0 w-0'
            }`}
          >
            <div className="font-semibold text-sm text-text-main whitespace-nowrap">Zero Drop</div>
            <div className="text-[10px] text-text-secondary whitespace-nowrap">FDR Management System</div>
          </div>
          {isMobile && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setMobileOpen(false);
              }}
              className="ml-auto p-1 rounded-lg hover:bg-bg-secondary"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          )}
        </Link>

        {/* Link back to Public Landing & Docs */}
        <div className="px-2 pt-2 pb-1">
          <Link
            to="/"
            onClick={handleNavClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-primary bg-emerald-pale/60 hover:bg-emerald-pale transition-colors border border-emerald-primary/20 ${
              !expanded && !isMobile ? 'justify-center px-0' : ''
            }`}
            title="Return to Public Landing Page & Docs"
          >
            <Globe size={16} className="shrink-0" />
            <span
              className={`whitespace-nowrap overflow-hidden transition-all duration-200 ${
                expanded || isMobile ? 'opacity-100 w-auto' : 'opacity-0 w-0'
              }`}
            >
              Landing & Docs
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-2 overflow-y-auto overflow-x-hidden">
          <ul className="space-y-0.5 px-2">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path || (path !== '/overview' && location.pathname.startsWith(path));
              return (
                <li key={path} className="relative sidebar-item">
                  <NavLink
                    to={path}
                    onClick={handleNavClick}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                      transition-all duration-150 relative group
                      ${isActive
                        ? 'bg-emerald-pale text-emerald-primary font-semibold'
                        : 'text-text-secondary hover:bg-bg-secondary hover:text-text-main'
                      }
                    `}
                  >
                    <Icon size={18} className="shrink-0" />
                    <span
                      className={`whitespace-nowrap overflow-hidden transition-all duration-200 ${
                        expanded || isMobile ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                      }`}
                    >
                      {label}
                    </span>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-emerald-primary rounded-r-full" />
                    )}
                  </NavLink>
                  {/* Tooltip when collapsed */}
                  {!expanded && !isMobile && (
                    <div className="sidebar-tooltip">{label}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Collapse toggle (desktop only) */}
        {!isMobile && (
          <div className="border-t border-border p-2 shrink-0">
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-text-secondary hover:bg-bg-secondary transition-colors text-sm cursor-pointer"
              aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {expanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
              <span
                className={`overflow-hidden transition-all duration-200 ${
                  expanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                }`}
              >
                Collapse
              </span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
