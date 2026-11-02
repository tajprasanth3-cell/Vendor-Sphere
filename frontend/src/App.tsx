import React, { useState } from 'react';
import { ProcurementProvider, useProcurement } from './context/ProcurementContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { DashboardView } from './components/views/DashboardView';
import { PurchaseRequestsView } from './components/views/PurchaseRequestsView';
import { QuotationsView } from './components/views/QuotationsView';
import { PurchaseOrdersView } from './components/views/PurchaseOrdersView';
import { DeliveriesView } from './components/views/DeliveriesView';
import { VendorsView } from './components/views/VendorsView';
import { AuditLogsView } from './components/views/AuditLogsView';
import { LoginView } from './components/views/LoginView';
import { CreatePRModal } from './components/modals/CreatePRModal';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, activeView } = useProcurement();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView onOpenCreatePR={() => setIsCreateModalOpen(true)} />;
      case 'requests':
        return <PurchaseRequestsView onOpenCreateModal={() => setIsCreateModalOpen(true)} />;
      case 'quotations':
        return <QuotationsView />;
      case 'orders':
        return <PurchaseOrdersView />;
      case 'deliveries':
        return <DeliveriesView />;
      case 'vendors':
        return <VendorsView />;
      case 'audits':
        return <AuditLogsView />;
      default:
        return <DashboardView onOpenCreatePR={() => setIsCreateModalOpen(true)} />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Enterprise Left Sidebar (Desktop persistent + Mobile drawer) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Navbar */}
        <Navbar onOpenCreateModal={() => setIsCreateModalOpen(true)} />

        {/* Scrollable View Canvas with Adaptive Padding */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-5 md:p-8 bg-slate-50/70 dark:bg-slate-950/90 transition-colors">
          <div className="max-w-7xl mx-auto pb-16">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Requisition Creation Modal */}
      <CreatePRModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ProcurementProvider>
      <MainAppContent />
    </ProcurementProvider>
  );
}
