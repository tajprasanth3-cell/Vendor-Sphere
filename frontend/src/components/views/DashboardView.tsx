import React from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatCurrency } from '../../config';
import { 
  DollarSign, 
  Clock, 
  Layers, 
  Truck, 
  FileText, 
  Building2, 
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  PackageCheck,
  ShoppingBag,
  Star,
  Send,
  AlertCircle
} from 'lucide-react';

interface DashboardViewProps {
  onOpenCreatePR: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenCreatePR }) => {
  const { 
    purchaseRequests, 
    rfqs, 
    purchaseOrders, 
    deliveries, 
    vendors, 
    approvePurchaseRequest, 
    role, 
    currentUser,
    setActiveView 
  } = useProcurement();

  // ==========================================
  // 1. VENDOR PORTAL VIEW
  // ==========================================
  if (role === 'vendor') {
    const openRfqs = rfqs.filter((r) => r.status === 'open');
    const awardedPOs = purchaseOrders;
    const totalAwardedValue = awardedPOs.reduce((sum, po) => sum + po.totalAmount, 0);
    const activeShipments = deliveries.filter((d) => !d.qcPassed);

    return (
      <div className="procurement-overview w-full max-w-full overflow-x-hidden space-y-4 sm:space-y-6">
        {/* Vendor Hero Banner */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50/40 to-white dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/30 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 relative overflow-hidden shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse shrink-0" />
                <span>Supplier Partner Portal</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {currentUser?.department || 'Apex Cloud Solutions Inc.'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                Welcome, {currentUser?.name}. Review open competitive tenders, submit sealed quotation bids, and track order fulfillment.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <Button
                variant="primary"
                size="md"
                onClick={() => setActiveView('quotations')}
                className="w-full sm:w-auto justify-center min-h-[38px] text-xs font-semibold"
              >
                <Layers className="w-4 h-4 mr-1.5" />
                View Open Tenders ({openRfqs.length})
              </Button>
            </div>
          </div>
        </div>

        {/* Vendor KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <StatCard
            title="Open Tenders"
            value={openRfqs.length.toString()}
            subtitle="Available for Quotation"
            icon={<Layers className="w-5 h-5 text-blue-600" />}
            change="Active Now"
            isPositive={true}
          />
          <StatCard
            title="Awarded PO Value"
            value={formatCurrency(totalAwardedValue)}
            subtitle={`${awardedPOs.length} Official Purchase Orders`}
            icon={<ShoppingBag className="w-5 h-5 text-emerald-600" />}
            change="Contracted"
            isPositive={true}
          />
          <StatCard
            title="Active Shipments"
            value={activeShipments.length.toString()}
            subtitle="In Transit to Client Dock"
            icon={<Truck className="w-5 h-5 text-indigo-600" />}
            change="On-Time Track"
            isPositive={true}
          />
          <StatCard
            title="Supplier Score"
            value="4.9 ★"
            subtitle="98% Quality Compliance"
            icon={<Star className="w-5 h-5 text-amber-500" />}
            change="Preferred Tier"
            isPositive={true}
          />
        </div>

        {/* Vendor Two-Column Workspaces */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Left: Open RFQ Tenders Awaiting Bid */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Tenders Awaiting Your Bid ({openRfqs.length})
                </h3>
              </div>
              <button
                onClick={() => setActiveView('quotations')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>Full Matrix</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {openRfqs.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No open tenders at this time.
                </div>
              ) : (
                openRfqs.map((rfq) => (
                  <div
                    key={rfq.id}
                    className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-2 hover:border-blue-400 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{rfq.code}</span>
                      <span className="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded font-medium border border-amber-200 dark:border-amber-800">
                        Deadline: {rfq.deadline}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">{rfq.title}</h4>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-slate-500">Cap Budget: <strong className="text-slate-900 dark:text-white">{formatCurrency(rfq.targetBudget)}</strong></span>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => setActiveView('quotations')}
                        className="text-xs"
                      >
                        Submit / Update Bid
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Dispatched Purchase Orders */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Purchase Orders to Fulfill ({awardedPOs.length})
                </h3>
              </div>
              <button
                onClick={() => setActiveView('orders')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>View Orders</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {awardedPOs.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No active purchase orders at this time.
                </div>
              ) : (
                awardedPOs.map((po) => (
                  <div
                    key={po.id}
                    className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">{po.poNumber}</span>
                      <Badge status={po.deliveryStatus} size="sm" />
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      Total: <strong className="text-slate-900 dark:text-white">{formatCurrency(po.totalAmount)}</strong> • Terms: {po.paymentTerms}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Expected Delivery: {po.expectedDeliveryDate}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. REQUESTER WORKSPACE VIEW
  // ==========================================
  if (role === 'requester') {
    const myPRs = purchaseRequests;
    const pendingMyPRs = myPRs.filter((p) => p.status.includes('pending'));
    const approvedMyPRs = myPRs.filter((p) => p.status === 'approved' || p.status === 'rfq_initiated');
    const myDeliveries = deliveries;

    return (
      <div className="procurement-overview w-full max-w-full overflow-x-hidden space-y-4 sm:space-y-6">
        {/* Requester Hero Banner */}
        <div className="bg-gradient-to-r from-indigo-50 via-blue-50/40 to-white dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 relative overflow-hidden shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse shrink-0" />
                <span>Department Requester Portal</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {currentUser?.name} — {currentUser?.department || 'Infrastructure & DevOps'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                Create new purchase requisitions, monitor department budget approvals, and inspect incoming warehouse deliveries.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <Button
                variant="primary"
                size="md"
                onClick={onOpenCreatePR}
                className="w-full sm:w-auto justify-center min-h-[38px] text-xs font-semibold"
              >
                + New Purchase Requisition
              </Button>
            </div>
          </div>
        </div>

        {/* Requester KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <StatCard
            title="My Requisitions"
            value={myPRs.length.toString()}
            subtitle="Department Line Items"
            icon={<FileText className="w-5 h-5 text-blue-600" />}
            change="Filed"
            isPositive={true}
          />
          <StatCard
            title="Awaiting Approval"
            value={pendingMyPRs.length.toString()}
            subtitle="Manager & Sourcing Review"
            icon={<Clock className="w-5 h-5 text-amber-500" />}
            change="In Review"
            isPositive={false}
          />
          <StatCard
            title="Approved & Sourced"
            value={approvedMyPRs.length.toString()}
            subtitle="In Procurement Tender"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            change="Moving Ahead"
            isPositive={true}
          />
          <StatCard
            title="Shipments to Inspect"
            value={myDeliveries.filter(d => !d.qcPassed).length.toString()}
            subtitle="Receiving Dock QC"
            icon={<Truck className="w-5 h-5 text-indigo-600" />}
            change="Dock Arrival"
            isPositive={true}
          />
        </div>

        {/* Requester Workspaces */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Left: My Requisitions */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  My Recent Requisitions ({myPRs.length})
                </h3>
              </div>
              <button
                onClick={() => setActiveView('requests')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {myPRs.map((pr) => (
                <div
                  key={pr.id}
                  className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{pr.code}</span>
                    <Badge status={pr.status} size="sm" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">{pr.title}</h4>
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span>Est. Budget: <strong className="text-slate-900 dark:text-white">{formatCurrency(pr.totalAmount)}</strong></span>
                    <span>Required: {pr.requiredDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Deliveries Awaiting Inspection */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Shipments for Department ({myDeliveries.length})
                </h3>
              </div>
              <button
                onClick={() => setActiveView('deliveries')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>Receiving Dock</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {myDeliveries.map((del) => (
                <div
                  key={del.id}
                  className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{del.trackingNumber}</span>
                    <Badge status={del.status} size="sm" />
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    Carrier: {del.carrier} • Vendor: {del.vendorName}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Est. Arrival: {del.estimatedDelivery}</span>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setActiveView('deliveries')}
                      className="text-xs"
                    >
                      Inspect Receipt
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 3. PROCUREMENT MANAGER & ADMIN COMMAND CENTER
  // ==========================================
  const totalSpend = purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0);
  const pendingRequests = purchaseRequests.filter(
    (pr) => pr.status === 'pending_dept_approval' || pr.status === 'pending_procurement_review'
  );
  const activeRfqs = rfqs.filter((r) => r.status === 'open' || r.status === 'evaluating');
  const avgOnTime = (
    vendors.reduce((sum, v) => sum + v.onTimeDeliveryRate, 0) / (vendors.length || 1)
  ).toFixed(1);

  const workflowSteps = [
    { name: '1. Purchase Request', count: purchaseRequests.length, view: 'requests' },
    { name: '2. Review & Approval', count: pendingRequests.length, view: 'requests' },
    { name: '3. Quotation Collection', count: activeRfqs.length, view: 'quotations' },
    { name: '4. Quotation Evaluation', count: activeRfqs.length, view: 'quotations' },
    { name: '5. Vendor Selection', count: 2, view: 'quotations' },
    { name: '6. Purchase Order', count: purchaseOrders.length, view: 'orders' },
    { name: '7. Delivery Tracking', count: deliveries.length, view: 'deliveries' },
    { name: '8. 3-Way Match & Close', count: deliveries.filter(d => d.qcPassed).length, view: 'deliveries' },
  ];

  return (
    <div className="procurement-overview w-full max-w-full overflow-x-hidden space-y-4 sm:space-y-6">
      {/* Welcome Banner */}
      <div className="overview-hero-banner bg-gradient-to-r from-blue-50 via-indigo-50/40 to-white dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/40 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 md:p-6 relative overflow-hidden shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-1 sm:space-y-1.5 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 mb-0.5 max-w-full">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse shrink-0" />
              <span className="truncate">
                {role === 'admin' ? 'Enterprise System Governance & Compliance' : 'Enterprise Procurement Command Center'}
              </span>
            </div>
            <h2 className="text-base sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-white tracking-tight break-words leading-snug">
              Centralized Sourcing, Approval & Logistics Management
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed break-words">
              Real-time oversight over purchase requisitions, supplier competitive bidding, multi-tier authorizations, and automated 3-way matching.
            </p>
          </div>

          <div className="overview-hero-actions flex items-center gap-2 sm:gap-3 shrink-0 pt-1 lg:pt-0">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setActiveView('requests')}
              className="w-full sm:w-auto justify-center min-h-[38px] text-xs font-semibold"
            >
              View Requisitions
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={onOpenCreatePR}
              className="w-full sm:w-auto justify-center min-h-[38px] text-xs font-semibold"
            >
              + Create New PR
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <StatCard
          title="Spend (YTD)"
          value={formatCurrency(totalSpend)}
          subtitle="Contracted via PO"
          icon={<DollarSign className="w-5 h-5 text-blue-600" />}
          change="+12.4%"
          isPositive={true}
        />
        <StatCard
          title="Pending PRs"
          value={pendingRequests.length.toString()}
          subtitle="Requires Review"
          icon={<Clock className="w-5 h-5 text-amber-500" />}
          change={`${pendingRequests.length} action items`}
          isPositive={false}
        />
        <StatCard
          title="Active Tenders"
          value={activeRfqs.length.toString()}
          subtitle="RFQ Sourcing Live"
          icon={<Layers className="w-5 h-5 text-indigo-600" />}
          change="3 Bids per PR"
          isPositive={true}
        />
        <StatCard
          title="Supplier SLA"
          value={`${avgOnTime}%`}
          subtitle="On-time Delivery"
          icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
          change="+2.1% MoM"
          isPositive={true}
        />
      </div>

      {/* 8-Stage Procurement Workflow Pipeline */}
      <div className="overview-pipeline-section bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 sm:p-5 space-y-3 sm:space-y-4 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
              Standard 8-Stage Procurement Lifecycle
            </h3>
          </div>
          <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:inline shrink-0">
            ISO-9001 Compliant
          </span>
        </div>

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 sm:gap-6">
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
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => approvePurchaseRequest(pr.id)}
                      className="text-xs min-h-[34px] px-2.5"
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setActiveView('requests')}
                      className="text-xs min-h-[34px] px-2.5"
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Supplier Performance Leaderboard */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 sm:p-5 space-y-3 sm:space-y-4 shadow-xs min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                Top Strategic Suppliers
              </h3>
            </div>
            <button
              onClick={() => setActiveView('vendors')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>Directory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {vendors.slice(0, 4).map((vendor) => (
              <div
                key={vendor.id}
                className="overview-supplier-item flex items-center justify-between gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {vendor.name}
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                    {vendor.category} • Rating: {vendor.rating} ★
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {vendor.onTimeDeliveryRate}%
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    On-Time SLA
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
