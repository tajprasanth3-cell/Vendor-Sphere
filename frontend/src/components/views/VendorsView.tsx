import React, { useState } from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import { Badge } from '../common/Badge';
import { formatCurrency } from '../../config';
import { 
  Users, 
  Star, 
  Mail, 
  Phone, 
  MapPin
} from 'lucide-react';

export const VendorsView: React.FC = () => {
  const { vendors, searchQuery } = useProcurement();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(vendors.map((v) => v.category)))];

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
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Supplier Directory & Performance Scorecards
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Evaluate vendor reliability, delivery SLA compliance, quality ratings, and annual procurement spend.
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 sm:gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5 sm:pb-3 overflow-x-auto scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors shrink-0 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cat === 'all' ? 'All Categories' : cat}
          </button>
        ))}
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {filtered.map((vendor) => (
          <div
            key={vendor.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 space-y-3.5 sm:space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{vendor.code}</span>
                    <Badge status={vendor.status} size="sm" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{vendor.name}</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{vendor.category}</span>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-2 py-1 rounded-lg">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 dark:text-amber-400 dark:fill-amber-400" />
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-300">{vendor.rating}</span>
                </div>
              </div>

              {/* Performance Metrics Bar */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 rounded-xl p-2.5 sm:p-3 text-center">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">On-Time SLA</span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">{vendor.onTimeDeliveryRate}%</span>
                </div>
                <div className="border-x border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">Quality QC</span>
                  <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">{vendor.qualityComplianceRate}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">Active POs</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{vendor.activeOrdersCount}</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>Contact: {vendor.contactPerson}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="truncate">{vendor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>{vendor.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="truncate">{vendor.address}</span>
                </div>
              </div>
            </div>

            {/* Bottom Spend Footer */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Annual Spend (YTD):</span>
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {formatCurrency(vendor.totalSpendYTD)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
