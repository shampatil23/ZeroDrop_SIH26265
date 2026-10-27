import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
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
} from 'lucide-react';
import { useData } from '../../hooks/useDataContext';
import { notificationService } from '../../services/dataService';
import { formatDate } from '../../data/demoData';

const routeLabels = {
  '/': 'Overview',
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
  const breadcrumbs = [{ label: 'Home', path: '/' }];
  let currentPath = '';
  pathParts.forEach((part) => {
    currentPath += `/${part}`;
    const label = routeLabels[currentPath] || part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
    breadcrumbs.push({ label, path: currentPath });
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
    <header
      className="sticky top-0 z-30 bg-white border-b border-border h-16 flex items-center px-4 lg:px-6 gap-4"
    >
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
      <nav className="hidden md:flex items-center gap-1 text-sm text-text-secondary" aria-label="Breadcrumb">
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={crumb.path}>
            {i > 0 && <ChevronRight size={14} className="text-text-secondary/40" />}
            {i === breadcrumbs.length - 1 ? (
              <span className="text-text-main font-medium">{crumb.label}</span>
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

      {/* Search */}
      <div className="hidden sm:flex items-center gap-2 bg-bg-secondary rounded-xl px-3 py-2 w-60 lg:w-72">
        <Search size={16} className="text-text-secondary/60 shrink-0" />
        <input
          type="text"
          placeholder="Search FDRs, institutions..."
          className="bg-transparent text-sm text-text-main placeholder:text-text-secondary/50 outline-none w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-text-secondary/60 hover:text-text-main">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Help */}
      <button
        className="p-2 rounded-xl hover:bg-bg-secondary transition-colors text-text-secondary"
        aria-label="Help"
        title="Help & Documentation"
      >
        <HelpCircle size={18} />
      </button>

      {/* Notifications */}
      <div className="relative" ref={notifRef}>
        <button
          onClick={() => {
            setShowNotifications(!showNotifications);
            setShowProfile(false);
          }}
          className="p-2 rounded-xl hover:bg-bg-secondary transition-colors text-text-secondary relative"
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
              <span className="text-sm font-semibold text-text-main">Notifications</span>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} className="text-xs text-emerald-primary hover:text-emerald-hover font-medium">
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-text-secondary">No notifications</div>
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
                        <div className="text-sm font-medium text-text-main">{n.title}</div>
                        <div className="text-xs text-text-secondary mt-0.5 line-clamp-2">{n.message}</div>
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
          className="flex items-center gap-2 pl-3 pr-1 py-1 rounded-xl hover:bg-bg-secondary transition-colors"
        >
          <div className="hidden sm:block text-right">
            <div className="text-sm font-medium text-text-main leading-tight">{user.name}</div>
            <div className="text-[11px] text-text-secondary leading-tight">{user.role}</div>
          </div>
          <div className="w-8 h-8 bg-emerald-pale text-emerald-primary rounded-full flex items-center justify-center">
            <User size={16} />
          </div>
        </button>

        {showProfile && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-border shadow-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <div className="text-sm font-medium text-text-main">{user.name}</div>
              <div className="text-xs text-text-secondary">{user.email}</div>
            </div>
            <div className="py-1">
              <Link
                to="/settings"
                onClick={() => setShowProfile(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-bg-secondary hover:text-text-main transition-colors"
              >
                <Settings size={16} />
                Settings
              </Link>
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-bg-secondary hover:text-text-main transition-colors w-full text-left">
                <LogOut size={16} />
                Sign Out (Demo)
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
