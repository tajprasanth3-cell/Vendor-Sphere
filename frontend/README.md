# VendorSphere — Enterprise Vendor & Procurement Management Platform

> Built to fulfill the enterprise software development challenge by **ADZ4NEEDZ**.

VendorSphere is a modern, enterprise-grade Vendor & Procurement Management platform designed with institutional reliability, multi-tier approval hierarchies, competitive RFQ bidding matrices, 3-way matching accountability, and real-time logistics tracking.

---

## 🏛 Architecture & Folder Layout

```
frontend/
├── src/
│   ├── config/              # Centralized application configuration, thresholds, role definitions
│   │   └── index.ts         # APP_CONFIG, approval limits, status badges, currency helpers
│   ├── context/             # Global interactive procurement state store
│   │   └── ProcurementContext.tsx  # Dynamic workflow state, PRs, RFQs, POs, and audit trail
│   ├── types/               # Strong TypeScript business models (PR, RFQ, Bid, PO, Vendor, Audit)
│   │   └── index.ts
│   ├── services/            # Realistic enterprise seed datasets
│   │   └── mockData.ts
│   ├── components/
│   │   ├── common/          # Reusable UI primitives (Button, Badge, Modal, StatCard)
│   │   ├── layout/          # Corporate app shell (Sidebar, Top Navbar with role switcher)
│   │   ├── views/           # High-fidelity workflow views
│   │   │   ├── DashboardView.tsx         # KPI cards, 8-stage pipeline visualizer, action items
│   │   │   ├── PurchaseRequestsView.tsx  # Multi-level approval steps, itemized PR tables
│   │   │   ├── QuotationsView.tsx        # Comparative RFQ bid matrix & best-value recommendation
│   │   │   ├── PurchaseOrdersView.tsx    # Confirmed orders, vouchers, 3-way match validation
│   │   │   ├── DeliveriesView.tsx        # Logistics tracking, chain of custody & QC sign-off
│   │   │   ├── VendorsView.tsx           # Supplier scorecards, SLA on-time metrics & ratings
│   │   │   └── AuditLogsView.tsx         # Immutable accountability audit trail
│   │   └── modals/
│   │       └── CreatePRModal.tsx         # Interactive multi-item PR creation with tax calculator
│   ├── App.tsx              # Main entry layout
│   ├── main.tsx
│   └── index.css            # Tailwind CSS v4 styling & corporate tokens
├── vite.config.ts           # Vite + Tailwind v4 + '@/' path aliases
├── tsconfig.json
├── package.json
└── .env.example
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## 🎯 Key Enterprise Features Aligned with Project Specs

1. **8-Stage Procurement Workflow**:
   - `Purchase Request` ➔ `Review & Approval` ➔ `Quotation Collection` ➔ `Quotation Evaluation` ➔ `Vendor Selection` ➔ `Purchase Order` ➔ `Delivery Tracking` ➔ `3-Way Match & Completion`.
2. **Interactive Role Switching (Demo-Ready)**:
   - Switch between **Requester**, **Procurement Manager**, **Administrator**, and **Vendor** from the top navigation bar to test role permissions and workflows instantly.
3. **Multi-Level Approval Rules**:
   - Configured in [src/config/index.ts](file:///g:/Vendor%20Sphere/frontend/src/config/index.ts) with department, procurement, and executive financial threshold rules.
4. **Competitive Quotation Matrix**:
   - Side-by-side comparative bid evaluations with scoring on Price, Lead Time SLA, Compliance Score, and Automated Best Value recommendation.
5. **3-Way Matching Engine**:
   - Validates agreement between Purchase Order, Receiving Inspection, and Supplier Invoicing.
6. **Enterprise Audit Trail**:
   - Logs timestamp, actor, role, and actions taken across all procurement entities.
