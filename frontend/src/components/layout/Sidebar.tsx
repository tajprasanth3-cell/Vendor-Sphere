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
    role, 
    isMobileSidebarOpen, 
    setIsMobileSidebarOpen 
  } = useProcurement();

  const pendingPRCount = purchaseRequests.filter(
    (p) => p.status === 'pending_dept_approval' || p.status === 'pending_procurement_review'
  ).length;

  const activeRFQCount = rfqs.filter((r) => r.status === 'open' || r.status === 'evaluating').length;

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Procurement Overview',
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
      category: 'ops',
    },
    {
      id: 'requests',
      label: 'Purchase Requests',
      icon: <FileText className="w-4 h-4 shrink-0" />,
      badge: pendingPRCount,
      category: 'ops',
    },
    {
      id: 'quotations',
      label: 'RFQ & Quotes Matrix',
      icon: <Layers className="w-4 h-4 shrink-0" />,
      badge: activeRFQCount,
      category: 'ops',
    },
    {
      id: 'orders',
      label: 'Purchase Orders (PO)',
      icon: <ShoppingBag className="w-4 h-4 shrink-0" />,
      category: 'ops',
    },
    {
      id: 'deliveries',
      label: 'Delivery & 3-Way Match',
      icon: <Truck className="w-4 h-4 shrink-0" />,
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
      label: 'Audit & Accountability',
      icon: <Activity className="w-4 h-4 shrink-0" />,
      category: 'governance',
    },
  ];

  const currentRoleObj = APP_CONFIG.roles.find((r) => r.id === role);

  const handleNavClick = (viewId: string) => {
    setActiveView(viewId);
    if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 sm:px-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 ring-1 ring-blue-400/40">
            <Boxes className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
              VendorSphere
              <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 px-1.5 py-0.2 rounded">
                v2.4
              </span>
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Enterprise Procurement</p>
          </div>
        </div>

        {/* Close button on mobile/tablet */}
        <button
          onClick={() => setIsMobileSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-6">
        {/* Category: Procurement Operations */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Procurement Operations
          </div>
          <div className="space-y-1">
            {navItems
              .filter((item) => item.category === 'ops')
              .map((item) => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
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

        {/* Category: Supplier Management */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Supplier Relations
          </div>
          <div className="space-y-1">
            {navItems
              .filter((item) => item.category === 'vendors')
              .map((item) => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Category: Governance & Audit */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Governance & Compliance
          </div>
          <div className="space-y-1">
            {navItems
              .filter((item) => item.category === 'governance')
              .map((item) => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* Role Indicator Footer */}
      <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
        <div className="bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium text-[11px]">Session Role</span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active
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
      <aside className="hidden lg:block w-64 h-full shrink-0 select-none">
        {sidebarContent}
      </aside>

      {/* Mobile & Tablet Slide-over Drawer */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />

          {/* Sliding Panel */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
