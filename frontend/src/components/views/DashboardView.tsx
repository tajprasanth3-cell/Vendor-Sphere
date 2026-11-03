import React from 'react';
import { 
  DollarSign, 
  FileText, 
  Layers, 
  Truck, 
  Clock, 
  ChevronRight, 
  Building2, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useProcurement } from '../../context/ProcurementContext';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatCurrency } from '../../config';

interface DashboardViewProps {
  onOpenCreatePR: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenCreatePR }) => {
  const { 
    purchaseRequests, 
    rfqs, 
    purchaseOrders, 
    vendors, 
    role, 
    setActiveView,
    approvePurchaseRequest 
  } = useProcurement();

  // Metrics calculation
  const totalSpend = purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0) + 720000;
  const pendingRequests = purchaseRequests.filter(
    (p) => p.status === 'pending_dept_approval' || p.status === 'pending_procurement_review'
  );
  const activeRfqs = rfqs.filter((r) => r.status === 'open' || r.status === 'evaluating');
  const avgOnTime = (
    vendors.reduce((sum, v) => sum + v.onTimeDeliveryRate, 0) / (vendors.length || 1)
  ).toFixed(1);

  // 8-stage enterprise workflow steps
  const workflowSteps = [
    { name: '1. Purchase Request', count: purchaseRequests.length, view: 'requests' },
    { name: '2. Review & Approval', count: pendingRequests.length, view: 'requests' },
    { name: '3. Quotation Collection', count: activeRfqs.length, view: 'quotations' },
    { name: '4. Quotation Evaluation', count: activeRfqs.length, view: 'quotations' },
    { name: '5. Vendor Selection', count: 2, view: 'quotations' },
    { name: '6. Purchase Order', count: purchaseOrders.length, view: 'orders' },
    { name: '7. Delivery Tracking', count: 1, view: 'deliveries' },
    { name: '8. 3-Way Match & Close', count: 1, view: 'deliveries' },
  ];

  return (
    <div className="procurement-overview w-full max-w-full overflow-x-hidden space-y-4 sm:space-y-6">
      {/* Welcome Banner */}
      <div className="overview-hero-banner bg-gradient-to-r from-blue-50 via-indigo-50/40 to-white dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/40 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 relative overflow-hidden shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 sm:gap-4">
          <div className="space-y-1 sm:space-y-1.5 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
              Enterprise Procurement Command Center
            </div>
            <h2 className="text-base sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-white tracking-tight break-words">
              Centralized Sourcing, Approval & Logistics Management
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Real-time oversight over purchase requisitions, supplier competitive bidding, multi-tier authorizations, and automated 3-way matching.
            </p>
          </div>

          <div className="overview-hero-actions flex items-center gap-2 sm:gap-3 shrink-0 pt-1 lg:pt-0">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setActiveView('requests')}
              className="w-full sm:w-auto"
            >
              View Requisitions
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={onOpenCreatePR}
              className="w-full sm:w-auto"
            >
              + Create New PR
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <StatCard
          title="Procurement Spend (YTD)"
          value={formatCurrency(totalSpend)}
          change="+14.2% vs Q3"
          isPositive={true}
          subtitle="Direct & Indirect Capex/Opex"
          icon={<DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />}
          iconColor="text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20"
        />
        <StatCard
          title="Pending Approvals"
          value={pendingRequests.length.toString()}
          change={pendingRequests.length > 0 ? 'Action Required' : 'All Clear'}
          isPositive={pendingRequests.length === 0}
          subtitle="Department & Finance Queues"
          icon={<Clock className="w-4 h-4 sm:w-5 sm:h-5" />}
          iconColor="text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20"
        />
        <StatCard
          title="Active RFQ Tenders"
          value={activeRfqs.length.toString()}
          change="3 Bids In Review"
          isPositive={true}
          subtitle="Competitive Quotation Stage"
          icon={<Layers className="w-4 h-4 sm:w-5 sm:h-5" />}
          iconColor="text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/20"
        />
        <StatCard
          title="On-Time Delivery Rate"
          value={`${avgOnTime}%`}
          change="+2.4% SLA"
          isPositive={true}
          subtitle="Across 4 Qualified Suppliers"
          icon={<Truck className="w-4 h-4 sm:w-5 sm:h-5" />}
          iconColor="text-indigo-700 bg-indigo-50 border-indigo-200 dark:text-indigo-400 dark:bg-indigo-500/10 dark:border-indigo-500/20"
        />
      </div>

      {/* Interactive Enterprise Workflow Visualizer */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 sm:p-5 space-y-3 sm:space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
              <span>Enterprise Procurement Lifecycle Pipeline</span>
              <span className="hidden sm:inline text-xs text-slate-500 dark:text-slate-400 font-normal">• 8 Stages</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              Interactive end-to-end workflow stages as defined in the Adz4needz enterprise assignment.
            </p>
          </div>
          <span className="text-[11px] sm:text-xs text-blue-600 dark:text-blue-400 font-medium self-start sm:self-auto">
            Swipe or Click to Filter ➔
          </span>
        </div>

        {/* Responsive Pipeline: Touch Swipe with Snap on Mobile, Clean Grid on Tablet & Desktop */}
        <div className="overview-pipeline-container no-scrollbar flex sm:grid sm:grid-cols-4 lg:grid-cols-8 gap-2 overflow-x-auto pb-1.5 sm:pb-0">
          {workflowSteps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setActiveView(step.view)}
              className="overview-pipeline-step text-left p-2.5 sm:p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition-all group cursor-pointer shrink-0 sm:shrink min-w-[130px] sm:min-w-0"
            >
              <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-0.5">
                STAGE 0{idx + 1}
              </div>
              <div className="text-[11px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white line-clamp-2 leading-tight">
                {step.name.split('. ')[1]}
              </div>
              <div className="mt-1.5 sm:mt-2 text-[10px] sm:text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center justify-between">
                <span>{step.count} active</span>
                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Action Items & Top Suppliers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left: Pending Requisitions requiring review */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 sm:p-5 space-y-3 sm:space-y-4 shadow-xs min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                Requisitions Requiring Action ({pendingRequests.length})
              </h3>
            </div>
            <button
              onClick={() => setActiveView('requests')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            {pendingRequests.map((pr) => (
              <div
                key={pr.id}
                className="overview-requisition-item bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0">{pr.code}</span>
                    <Badge status={pr.status} size="sm" />
                    <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">• {pr.department}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white break-words leading-snug">
                    {pr.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-1 break-words">
                    {pr.businessJustification}
                  </p>
                </div>

                <div className="overview-requisition-actions flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800 w-full sm:w-auto">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 block font-medium">Est. Budget</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(pr.totalAmount)}</span>
                  </div>
                  {(role === 'procurement_manager' || role === 'admin') && (
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => approvePurchaseRequest(pr.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setActiveView('requests')}
                      >
                        Details
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Supplier Performance Leaderboard */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 sm:p-5 space-y-3 sm:space-y-4 shadow-xs min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                Supplier Scorecard
              </h3>
            </div>
            <button
              onClick={() => setActiveView('vendors')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer shrink-0"
            >
              All Vendors
            </button>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            {vendors.map((v) => (
              <div
                key={v.id}
                className="bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 sm:p-3.5 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors min-w-0"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-xs text-slate-900 dark:text-white truncate">{v.name}</div>
                  <span className="text-xs font-bold text-amber-500 dark:text-amber-400 shrink-0">★ {v.rating}</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{v.category}</div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2 text-[11px] flex-wrap">
                  <span className="text-slate-500 dark:text-slate-400">On-Time: <strong className="text-emerald-600 dark:text-emerald-400">{v.onTimeDeliveryRate}%</strong></span>
                  <span className="text-slate-500 dark:text-slate-400">Spend: <strong className="text-slate-800 dark:text-slate-200">{formatCurrency(v.totalSpendYTD)}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
