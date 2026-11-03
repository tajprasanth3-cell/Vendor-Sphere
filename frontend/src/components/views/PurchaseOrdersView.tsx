import React, { useState } from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatCurrency } from '../../config';
import { 
  ShoppingBag, 
  Printer, 
  CheckCircle2,
  Truck,
  FileText,
  DollarSign,
  Calendar,
  Building2,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { PurchaseOrder } from '../../types';

export const PurchaseOrdersView: React.FC = () => {
  const { purchaseOrders, searchQuery, setActiveView } = useProcurement();
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const totalCommittedValue = purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0);
  const inTransitCount = purchaseOrders.filter((po) => po.deliveryStatus === 'in_transit').length;
  const matchedCount = purchaseOrders.filter((po) => po.matchingStatus === '3_way_matched').length;

  const filtered = purchaseOrders.filter((po) => {
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.prCode.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'in_transit') return po.deliveryStatus === 'in_transit';
    if (statusFilter === 'delivered') return po.deliveryStatus === 'delivered' || po.deliveryStatus === 'inspected';
    if (statusFilter === 'matched') return po.matchingStatus === '3_way_matched';

    return true;
  });

  return (
    <div className="purchase-orders-view space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="truncate">Purchase Orders (PO) & Commitments</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed break-words">
            Confirmed contractual purchasing records, payment terms enforcement, and 3-way matching validation.
          </p>
        </div>
      </div>

      {/* Enterprise Metrics Bar */}
      <div className="po-metrics-grid grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
            <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>Active Orders</span>
          </div>
          <div className="mt-1 text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {purchaseOrders.length}
          </div>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Committed Value</span>
          </div>
          <div className="mt-1 text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
            {formatCurrency(totalCommittedValue)}
          </div>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
            <Truck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>In-Transit Shipments</span>
          </div>
          <div className="mt-1 text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {inTransitCount}
          </div>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
            <span>3-Way Match Rate</span>
          </div>
          <div className="mt-1 text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {purchaseOrders.length > 0 ? Math.round((matchedCount / purchaseOrders.length) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* PO Filter Tabs */}
      <div className="po-filter-tabs flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'all', label: `All Orders (${purchaseOrders.length})` },
          { id: 'in_transit', label: `In Transit (${inTransitCount})` },
          { id: 'delivered', label: 'Inspected / Delivered' },
          { id: 'matched', label: '3-Way Matched' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shrink-0 cursor-pointer ${
              statusFilter === tab.id
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Mobile Cards Layout (< 640px) - Zero Overflow, Adjusted Snug Padding */}
      <div className="sm:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No purchase orders found</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Try adjusting your search query or filter.</p>
          </div>
        ) : (
          filtered.map((po) => (
            <div
              key={po.id}
              className="po-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-3 shadow-xs"
            >
              {/* Card Header: PO Number + Status Badges */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs sm:text-sm truncate">
                    {po.poNumber}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                    Ref: {po.prCode}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                  <Badge status={po.deliveryStatus} size="sm" />
                  <Badge status={po.matchingStatus} size="sm" />
                </div>
              </div>

              {/* Vendor & Details */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-semibold">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{po.vendorName}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block">Committed Total:</span>
                    <strong className="text-slate-900 dark:text-white text-xs font-bold">
                      {formatCurrency(po.totalAmount)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block">Payment Terms:</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      {po.paymentTerms}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>Issued: {po.issueDate}</span>
                  </span>
                  <span>Due: {po.expectedDeliveryDate}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="po-card-actions grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <Button
                  size="sm"
                  variant="secondary"
                  icon={<FileText className="w-3.5 h-3.5" />}
                  onClick={() => setSelectedPO(po)}
                  className="w-full justify-center text-xs min-h-[36px]"
                >
                  Voucher
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Truck className="w-3.5 h-3.5" />}
                  onClick={() => setActiveView('deliveries')}
                  className="w-full justify-center text-xs min-h-[36px]"
                >
                  Track
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 2. Tablet & Desktop Structured Table (>= 640px) */}
      <div className="hidden sm:block po-table-container bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="po-table-wrapper overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs min-w-[720px]">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-3 sm:px-4">PO Number</th>
                <th className="py-3 px-3 sm:px-4">Awarded Vendor</th>
                <th className="py-3 px-3 sm:px-4">Requisition</th>
                <th className="py-3 px-3 sm:px-4">Amount</th>
                <th className="py-3 px-3 sm:px-4">Payment Terms</th>
                <th className="py-3 px-3 sm:px-4">Delivery Status</th>
                <th className="py-3 px-3 sm:px-4">3-Way Match</th>
                <th className="py-3 px-3 sm:px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    No purchase orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 sm:px-4 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                      {po.poNumber}
                    </td>
                    <td className="py-3 px-3 sm:px-4 font-semibold text-slate-900 dark:text-white">
                      {po.vendorName}
                    </td>
                    <td className="py-3 px-3 sm:px-4 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {po.prCode}
                    </td>
                    <td className="py-3 px-3 sm:px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {formatCurrency(po.totalAmount)}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {po.paymentTerms}
                    </td>
                    <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                      <Badge status={po.deliveryStatus} size="sm" />
                    </td>
                    <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                      <Badge status={po.matchingStatus} size="sm" />
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setSelectedPO(po)}
                        >
                          Voucher
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setActiveView('deliveries')}
                        >
                          Track
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PO Document Voucher Modal */}
      {selectedPO && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedPO(null)}
          title={`Purchase Order Voucher — ${selectedPO.poNumber}`}
          subtitle="Legally binding commitment dispatch for supplier fulfillment."
          maxWidth="4xl"
        >
          <div className="po-voucher-modal space-y-4 sm:space-y-6 text-slate-800 dark:text-slate-200">
            {/* Header info */}
            <div className="bg-slate-50 dark:bg-slate-950 p-3.5 sm:p-5 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
              <div>
                <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">VendorSphere Enterprise</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Corporate Procurement & Global Sourcing Division<br />
                  450 Innovation Parkway, San Francisco, CA
                </p>
              </div>
              <div className="text-left sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800 w-full sm:w-auto">
                <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">PURCHASE ORDER</div>
                <div className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400 font-mono">{selectedPO.poNumber}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Date: {selectedPO.issueDate}</div>
              </div>
            </div>

            {/* Vendor and Ship To */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 text-xs">
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 sm:p-4 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Vendor Information:
                </span>
                <strong className="text-slate-900 dark:text-white text-xs sm:text-sm block">{selectedPO.vendorName}</strong>
                <span className="text-slate-600 dark:text-slate-400 block mt-1 break-words">Email: {selectedPO.vendorEmail}</span>
                <span className="text-slate-600 dark:text-slate-400 block">Terms: {selectedPO.paymentTerms}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 sm:p-4 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Deliver To / Destination:
                </span>
                <strong className="text-slate-900 dark:text-white text-xs sm:text-sm block">Central Receiving Dock 4</strong>
                <span className="text-slate-600 dark:text-slate-400 block mt-1 break-words">{selectedPO.shippingAddress}</span>
                <span className="text-slate-600 dark:text-slate-400 block mt-0.5">
                  Expected Delivery: <strong className="text-blue-600 dark:text-blue-400">{selectedPO.expectedDeliveryDate}</strong>
                </span>
              </div>
            </div>

            {/* Items Breakdown (Responsive Mobile Cards + Desktop Table) */}
            <div className="space-y-2">
              <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Contract Line Items ({selectedPO.items.length})
              </div>

              {/* Mobile items breakdown */}
              <div className="sm:hidden space-y-2">
                {selectedPO.items.map((i) => (
                  <div key={i.id} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 space-y-1.5 text-xs">
                    <div className="font-semibold text-slate-900 dark:text-white break-words">
                      {i.name}
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/80 dark:border-slate-800/80 text-[11px]">
                      <span className="text-slate-500 dark:text-slate-400">
                        {i.quantity} {i.unit} × {formatCurrency(i.estimatedUnitPrice)}
                      </span>
                      <strong className="text-slate-900 dark:text-white text-xs">
                        {formatCurrency(i.totalPrice)}
                      </strong>
                    </div>
                  </div>
                ))}
                <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-950/80 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                  <span>Total Order Amount:</span>
                  <span>{formatCurrency(selectedPO.totalAmount)}</span>
                </div>
              </div>

              {/* Desktop items table */}
              <div className="hidden sm:block border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs min-w-[480px]">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3 sm:px-4">Item & Specifications</th>
                      <th className="py-2.5 px-3 sm:px-4">Qty</th>
                      <th className="py-2.5 px-3 sm:px-4">Unit Rate</th>
                      <th className="py-2.5 px-3 sm:px-4 text-right">Net Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {selectedPO.items.map((i) => (
                      <tr key={i.id}>
                        <td className="py-2.5 px-3 sm:px-4 font-medium text-slate-900 dark:text-white">{i.name}</td>
                        <td className="py-2.5 px-3 sm:px-4">{i.quantity} {i.unit}</td>
                        <td className="py-2.5 px-3 sm:px-4">{formatCurrency(i.estimatedUnitPrice)}</td>
                        <td className="py-2.5 px-3 sm:px-4 text-right font-bold text-slate-900 dark:text-white">
                          {formatCurrency(i.totalPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 dark:bg-slate-950 font-bold border-t border-slate-200 dark:border-slate-800">
                    <tr>
                      <td colSpan={3} className="py-2.5 px-3 sm:px-4 text-right text-slate-600 dark:text-slate-300">
                        Total Purchase Order Amount:
                      </td>
                      <td className="py-2.5 px-3 sm:px-4 text-right text-blue-600 dark:text-blue-400 text-sm">
                        {formatCurrency(selectedPO.totalAmount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Matching verification badge */}
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 p-2.5 sm:p-3 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="leading-snug">3-Way Matching Engine: Requisition + PO + Vendor Acceptance Verified</span>
              </div>
              <Badge status={selectedPO.matchingStatus} size="sm" />
            </div>

            {/* Voucher Footer Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                icon={<Printer className="w-4 h-4" />}
                onClick={() => window.print()}
                className="w-full sm:w-auto justify-center min-h-[38px]"
              >
                Print / Save PDF
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedPO(null)}
                className="w-full sm:w-auto justify-center min-h-[38px]"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
