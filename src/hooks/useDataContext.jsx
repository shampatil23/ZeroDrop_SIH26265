import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as demo from '../data/demoData';
import { initializeStore, getStore, updateStore } from '../services/dataService';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialData = {
      fdrRecords: demo.fdrRecords,
      institutions: demo.institutions,
      verificationDocuments: demo.verificationDocuments,
      approvalRequests: demo.approvalRequests,
      renewalRecords: demo.renewalRecords,
      refundRequests: demo.refundRequests,
      auditEvents: demo.auditEvents,
      notifications: demo.notifications,
      currentUser: demo.currentUser,
    };
    const stored = initializeStore(initialData);
    setData(stored);
    setLoading(false);
  }, []);

  const refresh = useCallback(() => {
    setData({ ...getStore() });
  }, []);

  const update = useCallback((key, value) => {
    updateStore(key, value);
    refresh();
  }, [refresh]);

  const resetData = useCallback(() => {
    localStorage.removeItem('zerodrop_data');
    const initialData = {
      fdrRecords: demo.fdrRecords,
      institutions: demo.institutions,
      verificationDocuments: demo.verificationDocuments,
      approvalRequests: demo.approvalRequests,
      renewalRecords: demo.renewalRecords,
      refundRequests: demo.refundRequests,
      auditEvents: demo.auditEvents,
      notifications: demo.notifications,
      currentUser: demo.currentUser,
    };
    initializeStore(initialData);
    setData(initialData);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg-secondary">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-text-secondary text-sm">Loading Zero Drop...</p>
        </div>
      </div>
    );
  }

  return (
    <DataContext.Provider value={{ data, refresh, update, resetData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
