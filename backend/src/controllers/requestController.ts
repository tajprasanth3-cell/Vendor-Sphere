import { Response } from 'express';
import { db } from '../db/store.js';
import { AuthenticatedRequest, PurchaseRequest, LineItem } from '../types/index.js';

export const getAllRequests = (req: AuthenticatedRequest, res: Response): void => {
  const { status, department, search } = req.query;
  const user = req.user;

  // RBAC: Vendor partners have NO access to internal enterprise purchase requisitions
  if (user?.role === 'vendor') {
    res.json({
      success: true,
      count: 0,
      data: [],
    });
    return;
  }

  let results = [...db.purchaseRequests];

  // RBAC: Department Requester only sees requisitions submitted by them or their department
  if (user?.role === 'requester') {
    const userEmail = user.email.toLowerCase();
    const userDept = (user.department || '').toLowerCase();
    results = results.filter((p) => {
      const matchEmail = p.requestedBy?.email?.toLowerCase() === userEmail;
      const matchDept = userDept && (
        p.department.toLowerCase().includes('infra') || 
        p.department.toLowerCase().includes('devops') || 
        p.department.toLowerCase().includes('engineering') ||
        p.department.toLowerCase() === userDept
      );
      return matchEmail || matchDept;
    });
  }

  if (status && typeof status === 'string') {
    results = results.filter((p) => p.status === status);
  }

  if (department && typeof department === 'string') {
    results = results.filter((p) => p.department.toLowerCase() === department.toLowerCase());
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(
      (p) =>
        p.code.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.businessJustification.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    count: results.length,
    data: results,
  });
};

export const getRequestById = (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const user = req.user;

  if (user?.role === 'vendor') {
    res.status(403).json({ success: false, message: 'Access denied: Vendor accounts cannot access internal requisitions.' });
    return;
  }

  const pr = db.purchaseRequests.find((p) => p.id === id || p.code === id);

  if (!pr) {
    res.status(404).json({ success: false, message: 'Purchase request not found.' });
    return;
  }

  // Requester check
  if (user?.role === 'requester') {
    const userEmail = user.email.toLowerCase();
    const matchEmail = pr.requestedBy?.email?.toLowerCase() === userEmail;
    const matchDept = pr.department.toLowerCase().includes('infra') || pr.department.toLowerCase().includes('devops');
    if (!matchEmail && !matchDept) {
      res.status(403).json({ success: false, message: 'Access denied to requisitions outside your department.' });
      return;
    }
  }

  res.json({ success: true, data: pr });
};

export const createRequest = (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user;
  if (user?.role === 'vendor') {
    res.status(403).json({ success: false, message: 'Vendors cannot file internal purchase requisitions.' });
    return;
  }

  const { title, department, priority, businessJustification, requiredDate, items } = req.body;

  if (!title || !items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({
      success: false,
      message: 'Requisition title and at least one item line are mandatory.',
    });
    return;
  }

  const processedItems: LineItem[] = items.map((it: any, idx: number) => ({
    id: `item-${Date.now()}-${idx}`,
    name: it.name,
    category: it.category || 'Standard Goods',
    quantity: Number(it.quantity) || 1,
    unit: it.unit || 'unit',
    estimatedUnitPrice: Number(it.estimatedUnitPrice) || 0,
    totalPrice: (Number(it.quantity) || 1) * (Number(it.estimatedUnitPrice) || 0),
    specifications: it.specifications || '',
  }));

  const subtotal = processedItems.reduce((acc, it) => acc + it.totalPrice, 0);
  const estimatedTax = Math.round(subtotal * 0.08 * 100) / 100;
  const totalAmount = subtotal + estimatedTax;

  const prCode = `PR-2026-0${Math.floor(100 + Math.random() * 899)}`;
  const newPR: PurchaseRequest = {
    id: `pr-${Date.now()}`,
    code: prCode,
    title,
    department: department || user?.department || 'Operations',
    requestedBy: {
      name: user?.name || 'Authorized Requester',
      email: user?.email || 'requester@enterprise.internal',
    },
    priority: priority || 'medium',
    status: 'pending_dept_approval',
    items: processedItems,
    subtotal,
    estimatedTax,
    totalAmount,
    currency: 'USD',
    businessJustification: businessJustification || 'Procurement requirement for operational continuity.',
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    requiredDate: requiredDate || '2026-12-15',
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

  db.purchaseRequests.unshift(newPR);

  db.addAudit({
    action: 'PR_CREATED',
    entityType: 'PR',
    entityCode: prCode,
    user: user?.name || 'Enterprise User',
    role: (user?.role || 'requester').toUpperCase(),
    details: `Requisition filed for ${newPR.department} totaling $${totalAmount.toLocaleString()}`,
  });

  res.status(201).json({
    success: true,
    message: `Purchase Requisition ${prCode} created successfully.`,
    data: newPR,
  });
};

export const approveRequestStep = (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const { comments } = req.body;
  const user = req.user;

  if (user?.role !== 'procurement_manager' && user?.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Forbidden: Insufficient privileges to approve requisitions.' });
    return;
  }

  const pr = db.purchaseRequests.find((p) => p.id === id || p.code === id);
  if (!pr) {
    res.status(404).json({ success: false, message: 'Purchase request not found.' });
    return;
  }

  const nextStep = pr.approvalChain.find((step) => step.status === 'pending');
  if (nextStep) {
    nextStep.status = 'approved';
    nextStep.approverName = user?.name || 'Authorized Approver';
    nextStep.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
    nextStep.comments = comments || 'Approved in compliance with procurement thresholds.';
  }

  const allApproved = pr.approvalChain.every((s) => s.status === 'approved');
  if (allApproved) {
    pr.status = 'approved';
  } else {
    pr.status = 'pending_procurement_review';
  }

  db.addAudit({
    action: 'PR_APPROVED',
    entityType: 'PR',
    entityCode: pr.code,
    user: user?.name || 'Elena Rostova',
    role: (user?.role || 'procurement_manager').toUpperCase(),
    details: `Approved step "${nextStep?.stepName || 'Approval Step'}". Status: ${pr.status}`,
  });

  res.json({
    success: true,
    message: `Requisition ${pr.code} approval progressed successfully.`,
    data: pr,
  });
};

export const rejectRequest = (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const { comments } = req.body;
  const user = req.user;

  if (user?.role !== 'procurement_manager' && user?.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Forbidden: Insufficient privileges to reject requisitions.' });
    return;
  }

  const pr = db.purchaseRequests.find((p) => p.id === id || p.code === id);
  if (!pr) {
    res.status(404).json({ success: false, message: 'Purchase request not found.' });
    return;
  }

  pr.status = 'rejected';
  pr.approvalChain.forEach((s) => {
    if (s.status === 'pending') {
      s.status = 'rejected';
      s.approverName = user?.name || 'Procurement Officer';
      s.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
      s.comments = comments || 'Requisition rejected.';
    }
  });

  db.addAudit({
    action: 'PR_REJECTED',
    entityType: 'PR',
    entityCode: pr.code,
    user: user?.name || 'Elena Rostova',
    role: (user?.role || 'procurement_manager').toUpperCase(),
    details: `Requisition declined. Reason: ${comments || 'Procurement review rejection.'}`,
  });

  res.json({
    success: true,
    message: `Requisition ${pr.code} was rejected.`,
    data: pr,
  });
};
