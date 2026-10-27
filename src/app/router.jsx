import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import LandingPage from '../pages/LandingPage';
import DocumentationPage from '../pages/DocumentationPage';
import MobilePrototypePage from '../pages/MobilePrototypePage';
import DashboardPage from '../pages/DashboardPage';
import FdrRepositoryPage from '../pages/FdrRepositoryPage';
import FdrFormPage from '../pages/FdrFormPage';
import InstitutionsPage from '../pages/InstitutionsPage';
import VerificationPage from '../pages/VerificationPage';
import RenewalsPage from '../pages/RenewalsPage';
import ApprovalsPage from '../pages/ApprovalsPage';
import RefundsPage from '../pages/RefundsPage';
import ReportsPage from '../pages/ReportsPage';
import AuditTrailPage from '../pages/AuditTrailPage';
import SettingsPage from '../pages/SettingsPage';

export const router = createBrowserRouter([
  // Public High-Impact Landing Page (Matching Image 1)
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/landing',
    element: <LandingPage />,
  },

  // Dedicated Documentation Page (Matching Image 2)
  {
    path: '/docs',
    element: <DocumentationPage />,
  },

  // Dedicated Mobile App Prototype View (Virtual Hardware Bezel Sandbox)
  {
    path: '/mobile',
    element: <MobilePrototypePage />,
  },

  // Main Desktop Regulatory Management Application Shell
  {
    element: <AppShell />,
    children: [
      { path: '/overview', element: <DashboardPage /> },
      { path: '/fdr-repository', element: <FdrRepositoryPage /> },
      { path: '/fdr-repository/new', element: <FdrFormPage /> },
      { path: '/fdr-repository/edit/:id', element: <FdrFormPage /> },
      { path: '/institutions', element: <InstitutionsPage /> },
      { path: '/verification', element: <VerificationPage /> },
      { path: '/renewals', element: <RenewalsPage /> },
      { path: '/approvals', element: <ApprovalsPage /> },
      { path: '/refunds', element: <RefundsPage /> },
      { path: '/reports', element: <ReportsPage /> },
      { path: '/audit', element: <AuditTrailPage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  },
]);
