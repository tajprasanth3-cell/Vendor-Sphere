# VendorSphere Enterprise API — Backend Service

> Centralized backend for the **VendorSphere** Vendor & Procurement Management Platform, adhering to the enterprise software development assignment by **ADZ4NEEDZ**.

---

## 🏛 Backend Architecture

```
backend/
├── src/
│   ├── config/              # Typed environment variables and security constants
│   │   └── env.ts
│   ├── controllers/         # Business logic handlers
│   │   ├── authController.ts     # User authentication, demo logins & JWT issuance
│   │   ├── requestController.ts  # PR requisitions, line items, and multi-tier approvals
│   │   ├── rfqController.ts      # RFQ tender creation, bid submission & award
│   │   ├── orderController.ts    # Purchase orders & 3-way matching records
│   │   ├── deliveryController.ts # Logistics tracking & receiving dock QC inspection
│   │   ├── vendorController.ts   # Supplier scorecards, ratings & spend analytics
│   │   └── auditController.ts    # Immutable accountability audit trail
│   ├── db/
│   │   └── store.ts              # In-memory ACID datastore seeded with realistic enterprise data
│   ├── middleware/          # Security & routing guards
│   │   ├── auth.ts               # Bearer JWT token authentication
│   │   ├── rbac.ts               # Role-based access control (checkRole('admin', ...))
│   │   └── errorHandler.ts       # Centralized JSON error format handler
│   ├── routes/              # Express API route modules
│   │   ├── authRoutes.ts         # /api/v1/auth
│   │   ├── requestRoutes.ts      # /api/v1/requests
│   │   ├── rfqRoutes.ts          # /api/v1/rfqs
│   │   ├── orderRoutes.ts        # /api/v1/orders
│   │   ├── deliveryRoutes.ts     # /api/v1/deliveries
│   │   ├── vendorRoutes.ts       # /api/v1/vendors
│   │   ├── auditRoutes.ts        # /api/v1/audits
│   │   └── index.ts              # Aggregated /api/v1 router
│   ├── types/               # TypeScript domain interfaces
│   │   └── index.ts
│   ├── app.ts               # Express application initialization & middleware setup
│   └── server.ts            # Entrypoint & HTTP server lifecycle
├── package.json
├── tsconfig.json
├── .env.example
└── .env
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
npm start
```

---

## 🔑 Pre-Configured Enterprise Demo Accounts

| Role | Name | Email | Password |
|---|---|---|---|
| **Procurement Manager** | Elena Rostova | `elena.rostova@enterprise.internal` | `password123` |
| **Dept Requester** | Sarah Jenkins | `s.jenkins@enterprise.internal` | `password123` |
| **System Administrator** | Alexander Vance | `admin@enterprise.internal` | `password123` |
| **Vendor Partner** | David Vance | `dvance@apexcloud.io` | `password123` |

---

## 📡 REST API Documentation

### 1. Authentication
* `POST /api/v1/auth/login` — Sign in and receive JWT bearer token.
* `GET  /api/v1/auth/me` — Retrieve active authenticated user profile.

### 2. Purchase Requisitions (PR)
* `GET   /api/v1/requests` — List requisitions with filter query params (`?status=...&department=...`).
* `GET   /api/v1/requests/:id` — Get single requisition by ID or code.
* `POST  /api/v1/requests` — Submit a new requisition with multiple item lines and estimated tax.
* `PATCH /api/v1/requests/:id/approve` — Advance multi-tier approval step (Requires: `procurement_manager` or `admin`).
* `PATCH /api/v1/requests/:id/reject` — Reject requisition with reason.

### 3. RFQs & Quotations
* `GET  /api/v1/rfqs` — List quotation tenders and bid matrices.
* `POST /api/v1/rfqs` — Initiate tender for approved PR.
* `POST /api/v1/rfqs/:rfqId/bids` — Submit vendor bid (Requires: `vendor` or `admin`).
* `POST /api/v1/rfqs/:rfqId/award/:bidId` — Award contract and automatically generate PO + logistics tracking.

### 4. Purchase Orders (PO)
* `GET /api/v1/orders` — List purchase orders with 3-way match status.
* `GET /api/v1/orders/:id` — Get PO voucher details.

### 5. Logistics & Deliveries
* `GET  /api/v1/deliveries` — List shipments, carriers & milestones.
* `POST /api/v1/deliveries/:id/qc` — Receiving dock quality check verification.

### 6. Vendors & Audit
* `GET /api/v1/vendors` — Supplier scorecards, SLA ratings & annual spend.
* `GET /api/v1/audits` — Full enterprise accountability audit log.

