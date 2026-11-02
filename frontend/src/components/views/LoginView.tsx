import React, { useState } from 'react';
import { 
  Boxes, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sun, 
  Moon, 
  Users, 
  FileCheck, 
  Building 
} from 'lucide-react';
import { useProcurement, DEMO_ACCOUNTS } from '../../context/ProcurementContext';
import { UserRole } from '../../types';
import { Button } from '../common/Button';

export const LoginView: React.FC = () => {
  const { login, theme, toggleTheme } = useProcurement();

  const [email, setEmail] = useState('elena.rostova@enterprise.internal');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('procurement_manager');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectRole = (r: UserRole) => {
    setSelectedRole(r);
    setEmail(DEMO_ACCOUNTS[r].email);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your corporate email address.');
      return;
    }

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      login(email, password);
      setIsLoading(false);
    }, 350);
  };

  return (
    <div className="h-screen w-full flex bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200 overflow-y-auto lg:overflow-hidden select-none">
      {/* Left Brand Showcase Column (Desktop Only) */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white p-6 xl:p-10 flex-col justify-between relative overflow-hidden border-r border-slate-800 shrink-0">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 ring-1 ring-blue-400/40">
            <Boxes className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              VendorSphere
              <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.2 rounded-full">
                v2.4 Enterprise
              </span>
            </span>
            <p className="text-[11px] text-slate-400">Vendor & Procurement Management Platform</p>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 space-y-4 my-auto py-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            Institutional Procurement & Supplier Governance
          </div>

          <h1 className="text-2xl xl:text-3xl font-extrabold tracking-tight text-white leading-tight">
            End-to-End Visibility, Accountability & Control.
          </h1>

          <p className="text-xs text-slate-300 leading-relaxed max-w-md">
            Unify requisitions, multi-tier authorizations, competitive quotation tendering, Purchase Orders, and automated 3-way matching in a single verified platform.
          </p>

          {/* Core Feature Pillars in Compact 2x2 Grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            {[
              {
                title: '8-Stage Lifecycle',
                desc: 'Requisition to delivery & audit closure.',
              },
              {
                title: 'Multi-Tier Approvals',
                desc: 'Dept, sourcing & CFO threshold rules.',
              },
              {
                title: 'Competitive RFQ Bids',
                desc: 'Side-by-side comparative matrices.',
              },
              {
                title: '3-Way Match & QC',
                desc: 'Verified receiving dock inspections.',
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-white/5 border border-white/10 rounded-lg p-2.5 backdrop-blur-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">{item.title}</div>
                  <div className="text-[10px] text-slate-300 leading-tight mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Trust Metrics */}
        <div className="relative z-10 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            <div className="font-bold text-white text-sm xl:text-base">$4.2M+</div>
            <div className="text-[10px] text-slate-400">Managed Spend</div>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <div className="font-bold text-emerald-400 text-sm xl:text-base">99.8%</div>
            <div className="text-[10px] text-slate-400">On-Time SLA</div>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <div className="font-bold text-blue-400 text-sm xl:text-base">SOC-2 / ISO</div>
            <div className="text-[10px] text-slate-400">Audit Verified</div>
          </div>
        </div>
      </div>

      {/* Right Form Column */}
      <div className="w-full lg:w-7/12 xl:w-1/2 flex flex-col justify-between p-4 sm:p-6 lg:p-8 xl:p-10 relative overflow-y-auto">
        {/* Top Header: Mobile Logo & Theme Toggle */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Boxes className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-slate-900 dark:text-white">VendorSphere</span>
          </div>

          <div className="ml-auto">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>
          </div>
        </div>

        {/* Center Card */}
        <div className="max-w-md w-full mx-auto my-auto py-2 sm:py-4">
          <div className="mb-4 space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Sign In to Your Workspace
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select an enterprise persona below or enter your credentials:
            </p>
          </div>

          {/* Quick Demo Role Selector Pills */}
          <div className="space-y-1.5 mb-4">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Quick Role Demo Accounts:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  role: 'procurement_manager' as UserRole,
                  title: 'Procurement Mgr',
                  name: 'Elena Rostova',
                  icon: <FileCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />,
                },
                {
                  role: 'requester' as UserRole,
                  title: 'Dept Requester',
                  name: 'Sarah Jenkins',
                  icon: <Users className="w-3.5 h-3.5 text-indigo-500 shrink-0" />,
                },
                {
                  role: 'admin' as UserRole,
                  title: 'Administrator',
                  name: 'Alexander Vance',
                  icon: <ShieldCheck className="w-3.5 h-3.5 text-purple-500 shrink-0" />,
                },
                {
                  role: 'vendor' as UserRole,
                  title: 'Vendor Partner',
                  name: 'Apex Cloud Rep',
                  icon: <Building className="w-3.5 h-3.5 text-emerald-500 shrink-0" />,
                },
              ].map((p) => {
                const isSelected = selectedRole === p.role;
                return (
                  <button
                    key={p.role}
                    type="button"
                    onClick={() => handleSelectRole(p.role)}
                    className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 dark:bg-blue-500/10 dark:border-blue-500 shadow-xs ring-1 ring-blue-500/30'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {p.icon}
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {p.title}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate pl-5">
                      {p.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@enterprise.internal"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-blue-600 dark:text-blue-400 hover:underline text-[11px]">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter enterprise credentials"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-9 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-600 dark:text-slate-400 text-xs">Remember session for 30 days</span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={isLoading}
              className="w-full text-xs sm:text-sm font-semibold py-2.5 mt-1"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Procurement Workspace
            </Button>
          </form>

          {/* Quick Note */}
          <div className="mt-3.5 pt-3 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Demo Environment: All 4 enterprise user roles are pre-configured.<br />
              Select any role pill above and click <strong>Sign In</strong> to explore.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] text-slate-400 dark:text-slate-500 pt-2 shrink-0">
          VendorSphere Enterprise Procurement • ADZ4NEEDZ Software Challenge • Restricted Access
        </div>
      </div>
    </div>
  );
};
