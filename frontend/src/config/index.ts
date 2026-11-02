import { UserRole } from '../types';

export interface AppConfig {
  name: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  apiBaseUrl: string;
  defaultCurrency: string;
  currencySymbol: string;
  approvalThresholds: {
    departmentHeadOnly: number;
    procurementManagerRequired: number;
    financeDirectorRequired: number;
  };
  roles: {
    id: UserRole;
    label: string;
    description: string;
    badgeColor: string;
  }[];
}

export const APP_CONFIG: AppConfig = {
  name: 'VendorSphere',
  version: '2.4.0-enterprise',
  environment: 'development',
  apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  defaultCurrency: 'USD',
  currencySymbol: '$',
  approvalThresholds: {
    departmentHeadOnly: 5000,
    procurementManagerRequired: 25000,
    financeDirectorRequired: 50000,
  },
  roles: [
    {
      id: 'procurement_manager',
      label: 'Procurement Manager',
      description: 'Reviews requests, issues RFQs, compares bids, and manages vendors.',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
    },
    {
      id: 'requester',
      label: 'Department Requester',
      description: 'Creates purchase requisitions, tracks approvals, and inspects receipts.',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20',
    },
    {
      id: 'admin',
      label: 'System Administrator',
      description: 'Controls organizational policies, user access, and compliance audits.',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20',
    },
    {
      id: 'vendor',
      label: 'Vendor Portal (Supplier)',
      description: 'Submits competitive quotation bids and updates shipment dispatch status.',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    },
  ],
};

export const formatCurrency = (amount: number, currency = APP_CONFIG.currencySymbol): string => {
  return `${currency}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const getStatusBadgeStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved':
    case 'preferred':
    case 'paid':
    case 'delivered':
    case 'quality_check_passed':
    case '3_way_matched':
    case 'awarded':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30 dark:ring-emerald-500/20';
    case 'pending_dept_approval':
    case 'pending_procurement_review':
    case 'pending_finance_approval':
    case 'evaluating':
    case 'in_transit':
    case 'processing':
    case 'under_review':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30 dark:ring-amber-500/20';
    case 'urgent':
    case 'rejected':
    case 'blocked':
    case 'discrepancy':
    case 'disqualified':
      return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30 dark:ring-rose-500/20';
    case 'high':
      return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/30 dark:ring-orange-500/20';
    case 'open':
    case 'rfq_initiated':
    case 'active':
    case 'shipped':
    case 'out_for_delivery':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30 dark:ring-blue-500/20';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/30 dark:ring-slate-500/20';
  }
};
