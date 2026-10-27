import React, { useState, useRef, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Key,
  Database,
  Palette,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { useData } from '../hooks/useDataContext';
import { animatePageEntrance } from '../animations/gsapConfig';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { data, resetData, refresh } = useData();
  const pageRef = useRef(null);

  const currentUser = data?.currentUser || {
    name: 'Admin User',
    role: 'System Administrator',
    email: 'admin@aicte-zerodrop.gov.in',
  };

  const [activeSection, setActiveSection] = useState('profile');
  const [userName, setUserName] = useState(currentUser.name);
  const [userEmail, setUserEmail] = useState(currentUser.email);
  const [selectedRole, setSelectedRole] = useState(currentUser.role);

  // Reminder settings
  const [reminderFirst, setReminderFirst] = useState('60');
  const [reminderSecond, setReminderSecond] = useState('30');
  const [reminderUrgent, setReminderUrgent] = useState('7');

  // Notification toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [discrepancyAlerts, setDiscrepancyAlerts] = useState(true);

  // Reset dialog
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  useEffect(() => {
    animatePageEntrance(pageRef);
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    toast.success('Profile settings updated (Demo Session)');
  };

  const handleSaveReminders = (e) => {
    e.preventDefault();
    toast.success('Maturity reminder thresholds configured');
  };

  const handleConfirmReset = () => {
    resetData();
    setIsResetDialogOpen(false);
    toast.success('Demonstration dataset reset to initial state');
  };

  const sections = [
    { id: 'profile', label: 'User Profile & Role', icon: User },
    { id: 'reminders', label: 'Renewal Reminders', icon: Bell },
    { id: 'roles', label: 'RBAC Permissions Matrix', icon: Shield },
    { id: 'security', label: 'Security & Integrity', icon: Key },
    { id: 'database', label: 'Prototype Data Management', icon: Database },
  ];

  return (
    <div ref={pageRef} className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-text-main">System Settings & Configuration</h1>
        <p className="text-xs text-text-secondary mt-1">
          Manage regulatory portal preferences, officer roles, automated maturity notice intervals, and prototype data.
        </p>
      </div>

      {/* Main Grid: Settings Navigation (left) + Settings Content (right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <div className="md:col-span-4 space-y-1">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-emerald-pale text-emerald-primary shadow-xs'
                    : 'text-text-secondary hover:bg-bg-secondary hover:text-text-main'
                }`}
              >
                <Icon size={16} />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Settings Content Area */}
        <div className="md:col-span-8">
          {/* SECTION 1: Profile */}
          {activeSection === 'profile' && (
            <div className="card space-y-5">
              <div className="border-b border-border/60 pb-3">
                <h3 className="text-sm font-semibold text-text-main">User Profile & Active Role</h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Simulate different operator roles to test user-specific views across the portal.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-text-main mb-1">Full Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-text-main mb-1">Official Email Address</label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-text-main mb-1">Active Demonstrated Role</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="select-field text-xs"
                  >
                    <option value="System Administrator">System Administrator (Full Access)</option>
                    <option value="Approving Official">Approving Official (Authorized Sign-off)</option>
                    <option value="Verification Officer">Verification Officer (Document Review)</option>
                    <option value="Institution Administrator">Institution Administrator (College Rep)</option>
                  </select>
                  <span className="text-[11px] text-text-secondary mt-1 block">
                    Note: Frontend role switcher is for prototype demonstration of role-based views.
                  </span>
                </div>

                <div className="pt-2">
                  <button type="submit" className="btn-primary text-xs">
                    Save Profile Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SECTION 2: Reminders */}
          {activeSection === 'reminders' && (
            <div className="card space-y-5">
              <div className="border-b border-border/60 pb-3">
                <h3 className="text-sm font-semibold text-text-main">Automated Maturity Notice Thresholds</h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Configure proactive reminder intervals before Fixed Deposit Receipt maturity.
                </p>
              </div>

              <form onSubmit={handleSaveReminders} className="space-y-4 text-xs">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-text-main mb-1">First Reminder</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={reminderFirst}
                        onChange={(e) => setReminderFirst(e.target.value)}
                        className="input-field text-xs pr-12"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary text-[11px]">
                        Days
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-text-main mb-1">Second Notice</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={reminderSecond}
                        onChange={(e) => setReminderSecond(e.target.value)}
                        className="input-field text-xs pr-12"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary text-[11px]">
                        Days
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-text-main mb-1">Urgent Escalation</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={reminderUrgent}
                        onChange={(e) => setReminderUrgent(e.target.value)}
                        className="input-field text-xs pr-12"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary text-[11px]">
                        Days
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-border/60">
                  <h4 className="font-semibold text-text-main text-xs">Notification Channels</h4>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                      className="rounded text-emerald-primary focus:ring-emerald-primary"
                    />
                    <span>Dispatch automated email notices to institution principal & finance dean</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={discrepancyAlerts}
                      onChange={(e) => setDiscrepancyAlerts(e.target.checked)}
                      className="rounded text-emerald-primary focus:ring-emerald-primary"
                    />
                    <span>Real-time alert notification upon OCR discrepancy detection</span>
                  </label>
                </div>

                <div className="pt-2">
                  <button type="submit" className="btn-primary text-xs">
                    Update Thresholds
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SECTION 3: RBAC Matrix */}
          {activeSection === 'roles' && (
            <div className="card space-y-4">
              <div className="border-b border-border/60 pb-3">
                <h3 className="text-sm font-semibold text-text-main">Role-Based Access Control (RBAC) Matrix</h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Pre-configured permission mapping for AICTE regulatory officers and institutional representatives.
                </p>
              </div>

              <div className="table-container text-xs">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left text-[11px] text-text-secondary uppercase">
                      <th className="py-2">Permission</th>
                      <th className="py-2 text-center">Institution Admin</th>
                      <th className="py-2 text-center">Verification Officer</th>
                      <th className="py-2 text-center">Approving Official</th>
                      <th className="py-2 text-center">Sys Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-xs">
                    <tr>
                      <td className="py-2.5 font-medium">Register New FDR</td>
                      <td className="text-center text-emerald-primary">✓</td>
                      <td className="text-center text-emerald-primary">✓</td>
                      <td className="text-center text-text-secondary">—</td>
                      <td className="text-center text-emerald-primary">✓</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium">Run OCR Verification</td>
                      <td className="text-center text-text-secondary">—</td>
                      <td className="text-center text-emerald-primary">✓</td>
                      <td className="text-center text-emerald-primary">✓</td>
                      <td className="text-center text-emerald-primary">✓</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium">Flag Discrepancies</td>
                      <td className="text-center text-text-secondary">—</td>
                      <td className="text-center text-emerald-primary">✓</td>
                      <td className="text-center text-emerald-primary">✓</td>
                      <td className="text-center text-emerald-primary">✓</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium">Sign-off Approvals</td>
                      <td className="text-center text-text-secondary">—</td>
                      <td className="text-center text-text-secondary">—</td>
                      <td className="text-center text-emerald-primary">✓</td>
                      <td className="text-center text-emerald-primary">✓</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium">Discharge Lien / Refund</td>
                      <td className="text-center text-text-secondary">—</td>
                      <td className="text-center text-text-secondary">—</td>
                      <td className="text-center text-emerald-primary">✓</td>
                      <td className="text-center text-emerald-primary">✓</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium">Inspect Audit Ledger</td>
                      <td className="text-center text-text-secondary">—</td>
                      <td className="text-center text-emerald-primary">✓</td>
                      <td className="text-center text-emerald-primary">✓</td>
                      <td className="text-center text-emerald-primary">✓</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 4: Security */}
          {activeSection === 'security' && (
            <div className="card space-y-4">
              <div className="border-b border-border/60 pb-3">
                <h3 className="text-sm font-semibold text-text-main">Architecture & Security Boundaries</h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Overview of technical guarantees, backend service mapping, and prototype limitations.
                </p>
              </div>

              <div className="space-y-3 text-xs text-text-secondary leading-relaxed">
                <div className="p-3.5 rounded-xl bg-bg-secondary border border-border">
                  <h4 className="font-semibold text-text-main text-xs mb-1">Target Production Architecture</h4>
                  <p>
                    In full deployment, Zero Drop integrates with a hardened <strong>Django REST Framework</strong> backend
                    with PostgreSQL database, private AWS S3 / encrypted blob storage for certificates, and Indian banking
                    Open Banking / SFMS APIs for electronic lien verification.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-bg-secondary border border-border">
                  <h4 className="font-semibold text-text-main text-xs mb-1">FIDO2 / Hardware Token Integration</h4>
                  <p>
                    Privileged operations such as Security Deposit Lien Release and High-Value Renewal Sign-off will mandate
                    FIDO2 WebAuthn authentication or Class 3 Digital Signature Certificate (DSC) USB tokens.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: Prototype Data Management */}
          {activeSection === 'database' && (
            <div className="card space-y-4">
              <div className="border-b border-border/60 pb-3">
                <h3 className="text-sm font-semibold text-text-main">Prototype Demonstration Data</h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Manage browser LocalStorage persistence and restore deterministic demo records.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <p className="text-text-secondary">
                  During demonstration, any added FDRs, verified documents, or approved requests are saved in your browser's
                  LocalStorage. You can revert to the pristine demonstration baseline at any time.
                </p>

                <div className="p-4 rounded-xl border border-red-200 bg-red-50/40 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-bold text-red-critical block">Reset Demo Database</span>
                    <span className="text-[11px] text-text-secondary">
                      Clears local storage modifications and restores original SIH prototype sample records.
                    </span>
                  </div>
                  <button
                    onClick={() => setIsResetDialogOpen(true)}
                    className="btn-danger text-xs px-3.5 py-2 shrink-0"
                  >
                    <RotateCcw size={14} /> Reset Data
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog for Reset */}
      <ConfirmationDialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        onConfirm={handleConfirmReset}
        title="Reset Demo Dataset"
        message="Are you sure you want to revert all changes? This will restore the demo dataset to its initial state."
        type="danger"
        confirmText="Yes, Reset Data"
      />
    </div>
  );
}
