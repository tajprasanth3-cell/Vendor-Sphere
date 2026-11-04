import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Bell, 
  UserCheck,
  Sun,
  Moon,
  Menu,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldAlert,
  CheckCheck,
  Trash2,
  X,
  ChevronRight
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
    logout,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    setActiveView,
    isBackendConnected,
    dbProviderInfo
  } = useProcurement();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    if (isNotificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationsOpen]);

  const handleNotificationClick = (notifId: string, targetView?: string) => {
    markNotificationAsRead(notifId);
    if (targetView) {
      setActiveView(targetView);
    }
    setIsNotificationsOpen(false);
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'alert':
        return <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-500 shrink-0" />;
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 shrink-0 transition-colors relative z-30">
      {/* Mobile Hamburger Button + Brand on small screens */}
      <div className="flex items-center gap-1.5 lg:hidden">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <button
          onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors sm:hidden cursor-pointer"
          aria-label="Toggle search"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Desktop Search Bar */}
      <div className="flex-1 max-w-xs sm:max-w-md relative hidden sm:block">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search PR, vendors, RFQs, POs..."
          className="w-full bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-lg pl-10 pr-8 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Mobile Dropdown Search Input */}
      {isMobileSearchOpen && (
        <div className="absolute top-16 left-0 right-0 p-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-md sm:hidden z-20 flex items-center gap-2 animate-in fade-in duration-150">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search requisitions, POs, vendors..."
              className="w-full bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-8 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={() => setIsMobileSearchOpen(false)}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-semibold"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Right Controls: Theme Toggle, Role Switcher, Notifications & CTA */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 ml-auto">
        {/* Light / Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>

        {/* Backend & MongoDB Atlas Connection Status */}
        <div 
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border bg-slate-100/80 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 shrink-0"
          title={isBackendConnected ? `Backend API Online | Database: ${dbProviderInfo?.provider || 'MongoDB Atlas'}` : 'Operating in local cache mode'}
        >
          <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-amber-400'}`} />
          <span className="text-slate-700 dark:text-slate-300 font-medium">
            {isBackendConnected ? (dbProviderInfo?.provider || 'MongoDB') : 'Local Cache'}
          </span>
        </div>

        {/* Role Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg px-2 sm:px-2.5 py-1.5 shrink-0">
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
          className="px-2.5 sm:px-3.5 shrink-0 min-h-[36px]"
        >
          <span className="hidden sm:inline">New Requisition</span>
          <span className="sm:hidden">New PR</span>
        </Button>

        {/* Notifications Dropdown Anchor */}
        <div className="relative shrink-0" ref={notifRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={`relative p-2 rounded-lg transition-colors cursor-pointer ${
              isNotificationsOpen
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="System Notifications"
            aria-label="Open notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900 animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900" />
              </>
            )}
          </button>

          {/* Interactive Notifications Panel */}
          {isNotificationsOpen && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in duration-150">
              {/* Header */}
              <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/80">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Notifications</h4>
                  {unreadNotificationsCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                      {unreadNotificationsCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {unreadNotificationsCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 px-1.5 py-0.5 rounded cursor-pointer"
                      title="Mark all notifications as read"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark read</span>
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 rounded cursor-pointer"
                      title="Clear all notifications"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Notification Items List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 dark:text-slate-500 text-xs">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-medium">No notifications</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">You are completely up to date.</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif.id, notif.targetView)}
                      className={`p-3 text-left transition-colors cursor-pointer flex items-start gap-2.5 ${
                        notif.read
                          ? 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/40 opacity-75'
                          : 'bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/70 dark:hover:bg-blue-950/30'
                      }`}
                    >
                      <div className="mt-0.5">{getNotifIcon(notif.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            {notif.title}
                          </span>
                          {!notif.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 break-words leading-snug line-clamp-2">
                          {notif.message}
                        </p>
                        <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                          <span>{notif.timestamp}</span>
                          {notif.targetView && (
                            <span className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-0.5">
                              <span>Open</span>
                              <ChevronRight className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Info */}
        <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200 dark:border-slate-800 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center font-bold text-[11px] sm:text-xs text-blue-700 dark:text-blue-400 shrink-0">
            {role === 'requester' ? 'SJ' : role === 'admin' ? 'AD' : role === 'vendor' ? 'VN' : 'ER'}
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
              {currentUser?.name || 'Elena Rostova'}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
              {currentUser?.department || 'Procurement Specialist'}
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer shrink-0"
          title="Sign Out / Switch Session"
          aria-label="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
