export type UserRole = 'requester' | 'procurement_manager' | 'admin' | 'vendor';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}

export type PRStatus = 
  | 'draft'
  | 'pending_dept_approval'
  | 'pending_procurement_review'
  | 'pending_finance_approval'
  | 'approved'
  | 'rejected'
  | 'rfq_initiated'
  | 'completed';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface LineItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  estimatedUnitPrice: number;
  totalPrice: number;
  specifications?: string;
}

export interface ApprovalStep {
  stepName: string;
  approverRole: string;
  approverName?: string;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  updatedAt?: string;
  comments?: string;
}

export interface PurchaseRequest {
  id: string;
  code: string; // e.g. PR-2026-0042
  title: string;
  department: string;
  requestedBy: {
    name: string;
    email: string;
    avatar?: string;
  };
  priority: Priority;
  status: PRStatus;
  items: LineItem[];
  subtotal: number;
  estimatedTax: number;
  totalAmount: number;
  currency: string;
  businessJustification: string;
  createdAt: string;
  requiredDate: string;
  approvalChain: ApprovalStep[];
}

export interface VendorBid {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorRating: number;
  submittedAt: string;
  quotedAmount: number;
  deliveryDays: number;
  warrantyPeriodMonths: number;
  paymentTerms: string;
  complianceScore: number; // 0 - 100
  scoreBreakdown: {
    pricing: number;
    deliverySpeed: number;
    reputation: number;
  };
  notes: string;
  isRecommended?: boolean;
  status: 'submitted' | 'under_review' | 'awarded' | 'disqualified';
}

export interface RFQ {
  id: string;
  code: string; // e.g. RFQ-2026-018
  prId: string;
  prCode: string;
  title: string;
  targetBudget: number;
  deadline: string;
  invitedVendorsCount: number;
  status: 'open' | 'evaluating' | 'awarded' | 'closed';
  bids: VendorBid[];
  awardedBidId?: string;
  notes?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string; // e.g. PO-88214
  rfqCode?: string;
  prCode: string;
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  items: LineItem[];
  totalAmount: number;
  currency: string;
  paymentTerms: string;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  deliveryStatus: 'processing' | 'shipped' | 'in_transit' | 'delivered' | 'inspected';
  matchingStatus: '3_way_matched' | 'pending_invoice' | 'discrepancy';
  issueDate: string;
  expectedDeliveryDate: string;
  shippingAddress: string;
}

export interface DeliveryMilestone {
  step: string;
  timestamp: string;
  location: string;
  completed: boolean;
  notes?: string;
}

export interface DeliveryShipment {
  id: string;
  poNumber: string;
  trackingNumber: string;
  carrier: string;
  vendorName: string;
  status: 'in_transit' | 'out_for_delivery' | 'delivered' | 'quality_check_passed';
  estimatedDelivery: string;
  deliveredDate?: string;
  milestones: DeliveryMilestone[];
  itemsCount: number;
  qcPassed: boolean;
}

export interface Vendor {
  id: string;
  code: string;
  name: string;
  category: string;
  contactPerson: string;
  email: string;
  phone: string;
  rating: number; // out of 5.0
  onTimeDeliveryRate: number; // percentage
  qualityComplianceRate: number; // percentage
  status: 'preferred' | 'active' | 'under_review' | 'blocked';
  totalSpendYTD: number;
  activeOrdersCount: number;
  address: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: 'PR' | 'RFQ' | 'PO' | 'DELIVERY' | 'VENDOR' | 'AUTH';
  entityCode: string;
  user: string;
  role: string;
  timestamp: string;
  details: string;
}

