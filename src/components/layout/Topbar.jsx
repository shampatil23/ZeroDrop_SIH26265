import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  HelpCircle,
  ChevronRight,
  Menu,
  User,
  LogOut,
  Settings,
  X,
  Check,
  Smartphone,
  BookOpen,
} from 'lucide-react';
import { useData } from '../../hooks/useDataContext';
import { notificationService } from '../../services/dataService';
import { formatDate } from '../../data/demoData';

const routeLabels = {
  '/overview': 'Overview Dashboard',
  '/fdr-repository': 'FDR Repository',
  '/fdr-repository/new': 'Add New FDR',
  '/institutions': 'Institutions',
  '/verification': 'Document Verification',
  '/renewals': 'Renewals & Maturity',
  '/approvals': 'Approval Queue',
  '/refunds': 'Release & Refunds',
  '/reports': 'Reports & Analytics',
  '/audit': 'Audit Trail',
  '/settings': 'Settings',
};

export default function Topbar({ onMenuClick, sidebarExpanded, isMobile }) {
  const { data, refresh } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const notifications = data?.notifications || [];
  const unreadCount = notifications.filter((n) => !n.read).length;
  const user = data?.currentUser || { name: 'Admin', role: 'Administrator' };

  // Build breadcrumbs
  const pathParts = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ label: 'Portal', path: '/overview' }];
  let currentPath = '';
  pathParts.forEach((part) => {
    currentPath += `/${part}`;
    if (currentPath !== '/overview') {
      const label = routeLabels[currentPath] || part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
      breadcrumbs.push({ label, path: currentPath });
    }
  });

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleMarkAllRead = () => {
    notificationService.markAllRead();
    refresh();
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'error': return '🔴';
      case 'success': return '✅';
      default: return 'ℹ️';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-border h-16 flex items-center px-4 lg:px-6 gap-3 sm:gap-4">
      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl hover:bg-bg-secondary transition-colors lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Breadcrumbs */}
      <nav className="hidden md:flex items-center gap-1 text-xs text-text-secondary" aria-label="Breadcrumb">
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={crumb.path}>
            {i > 0 && <ChevronRight size={13} className="text-text-secondary/40" />}
            {i === breadcrumbs.length - 1 ? (
              <span className="text-text-main font-semibold">{crumb.label}</span>
            ) : (
              <Link to={crumb.path} className="hover:text-text-main transition-colors">
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Quick Launch: Mobile Device Simulator & Docs */}
      <div className="hidden xl:flex items-center gap-2">
        <Link
          to="/#simulator"
          className="px-2.5 py-1.5 rounded-xl border border-border bg-bg-secondary/70 hover:bg-bg-secondary text-text-secondary hover:text-text-main text-xs font-medium flex items-center gap-1.5 transition-colors"
          title="Open Virtual Mobile Device Simulator"
        >
          <Smartphone size={13} className="text-emerald-primary" />
          <span>Device Simulator</span>
        </Link>
        <Link
          to="/#documentation"
          className="px-2.5 py-1.5 rounded-xl border border-border bg-bg-secondary/70 hover:bg-bg-secondary text-text-secondary hover:text-text-main text-xs font-medium flex items-center gap-1.5 transition-colors"
          title="Open Architecture & Regulatory Documentation"
        >
          <BookOpen size={13} className="text-emerald-primary" />
          <span>Documentation</span>
        </Link>
      </div>

      {/* Search */}
      <div className="hidden sm:flex items-center gap-2 bg-bg-secondary rounded-xl px-3 py-1.5 w-48 lg:w-64">
        <Search size={15} className="text-text-secondary/60 shrink-0" />
        <input
          type="text"
          placeholder="Search FDRs, institutions..."
          className="bg-transparent text-xs text-text-main placeholder:text-text-secondary/50 outline-none w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-text-secondary/60 hover:text-text-main">
            <X size={13} />
          </button>
        )}
      </div>

      {/* Help Link */}
      <Link
        to="/#documentation"
        className="p-2 rounded-xl hover:bg-bg-secondary transition-colors text-text-secondary"
        aria-label="Documentation"
        title="View Technical Documentation"
      >
        <HelpCircle size={18} />
      </Link>

      {/* Notifications */}
      <div className="relative" ref={notifRef}>
        <button
          onClick={() => {
            setShowNotifications(!showNotifications);
            setShowProfile(false);
          }}
          className="p-2 rounded-xl hover:bg-bg-secondary transition-colors text-text-secondary relative cursor-pointer"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-critical text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {showNotifications && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-border shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="text-xs font-bold text-text-main">Notifications</span>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} className="text-xs text-emerald-primary hover:text-emerald-hover font-medium cursor-pointer">
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-xs text-text-secondary">No notifications</div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-b border-border/50 last:border-0 hover:bg-bg-secondary/50 transition-colors cursor-pointer ${
                      !n.read ? 'bg-emerald-50/30' : ''
                    }`}
                    onClick={() => {
                      notificationService.markRead(n.id);
                      refresh();
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-sm mt-0.5">{getNotifIcon(n.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-text-main">{n.title}</div>
                        <div className="text-[11px] text-text-secondary mt-0.5 line-clamp-2">{n.message}</div>
                      </div>
                      {!n.read && (
                        <div className="w-2 h-2 bg-emerald-primary rounded-full mt-1.5 shrink-0" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => {
            setShowProfile(!showProfile);
            setShowNotifications(false);
          }}
          className="flex items-center gap-2 pl-2 sm:pl-3 pr-1 py-1 rounded-xl hover:bg-bg-secondary transition-colors cursor-pointer"
        >
          <div className="hidden sm:block text-right">
            <div className="text-xs font-semibold text-text-main leading-tight">{user.name}</div>
            <div className="text-[10px] text-text-secondary leading-tight">{user.role}</div>
          </div>
          <div className="w-8 h-8 bg-emerald-pale text-emerald-primary rounded-full flex items-center justify-center font-bold text-xs">
            <User size={15} />
          </div>
        </button>

        {showProfile && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-border shadow-lg overflow-hidden text-xs">
            <div className="px-4 py-3 border-b border-border">
              <div className="font-semibold text-text-main">{user.name}</div>
              <div className="text-[11px] text-text-secondary">{user.email}</div>
            </div>
            <div className="py-1">
              <Link
                to="/settings"
                onClick={() => setShowProfile(false)}
                className="flex items-center gap-2 px-4 py-2 text-text-secondary hover:bg-bg-secondary hover:text-text-main transition-colors"
              >
                <Settings size={15} />
                Settings
              </Link>
              <Link
                to="/"
                onClick={() => setShowProfile(false)}
                className="flex items-center gap-2 px-4 py-2 text-text-secondary hover:bg-bg-secondary hover:text-text-main transition-colors"
              >
                <BookOpen size={15} />
                Landing & Docs
              </Link>
              <button
                onClick={() => {
                  setShowProfile(false);
                  navigate('/');
                }}
                className="flex items-center gap-2 px-4 py-2 text-text-secondary hover:bg-bg-secondary hover:text-text-main transition-colors w-full text-left cursor-pointer"
              >
                <LogOut size={15} />
                Sign Out (Exit Portal)
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
