import React, { useState } from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatCurrency } from '../../config';
import { 
  Layers, 
  CheckCircle, 
  Award, 
  Sparkles, 
  Clock, 
  TrendingDown,
  ShieldAlert,
  Send,
  Lock
} from 'lucide-react';

export const QuotationsView: React.FC = () => {
  const { rfqs, awardQuotationBid, role, setActiveView } = useProcurement();
  const [selectedRfqId, setSelectedRfqId] = useState<string>(rfqs[0]?.id || '');

  const activeRfq = rfqs.find((r) => r.id === selectedRfqId) || rfqs[0];

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            {role === 'vendor' ? 'Open Tenders & Quotation Bids' : 'Vendor Quotations & RFQ Evaluation Matrix'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {role === 'vendor'
              ? 'Review open competitive tenders and manage your commercial quotations.'
              : 'Side-by-side comparative scoring, commercial terms analysis, and vendor selection.'}
          </p>
        </div>
      </div>

      {/* RFQ Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5 sm:pb-3 overflow-x-auto scrollbar-none">
        {rfqs.map((rfq) => (
          <button
            key={rfq.id}
            onClick={() => setSelectedRfqId(rfq.id)}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shrink-0 cursor-pointer ${
              activeRfq?.id === rfq.id
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>{rfq.code}</span>
            <Badge status={rfq.status} size="sm" showDot={false} />
          </button>
        ))}
      </div>

      {activeRfq ? (
        <div className="space-y-5 sm:space-y-6">
          {/* Active RFQ Metadata Summary Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{activeRfq.code}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">• Linked to {activeRfq.prCode}</span>
                  <Badge status={activeRfq.status} size="sm" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{activeRfq.title}</h3>
              </div>

              <div className="flex items-center gap-4 text-left md:text-right pt-2 md:pt-0">
                <div>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Target Budget Cap</span>
                  <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {formatCurrency(activeRfq.targetBudget)}
                  </span>
                </div>
                <div className="border-l border-slate-200 dark:border-slate-800 pl-4">
                  <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Submission Deadline</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{activeRfq.deadline}</span>
                </div>
              </div>
            </div>

            {/* AI Sourcing Recommendation Insight (Internal Procurement Only) */}
            {role !== 'vendor' && (
              <div className="mt-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/20 rounded-lg p-3 sm:p-3.5 flex items-start gap-2.5 sm:gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  <strong className="text-slate-900 dark:text-white font-semibold">Evaluation Recommendation: </strong>
                  Apex Cloud Solutions Inc. scored the highest overall weighted evaluation (95.3/100)
                  by delivering a competitive price ($82,500 vs $90k target cap), fastest delivery SLA (5
                  days), and 98% quality compliance track record.
                </div>
              </div>
            )}
          </div>

          {/* Quotation Comparison Sheet Grid */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">
                {role === 'vendor' ? 'Commercial Bid Proposals' : `Comparative Bid Offers (${activeRfq.bids.length} Suppliers Responded)`}
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                {role === 'vendor' ? 'Confidential Supplier Tendering' : 'Weights: 40% Pricing, 30% SLA/Speed, 30% Reliability'}
              </span>
            </div>

            {activeRfq.bids.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
                <Clock className="w-8 h-8 text-amber-500 mx-auto mb-2 animate-spin" />
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-300">Waiting for invited suppliers to upload quotations...</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Invited 3 vendors via the secure Vendor Portal.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {activeRfq.bids.map((bid) => {
                  const isAwarded = bid.status === 'awarded';
                  const isDisqualified = bid.status === 'disqualified';
                  const isUnderBudget = bid.quotedAmount <= activeRfq.targetBudget;
                  const savings = activeRfq.targetBudget - bid.quotedAmount;
                  const isCompetitorMasked = role === 'vendor' && bid.quotedAmount === 0;

                  return (
                    <div
                      key={bid.id}
                      className={`relative rounded-xl border p-4 sm:p-5 flex flex-col justify-between transition-all shadow-xs ${
                        bid.isRecommended && role !== 'vendor'
                          ? 'bg-white dark:bg-slate-900/90 border-blue-400 dark:border-blue-500/50 ring-1 ring-blue-500/20'
                          : isAwarded
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-500/40'
                          : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {/* Top Pill */}
                      {bid.isRecommended && role !== 'vendor' && (
                        <div className="absolute -top-3 left-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                          <Sparkles className="w-3 h-3" />
                          BEST VALUE WINNER
                        </div>
                      )}

                      <div className="space-y-3.5 sm:space-y-4">
                        {/* Vendor Name & Rating */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                              {isCompetitorMasked ? 'Sealed Tender Offer' : 'Supplier Offer'}
                            </span>
                            {!isCompetitorMasked && (
                              <span className="text-xs font-bold text-amber-500 dark:text-amber-400">★ {bid.vendorRating}</span>
                            )}
                          </div>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                            {isCompetitorMasked ? (
                              <>
                                <Lock className="w-3.5 h-3.5 text-slate-400" />
                                <span>{bid.vendorName}</span>
                              </>
                            ) : (
                              bid.vendorName
                            )}
                          </h4>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">Submitted: {bid.submittedAt}</span>
                        </div>

                        {/* Price Quote */}
                        <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 rounded-lg p-3">
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block">
                            Quoted Commercial Value
                          </span>
                          <div className="flex items-baseline gap-2 flex-wrap">
                            {isCompetitorMasked ? (
                              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 italic">
                                [Sealed Confidential Pricing]
                              </span>
                            ) : (
                              <>
                                <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                                  {formatCurrency(bid.quotedAmount)}
                                </span>
                                {isUnderBudget ? (
                                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                                    <TrendingDown className="w-3 h-3" />
                                    Save {formatCurrency(savings)}
                                  </span>
                                ) : (
                                  <span className="text-[11px] text-rose-700 dark:text-rose-400 font-semibold">
                                    +{formatCurrency(Math.abs(savings))} Over
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </div>

                        {/* Terms & Metrics */}
                        <div className="space-y-1.5 sm:space-y-2 text-xs">
                          <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/80">
                            <span className="text-slate-500 dark:text-slate-400">Fulfillment Lead Time:</span>
                            <strong className="text-slate-800 dark:text-white">{bid.deliveryDays} Business Days</strong>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/80">
                            <span className="text-slate-500 dark:text-slate-400">Payment Terms:</span>
                            <strong className="text-slate-800 dark:text-white">{bid.paymentTerms}</strong>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/80">
                            <span className="text-slate-500 dark:text-slate-400">Warranty Coverage:</span>
                            <strong className="text-slate-800 dark:text-white">{bid.warrantyPeriodMonths} Months</strong>
                          </div>
                          {bid.complianceScore > 0 && (
                            <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/80">
                              <span className="text-slate-500 dark:text-slate-400">Vendor Compliance Score:</span>
                              <strong className="text-blue-600 dark:text-blue-400">{bid.complianceScore}%</strong>
                            </div>
                          )}
                        </div>

                        {/* Bid Notes */}
                        <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/50 italic">
                          "{bid.notes}"
                        </div>
                      </div>

                      {/* Bottom Award Action */}
                      <div className="pt-4 mt-3 border-t border-slate-200 dark:border-slate-800">
                        {isAwarded ? (
                          <div className="w-full py-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5">
                            <CheckCircle className="w-4 h-4" />
                            AWARDED & PO GENERATED
                          </div>
                        ) : isDisqualified ? (
                          <div className="w-full py-2 text-slate-400 dark:text-slate-500 text-xs font-medium text-center">
                            Bid Disqualified
                          </div>
                        ) : role === 'vendor' ? (
                          <div className="w-full py-2 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-lg text-center border border-blue-200 dark:border-blue-800">
                            {isCompetitorMasked ? 'Sealed Competitor Bid' : 'Your Active Commercial Proposal'}
                          </div>
                        ) : (
                          <Button
                            variant={bid.isRecommended ? 'primary' : 'outline'}
                            size="md"
                            className="w-full"
                            icon={<Award className="w-4 h-4" />}
                            disabled={role !== 'procurement_manager' && role !== 'admin'}
                            onClick={() => {
                              awardQuotationBid(activeRfq.id, bid.id);
                              setActiveView('orders');
                            }}
                          >
                            Award & Generate PO
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 sm:p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs space-y-3">
          <Layers className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Open RFQ Tenders Available</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            There are currently no active competitive tenders. Requisitions that are approved can be converted into open RFQs from the Purchase Requisitions view.
          </p>
        </div>
      )}
    </div>
  );
};
