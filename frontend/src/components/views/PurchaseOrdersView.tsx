import React, { useState } from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatCurrency } from '../../config';
import { 
  ShoppingBag, 
  Printer, 
  CheckCircle2
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { PurchaseOrder } from '../../types';

export const PurchaseOrdersView: React.FC = () => {
  const { purchaseOrders, searchQuery, setActiveView } = useProcurement();
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

  const filtered = purchaseOrders.filter((po) =>
    po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    po.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    po.prCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Purchase Orders (PO) & Commitments
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Confirmed contractual purchasing records, payment terms enforcement, and 3-way matching validation.
          </p>
        </div>
      </div>

      {/* PO Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
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
              {filtered.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 sm:px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                    {po.poNumber}
                  </td>
                  <td className="py-3 px-3 sm:px-4 font-semibold text-slate-900 dark:text-white">
                    {po.vendorName}
                  </td>
                  <td className="py-3 px-3 sm:px-4 font-mono text-slate-500 dark:text-slate-400">
                    {po.prCode}
                  </td>
                  <td className="py-3 px-3 sm:px-4 font-bold text-slate-900 dark:text-white">
                    {formatCurrency(po.totalAmount)}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-slate-600 dark:text-slate-300">
                    {po.paymentTerms}
                  </td>
                  <td className="py-3 px-3 sm:px-4">
                    <Badge status={po.deliveryStatus} size="sm" />
                  </td>
                  <td className="py-3 px-3 sm:px-4">
                    <Badge status={po.matchingStatus} size="sm" />
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-right">
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
              ))}
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
          <div className="space-y-5 sm:space-y-6 text-slate-800 dark:text-slate-200">
            {/* Header info */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">VendorSphere Enterprise</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Corporate Procurement & Global Sourcing Division<br />
                  450 Innovation Parkway, San Francisco, CA
                </p>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">PURCHASE ORDER</div>
                <div className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400 font-mono">{selectedPO.poNumber}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Date: {selectedPO.issueDate}</div>
              </div>
            </div>

            {/* Vendor and Ship To */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Vendor Information:
                </span>
                <strong className="text-slate-900 dark:text-white text-sm block">{selectedPO.vendorName}</strong>
                <span className="text-slate-600 dark:text-slate-400 block mt-1">Email: {selectedPO.vendorEmail}</span>
                <span className="text-slate-600 dark:text-slate-400 block">Terms: {selectedPO.paymentTerms}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Deliver To / Shipping Destination:
                </span>
                <strong className="text-slate-900 dark:text-white text-sm block">Central Receiving Dock 4</strong>
                <span className="text-slate-600 dark:text-slate-400 block mt-1">{selectedPO.shippingAddress}</span>
                <span className="text-slate-600 dark:text-slate-400 block">
                  Expected Delivery: <strong className="text-blue-600 dark:text-blue-400">{selectedPO.expectedDeliveryDate}</strong>
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
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
                      <td className="py-3 px-3 sm:px-4 font-medium text-slate-900 dark:text-white">{i.name}</td>
                      <td className="py-3 px-3 sm:px-4">{i.quantity} {i.unit}</td>
                      <td className="py-3 px-3 sm:px-4">{formatCurrency(i.estimatedUnitPrice)}</td>
                      <td className="py-3 px-3 sm:px-4 text-right font-bold text-slate-900 dark:text-white">
                        {formatCurrency(i.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 dark:bg-slate-950 font-bold border-t border-slate-200 dark:border-slate-800">
                  <tr>
                    <td colSpan={3} className="py-3 px-3 sm:px-4 text-right text-slate-600 dark:text-slate-300">
                      Total Purchase Order Amount:
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-right text-blue-600 dark:text-blue-400 text-sm">
                      {formatCurrency(selectedPO.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Matching verification badge */}
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 p-3 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>3-Way Matching Engine: Requisition + PO + Vendor Acceptance Verified</span>
              </div>
              <Badge status={selectedPO.matchingStatus} size="sm" />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" icon={<Printer className="w-4 h-4" />} onClick={() => window.print()}>
                Print / Save PDF
              </Button>
              <Button variant="primary" size="sm" onClick={() => setSelectedPO(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
