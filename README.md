# VendorSphere — Enterprise Vendor & Procurement Management Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-green.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> A modern, centralized platform that helps organizations manage vendor relationships, purchasing requests, quotation evaluation, approval processes, purchase orders, deliveries, and procurement activities with institutional visibility, accountability, and control.
> 
> *Built for the **ADZ4NEEDZ** Enterprise Software Development Challenge.*

---

## 🏛 Repository Architecture

```
Vendor-Sphere/
├── frontend/                        # React 19 + TypeScript + Vite + Tailwind CSS v4
│   ├── src/
│   │   ├── config/                  # Business thresholds, role permissions, badge tokens
│   │   ├── context/                 # State management (PRs, RFQs, POs, Auth, Theme)
│   │   ├── types/                   # TypeScript interfaces (PR, Bid, PO, Vendor, Audit)
│   │   ├── components/
│   │   │   ├── common/              # Badge, Button, Modal, StatCard
│   │   │   ├── layout/              # Sidebar (desktop + mobile drawer), Navbar with role switcher
│   │   │   ├── views/               # 8-stage procurement views & enterprise login page
│   │   │   └── modals/              # Interactive PR creation modal with dynamic lines & tax
│   │   └── App.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
│
├── backend/                         # Node.js + Express + TypeScript REST API
│   ├── src/
│   │   ├── config/                  # Environment constants (JWT, PORT, CORS)
│   │   ├── controllers/             # Auth, Requests, RFQs, Orders, Deliveries, Vendors, Audits
│   │   ├── db/                      # Pre-seeded ACID datastore
│   │   ├── middleware/              # JWT auth, Role-Based Access Control (RBAC), Error handler
│   │   ├── routes/                  # Modular /api/v1 endpoints
│   │   ├── types/                   # Express request extensions & domain models
│   │   ├── app.ts                   # Express application configuration
│   │   └── server.ts                # Server startup & graceful shutdown
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── .gitignore                       # Clean root ignore for dependencies and builds
└── README.md
```

---

## ⚡ Core Business Capabilities (8-Stage Workflow)

1. **Purchase Request (PR)**: Department requisition filing with line items, specs, unit costs, and automated tax provisions.
2. **Review & Approval**: Multi-level authorization hierarchy enforcing Department Head, Sourcing Lead, and CFO approval tiers.
3. **Quotation Collection (RFQ)**: Sourcing tenders issued to suppliers with deadlines and cap budgets.
4. **Quotation Evaluation**: Side-by-side comparative matrices assessing price, delivery speed SLA, warranty, and compliance scores.
5. **Vendor Selection**: Automated "Best Value Winner" recommendation with contract award actions.
6. **Purchase Order (PO)**: Binding PO voucher generation, payment terms, and 3-way matching validation.
7. **Delivery Tracking**: Carrier waybills (FedEx, DHL, UPS) and chain-of-custody transit milestone steppers.
8. **Receiving Inspection & Completion**: Dock QC inspection sign-off completing the 3-way match.

---

## 👥 Enterprise Personas & Pre-Configured Demo Accounts

| Role | Persona | Email | Password | Scope of Authority |
|---|---|---|---|---|
| **Procurement Manager** | Elena Rostova | `elena.rostova@enterprise.internal` | `password123` | Reviews PRs, issues RFQs, compares bids, awards contracts |
| **Department Requester** | Sarah Jenkins | `s.jenkins@enterprise.internal` | `password123` | Files requisitions, tracks approval progress, inspects receipts |
| **System Administrator** | Alexander Vance | `admin@enterprise.internal` | `password123` | System policies, governance oversight, user permissions, audit logs |
| **Vendor Partner** | David Vance | `dvance@apexcloud.io` | `password123` | Submits competitive quotations, updates dispatch waybills |

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js**: v20+ or v24+
* **npm**: v10+

### 1. Clone & Setup
```bash
git clone https://github.com/tajprasanth3-cell/Vendor-Sphere.git
cd Vendor-Sphere
```

### 2. Start the Backend API
```bash
cd backend
npm install
npm run dev
# Server running at http://localhost:5000
# Health check: http://localhost:5000/api/health
```

### 3. Start the Frontend Client
```bash
# In a separate terminal:
cd frontend
npm install
npm run dev
# App running at http://localhost:5173
```

---

## 🎨 UI & Design Highlights

* **Dual Themes**: Complete light and dark modes with persistent system sync and manual toggle.
* **Responsive Architecture**: Mobile slide-over navigation drawer, horizontal-scrolling enterprise tables, and adaptive touch padding.
* **Real-Time Audit Trail**: Immutable logging of all user activities across all 8 lifecycle stages.

---

## 📄 License
This project is licensed under the MIT License.
