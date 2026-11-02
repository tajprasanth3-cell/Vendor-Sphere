import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  AuthUser,
  PurchaseRequest, 
  RFQ, 
  PurchaseOrder, 
  DeliveryShipment, 
  Vendor, 
  AuditLog, 
  LineItem 
} from '../types';
import { 
  INITIAL_PURCHASE_REQUESTS, 
  INITIAL_RFQS, 
  INITIAL_PURCHASE_ORDERS, 
  INITIAL_DELIVERIES, 
  INITIAL_VENDORS, 
  INITIAL_AUDIT_LOGS 
} from '../services/mockData';

export type ThemeMode = 'light' | 'dark';

export const DEMO_ACCOUNTS: Record<UserRole, AuthUser> = {
  procurement_manager: {
    id: 'usr-1',
    name: 'Elena Rostova',
    email: 'elena.rostova@enterprise.internal',
    role: 'procurement_manager',
    department: 'Global Sourcing & Procurement',
  },
  requester: {
    id: 'usr-2',
    name: 'Sarah Jenkins',
    email: 's.jenkins@enterprise.internal',
    role: 'requester',
    department: 'Infrastructure & DevOps',
  },
  admin: {
    id: 'usr-3',
    name: 'Alexander Vance',
    email: 'admin@enterprise.internal',
    role: 'admin',
    department: 'Compliance & IT Administration',
  },
  vendor: {
    id: 'usr-4',
    name: 'David Vance',
    email: 'dvance@apexcloud.io',
    role: 'vendor',
    department: 'Apex Cloud Solutions Inc.',
  },
};

interface ProcurementContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  isAuthenticated: boolean;
  currentUser: AuthUser | null;
  login: (roleOrEmail: string, password?: string) => boolean;
  logout: () => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  purchaseRequests: PurchaseRequest[];
  rfqs: RFQ[];
  purchaseOrders: PurchaseOrder[];
  deliveries: DeliveryShipment[];
  vendors: Vendor[];
  auditLogs: AuditLog[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  
  // Actions
  createPurchaseRequest: (data: {
    title: string;
    department: string;
    priority: PurchaseRequest['priority'];
    businessJustification: string;
    requiredDate: string;
    items: LineItem[];
  }) => void;
  approvePurchaseRequest: (prId: string, comments?: string) => void;
  rejectPurchaseRequest: (prId: string, comments?: string) => void;
  initiateRFQ: (prId: string, deadline: string) => void;
  awardQuotationBid: (rfqId: string, bidId: string) => void;
  verifyDeliveryQC: (deliveryId: string) => void;
}

const ProcurementContext = createContext<ProcurementContextType | undefined>(undefined);

export const ProcurementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('procurement_manager');
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Auth state with local persistence
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const savedUser = localStorage.getItem('vendorsphere_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return DEMO_ACCOUNTS.procurement_manager;
      }
    }
    return DEMO_ACCOUNTS.procurement_manager;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('vendorsphere_auth') === 'true' || true;
  });

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (DEMO_ACCOUNTS[newRole]) {
      setCurrentUser(DEMO_ACCOUNTS[newRole]);
      localStorage.setItem('vendorsphere_user', JSON.stringify(DEMO_ACCOUNTS[newRole]));
    }
  };

  const login = (roleOrEmail: string, _password = 'password'): boolean => {
    let targetUser: AuthUser = DEMO_ACCOUNTS.procurement_manager;

    if (roleOrEmail in DEMO_ACCOUNTS) {
      targetUser = DEMO_ACCOUNTS[roleOrEmail as UserRole];
    } else {
      const match = Object.values(DEMO_ACCOUNTS).find((u) => u.email.toLowerCase() === roleOrEmail.toLowerCase());
      if (match) {
        targetUser = match;
      }
    }

    setCurrentUser(targetUser);
    setRoleState(targetUser.role);
    setIsAuthenticated(true);
    localStorage.setItem('vendorsphere_auth', 'true');
    localStorage.setItem('vendorsphere_user', JSON.stringify(targetUser));
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('vendorsphere_auth');
  };

  // Theme setup with persistence
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('vendorsphere_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('vendorsphere_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>(INITIAL_PURCHASE_REQUESTS);
  const [rfqs, setRfqs] = useState<RFQ[]>(INITIAL_RFQS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [deliveries, setDeliveries] = useState<DeliveryShipment[]>(INITIAL_DELIVERIES);
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  const addAuditLog = (
    action: string, 
    entityType: AuditLog['entityType'], 
    entityCode: string, 
    details: string
  ) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      action,
      entityType,
      entityCode,
      user: currentUser?.name || 'Authorized User',
      role: role.toUpperCase(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const createPurchaseRequest = (data: {
    title: string;
    department: string;
    priority: PurchaseRequest['priority'];
    businessJustification: string;
    requiredDate: string;
    items: LineItem[];
  }) => {
    const subtotal = data.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const estimatedTax = subtotal * 0.08;
    const totalAmount = subtotal + estimatedTax;
    const prCode = `PR-2026-0${Math.floor(100 + Math.random() * 900)}`;

    const newPR: PurchaseRequest = {
      id: `pr-${Date.now()}`,
      code: prCode,
      title: data.title,
      department: data.department,
      requestedBy: {
        name: currentUser?.name || 'Sarah Jenkins',
        email: currentUser?.email || 's.jenkins@enterprise.internal',
      },
      priority: data.priority,
      status: 'pending_dept_approval',
      items: data.items,
      subtotal,
      estimatedTax,
      totalAmount,
      currency: 'USD',
      businessJustification: data.businessJustification,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      requiredDate: data.requiredDate,
      approvalChain: [
        {
          stepName: 'Department Head Approval',
          approverRole: 'Department Manager',
          status: 'pending',
        },
        {
          stepName: 'Procurement Specialist Review',
          approverRole: 'Sourcing Lead',
          status: 'pending',
        },
        {
          stepName: 'Executive Finance Approval',
          approverRole: 'Finance Director',
          status: 'pending',
        },
      ],
    };

    setPurchaseRequests((prev) => [newPR, ...prev]);
    addAuditLog('PR_CREATED', 'PR', prCode, `New Requisition filed for ${data.department}: $${totalAmount.toLocaleString()}`);
  };

  const approvePurchaseRequest = (prId: string, comments = 'Approved in accordance with procurement policy.') => {
    setPurchaseRequests((prev) =>
      prev.map((pr) => {
        if (pr.id !== prId) return pr;

        const updatedChain = [...pr.approvalChain];
        const nextPendingIndex = updatedChain.findIndex((step) => step.status === 'pending');

        if (nextPendingIndex !== -1) {
          updatedChain[nextPendingIndex] = {
            ...updatedChain[nextPendingIndex],
            status: 'approved',
            updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            comments,
          };
        }

        const allApproved = updatedChain.every((s) => s.status === 'approved');
        const nextStatus = allApproved ? 'approved' : 'pending_procurement_review';

        addAuditLog(
          'PR_STEP_APPROVED',
          'PR',
          pr.code,
          `Step "${updatedChain[nextPendingIndex]?.stepName}" approved. Next state: ${nextStatus}`
        );

        return {
          ...pr,
          status: nextStatus,
          approvalChain: updatedChain,
        };
      })
    );
  };

  const rejectPurchaseRequest = (prId: string, comments = 'Rejected by review committee.') => {
    setPurchaseRequests((prev) =>
      prev.map((pr) => {
        if (pr.id !== prId) return pr;
        addAuditLog('PR_REJECTED', 'PR', pr.code, `Requisition rejected. Reason: ${comments}`);
        return {
          ...pr,
          status: 'rejected',
        };
      })
    );
  };

  const initiateRFQ = (prId: string, deadline: string) => {
    const pr = purchaseRequests.find((p) => p.id === prId);
    if (!pr) return;

    const rfqCode = `RFQ-2026-0${Math.floor(10 + Math.random() * 89)}`;
    const newRfq: RFQ = {
      id: `rfq-${Date.now()}`,
      code: rfqCode,
      prId: pr.id,
      prCode: pr.code,
      title: `Competitive Sourcing: ${pr.title}`,
      targetBudget: pr.totalAmount,
      deadline,
      invitedVendorsCount: 3,
      status: 'open',
      bids: [],
    };

    setRfqs((prev) => [newRfq, ...prev]);
    setPurchaseRequests((prev) =>
      prev.map((p) => (p.id === prId ? { ...p, status: 'rfq_initiated' } : p))
    );
    addAuditLog('RFQ_INITIATED', 'RFQ', rfqCode, `Tender opened for ${pr.code} with deadline ${deadline}`);
  };

  const awardQuotationBid = (rfqId: string, bidId: string) => {
    const targetRfq = rfqs.find((r) => r.id === rfqId);
    if (!targetRfq) return;

    const winningBid = targetRfq.bids.find((b) => b.id === bidId);
    if (!winningBid) return;

    // Update RFQ status
    setRfqs((prev) =>
      prev.map((r) =>
        r.id === rfqId
          ? {
              ...r,
              status: 'awarded',
              awardedBidId: bidId,
              bids: r.bids.map((b) =>
                b.id === bidId
                  ? { ...b, status: 'awarded' }
                  : { ...b, status: 'disqualified' }
              ),
            }
          : r
      )
    );

    // Auto-generate Purchase Order
    const poNumber = `PO-2026-${Math.floor(8000 + Math.random() * 1999)}`;
    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber,
      rfqCode: targetRfq.code,
      prCode: targetRfq.prCode,
      vendorId: winningBid.vendorId,
      vendorName: winningBid.vendorName,
      vendorEmail: 'orders@vendorpartner.com',
      items: [
        {
          id: `item-${Date.now()}`,
          name: targetRfq.title,
          category: 'Awarded Goods & Services',
          quantity: 1,
          unit: 'lot',
          estimatedUnitPrice: winningBid.quotedAmount,
          totalPrice: winningBid.quotedAmount,
        },
      ],
      totalAmount: winningBid.quotedAmount,
      currency: 'USD',
      paymentTerms: winningBid.paymentTerms,
      paymentStatus: 'unpaid',
      deliveryStatus: 'processing',
      matchingStatus: 'pending_invoice',
      issueDate: new Date().toISOString().substring(0, 10),
      expectedDeliveryDate: new Date(Date.now() + winningBid.deliveryDays * 86400000)
        .toISOString()
        .substring(0, 10),
      shippingAddress: '450 Innovation Parkway, Bldg 4, San Francisco, CA 94105',
    };

    setPurchaseOrders((prev) => [newPO, ...prev]);

    // Create logistics shipment
    const newDelivery: DeliveryShipment = {
      id: `del-${Date.now()}`,
      poNumber,
      trackingNumber: `EXP-${Math.floor(10000000 + Math.random() * 89999999)}`,
      carrier: 'DHL Express Freight',
      vendorName: winningBid.vendorName,
      status: 'in_transit',
      estimatedDelivery: newPO.expectedDeliveryDate,
      itemsCount: 1,
      qcPassed: false,
      milestones: [
        {
          step: 'Award Confirmed & PO Issued',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          location: 'Procurement Dispatch Center',
          completed: true,
        },
        {
          step: 'Vendor Assembly & Packaging',
          timestamp: 'In Progress',
          location: `${winningBid.vendorName} Fulfillment Center`,
          completed: false,
        },
      ],
    };

    setDeliveries((prev) => [newDelivery, ...prev]);
    addAuditLog(
      'BID_AWARDED_PO_GENERATED',
      'PO',
      poNumber,
      `Awarded to ${winningBid.vendorName} ($${winningBid.quotedAmount.toLocaleString()}). PO generated automatically.`
    );
  };

  const verifyDeliveryQC = (deliveryId: string) => {
    setDeliveries((prev) =>
      prev.map((d) => {
        if (d.id !== deliveryId) return d;
        addAuditLog('QC_INSPECTION_PASSED', 'DELIVERY', d.poNumber, `Quality inspection completed. 3-Way Match verified.`);
        return {
          ...d,
          status: 'quality_check_passed',
          qcPassed: true,
          milestones: d.milestones.map((m) => ({ ...m, completed: true })),
        };
      })
    );

    // Update corresponding PO to inspected
    setPurchaseOrders((prev) =>
      prev.map((po) => {
        const del = deliveries.find((d) => d.id === deliveryId);
        if (del && po.poNumber === del.poNumber) {
          return {
            ...po,
            deliveryStatus: 'inspected',
            matchingStatus: '3_way_matched',
          };
        }
        return po;
      })
    );
  };

  return (
    <ProcurementContext.Provider
      value={{
        role,
        setRole,
        theme,
        toggleTheme,
        isAuthenticated,
        currentUser,
        login,
        logout,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        purchaseRequests,
        rfqs,
        purchaseOrders,
        deliveries,
        vendors,
        auditLogs,
        searchQuery,
        setSearchQuery,
        activeView,
        setActiveView,
        createPurchaseRequest,
        approvePurchaseRequest,
        rejectPurchaseRequest,
        initiateRFQ,
        awardQuotationBid,
        verifyDeliveryQC,
      }}
    >
      {children}
    </ProcurementContext.Provider>
  );
};

export const useProcurement = () => {
  const context = useContext(ProcurementContext);
  if (!context) {
    throw new Error('useProcurement must be used within a ProcurementProvider');
  }
  return context;
};
