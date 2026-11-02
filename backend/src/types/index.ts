import { Request } from 'express';

export type UserRole = 'requester' | 'procurement_manager' | 'admin' | 'vendor';

export interface AuthPayload {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

export interface UserAccount extends AuthPayload {
  passwordHash: string;
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
  code: string;
  title: string;
  department: string;
  requestedBy: {
    name: string;
    email: string;
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
  complianceScore: number;
  notes: string;
  isRecommended?: boolean;
  status: 'submitted' | 'under_review' | 'awarded' | 'disqualified';
}

export interface RFQ {
  id: string;
  code: string;
  prId: string;
  prCode: string;
  title: string;
  targetBudget: number;
  deadline: string;
  invitedVendorsCount: number;
  status: 'open' | 'evaluating' | 'awarded' | 'closed';
  bids: VendorBid[];
  awardedBidId?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
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
}

export interface DeliveryShipment {
  id: string;
  poNumber: string;
  trackingNumber: string;
  carrier: string;
  vendorName: string;
  status: 'in_transit' | 'out_for_delivery' | 'delivered' | 'quality_check_passed';
  estimatedDelivery: string;
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
  rating: number;
  onTimeDeliveryRate: number;
  qualityComplianceRate: number;
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

