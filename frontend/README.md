# VendorSphere — Enterprise Vendor & Procurement Management Platform

[![Live Demo](https://img.shields.io/badge/Live%20Hosted%20App-vendor--sphere--app.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vendor-sphere-app.vercel.app)
[![Vercel Production](https://img.shields.io/badge/Vercel-Production%20Live-success?style=for-the-badge&logo=vercel)](https://vendor-sphere-app.vercel.app)

> **Live Production Website**: **[https://vendor-sphere-app.vercel.app](https://vendor-sphere-app.vercel.app)**
> 
> Built to fulfill the enterprise software development challenge by **ADZ4NEEDZ**.

VendorSphere is a modern, enterprise-grade Vendor & Procurement Management platform designed with institutional reliability, multi-tier approval hierarchies, competitive RFQ bidding matrices, 3-way matching accountability, and real-time logistics tracking.

---

## 🌐 Live Hosted Link
- **Vercel Production**: **[https://vendor-sphere-app.vercel.app](https://vendor-sphere-app.vercel.app)**
- **GitHub Repository**: **[https://github.com/tajprasanth3-cell/Vendor-Sphere](https://github.com/tajprasanth3-cell/Vendor-Sphere)**

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
│   ├── services/            # API client and seed datasets
│   │   ├── api.ts           # REST API client with JWT bearer tokens
│   │   └── mockData.ts
│   ├── components/
│   │   ├── common/          # Reusable UI primitives (Button, Badge, Modal, StatCard)
│   │   ├── layout/          # Corporate app shell (Sidebar, Top Navbar)
│   │   ├── views/           # High-fidelity workflow views
│   │   │   ├── DashboardView.tsx         # KPI cards, role-specific pipelines, action items
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
├── vercel.json              # Vercel SPA rewrite rules
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

### 2. Start Development Server
```bash
npm run dev
```

### 3. Production Build
```bash
npm run build
```
