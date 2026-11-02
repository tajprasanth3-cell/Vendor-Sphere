import { 
  UserAccount, 
  PurchaseRequest, 
  RFQ, 
  PurchaseOrder, 
  DeliveryShipment, 
  Vendor, 
  AuditLog 
} from '../types/index.js';

class DataStore {
  public users: UserAccount[] = [
    {
      id: 'usr-1',
      name: 'Elena Rostova',
      email: 'elena.rostova@enterprise.internal',
      role: 'procurement_manager',
      department: 'Global Sourcing & Procurement',
      passwordHash: 'password123',
    },
    {
      id: 'usr-2',
      name: 'Sarah Jenkins',
      email: 's.jenkins@enterprise.internal',
      role: 'requester',
      department: 'Infrastructure & DevOps',
      passwordHash: 'password123',
    },
    {
      id: 'usr-3',
      name: 'Alexander Vance',
      email: 'admin@enterprise.internal',
      role: 'admin',
      department: 'Compliance & IT Administration',
      passwordHash: 'password123',
    },
    {
      id: 'usr-4',
      name: 'David Vance',
      email: 'dvance@apexcloud.io',
      role: 'vendor',
      department: 'Apex Cloud Solutions Inc.',
      passwordHash: 'password123',
    },
  ];

  public purchaseRequests: PurchaseRequest[] = [
    {
      id: 'pr-1',
      code: 'PR-2026-0104',
      title: 'High-Density Rack Servers for AI Inference Cluster',
      department: 'Infrastructure & DevOps',
      requestedBy: {
        name: 'Sarah Jenkins',
        email: 's.jenkins@enterprise.internal',
      },
      priority: 'urgent',
      status: 'pending_procurement_review',
      currency: 'USD',
      businessJustification: 'Capacity expansion required to host fine-tuned procurement agent models and prevent SLA degradation in Q4.',
      createdAt: '2026-10-28 09:15',
      requiredDate: '2026-11-15',
      items: [
        {
          id: 'item-101',
          name: 'Dell PowerEdge R760xa Server (Dual Xeon Platinum)',
          category: 'Compute Hardware',
          quantity: 4,
          unit: 'units',
          estimatedUnitPrice: 14200,
          totalPrice: 56800,
          specifications: '2x Intel Xeon Platinum 8480+, 512GB DDR5 RAM, 4x NVIDIA L40S GPUs',
        },
        {
          id: 'item-102',
          name: '400GbE QSFP-DD Transceivers & Fiber Patch Cables',
          category: 'Networking',
          quantity: 16,
          unit: 'pcs',
          estimatedUnitPrice: 650,
          totalPrice: 10400,
          specifications: 'MPO-16 to 4x LC breakout, OM5 multimode fiber rated',
        },
      ],
      subtotal: 67200,
      estimatedTax: 5376,
      totalAmount: 72576,
      approvalChain: [
        {
          stepName: 'Department Head Sign-off',
          approverRole: 'VP of Engineering',
          approverName: 'Marcus Vance',
          status: 'approved',
          updatedAt: '2026-10-28 14:20',
          comments: 'Critical cluster refresh. Budget approved from Capex pool.',
        },
        {
          stepName: 'Procurement Technical Review',
          approverRole: 'Procurement Specialist',
          approverName: 'Elena Rostova',
          status: 'pending',
          comments: 'Analyzing market prices and checking vendor lead times.',
        },
        {
          stepName: 'Corporate Finance Sign-off',
          approverRole: 'CFO / Finance Director',
          approverName: 'Jonathan Davis',
          status: 'pending',
        },
      ],
    },
    {
      id: 'pr-2',
      code: 'PR-2026-0098',
      title: 'Enterprise Ergonomic Workstations & Standing Desks',
      department: 'Facilities & Workplace',
      requestedBy: {
        name: 'Michael Chen',
        email: 'm.chen@enterprise.internal',
      },
      priority: 'medium',
      status: 'approved',
      currency: 'USD',
      businessJustification: 'Equipping new floor wing for 35 incoming engineering and procurement staff.',
      createdAt: '2026-10-24 11:30',
      requiredDate: '2026-11-20',
      items: [
        {
          id: 'item-201',
          name: 'Herman Miller Aeron Chair (Size B, Fully Loaded)',
          category: 'Office Furniture',
          quantity: 35,
          unit: 'units',
          estimatedUnitPrice: 1195,
          totalPrice: 41825,
        },
      ],
      subtotal: 41825,
      estimatedTax: 3346,
      totalAmount: 45171,
      approvalChain: [
        {
          stepName: 'Facilities Director',
          approverRole: 'Facilities Head',
          approverName: 'Rachel Ross',
          status: 'approved',
          updatedAt: '2026-10-24 15:45',
        },
        {
          stepName: 'Procurement Review',
          approverRole: 'Senior Sourcing Mgr',
          approverName: 'Elena Rostova',
          status: 'approved',
          updatedAt: '2026-10-25 10:10',
        },
      ],
    },
  ];

  public rfqs: RFQ[] = [
    {
      id: 'rfq-1',
      code: 'RFQ-2026-0045',
      prId: 'pr-3',
      prCode: 'PR-2026-0092',
      title: 'Enterprise SIEM & Threat Intelligence Platform Bids',
      targetBudget: 90000,
      deadline: '2026-11-08',
      invitedVendorsCount: 3,
      status: 'evaluating',
      bids: [
        {
          id: 'bid-1',
          vendorId: 'ven-1',
          vendorName: 'Apex Cloud Solutions Inc.',
          vendorRating: 4.9,
          submittedAt: '2026-10-23 11:20',
          quotedAmount: 82500,
          deliveryDays: 5,
          warrantyPeriodMonths: 12,
          paymentTerms: 'Net 45 Days',
          complianceScore: 98,
          notes: 'Includes dedicated 24/7 technical architect support and zero egress data fees.',
          isRecommended: true,
          status: 'submitted',
        },
        {
          id: 'bid-2',
          vendorId: 'ven-2',
          vendorName: 'Sentinel Defense Technologies',
          vendorRating: 4.6,
          submittedAt: '2026-10-24 16:45',
          quotedAmount: 88900,
          deliveryDays: 7,
          warrantyPeriodMonths: 12,
          paymentTerms: 'Net 30 Days',
          complianceScore: 91,
          notes: 'Standard tier onboarding included.',
          isRecommended: false,
          status: 'submitted',
        },
      ],
    },
  ];

  public purchaseOrders: PurchaseOrder[] = [
    {
      id: 'po-1',
      poNumber: 'PO-2026-7841',
      rfqCode: 'RFQ-2026-0039',
      prCode: 'PR-2026-0081',
      vendorId: 'ven-4',
      vendorName: 'Nova Hardware Logistics Ltd',
      vendorEmail: 'procure@novahardware.com',
      items: [
        {
          id: 'it-1',
          name: 'Apple MacBook Pro 16" M3 Max (64GB RAM, 1TB SSD)',
          category: 'Hardware',
          quantity: 12,
          unit: 'units',
          estimatedUnitPrice: 3499,
          totalPrice: 41988,
        },
      ],
      totalAmount: 41988,
      currency: 'USD',
      paymentTerms: 'Net 30 Days',
      paymentStatus: 'paid',
      deliveryStatus: 'in_transit',
      matchingStatus: '3_way_matched',
      issueDate: '2026-10-22',
      expectedDeliveryDate: '2026-11-04',
      shippingAddress: '450 Innovation Parkway, Bldg 4, San Francisco, CA 94105',
    },
  ];

  public deliveries: DeliveryShipment[] = [
    {
      id: 'del-1',
      poNumber: 'PO-2026-7841',
      trackingNumber: 'FX-88912048991',
      carrier: 'FedEx Priority Freight',
      vendorName: 'Nova Hardware Logistics Ltd',
      status: 'in_transit',
      estimatedDelivery: '2026-11-04 14:00',
      itemsCount: 12,
      qcPassed: false,
      milestones: [
        {
          step: 'Order Dispatched from Factory Hub',
          timestamp: '2026-10-27 18:30',
          location: 'Austin Distribution Center, TX',
          completed: true,
        },
        {
          step: 'In Transit — Intermodal Transport',
          timestamp: '2026-10-30 06:15',
          location: 'Sacramento Transit Facility, CA',
          completed: true,
        },
        {
          step: 'Out for Final Commercial Delivery',
          timestamp: 'Estimated Nov 4',
          location: 'San Francisco Central Depot',
          completed: false,
        },
      ],
    },
  ];

  public vendors: Vendor[] = [
    {
      id: 'ven-1',
      code: 'VEN-001',
      name: 'Apex Cloud Solutions Inc.',
      category: 'Cloud Infrastructure & Security',
      contactPerson: 'David Vance',
      email: 'dvance@apexcloud.io',
      phone: '+1 (415) 890-2100',
      rating: 4.9,
      onTimeDeliveryRate: 99.2,
      qualityComplianceRate: 99.8,
      status: 'preferred',
      totalSpendYTD: 485000,
      activeOrdersCount: 2,
      address: '500 Howard Street, Suite 800, San Francisco, CA',
    },
    {
      id: 'ven-4',
      code: 'VEN-004',
      name: 'Nova Hardware Logistics Ltd',
      category: 'IT Hardware & Endpoints',
      contactPerson: 'Claire Bennett',
      email: 'c.bennett@novahardware.com',
      phone: '+1 (512) 674-9021',
      rating: 4.7,
      onTimeDeliveryRate: 96.5,
      qualityComplianceRate: 98.4,
      status: 'active',
      totalSpendYTD: 242000,
      activeOrdersCount: 1,
      address: '1200 Tech Ridge Parkway, Austin, TX',
    },
  ];

  public auditLogs: AuditLog[] = [
    {
      id: 'aud-1',
      action: 'APPROVAL_SIGN_OFF',
      entityType: 'PR',
      entityCode: 'PR-2026-0098',
      user: 'Jonathan Davis',
      role: 'FINANCE_DIRECTOR',
      timestamp: '2026-10-26 09:30',
      details: 'Final Capex authorization approved for $45,171.00',
    },
    {
      id: 'aud-2',
      action: 'PO_ISSUED',
      entityType: 'PO',
      entityCode: 'PO-2026-7841',
      user: 'Elena Rostova',
      role: 'PROCUREMENT_MANAGER',
      timestamp: '2026-10-22 14:00',
      details: 'Purchase Order created for Nova Hardware Logistics ($41,988.00).',
    },
  ];

  public addAudit(log: Omit<AuditLog, 'id' | 'timestamp'>) {
    const newLog: AuditLog = {
      ...log,
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    this.auditLogs.unshift(newLog);
    return newLog;
  }
}

export const db = new DataStore();

