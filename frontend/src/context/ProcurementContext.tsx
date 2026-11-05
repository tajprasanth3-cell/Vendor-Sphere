import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  UserRole, 
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
import { api, clearStoredToken } from '../services/api';

export type ThemeMode = 'light' | 'dark';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  timestamp: string;
  read: boolean;
  targetView?: string;
}

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
    department: 'Infrastructure & R&D Engineering',
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

const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'Pending Executive Capex Authorization',
    message: 'Requisition PR-2026-0098 ($74,655.00) for Facilities is awaiting Finance Director approval.',
    type: 'warning',
    timestamp: '10m ago',
    read: false,
    targetView: 'requests',
  },
  {
    id: 'notif-2',
    title: 'Supplier Bid Submitted',
    message: 'Apex Cloud Solutions submitted a quotation ($82,500.00) for Cloud SIEM Renewal.',
    type: 'info',
    timestamp: '45m ago',
    read: false,
    targetView: 'quotations',
  },
  {
    id: 'notif-3',
    title: 'Purchase Order Dispatched',
    message: 'Official PO-2026-7841 dispatched to Nova Hardware Logistics Ltd for fulfillment.',
    type: 'success',
    timestamp: '2h ago',
    read: true,
    targetView: 'orders',
  },
  {
    id: 'notif-4',
    title: 'Receiving Dock Inspection Needed',
    message: 'Waybill FX-88912048991 arrived at Bay 4. Complete 3-Way Match receiving inspection.',
    type: 'alert',
    timestamp: '4h ago',
    read: false,
    targetView: 'deliveries',
  },
];

interface ProcurementContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  isAuthenticated: boolean;
  currentUser: AuthUser | null;
  login: (roleOrEmail: string, password?: string) => Promise<boolean> | boolean;
  logout: () => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  purchaseRequests: PurchaseRequest[];
  rfqs: RFQ[];
  purchaseOrders: PurchaseOrder[];
  deliveries: DeliveryShipment[];
  vendors: Vendor[];
  auditLogs: AuditLog[];
  notifications: SystemNotification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  addNotification: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'alert', targetView?: string) => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string; otp?: string }>;
  resetPasswordWithOtp: (email: string, otp: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
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

  // Backend Sync & State
  isBackendConnected: boolean;
  dbProviderInfo: { provider: string; connected: boolean; host?: string } | null;
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const ProcurementContext = createContext<ProcurementContextType | undefined>(undefined);

// Helper function to return initial role-filtered data
const getInitialPRs = (role: UserRole): PurchaseRequest[] => {
  if (role === 'vendor') return [];
  if (role === 'requester') {
    return INITIAL_PURCHASE_REQUESTS.filter(p => 
      p.department.toLowerCase().includes('infra') || 
      p.department.toLowerCase().includes('devops') ||
      p.department.toLowerCase().includes('engineering')
    );
  }
  return INITIAL_PURCHASE_REQUESTS;
};

const getInitialPOs = (role: UserRole): PurchaseOrder[] => {
  if (role === 'vendor') {
    return INITIAL_PURCHASE_ORDERS.filter(po => po.vendorId === 'ven-1' || po.vendorName.toLowerCase().includes('apex'));
  }
  return INITIAL_PURCHASE_ORDERS;
};

const getInitialDeliveries = (role: UserRole): DeliveryShipment[] => {
  if (role === 'vendor') {
    return INITIAL_DELIVERIES.filter(d => d.vendorName.toLowerCase().includes('apex'));
  }
  return INITIAL_DELIVERIES;
};

const getInitialVendors = (role: UserRole): Vendor[] => {
  if (role === 'vendor') {
    return INITIAL_VENDORS.filter(v => v.id === 'ven-1');
  }
  return INITIAL_VENDORS;
};

const getInitialAudits = (role: UserRole): AuditLog[] => {
  if (role === 'vendor' || role === 'requester') return [];
  return INITIAL_AUDIT_LOGS;
};

export const ProcurementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  // Role correctly mirrors currentUser.role
  const [role, setRoleState] = useState<UserRole>(() => {
    const savedUser = localStorage.getItem('vendorsphere_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u.role) return u.role as UserRole;
      } catch (e) {}
    }
    return 'procurement_manager';
  });

  const [activeView, setActiveView] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Backend connection status
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [dbProviderInfo, setDbProviderInfo] = useState<{ provider: string; connected: boolean; host?: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('vendorsphere_auth') === 'true';
  });

  // Core procurement collections - initialized based on active role
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>(() => getInitialPRs(role));
  const [rfqs, setRfqs] = useState<RFQ[]>(INITIAL_RFQS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => getInitialPOs(role));
  const [deliveries, setDeliveries] = useState<DeliveryShipment[]>(() => getInitialDeliveries(role));
  const [vendors, setVendors] = useState<Vendor[]>(() => getInitialVendors(role));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => getInitialAudits(role));

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

  // Centralized Audit Log
  const addAuditLog = useCallback((
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
  }, [currentUser, role]);

  // Notifications State with persistence
  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem('vendorsphere_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_NOTIFICATIONS;
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('vendorsphere_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const addNotification = (
    title: string, 
    message: string, 
    type: 'info' | 'success' | 'warning' | 'alert' = 'info', 
    targetView?: string
  ) => {
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      message,
      type,
      timestamp: 'Just now',
      read: false,
      targetView,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Primary function to fetch backend data - respecting role-based filtering
  const loadBackendData = useCallback(async () => {
    try {
      setIsLoading(true);

      // 1. Check health
      try {
        const health = await api.checkHealth();
        setIsBackendConnected(true);
        if (health.database) {
          setDbProviderInfo(health.database);
        }
      } catch {
        setIsBackendConnected(false);
      }

      // 2. Fetch all collections in parallel
      const [prsRes, rfqsRes, ordersRes, delsRes, vendsRes, auditsRes] = await Promise.allSettled([
        api.getPurchaseRequests(),
        api.getRFQs(),
        api.getPurchaseOrders(),
        api.getDeliveries(),
        api.getVendors(),
        api.getAuditLogs(),
      ]);

      if (prsRes.status === 'fulfilled') {
        setPurchaseRequests(prsRes.value);
      }
      if (rfqsRes.status === 'fulfilled') {
        setRfqs(rfqsRes.value);
      }
      if (ordersRes.status === 'fulfilled') {
        setPurchaseOrders(ordersRes.value);
      }
      if (delsRes.status === 'fulfilled') {
        setDeliveries(delsRes.value);
      }
      if (vendsRes.status === 'fulfilled') {
        setVendors(vendsRes.value);
      }
      if (auditsRes.status === 'fulfilled') {
        setAuditLogs(auditsRes.value);
      } else {
        // Forbidden for vendors / requesters
        setAuditLogs([]);
      }
    } catch (err) {
      console.warn('Backend sync note: Operating in resilient cache mode', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch from backend when mounted or auth status ready
  useEffect(() => {
    if (isAuthenticated) {
      loadBackendData();
    }
  }, [isAuthenticated, role, loadBackendData]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (DEMO_ACCOUNTS[newRole]) {
      const u = DEMO_ACCOUNTS[newRole];
      setCurrentUser(u);
      localStorage.setItem('vendorsphere_user', JSON.stringify(u));
      // Reset data to that role's scope immediately
      setPurchaseRequests(getInitialPRs(newRole));
      setPurchaseOrders(getInitialPOs(newRole));
      setDeliveries(getInitialDeliveries(newRole));
      setVendors(getInitialVendors(newRole));
      setAuditLogs(getInitialAudits(newRole));
      // Ensure active view is permitted for this role
      if (newRole === 'vendor' && ['requests', 'vendors', 'audits'].includes(activeView)) {
        setActiveView('dashboard');
      } else if (newRole === 'requester' && ['quotations', 'orders', 'vendors', 'audits'].includes(activeView)) {
        setActiveView('dashboard');
      }
      // Re-authenticate silently with backend
      api.login(newRole).then(() => loadBackendData()).catch(() => {});
    }
  };

  const login = async (roleOrEmail: string, password = 'password123'): Promise<boolean> => {
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

    // Reset initial collections to that user's role scope
    setPurchaseRequests(getInitialPRs(targetUser.role));
    setPurchaseOrders(getInitialPOs(targetUser.role));
    setDeliveries(getInitialDeliveries(targetUser.role));
    setVendors(getInitialVendors(targetUser.role));
    setAuditLogs(getInitialAudits(targetUser.role));
    setActiveView('dashboard');

    try {
      const res = await api.login(roleOrEmail, password);
      if (res.user) {
        targetUser = {
          id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          role: res.user.role as UserRole,
          department: res.user.department,
        };
        setCurrentUser(targetUser);
        setRoleState(targetUser.role);
        localStorage.setItem('vendorsphere_user', JSON.stringify(targetUser));
      }
      setIsBackendConnected(true);
      await loadBackendData();
    } catch {
      console.warn('Backend authentication endpoint offline. Falling back to local authentication.');
    }

    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    clearStoredToken();
    localStorage.removeItem('vendorsphere_auth');
  };

  const forgotPassword = async (emailToReset: string): Promise<{ success: boolean; message: string; otp?: string }> => {
    try {
      return await api.forgotPassword(emailToReset);
    } catch {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      return {
        success: true,
        message: `Verification code sent to corporate email: ${emailToReset}`,
        otp,
      };
    }
  };

  const resetPasswordWithOtp = async (
    email: string, 
    otp: string, 
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      return await api.resetPassword(email, otp, newPassword);
    } catch {
      if (!otp || otp.trim().length !== 6) {
        return { success: false, message: 'Invalid 6-digit verification code.' };
      }
      return { success: true, message: 'Password updated successfully. You can now sign in with your new credentials.' };
    }
  };

  const createPurchaseRequest = async (data: {
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
        name: currentUser?.name || 'Authorized Requester',
        email: currentUser?.email || 'user@enterprise.internal',
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
    addNotification('New Requisition Submitted', `Requisition ${prCode} filed for ${data.department} ($${totalAmount.toLocaleString()}).`, 'info', 'requests');

    try {
      const created = await api.createPurchaseRequest(data);
      if (created) {
        setPurchaseRequests((prev) => prev.map((p) => (p.id === newPR.id ? created : p)));
      }
    } catch (e) {
      console.warn('API sync deferred for createPurchaseRequest', e);
    }
  };

  const approvePurchaseRequest = async (prId: string, comments = 'Approved in accordance with procurement policy.') => {
    let prCode = '';
    setPurchaseRequests((prev) =>
      prev.map((pr) => {
        if (pr.id !== prId) return pr;
        prCode = pr.code;

        const updatedChain = [...pr.approvalChain];
        const nextPendingIndex = updatedChain.findIndex((step) => step.status === 'pending');

        if (nextPendingIndex !== -1) {
          updatedChain[nextPendingIndex] = {
            ...updatedChain[nextPendingIndex],
            status: 'approved',
            approverName: currentUser?.name || 'Elena Rostova',
            updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            comments,
          };
        }

        const allApproved = updatedChain.every((step) => step.status === 'approved');
        const newStatus = allApproved
          ? 'approved'
          : nextPendingIndex === 0
          ? 'pending_procurement_review'
          : 'pending_finance_approval';

        return {
          ...pr,
          approvalChain: updatedChain,
          status: newStatus,
        };
      })
    );

    addAuditLog('PR_APPROVED', 'PR', prCode || prId, `Approval milestone signed by ${currentUser?.name || 'Elena Rostova'}`);
    addNotification('Requisition Approved', `Requisition ${prCode || prId} authorized to next workflow tier.`, 'success', 'requests');

    try {
      await api.approvePurchaseRequest(prId, comments);
    } catch (e) {
      console.warn('API sync deferred for approvePurchaseRequest', e);
    }
  };

  const rejectPurchaseRequest = async (prId: string, comments = 'Rejected by procurement reviewer.') => {
    let prCode = '';
    setPurchaseRequests((prev) =>
      prev.map((pr) => {
        if (pr.id !== prId) return pr;
        prCode = pr.code;

        const updatedChain = pr.approvalChain.map((step) =>
          step.status === 'pending'
            ? {
                ...step,
                status: 'rejected' as const,
                approverName: currentUser?.name || 'Elena Rostova',
                updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
                comments,
              }
            : step
        );

        return {
          ...pr,
          approvalChain: updatedChain,
          status: 'rejected',
        };
      })
    );

    addAuditLog('PR_REJECTED', 'PR', prCode || prId, `Requisition rejected. Reason: ${comments}`);
    addNotification('Requisition Rejected', `Requisition ${prCode || prId} declined: ${comments}`, 'alert', 'requests');

    try {
      await api.rejectPurchaseRequest(prId, comments);
    } catch (e) {
      console.warn('API sync deferred for rejectPurchaseRequest', e);
    }
  };

  const initiateRFQ = async (prId: string, deadline: string) => {
    const targetPR = purchaseRequests.find((pr) => pr.id === prId);
    if (!targetPR) return;

    const rfqCode = `RFQ-2026-00${Math.floor(50 + Math.random() * 49)}`;
    const newRFQ: RFQ = {
      id: `rfq-${Date.now()}`,
      code: rfqCode,
      prId: targetPR.id,
      prCode: targetPR.code,
      title: targetPR.title,
      status: 'open',
      targetBudget: targetPR.totalAmount,
      deadline,
      invitedVendorsCount: 3,
      bids: [
        {
          id: `bid-new-1`,
          vendorId: 'ven-1',
          vendorName: 'Apex Cloud Solutions Inc.',
          vendorRating: 4.9,
          submittedAt: 'Just Now',
          quotedAmount: Math.round(targetPR.totalAmount * 0.94),
          deliveryDays: 5,
          warrantyPeriodMonths: 24,
          paymentTerms: 'Net 30 Days',
          complianceScore: 98,
          scoreBreakdown: { pricing: 94, deliverySpeed: 96, reputation: 99 },
          notes: 'Standard enterprise discount applied. Expedited delivery included.',
          isRecommended: true,
          status: 'submitted',
        },
      ],
    };

    setRfqs((prev) => [newRFQ, ...prev]);

    setPurchaseRequests((prev) =>
      prev.map((pr) => (pr.id === prId ? { ...pr, status: 'rfq_initiated' } : pr))
    );

    addAuditLog('RFQ_INITIATED', 'RFQ', rfqCode, `RFQ initiated from ${targetPR.code} with target cap: $${targetPR.totalAmount.toLocaleString()}`);
    addNotification('RFQ Tender Sourcing Live', `Tender ${rfqCode} opened for ${targetPR.title}. Vendors invited.`, 'info', 'quotations');

    try {
      const createdRfq = await api.createRFQ(prId, deadline);
      if (createdRfq) {
        setRfqs((prev) => prev.map((r) => (r.id === newRFQ.id ? createdRfq : r)));
      }
    } catch (e) {
      console.warn('API sync deferred for initiateRFQ', e);
    }
  };

  const awardQuotationBid = async (rfqId: string, bidId: string) => {
    const targetRfq = rfqs.find((r) => r.id === rfqId);
    if (!targetRfq) return;

    const winningBid = targetRfq.bids.find((b) => b.id === bidId);
    if (!winningBid) return;

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
      expectedDeliveryDate: new Date(Date.now() + winningBid.deliveryDays * 86400000).toISOString().substring(0, 10),
      shippingAddress: '450 Innovation Parkway, Receiving Bay 4, San Francisco, CA',
    };

    setPurchaseOrders((prev) => [newPO, ...prev]);

    const newDelivery: DeliveryShipment = {
      id: `del-${Date.now()}`,
      poNumber,
      trackingNumber: `FX-TRK-${Math.floor(100000 + Math.random() * 899999)}`,
      carrier: 'FedEx Express Freight',
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
    addNotification(
      'Contract Awarded & PO Issued',
      `PO ${poNumber} generated for ${winningBid.vendorName} ($${winningBid.quotedAmount.toLocaleString()}).`,
      'success',
      'orders'
    );

    try {
      await api.awardBid(rfqId, bidId);
    } catch (e) {
      console.warn('API sync deferred for awardBid', e);
    }
  };

  const verifyDeliveryQC = async (deliveryId: string) => {
    let targetPoNumber = '';
    setDeliveries((prev) =>
      prev.map((d) => {
        if (d.id !== deliveryId) return d;
        targetPoNumber = d.poNumber;
        addAuditLog('QC_INSPECTION_PASSED', 'DELIVERY', d.poNumber, `Quality inspection completed. 3-Way Match verified.`);
        return {
          ...d,
          status: 'quality_check_passed',
          qcPassed: true,
          milestones: d.milestones.map((m) => ({ ...m, completed: true })),
        };
      })
    );

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

    addNotification(
      '3-Way Match Inspection Verified',
      `Receiving inspection passed for ${targetPoNumber || 'delivery'}. Payment release authorized.`,
      'success',
      'deliveries'
    );

    try {
      await api.verifyDeliveryQC(deliveryId);
    } catch (e) {
      console.warn('API sync deferred for verifyDeliveryQC', e);
    }
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
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        addNotification,
        forgotPassword,
        resetPasswordWithOtp,
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
        isBackendConnected,
        dbProviderInfo,
        isLoading,
        refreshData: loadBackendData,
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
