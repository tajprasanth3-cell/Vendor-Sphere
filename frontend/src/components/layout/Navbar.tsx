import React from 'react';
import { 
  Search, 
  Plus, 
  Bell, 
  UserCheck,
  Sun,
  Moon,
  Menu,
  LogOut
} from 'lucide-react';
import { useProcurement } from '../../context/ProcurementContext';
import { APP_CONFIG } from '../../config';
import { Button } from '../common/Button';
import { UserRole } from '../../types';

interface NavbarProps {
  onOpenCreateModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreateModal }) => {
  const { 
    role, 
    setRole, 
    theme, 
    toggleTheme, 
    searchQuery, 
    setSearchQuery, 
    setIsMobileSidebarOpen,
    currentUser,
    logout
  } = useProcurement();

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 shrink-0 transition-colors">
      {/* Mobile Hamburger Button + Brand on small screens */}
      <div className="flex items-center gap-2 lg:hidden">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-xs sm:max-w-md relative hidden sm:block">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search PR, vendors, RFQs, POs..."
          className="w-full bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Right Controls: Theme Toggle, Role Switcher & CTA */}
      <div className="flex items-center gap-1.5 sm:gap-3 ml-auto">
        {/* Light / Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>

        {/* Role Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg px-2 sm:px-2.5 py-1.5">
          <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden md:inline">Role:</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="bg-transparent text-[11px] sm:text-xs font-semibold text-slate-800 dark:text-white focus:outline-none cursor-pointer pr-1"
          >
            {APP_CONFIG.roles.map((r) => (
              <option 
                key={r.id} 
                value={r.id} 
                className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              >
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Create Purchase Requisition CTA */}
        <Button
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={onOpenCreateModal}
          className="px-2.5 sm:px-3.5"
        >
          <span className="hidden sm:inline">New Requisition</span>
          <span className="sm:hidden">New PR</span>
        </Button>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="System Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900 animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center font-bold text-[11px] sm:text-xs text-blue-700 dark:text-blue-400 shrink-0">
            {role === 'requester' ? 'SJ' : role === 'admin' ? 'AD' : role === 'vendor' ? 'VN' : 'ER'}
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
              {currentUser?.name || (role === 'requester' ? 'Sarah Jenkins' : role === 'admin' ? 'Alexander Vance' : role === 'vendor' ? 'Apex Sales Rep' : 'Elena Rostova')}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
              {currentUser?.department || (role === 'requester' ? 'Engineering Lead' : role === 'admin' ? 'Admin / Compliance' : role === 'vendor' ? 'Supplier Portal' : 'Procurement Specialist')}
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
          title="Sign Out / Switch Session"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
