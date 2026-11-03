import React, { useState } from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { formatCurrency } from '../../config';
import { 
  Users, 
  Star, 
  Mail, 
  Phone, 
  MapPin,
  Award,
  DollarSign,
  Clock,
  ShieldCheck,
  ExternalLink,
  Send,
  Building2,
  AlertCircle
} from 'lucide-react';
import { Vendor } from '../../types';

export const VendorsView: React.FC = () => {
  const { vendors, searchQuery, setActiveView } = useProcurement();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const categories = ['all', ...Array.from(new Set(vendors.map((v) => v.category)))];

  const totalSpend = vendors.reduce((sum, v) => sum + v.totalSpendYTD, 0);
  const preferredCount = vendors.filter((v) => v.status === 'preferred').length;
  const avgSla = vendors.length > 0
    ? (vendors.reduce((sum, v) => sum + v.onTimeDeliveryRate, 0) / vendors.length).toFixed(1)
    : '0';

  const filtered = vendors.filter((v) => {
    const matchesCat = selectedCategory === 'all' || v.category === selectedCategory;
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="vendors-view space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="truncate">Supplier Directory & Performance Scorecards</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed break-words">
            Evaluate vendor reliability, delivery SLA compliance, quality ratings, and annual procurement spend.
          </p>
        </div>
      </div>

      {/* Supplier Metrics Grid */}
      <div className="vendor-metrics-grid grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
            <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>Total Suppliers</span>
          </div>
          <div className="mt-1 text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {vendors.length}
          </div>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
            <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Preferred Partners</span>
          </div>
          <div className="mt-1 text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {preferredCount}
          </div>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
            <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Avg On-Time SLA</span>
          </div>
          <div className="mt-1 text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {avgSla}%
          </div>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
            <DollarSign className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
            <span>Total YTD Spend</span>
          </div>
          <div className="mt-1 text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
            {formatCurrency(totalSpend)}
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="vendor-filter-tabs flex items-center gap-1.5 sm:gap-2 pb-1 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors shrink-0 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cat === 'all' ? `All Categories (${vendors.length})` : cat}
          </button>
        ))}
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4 md:gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-8 sm:py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
              No suppliers match your query.
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Try adjusting category filter or search keywords.
            </p>
          </div>
        ) : (
          filtered.map((vendor) => (
            <div
              key={vendor.id}
              className="vendor-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 sm:p-5 space-y-3 sm:space-y-3.5 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header: Code + Status + Rating */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0">
                        {vendor.code}
                      </span>
                      <Badge status={vendor.status} size="sm" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white break-words leading-snug">
                      {vendor.name}
                    </h3>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
                      {vendor.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-2 py-1 rounded-lg shrink-0">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 dark:text-amber-400 dark:fill-amber-400 shrink-0" />
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-300">{vendor.rating}</span>
                  </div>
                </div>

                {/* Performance Scorecard Box */}
                <div className="vendor-score-box grid grid-cols-3 gap-1.5 sm:gap-2 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 rounded-xl p-2 sm:p-2.5 text-center">
                  <div className="min-w-0">
                    <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block truncate">
                      On-Time SLA
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 block">
                      {vendor.onTimeDeliveryRate}%
                    </span>
                  </div>
                  <div className="border-x border-slate-200 dark:border-slate-800 min-w-0 px-1">
                    <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block truncate">
                      Quality QC
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 block">
                      {vendor.qualityComplianceRate}%
                    </span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block truncate">
                      Active POs
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block">
                      {vendor.activeOrdersCount}
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="truncate">Contact: {vendor.contactPerson}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <a 
                      href={`mailto:${vendor.email}`}
                      className="truncate text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
                    >
                      {vendor.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <a
                      href={`tel:${vendor.phone}`}
                      className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
                    >
                      {vendor.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="break-words line-clamp-1">{vendor.address}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Spend Footer & Actions */}
              <div className="pt-2.5 sm:pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                    Annual Spend (YTD)
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {formatCurrency(vendor.totalSpendYTD)}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedVendor(vendor)}
                  className="vendor-scorecard-btn text-xs px-2.5 py-1 min-h-[34px]"
                >
                  Scorecard
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detailed Supplier Performance Scorecard Modal */}
      {selectedVendor && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedVendor(null)}
          title={`Supplier Scorecard — ${selectedVendor.name}`}
          subtitle={`Supplier Code: ${selectedVendor.code} • Category: ${selectedVendor.category}`}
          maxWidth="2xl"
        >
          <div className="vendor-scorecard-modal space-y-4 text-slate-800 dark:text-slate-200 text-xs">
            {/* Top Score Summary Banner */}
            <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                    {selectedVendor.code}
                  </span>
                  <Badge status={selectedVendor.status} size="sm" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedVendor.name}
                </h3>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  {selectedVendor.category}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-3 py-1.5 rounded-xl">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500 dark:text-amber-400 dark:fill-amber-400 shrink-0" />
                <div>
                  <span className="text-sm font-bold text-amber-700 dark:text-amber-300 block leading-none">
                    {selectedVendor.rating} / 5.0
                  </span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                    Supplier Rating
                  </span>
                </div>
              </div>
            </div>

            {/* SLA Progress Bars */}
            <div className="space-y-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <h4 className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Contractual SLA & Quality Compliance Benchmarks</span>
              </h4>

              {/* On Time SLA */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">On-Time Delivery SLA:</span>
                  <strong className="text-emerald-600 dark:text-emerald-400">{selectedVendor.onTimeDeliveryRate}%</strong>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${selectedVendor.onTimeDeliveryRate}%` }}
                  />
                </div>
              </div>

              {/* Quality Compliance */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Quality & Defect-Free Compliance:</span>
                  <strong className="text-blue-600 dark:text-blue-400">{selectedVendor.qualityComplianceRate}%</strong>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${selectedVendor.qualityComplianceRate}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Financials & Contact Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  Procurement Volume:
                </span>
                <div className="text-slate-600 dark:text-slate-300">
                  Annual Spend (YTD): <strong className="text-slate-900 dark:text-white font-bold">{formatCurrency(selectedVendor.totalSpendYTD)}</strong>
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  Active PO Commitments: <strong className="text-slate-900 dark:text-white font-bold">{selectedVendor.activeOrdersCount}</strong>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  Authorized Contact:
                </span>
                <div className="text-slate-900 dark:text-white font-semibold">{selectedVendor.contactPerson}</div>
                <div className="text-slate-600 dark:text-slate-400 break-words">{selectedVendor.email}</div>
                <div className="text-slate-600 dark:text-slate-400">{selectedVendor.phone}</div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedVendor(null)}
                className="w-full sm:w-auto justify-center min-h-[38px]"
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Send className="w-3.5 h-3.5" />}
                onClick={() => {
                  setSelectedVendor(null);
                  setActiveView('quotations');
                }}
                className="w-full sm:w-auto justify-center min-h-[38px]"
              >
                Issue RFQ Tender
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
