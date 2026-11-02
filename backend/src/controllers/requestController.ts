import { Response } from 'express';
import { db } from '../db/store.js';
import { AuthenticatedRequest, PurchaseRequest, LineItem } from '../types/index.js';

export const getAllRequests = (req: AuthenticatedRequest, res: Response): void => {
  const { status, department, search } = req.query;

  let results = [...db.purchaseRequests];

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
  const pr = db.purchaseRequests.find((p) => p.id === id || p.code === id);

  if (!pr) {
    res.status(404).json({ success: false, message: 'Purchase request not found.' });
    return;
  }

  res.json({ success: true, data: pr });
};

export const createRequest = (req: AuthenticatedRequest, res: Response): void => {
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
    category: it.category || 'General Supplies',
    quantity: Number(it.quantity) || 1,
    unit: it.unit || 'units',
    estimatedUnitPrice: Number(it.estimatedUnitPrice) || 0,
    totalPrice: (Number(it.quantity) || 1) * (Number(it.estimatedUnitPrice) || 0),
    specifications: it.specifications,
  }));

  const subtotal = processedItems.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const estimatedTax = subtotal * 0.08;
  const totalAmount = subtotal + estimatedTax;
  const prCode = `PR-2026-0${Math.floor(100 + Math.random() * 900)}`;

  const newPR: PurchaseRequest = {
    id: `pr-${Date.now()}`,
    code: prCode,
    title,
    department: department || req.user?.department || 'Operations',
    requestedBy: {
      name: req.user?.name || 'Authorized Requester',
      email: req.user?.email || 'requester@enterprise.internal',
    },
    priority: priority || 'medium',
    status: 'pending_dept_approval',
    items: processedItems,
    subtotal,
    estimatedTax,
    totalAmount,
    currency: 'USD',
    businessJustification: businessJustification || 'No justification provided.',
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    requiredDate: requiredDate || '2026-12-01',
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
    user: req.user?.name || 'Requester',
    role: (req.user?.role || 'requester').toUpperCase(),
    details: `Requisition filed for ${newPR.department}: $${totalAmount.toLocaleString()}`,
  });

  res.status(201).json({
    success: true,
    message: 'Purchase Requisition successfully submitted for multi-level review.',
    data: newPR,
  });
};

export const approveRequestStep = (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const { comments } = req.body;

  const pr = db.purchaseRequests.find((p) => p.id === id);
  if (!pr) {
    res.status(404).json({ success: false, message: 'Purchase request not found.' });
    return;
  }

  const nextPendingStep = pr.approvalChain.find((s) => s.status === 'pending');
  if (!nextPendingStep) {
    res.status(400).json({ success: false, message: 'All approval steps are already finalized.' });
    return;
  }

  nextPendingStep.status = 'approved';
  nextPendingStep.approverName = req.user?.name;
  nextPendingStep.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
  nextPendingStep.comments = comments || 'Approved according to corporate policy guidelines.';

  const allApproved = pr.approvalChain.every((s) => s.status === 'approved');
  pr.status = allApproved ? 'approved' : 'pending_procurement_review';

  db.addAudit({
    action: 'PR_STEP_APPROVED',
    entityType: 'PR',
    entityCode: pr.code,
    user: req.user?.name || 'Approver',
    role: (req.user?.role || 'admin').toUpperCase(),
    details: `Step '${nextPendingStep.stepName}' approved. Status is now ${pr.status}.`,
  });

  res.json({
    success: true,
    message: `Approval step recorded. Next state: ${pr.status}.`,
    data: pr,
  });
};

export const rejectRequest = (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const { reason } = req.body;

  const pr = db.purchaseRequests.find((p) => p.id === id);
  if (!pr) {
    res.status(404).json({ success: false, message: 'Purchase request not found.' });
    return;
  }

  pr.status = 'rejected';

  db.addAudit({
    action: 'PR_REJECTED',
    entityType: 'PR',
    entityCode: pr.code,
    user: req.user?.name || 'Reviewer',
    role: (req.user?.role || 'admin').toUpperCase(),
    details: `Requisition rejected. Justification: ${reason || 'Criteria not met.'}`,
  });

  res.json({
    success: true,
    message: 'Requisition marked as rejected.',
    data: pr,
  });
};

