import React, { useState } from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { 
  Truck, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  ClipboardCheck,
  Package,
  Building2,
  ShieldCheck,
  AlertCircle,
  FileCheck,
  ExternalLink
} from 'lucide-react';
import { DeliveryShipment } from '../../types';

export const DeliveriesView: React.FC = () => {
  const { deliveries, verifyDeliveryQC, searchQuery } = useProcurement();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [inspectingDelivery, setInspectingDelivery] = useState<DeliveryShipment | null>(null);

  // Inspection Checklist State for Modal
  const [checkIntegrity, setCheckIntegrity] = useState(true);
  const [checkQuantity, setCheckQuantity] = useState(true);
  const [checkPackingSlip, setCheckPackingSlip] = useState(true);
  const [inspectorNotes, setInspectorNotes] = useState('All packages received intact. Packaging seals undamaged. Quantity count matches PO specification.');

  const totalCount = deliveries.length;
  const inTransitCount = deliveries.filter(
    (d) => d.status === 'in_transit' || d.status === 'out_for_delivery'
  ).length;
  const pendingQCCount = deliveries.filter((d) => !d.qcPassed).length;
  const verifiedCount = deliveries.filter((d) => d.qcPassed).length;

  const filtered = deliveries.filter((del) => {
    const matchesSearch =
      del.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      del.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      del.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      del.carrier.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'in_transit') {
      return del.status === 'in_transit' || del.status === 'out_for_delivery';
    }
    if (statusFilter === 'pending_qc') {
      return !del.qcPassed;
    }
    if (statusFilter === 'verified') {
      return del.qcPassed;
    }

    return true;
  });

  const handleConfirmInspection = () => {
    if (inspectingDelivery) {
      verifyDeliveryQC(inspectingDelivery.id);
      setInspectingDelivery(null);
    }
  };

  return (
    <div className="deliveries-view space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="truncate">Logistics, Delivery Tracking & Receiving Inspection</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed break-words">
            Monitor real-time shipment dispatch, transit waybills, and complete receiving dock 3-way matching inspection.
          </p>
        </div>
      </div>

      {/* Logistics Executive Metrics */}
      <div className="delivery-metrics-grid grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
            <Package className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>Total Shipments</span>
          </div>
          <div className="mt-1 text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {totalCount}
          </div>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
            <Truck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Active In-Transit</span>
          </div>
          <div className="mt-1 text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {inTransitCount}
          </div>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
            <ClipboardCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>Pending Dock QC</span>
          </div>
          <div className="mt-1 text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {pendingQCCount}
          </div>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>3-Way Matched</span>
          </div>
          <div className="mt-1 text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {verifiedCount}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="delivery-filter-tabs flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'all', label: `All Shipments (${totalCount})` },
          { id: 'in_transit', label: `In Transit (${inTransitCount})` },
          { id: 'pending_qc', label: `Pending Dock QC (${pendingQCCount})` },
          { id: 'verified', label: `QC Verified (${verifiedCount})` },
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

      {/* Deliveries List */}
      <div className="space-y-3 sm:space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
              No shipments found matching filter.
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Try adjusting the filter tabs or search query.
            </p>
          </div>
        ) : (
          filtered.map((del) => (
            <div
              key={del.id}
              className="delivery-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 sm:p-5 md:p-6 space-y-3.5 sm:space-y-5 shadow-xs transition-all hover:border-slate-300 dark:hover:border-slate-700"
            >
              {/* Top Shipment Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0">
                      {del.poNumber}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 hidden xs:inline">•</span>
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px] font-mono text-slate-700 dark:text-slate-300">
                      <span className="text-slate-400 dark:text-slate-500 hidden sm:inline">Tracking:</span>
                      <span className="select-all font-semibold">{del.trackingNumber}</span>
                    </div>
                    <Badge status={del.status} size="sm" />
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {del.itemsCount} units
                    </span>
                  </div>

                  <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white break-words flex items-center gap-1.5 flex-wrap">
                    <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                      <Truck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span>{del.carrier}</span>
                    </span>
                    <span className="text-slate-400 dark:text-slate-500">•</span>
                    <span className="flex items-center gap-1 text-slate-800 dark:text-slate-200">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{del.vendorName}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-2.5 sm:gap-4 flex-wrap pt-2 sm:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800/80">
                  <div className="text-left md:text-right min-w-0">
                    <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                      Estimated Arrival:
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>{del.estimatedDelivery}</span>
                    </span>
                  </div>

                  {!del.qcPassed ? (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<ClipboardCheck className="w-4 h-4" />}
                      onClick={() => setInspectingDelivery(del)}
                      className="delivery-action-btn flex-1 md:flex-initial justify-center min-h-[38px] text-xs font-semibold"
                    >
                      Complete QC Match
                    </Button>
                  ) : (
                    <div className="px-2.5 sm:px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-lg flex items-center gap-1.5 shrink-0">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span>3-Way Matched</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Step-by-Step Delivery Milestones Progress */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>Chain of Custody & Transit Timeline</span>
                </h4>

                <div className="delivery-timeline relative pl-6 sm:pl-7 space-y-4 sm:space-y-5">
                  {/* Vertical Connector Line */}
                  <div className="absolute left-2.5 top-2.5 bottom-2.5 w-0.5 bg-slate-200 dark:bg-slate-800" />

                  {del.milestones.map((m, idx) => (
                    <div key={idx} className="relative flex items-start gap-2.5 sm:gap-3.5">
                      {/* Step Indicator Dot */}
                      <div
                        className={`absolute -left-6 sm:-left-7 top-0.5 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-slate-900 shrink-0 ${
                          m.completed
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                        }`}
                      >
                        {m.completed ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                      </div>

                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-2">
                          <span className={`text-xs font-bold break-words ${m.completed ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                            {m.step}
                          </span>
                          <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 dark:text-slate-500 shrink-0">
                            {m.timestamp}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 break-words">
                          <MapPin className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
                          <span>{m.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Receiving Dock Inspection Modal */}
      {inspectingDelivery && (
        <Modal
          isOpen={true}
          onClose={() => setInspectingDelivery(null)}
          title={`Receiving Dock Inspection & 3-Way Match`}
          subtitle={`PO Reference: ${inspectingDelivery.poNumber} • Waybill: ${inspectingDelivery.trackingNumber}`}
          maxWidth="lg"
        >
          <div className="delivery-inspection-modal space-y-4 text-slate-800 dark:text-slate-200 text-xs">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 p-3 rounded-lg text-blue-800 dark:text-blue-300">
              <div className="font-semibold text-xs mb-0.5 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Dock Quarantine & Inspection Verification</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Confirming physical receipt of {inspectingDelivery.itemsCount} units from{' '}
                <strong>{inspectingDelivery.vendorName}</strong> via {inspectingDelivery.carrier}.
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-2.5">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Quality & Verification Checklist:
              </label>

              <label className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkIntegrity}
                  onChange={(e) => setCheckIntegrity(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <div className="min-w-0">
                  <span className="font-semibold text-slate-900 dark:text-white block">
                    Physical Package & Tamper-Evident Seals
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Containers undamaged, manufacturer seals intact, zero transit tampering.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkQuantity}
                  onChange={(e) => setCheckQuantity(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <div className="min-w-0">
                  <span className="font-semibold text-slate-900 dark:text-white block">
                    SKU & Exact Quantity Count Match
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Physical item count ({inspectingDelivery.itemsCount} units) verified against packing slip and Purchase Order.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkPackingSlip}
                  onChange={(e) => setCheckPackingSlip(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <div className="min-w-0">
                  <span className="font-semibold text-slate-900 dark:text-white block">
                    3-Way Match Verification (PO + Shipping Note + Invoice)
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Pricing terms, specifications, and receiving note match PO commitment records.
                  </span>
                </div>
              </label>
            </div>

            {/* Inspector Notes */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Receiving Inspector Sign-off Notes:
              </label>
              <textarea
                rows={2}
                value={inspectorNotes}
                onChange={(e) => setInspectorNotes(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInspectingDelivery(null)}
                className="w-full sm:w-auto justify-center min-h-[38px]"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<CheckCircle2 className="w-4 h-4" />}
                disabled={!checkIntegrity || !checkQuantity || !checkPackingSlip}
                onClick={handleConfirmInspection}
                className="w-full sm:w-auto justify-center min-h-[38px]"
              >
                Confirm Inspection & Pass QC
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
