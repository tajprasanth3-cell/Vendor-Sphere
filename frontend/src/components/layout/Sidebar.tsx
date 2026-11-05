import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Layers, 
  ShoppingBag, 
  Truck, 
  Users, 
  Boxes,
  Activity,
  X
} from 'lucide-react';
import { useProcurement } from '../../context/ProcurementContext';
import { APP_CONFIG } from '../../config';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  category: 'ops' | 'vendors' | 'governance';
}

export const Sidebar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    purchaseRequests, 
    rfqs, 
    purchaseOrders,
    deliveries,
    role, 
    isMobileSidebarOpen, 
    setIsMobileSidebarOpen 
  } = useProcurement();

  const pendingPRCount = purchaseRequests.filter(
    (p) => p.status === 'pending_dept_approval' || p.status === 'pending_procurement_review'
  ).length;

  const activeRFQCount = rfqs.filter((r) => r.status === 'open' || r.status === 'evaluating').length;
  const pendingDeliveriesCount = deliveries.filter((d) => !d.qcPassed).length;

  // Role-specific customized navigation
  const allNavItems: NavItem[] = [
    {
      id: 'dashboard',
      label: role === 'vendor' ? 'Vendor Portal' : role === 'requester' ? 'Requester Workspace' : 'Procurement Overview',
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
      category: 'ops',
    },
    {
      id: 'requests',
      label: role === 'requester' ? 'My Requisitions' : 'Purchase Requests',
      icon: <FileText className="w-4 h-4 shrink-0" />,
      badge: pendingPRCount,
      category: 'ops',
    },
    {
      id: 'quotations',
      label: role === 'vendor' ? 'Open Tenders (RFQs)' : 'RFQ & Quotes Matrix',
      icon: <Layers className="w-4 h-4 shrink-0" />,
      badge: activeRFQCount,
      category: 'ops',
    },
    {
      id: 'orders',
      label: role === 'vendor' ? 'My Purchase Orders' : 'Purchase Orders (PO)',
      icon: <ShoppingBag className="w-4 h-4 shrink-0" />,
      badge: role === 'vendor' ? purchaseOrders.length : undefined,
      category: 'ops',
    },
    {
      id: 'deliveries',
      label: role === 'vendor' ? 'Shipments & Tracking' : role === 'requester' ? 'Receiving & Inspection' : 'Delivery & 2-Way Match',
      icon: <Truck className="w-4 h-4 shrink-0" />,
      badge: pendingDeliveriesCount > 0 ? pendingDeliveriesCount : undefined,
      category: 'ops',
    },
    {
      id: 'vendors',
      label: 'Suppliers & Scorecards',
      icon: <Users className="w-4 h-4 shrink-0" />,
      category: 'vendors',
    },
    {
      id: 'audits',
      label: role === 'admin' ? 'Audit & Governance' : 'Audit & Accountability',
      icon: <Activity className="w-4 h-4 shrink-0" />,
      category: 'governance',
    },
  ];

  // RBAC Navigation Filtering
  const navItems = allNavItems.filter((item) => {
    if (role === 'vendor') {
      // Vendor only accesses Portal, RFQ Tenders, their POs, and their Shipments
      return ['dashboard', 'quotations', 'orders', 'deliveries'].includes(item.id);
    }
    if (role === 'requester') {
      // Requester only accesses Requester Workspace, their PRs, and Receiving Deliveries
      return ['dashboard', 'requests', 'deliveries'].includes(item.id);
    }
    // Procurement Manager and Admin access all views
    return true;
  });

  const currentRoleObj = APP_CONFIG.roles.find((r) => r.id === role);

  const handleBrandClick = () => {
    setActiveView('dashboard');
    if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTop = 0;
      mainEl.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleNavClick = (viewId: string) => {
    setActiveView(viewId);
    if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTop = 0;
      mainEl.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const opsItems = navItems.filter((item) => item.category === 'ops');
  const vendorItems = navItems.filter((item) => item.category === 'vendors');
  const governanceItems = navItems.filter((item) => item.category === 'governance');

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-3 sm:px-3.5 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <button
          onClick={handleBrandClick}
          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all cursor-pointer group text-left select-none focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          title="Return to Main Dashboard"
          aria-label="Return to Main Dashboard"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
            <Boxes className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white block leading-none group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Vendor<span className="text-blue-600">Sphere</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block mt-1">
              {role === 'vendor' ? 'Vendor Portal' : role === 'requester' ? 'Requester App' : 'Enterprise SCM'}
            </span>
          </div>
        </button>
        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileSidebarOpen(false)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden cursor-pointer"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
        {/* Category: Core Operations */}
        {opsItems.length > 0 && (
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {role === 'vendor' ? 'Fulfillment & Bidding' : role === 'requester' ? 'My Department Ops' : 'Procurement Lifecycle'}
            </div>
            <div className="space-y-1">
              {opsItems.map((item) => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer min-h-[38px] group ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {item.icon}
                      <span className="truncate text-left leading-snug">{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-full ml-1.5 shrink-0 ${
                          isActive
                            ? 'bg-white text-blue-600'
                            : 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Category: Supplier Management */}
        {vendorItems.length > 0 && (
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Supplier Relations
            </div>
            <div className="space-y-1">
              {vendorItems.map((item) => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer min-h-[38px] group ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {item.icon}
                      <span className="truncate text-left leading-snug">{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Category: Governance & Audit */}
        {governanceItems.length > 0 && (
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Governance & Compliance
            </div>
            <div className="space-y-1">
              {governanceItems.map((item) => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer min-h-[38px] group ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {item.icon}
                      <span className="truncate text-left leading-snug">{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Role Indicator Footer */}
      <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
        <div className="bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium text-[11px]">Active Session</span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Verified
            </span>
          </div>
          <div className="font-semibold text-xs text-slate-900 dark:text-white truncate">
            {currentRoleObj?.label}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {currentRoleObj?.description}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="w-64 h-full shrink-0 hidden lg:block select-none z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop & Slide-over Drawer */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
