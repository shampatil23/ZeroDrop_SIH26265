# Zero Drop — AICTE Security Deposit & FDR Management Portal

**Smart India Hackathon 2026**  
**Problem Statement ID:** SIH26265  
**Problem Statement:** Streamline of Security Deposit / FDR Portal  
**Team Name:** Zero Drop  
**Theme:** Smart Automation  
**Target Users:** AICTE Regulatory Officials, Institutional Administrators, and Authorized System Administrators

---

## 1. Executive Summary

**Zero Drop** is an enterprise-grade financial regulatory web platform designed to digitize and centralize institutional security deposits, bank lien receipts, and Fixed Deposit Receipts (FDRs) across technical universities, engineering colleges, and polytechnics under the All India Council for Technical Education (AICTE).

The platform replaces fragmented spreadsheets, manual courier correspondence, and physical paper certificate tracking with a unified, automated digital operations workflow.

---

## 2. Key Architecture & Features

### 🖥️ Application Modules & Routes

1. **Overview Dashboard (`/`)**
   - KPI Cards: Total Security Deposits held under lien, Active Instruments, Pending Verifications, and Expiring within 30 days.
   - FDR Portfolio Donut Chart with breakdown by lifecycle stage.
   - Dynamic 30/60/90 Days Maturity Timeline with color-coded urgency alerts.
   - Priority Action Panel identifying high-risk renewals, awaiting OCR scans, and pending approvals.
   - Recent FDR Registry table with quick drawer inspection.

2. **FDR Repository (`/fdr-repository`)**
   - Centralized registry of all institutional fixed deposits.
   - Multi-criteria filtering by Lifecycle Status, Issuing Bank, and Institution.
   - Search across FDR reference, institution name, and branch.
   - Sorting by amount, maturity date, and issue date.
   - Pagination and adjustable rows per page.
   - Full CSV Export capability.
   - Interactive Detail Drawer with bank lien details, interest rates, and supporting document links.

3. **Add or Edit FDR (`/fdr-repository/new` & `/fdr-repository/edit/:id`)**
   - **Section A:** Institution Information (Auto-populated with discipline and authorized contact).
   - **Section B:** Financial Instrument (FDR reference, Scheduled Commercial Bank, Branch, Principal Amount in INR, Interest Rate, Issue Date, Maturity Date, Parent FDR reference for replacement chains).
   - **Section C:** Drag-and-drop document upload with format & size validation.
   - **Section D:** Regulatory compliance review, duplicate reference detection, and date order validation.

4. **Institution Management (`/institutions`)**
   - Directory of colleges, universities, and polytechnics with compliance statuses (`Compliant`, `Pending Review`, `Non-Compliant`).
   - Institution Profile Drawer with 3 tabs:
     - *Overview & Contact:* Regulatory dean contact, official email, phone, and total lien deposits.
     - *FDR Instruments:* List of active and expired deposits.
     - *Activity Log:* Institution-specific audit timeline.

5. **Document Verification Center (`/verification`)**
   - Dual-column interactive verification workspace.
   - Left: Certificate preview canvas with zoom controls (`70%` to `150%`), bank seal simulation, and download option.
   - Right: Automated OCR cross-verification comparing submitted form fields vs. certificate extracted values with field-by-field confidence metrics.
   - Simulated OCR scanner (`Run Demo OCR`) with simulated processing.
   - Reviewer decision actions: `Mark as Verified`, `Flag Discrepancy`, `Request Resubmission`, and `Reject with Reason`.

6. **Renewals & Maturity Lifecycle (`/renewals`)**
   - Summary cards for `Due in 7 Days (Critical)`, `Due in 30 Days (Upcoming)`, `Due in 90 Days (Under Watch)`, and `Overdue Renewals (Lien Risk)`.
   - Multi-view presentation:
     - *Registry View:* Detailed table with remaining days, renewal status, and next action.
     - *Lineage Chain View:* Rollover graph tracking original deposit → replacement certificate.
   - Interactive modals to link replacement FDRs and record follow-up notes.

7. **Approval Queue (`/approvals`)**
   - Maker-checker sign-off workflow for pending verifications, renewals, and release requests.
   - Priority tagging (`High`, `Medium`, `Low`).
   - Detail drawer with officer notes, case overview, and confirmed sign-off decisions (`Approve`, `Request Changes`, `Reject`).
   - Simulated FIDO2 / Digital Signature Certificate (DSC) token logging.

8. **Release & Refunds Management (`/refunds`)**
   - Formal workflow for discharging joint deposit lien and authorizing deposit refund.
   - Step-by-step 6-stage lifecycle progress tracker.
   - Supporting document audit checklist (Surrender Letter, No Dues Certificate, Original FDR Certificate).
   - Regulatory confirmation dialogs before authorization.

9. **Reports & Regulatory Analytics (`/reports`)**
   - Recharts visual dashboards:
     - Deposit Value by Institution (in ₹ Lakhs).
     - Maturities Forecast by Month.
     - Document Verification Turnaround Times.
     - FDR Lifecycle Distribution.
   - Dynamic filters by institution and fiscal cycle.
   - Downloadable CSV audit report.

10. **Audit Trail & Compliance Log (`/audit`)**
    - Chronologically ordered, append-only activity ledger.
    - Captures operator attribution, role, action, target entity, timestamp, and outcome.
    - Inspection drawer with before-and-after JSON snapshots of record modifications.

11. **System Settings (`/settings`)**
    - Role-based profile switching (`System Administrator`, `Approving Official`, `Verification Officer`, `Institution Administrator`).
    - Configurable automated maturity reminder thresholds (First Notice, Second Notice, Urgent Escalation).
    - RBAC permissions matrix display.
    - One-click demonstration dataset reset to restore initial SIH benchmark data.

---

## 3. Design System: Pure White + Emerald + Graphite

- **Primary Background:** `#FFFFFF`
- **Secondary Background:** `#F5F7F6`
- **Primary Emerald:** `#168568`
- **Emerald Hover:** `#116B53`
- **Pale Emerald Surface:** `#E8F5EF`
- **Main Text:** `#202824`
- **Secondary Text:** `#68736D`
- **Borders:** `#E2E8E4`
- **Warning Amber:** `#E9A23B`
- **Critical Red:** `#D94848`
- **Typography:** `Inter`, with tabular numerals (`font-variant-numeric: tabular-nums`) for currency and dates.
- **Micro-Animations:** Powered by GSAP 3 with subtle easing (`power2.out`, `power3.out`), KPI counter transitions, and responsive collapsible sidebar.

---

## 4. Local Development & Setup

### Prerequisites
- Node.js (version 18 or higher)
- npm (version 9 or higher)

### Installation
```bash
# Clone or navigate to the project directory
cd prototype

# Install dependencies
npm install

# Run the development server
npm run dev
```

The application will be live at: **`http://localhost:5173/`**

### Production Build
```bash
# Build production bundle
npm run build

# Preview production build
npm run preview
```

---

## 5. Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + Vite 8 |
| **Routing** | React Router v7 |
| **Styling** | Tailwind CSS v4 |
| **Animations** | GSAP 3 (Context, Timelines, Staggers) |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Forms & Validation** | React Hook Form + Zod |
| **Notifications** | React Hot Toast |
| **Storage & State** | LocalStorage with service abstraction layer |

---

## 6. Prototype Boundaries & Security Notice

1. **Frontend Prototype:** This build is a functional demonstration prototype. Document OCR extraction, FIDO2/WebAuthn hardware signatures, bank SFMS integrations, and duplicate detection are simulated in the frontend service layer.
2. **Production Roadmap:** In full deployment, this UI will communicate via REST APIs with a Django REST Framework backend, PostgreSQL database, AWS S3 / encrypted document storage, and Scheduled Commercial Bank Core Banking Systems (CBS) via SFMS / Open Banking protocols.
