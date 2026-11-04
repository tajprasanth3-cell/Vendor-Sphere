import { APP_CONFIG } from '../config';
import { 
  PurchaseRequest, 
  RFQ, 
  PurchaseOrder, 
  DeliveryShipment, 
  Vendor, 
  AuditLog, 
  LineItem 
} from '../types';

const BASE_URL = APP_CONFIG.apiBaseUrl.replace(/\/+$/, '');
const HEALTH_URL = BASE_URL.replace(/\/api\/v1$/, '/api/health');

// Token management in localStorage
const TOKEN_KEY = 'vendorsphere_jwt_token';

export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearStoredToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Generic authenticated fetch wrapper
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed with HTTP ${res.status}`);
  }

  return data;
}

export interface HealthResponse {
  status: string;
  platform: string;
  version: string;
  database: {
    provider: string;
    connected: boolean;
    host?: string;
  };
  timestamp: string;
}

export interface AuthLoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    department: string;
  };
}

export const api = {
  // Health & Provider Check
  async checkHealth(): Promise<HealthResponse> {
    const res = await fetch(HEALTH_URL);
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  },

  // Auth Endpoints
  async login(roleOrEmail: string, password = 'password123'): Promise<AuthLoginResponse> {
    const body: Record<string, string> = { password };
    if (roleOrEmail.includes('@')) {
      body.email = roleOrEmail;
    } else {
      body.role = roleOrEmail;
    }

    const res = await apiRequest<AuthLoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (res.token) {
      setStoredToken(res.token);
    }
    return res;
  },

  async getMe() {
    return apiRequest<{ success: boolean; user: any }>('/auth/me');
  },

  async forgotPassword(email: string) {
    return apiRequest<{ success: boolean; message: string; otp?: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(email: string, otp: string, newPassword: string) {
    return apiRequest<{ success: boolean; message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword }),
    });
  },

  // Purchase Requests
  async getPurchaseRequests(): Promise<PurchaseRequest[]> {
    const res = await apiRequest<{ success: boolean; data: PurchaseRequest[] }>('/requests');
    return res.data || [];
  },

  async createPurchaseRequest(payload: {
    title: string;
    department: string;
    priority: string;
    businessJustification: string;
    requiredDate: string;
    items: LineItem[];
  }): Promise<PurchaseRequest> {
    const res = await apiRequest<{ success: boolean; data: PurchaseRequest }>('/requests', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async approvePurchaseRequest(prId: string, comments?: string) {
    return apiRequest<{ success: boolean; data: PurchaseRequest }>(`/requests/${prId}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ comments }),
    });
  },

  async rejectPurchaseRequest(prId: string, comments?: string) {
    return apiRequest<{ success: boolean; data: PurchaseRequest }>(`/requests/${prId}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ comments }),
    });
  },

  // RFQs
  async getRFQs(): Promise<RFQ[]> {
    const res = await apiRequest<{ success: boolean; data: RFQ[] }>('/rfqs');
    return res.data || [];
  },

  async createRFQ(prId: string, deadline: string): Promise<RFQ> {
    const res = await apiRequest<{ success: boolean; data: RFQ }>('/rfqs', {
      method: 'POST',
      body: JSON.stringify({ prId, deadline }),
    });
    return res.data;
  },

  async submitBid(rfqId: string, bidData: {
    quotedAmount: number;
    deliveryDays: number;
    warrantyPeriodMonths: number;
    paymentTerms: string;
    notes?: string;
  }) {
    return apiRequest<{ success: boolean; data: RFQ }>(`/rfqs/${rfqId}/bids`, {
      method: 'POST',
      body: JSON.stringify(bidData),
    });
  },

  async awardBid(rfqId: string, bidId: string) {
    return apiRequest<{ success: boolean; data: any }>(`/rfqs/${rfqId}/award/${bidId}`, {
      method: 'POST',
    });
  },

  // Purchase Orders
  async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    const res = await apiRequest<{ success: boolean; data: PurchaseOrder[] }>('/orders');
    return res.data || [];
  },

  // Deliveries
  async getDeliveries(): Promise<DeliveryShipment[]> {
    const res = await apiRequest<{ success: boolean; data: DeliveryShipment[] }>('/deliveries');
    return res.data || [];
  },

  async verifyDeliveryQC(deliveryId: string) {
    return apiRequest<{ success: boolean; message: string; data: any }>(`/deliveries/${deliveryId}/qc`, {
      method: 'POST',
    });
  },

  // Vendors
  async getVendors(): Promise<Vendor[]> {
    const res = await apiRequest<{ success: boolean; data: Vendor[] }>('/vendors');
    return res.data || [];
  },

  // Audit Logs
  async getAuditLogs(): Promise<AuditLog[]> {
    const res = await apiRequest<{ success: boolean; data: AuditLog[] }>('/audits');
    return res.data || [];
  },
};

