import React from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { 
  Truck, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  ClipboardCheck
} from 'lucide-react';

export const DeliveriesView: React.FC = () => {
  const { deliveries, verifyDeliveryQC } = useProcurement();

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Logistics, Delivery Tracking & Receiving Inspection
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor real-time shipment dispatch, transit waybills, and complete receiving dock 3-way matching inspection.
          </p>
        </div>
      </div>

      {/* Deliveries List */}
      <div className="space-y-5 sm:space-y-6">
        {deliveries.map((del) => (
          <div
            key={del.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-6 space-y-5 sm:space-y-6 shadow-xs"
          >
            {/* Top Shipment Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 sm:pb-5 border-b border-slate-200 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{del.poNumber}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">• Tracking:</span>
                  <span className="font-mono text-xs text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {del.trackingNumber}
                  </span>
                  <Badge status={del.status} size="sm" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Carrier: {del.carrier} • Supplier: {del.vendorName}
                </h3>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-3 flex-wrap">
                <div className="text-left md:text-right">
                  <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Estimated Arrival</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{del.estimatedDelivery}</span>
                </div>

                {!del.qcPassed ? (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<ClipboardCheck className="w-4 h-4" />}
                    onClick={() => verifyDeliveryQC(del.id)}
                  >
                    Complete QC Match
                  </Button>
                ) : (
                  <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-lg flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    3-Way Matched
                  </div>
                )}
              </div>
            </div>

            {/* Step-by-Step Delivery Milestones Progress */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Chain of Custody & Transit Timeline
              </h4>

              <div className="relative pl-6 space-y-5 sm:space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {del.milestones.map((m, idx) => {
                  return (
                    <div key={idx} className="relative flex items-start gap-3 sm:gap-4">
                      <div
                        className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-slate-900 ${
                          m.completed
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                        }`}
                      >
                        {m.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                          <span>{m.step}</span>
                          <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                            ({m.timestamp})
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                          <span>{m.location}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
