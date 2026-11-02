import React, { useState } from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatCurrency } from '../../config';
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  Layers, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface PurchaseRequestsViewProps {
  onOpenCreateModal: () => void;
}

export const PurchaseRequestsView: React.FC<PurchaseRequestsViewProps> = ({ onOpenCreateModal }) => {
  const { 
    purchaseRequests, 
    approvePurchaseRequest, 
    rejectPurchaseRequest, 
    initiateRFQ, 
    role, 
    searchQuery,
    setActiveView 
  } = useProcurement();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedPRId, setExpandedPRId] = useState<string | null>('pr-1');

  const filtered = purchaseRequests.filter((pr) => {
    const matchesFilter =
      statusFilter === 'all' ||
      (statusFilter === 'pending' &&
        (pr.status === 'pending_dept_approval' || pr.status === 'pending_procurement_review')) ||
      (statusFilter === 'approved' && pr.status === 'approved') ||
      (statusFilter === 'rfq' && pr.status === 'rfq_initiated');

    const matchesSearch =
      pr.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.items.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Purchase Requisitions (PR)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage organizational purchasing demands, line item specs, and multi-tier authorization workflows.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={onOpenCreateModal}>
          + New Requisition
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5 sm:pb-3 overflow-x-auto scrollbar-none">
        {[
          { id: 'all', label: `All Requests (${purchaseRequests.length})` },
          { id: 'pending', label: 'Pending Approvals' },
          { id: 'approved', label: 'Approved (Ready for RFQ)' },
          { id: 'rfq', label: 'In Quotation Tender' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shrink-0 cursor-pointer ${
              statusFilter === tab.id
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Requisitions List */}
      <div className="space-y-3.5 sm:space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No purchase requests match your query.</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try adjusting the filter or search keywords.</p>
          </div>
        ) : (
          filtered.map((pr) => {
            const isExpanded = expandedPRId === pr.id;
            return (
              <div
                key={pr.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-slate-300 dark:hover:border-slate-700/80 transition-all shadow-xs"
              >
                {/* Collapsed Header Summary */}
                <div
                  className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 cursor-pointer select-none bg-slate-50/50 dark:bg-slate-900/60"
                  onClick={() => setExpandedPRId(isExpanded ? null : pr.id)}
                >
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                      <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{pr.code}</span>
                      <Badge status={pr.status} size="sm" />
                      <Badge status={pr.priority} label={`${pr.priority} priority`} size="sm" showDot={false} />
                      <span className="text-xs text-slate-500 dark:text-slate-400">• {pr.department}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">• Req. by {pr.requestedBy.name}</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white tracking-tight">{pr.title}</h3>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-4 sm:gap-6 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800">
                    <div className="text-left lg:text-right">
                      <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Estimated Budget</span>
                      <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                        {formatCurrency(pr.totalAmount)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Detailed Breakdown */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950/40 space-y-5 sm:space-y-6 animate-in fade-in duration-150">
                    {/* Business Justification */}
                    <div className="bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-lg p-3 sm:p-3.5">
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-300 mb-1">
                        Business Purpose & Justification:
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {pr.businessJustification}
                      </p>
                    </div>

                    {/* Line Items Table with Responsive Scroll */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                        Requisition Line Items ({pr.items.length})
                      </h4>
                      <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-x-auto">
                        <table className="w-full text-left text-xs min-w-[500px]">
                          <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                            <tr>
                              <th className="py-2.5 px-3">Item Description</th>
                              <th className="py-2.5 px-3">Category</th>
                              <th className="py-2.5 px-3">Qty</th>
                              <th className="py-2.5 px-3">Est. Unit Price</th>
                              <th className="py-2.5 px-3 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                            {pr.items.map((item) => (
                              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                <td className="py-2.5 px-3">
                                  <div className="font-medium text-slate-900 dark:text-white">{item.name}</div>
                                  {item.specifications && (
                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                                      {item.specifications}
                                    </div>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{item.category}</td>
                                <td className="py-2.5 px-3 font-semibold">
                                  {item.quantity} {item.unit}
                                </td>
                                <td className="py-2.5 px-3">{formatCurrency(item.estimatedUnitPrice)}</td>
                                <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                                  {formatCurrency(item.totalPrice)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 font-medium text-xs">
                            <tr>
                              <td colSpan={4} className="py-2 px-3 text-right text-slate-500 dark:text-slate-400">
                                Subtotal:
                              </td>
                              <td className="py-2 px-3 text-right text-slate-900 dark:text-white">
                                {formatCurrency(pr.subtotal)}
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={4} className="py-2 px-3 text-right text-slate-500 dark:text-slate-400">
                                Estimated Tax (8%):
                              </td>
                              <td className="py-2 px-3 text-right text-slate-900 dark:text-white">
                                {formatCurrency(pr.estimatedTax)}
                              </td>
                            </tr>
                            <tr className="font-bold text-sm text-blue-600 dark:text-blue-400">
                              <td colSpan={4} className="py-2 px-3 text-right">
                                Grand Total Requisition:
                              </td>
                              <td className="py-2 px-3 text-right">
                                {formatCurrency(pr.totalAmount)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>

                    {/* Multi-Tier Approval Chain Stepper */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        Multi-Level Approval Hierarchy
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {pr.approvalChain.map((step, idx) => {
                          const isApproved = step.status === 'approved';
                          const isPending = step.status === 'pending';
                          return (
                            <div
                              key={idx}
                              className={`p-3 rounded-lg border text-xs ${
                                isApproved
                                  ? 'bg-emerald-50/70 border-emerald-200 text-slate-800 dark:bg-emerald-500/5 dark:border-emerald-500/20 dark:text-slate-200'
                                  : isPending
                                  ? 'bg-amber-50/70 border-amber-200 text-slate-800 dark:bg-amber-500/5 dark:border-amber-500/20 dark:text-slate-300'
                                  : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-slate-900 dark:text-white">{step.stepName}</span>
                                {isApproved ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                ) : (
                                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">{step.approverRole}</div>
                              {step.approverName && (
                                <div className="text-[11px] text-slate-800 dark:text-slate-300 font-medium mt-0.5">
                                  {step.approverName}
                                </div>
                              )}
                              {step.updatedAt && (
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                                  Signed: {step.updatedAt}
                                </div>
                              )}
                              {step.comments && (
                                <div className="text-[11px] text-slate-600 dark:text-slate-400 italic mt-1 bg-white/70 dark:bg-slate-950/40 p-1.5 rounded border border-slate-200 dark:border-slate-800">
                                  "{step.comments}"
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Operational Action Footer */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 sm:pt-4 border-t border-slate-200 dark:border-slate-800">
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Date Required: <strong className="text-slate-800 dark:text-slate-200">{pr.requiredDate}</strong>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
                        {pr.status.startsWith('pending') &&
                          (role === 'procurement_manager' || role === 'admin') && (
                            <>
                              <Button
                                variant="danger"
                                size="sm"
                                icon={<XCircle className="w-4 h-4" />}
                                onClick={() => rejectPurchaseRequest(pr.id, 'Budget criteria not met')}
                              >
                                Reject
                              </Button>
                              <Button
                                variant="primary"
                                size="sm"
                                icon={<CheckCircle2 className="w-4 h-4" />}
                                onClick={() => approvePurchaseRequest(pr.id)}
                              >
                                Approve Next Level
                              </Button>
                            </>
                          )}

                        {pr.status === 'approved' &&
                          (role === 'procurement_manager' || role === 'admin') && (
                            <Button
                              variant="success"
                              size="sm"
                              icon={<Layers className="w-4 h-4" />}
                              onClick={() => {
                                initiateRFQ(pr.id, '2026-11-15');
                                setActiveView('quotations');
                              }}
                            >
                              Initiate RFQ Tender Sourcing
                            </Button>
                          )}

                        {pr.status === 'rfq_initiated' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={<Send className="w-4 h-4" />}
                            onClick={() => setActiveView('quotations')}
                          >
                            View Active RFQ Matrix
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
