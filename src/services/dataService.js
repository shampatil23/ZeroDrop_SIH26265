// ============================================================
// Service Abstractions — Mock Implementations
// In production, these would call a Django REST Framework API.
// ============================================================

const STORAGE_KEY = 'zerodrop_data';

function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load from localStorage:', e);
  }
  return null;
}

function saveStore(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

// Initialize store from demo data if empty
export function initializeStore(demoData) {
  const existing = loadStore();
  if (!existing) {
    saveStore(demoData);
    return demoData;
  }
  return existing;
}

export function getStore() {
  return loadStore() || {};
}

export function updateStore(key, value) {
  const store = getStore();
  store[key] = value;
  saveStore(store);
  return store;
}

// ---- FDR Service ----
export const fdrService = {
  getAll() {
    return getStore().fdrRecords || [];
  },
  getById(id) {
    return this.getAll().find((f) => f.id === id) || null;
  },
  create(record) {
    const records = this.getAll();
    records.push(record);
    updateStore('fdrRecords', records);
    auditService.log({
      action: 'FDR Created',
      entityType: 'FDR',
      entityRef: record.id,
      outcome: 'Success',
      details: `New FDR record created for ${record.institutionName}.`,
    });
    return record;
  },
  update(id, updates) {
    const records = this.getAll();
    const idx = records.findIndex((f) => f.id === id);
    if (idx === -1) return null;
    const before = { ...records[idx] };
    records[idx] = { ...records[idx], ...updates, updatedAt: new Date().toISOString().split('T')[0] };
    updateStore('fdrRecords', records);
    auditService.log({
      action: 'FDR Updated',
      entityType: 'FDR',
      entityRef: id,
      outcome: 'Success',
      details: `FDR record updated.`,
      before,
      after: records[idx],
    });
    return records[idx];
  },
  getByInstitution(institutionId) {
    return this.getAll().filter((f) => f.institutionId === institutionId);
  },
};

// ---- Institution Service ----
export const institutionService = {
  getAll() {
    return getStore().institutions || [];
  },
  getById(id) {
    return this.getAll().find((i) => i.id === id) || null;
  },
};

// ---- Document / Verification Service ----
export const verificationService = {
  getAll() {
    return getStore().verificationDocuments || [];
  },
  getById(id) {
    return this.getAll().find((d) => d.id === id) || null;
  },
  updateStatus(id, status, reviewer, fields = {}) {
    const docs = this.getAll();
    const idx = docs.findIndex((d) => d.id === id);
    if (idx === -1) return null;
    docs[idx] = {
      ...docs[idx],
      status,
      reviewer: reviewer || docs[idx].reviewer,
      reviewDate: new Date().toISOString().split('T')[0],
      ...fields,
    };
    updateStore('verificationDocuments', docs);
    auditService.log({
      action: status === 'Verified' ? 'Document Verified' : status === 'Discrepancy' ? 'Discrepancy Flagged' : `Document ${status}`,
      entityType: 'Document',
      entityRef: id,
      outcome: status === 'Verified' ? 'Success' : status === 'Discrepancy' ? 'Warning' : status,
      details: `Verification status set to "${status}" for document ${id}.`,
    });
    return docs[idx];
  },
  runDemoOcr(id) {
    const docs = this.getAll();
    const idx = docs.findIndex((d) => d.id === id);
    if (idx === -1) return null;
    const fdr = fdrService.getById(docs[idx].fdrId);
    if (!fdr) return null;
    // Simulated OCR extraction
    const extracted = {
      fdrNumber: fdr.id,
      institutionName: fdr.institutionName,
      bankName: fdr.bank,
      principalAmount: fdr.principalAmount,
      issueDate: fdr.issueDate,
      maturityDate: fdr.maturityDate,
    };
    const confidence = {
      fdrNumber: 95 + Math.floor(Math.random() * 5),
      institutionName: 90 + Math.floor(Math.random() * 8),
      bankName: 95 + Math.floor(Math.random() * 5),
      principalAmount: 92 + Math.floor(Math.random() * 7),
      issueDate: 93 + Math.floor(Math.random() * 6),
      maturityDate: 91 + Math.floor(Math.random() * 8),
    };
    docs[idx] = {
      ...docs[idx],
      ocrRun: true,
      extractedFields: extracted,
      confidence,
    };
    updateStore('verificationDocuments', docs);
    return docs[idx];
  },
};

// ---- Approval Service ----
export const approvalService = {
  getAll() {
    return getStore().approvalRequests || [];
  },
  getById(id) {
    return this.getAll().find((a) => a.id === id) || null;
  },
  updateStatus(id, status, notes) {
    const requests = this.getAll();
    const idx = requests.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    requests[idx] = { ...requests[idx], status, notes: notes || requests[idx].notes };
    updateStore('approvalRequests', requests);
    auditService.log({
      action: `Approval ${status}`,
      entityType: 'Approval',
      entityRef: id,
      outcome: status === 'Approved' ? 'Success' : status === 'Rejected' ? 'Rejected' : status,
      details: `Approval request ${id} status changed to "${status}".`,
    });
    return requests[idx];
  },
};

// ---- Renewal Service ----
export const renewalService = {
  getAll() {
    return getStore().renewalRecords || [];
  },
  getById(id) {
    return this.getAll().find((r) => r.id === id) || null;
  },
  updateStatus(id, status, fields = {}) {
    const records = this.getAll();
    const idx = records.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    records[idx] = { ...records[idx], renewalStatus: status, ...fields };
    updateStore('renewalRecords', records);
    auditService.log({
      action: 'Renewal Updated',
      entityType: 'Renewal',
      entityRef: id,
      outcome: 'Success',
      details: `Renewal ${id} status changed to "${status}".`,
    });
    return records[idx];
  },
};

// ---- Refund Service ----
export const refundService = {
  getAll() {
    return getStore().refundRequests || [];
  },
  getById(id) {
    return this.getAll().find((r) => r.id === id) || null;
  },
  updateStatus(id, status) {
    const requests = this.getAll();
    const idx = requests.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    requests[idx] = { ...requests[idx], status };
    updateStore('refundRequests', requests);
    auditService.log({
      action: `Release ${status}`,
      entityType: 'Refund',
      entityRef: id,
      outcome: status === 'Approved' ? 'Success' : status,
      details: `Release request ${id} status changed to "${status}".`,
    });
    return requests[idx];
  },
};

// ---- Audit Service ----
export const auditService = {
  getAll() {
    return getStore().auditEvents || [];
  },
  log(event) {
    const events = this.getAll();
    const newEvent = {
      id: `AUD-${String(events.length + 1).padStart(3, '0')}`,
      timestamp: new Date().toISOString(),
      user: 'Admin User',
      role: 'System Administrator',
      ...event,
    };
    events.unshift(newEvent);
    updateStore('auditEvents', events);
    return newEvent;
  },
};

// ---- Notification Service ----
export const notificationService = {
  getAll() {
    return getStore().notifications || [];
  },
  markRead(id) {
    const notifs = this.getAll();
    const idx = notifs.findIndex((n) => n.id === id);
    if (idx !== -1) {
      notifs[idx].read = true;
      updateStore('notifications', notifs);
    }
  },
  markAllRead() {
    const notifs = this.getAll().map((n) => ({ ...n, read: true }));
    updateStore('notifications', notifs);
  },
};

// ---- Report Service ----
export const reportService = {
  getPortfolioSummary() {
    const fdrs = fdrService.getAll();
    const active = fdrs.filter((f) => f.status === 'Active').length;
    const pending = fdrs.filter((f) => f.verificationStatus === 'Pending').length;
    const expired = fdrs.filter((f) => f.status === 'Expired').length;
    const released = fdrs.filter((f) => f.status === 'Released').length;
    const totalDeposit = fdrs.reduce((sum, f) => sum + f.principalAmount, 0);
    return { active, pending, expired, released, total: fdrs.length, totalDeposit };
  },
  getExpiringWithin(days) {
    const fdrs = fdrService.getAll();
    const now = new Date('2026-10-28');
    return fdrs.filter((f) => {
      if (f.status !== 'Active') return false;
      const mat = new Date(f.maturityDate);
      const diff = Math.ceil((mat - now) / (1000 * 60 * 60 * 24));
      return diff >= 0 && diff <= days;
    });
  },
  exportCSV(data, filename) {
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map((row) =>
        headers.map((h) => {
          const val = row[h];
          if (typeof val === 'string' && val.includes(',')) return `"${val}"`;
          return val ?? '';
        }).join(',')
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'export.csv';
    a.click();
    URL.revokeObjectURL(url);
  },
};
