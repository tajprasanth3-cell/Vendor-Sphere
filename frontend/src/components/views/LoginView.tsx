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
  Building,
  KeyRound,
  RotateCcw,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useProcurement, DEMO_ACCOUNTS } from '../../context/ProcurementContext';
import { UserRole } from '../../types';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

export const LoginView: React.FC = () => {
  const { login, theme, toggleTheme, forgotPassword, resetPasswordWithOtp } = useProcurement();

  const [email, setEmail] = useState('elena.rostova@enterprise.internal');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('procurement_manager');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

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

  const handleOpenForgotModal = () => {
    setForgotEmail(email);
    setForgotStep(1);
    setForgotError(null);
    setEnteredOtp('');
    setNewPassword('');
    setIsForgotModalOpen(true);
  };

  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setForgotError('Please enter a valid corporate email.');
      return;
    }

    setForgotLoading(true);
    setForgotError(null);

    try {
      const res = await forgotPassword(forgotEmail);
      if (res.success && res.otp) {
        setGeneratedOtp(res.otp);
        setForgotStep(2);
      } else {
        setForgotError(res.message);
      }
    } catch (err) {
      setForgotError('Failed to send reset code. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp.trim().length !== 6) {
      setForgotError('Please enter the 6-digit verification code.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setForgotError('New password must be at least 6 characters.');
      return;
    }

    setForgotLoading(true);
    setForgotError(null);

    try {
      const res = await resetPasswordWithOtp(forgotEmail, enteredOtp, newPassword);
      if (res.success) {
        setPassword(newPassword);
        setForgotStep(3);
      } else {
        setForgotError(res.message);
      }
    } catch (err) {
      setForgotError('Password reset failed. Please verify code.');
    } finally {
      setForgotLoading(false);
    }
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
                desc: 'Role-based Capex and Opex authorization.',
              },
              {
                title: 'Quotation Tender Matrix',
                desc: 'Side-by-side weighted scoring analysis.',
              },
              {
                title: 'Automated 3-Way Match',
                desc: 'PO + Waybill + Invoice validation.',
              },
            ].map((f, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-0.5"
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{f.title}</span>
                </div>
                <p className="text-[11px] text-slate-300/80 leading-snug">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Security Assurance */}
        <div className="relative z-10 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-3">
          <span>Enterprise Grade • SOC 2 & ISO 27001 Compliant</span>
          <span className="font-mono text-[10px] text-slate-400">TLS 1.3 256-Bit</span>
        </div>
      </div>

      {/* Right Authentication Form Column */}
      <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 md:p-8 relative min-w-0">
        {/* Top Bar on Right side */}
        <div className="flex items-center justify-between w-full">
          {/* Mobile Logo on small screens */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-xs">
              <Boxes className="w-4 h-4 text-white" />
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

          {/* Quick Role Demo Accounts Selector Pills */}
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
                <button
                  type="button"
                  onClick={handleOpenForgotModal}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-[11px] font-semibold cursor-pointer"
                >
                  Forgot Password?
                </button>
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

      {/* Forgot Password / Account Recovery Modal */}
      {isForgotModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsForgotModalOpen(false)}
          title="Account Password Recovery"
          subtitle="Corporate identity verification and credential reset workflow."
          maxWidth="md"
        >
          <div className="space-y-4 text-xs text-slate-800 dark:text-slate-200">
            {/* Step 1: Enter corporate email */}
            {forgotStep === 1 && (
              <form onSubmit={handleSendResetCode} className="space-y-3.5">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
                  Enter your registered institutional email. We will generate and dispatch a secure 6-digit verification code.
                </p>

                {forgotError && (
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/20 text-xs font-medium">
                    {forgotError}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    Corporate Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="name@enterprise.internal"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsForgotModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    loading={forgotLoading}
                    icon={<KeyRound className="w-3.5 h-3.5" />}
                  >
                    Send Verification Code
                  </Button>
                </div>
              </form>
            )}

            {/* Step 2: Verification Code & New Password */}
            {forgotStep === 2 && (
              <form onSubmit={handleConfirmReset} className="space-y-3.5">
                {/* Simulated Email Delivery Pill */}
                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>Demo Challenge Notification:</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    A verification code has been dispatched to <strong>{forgotEmail}</strong>.
                  </p>
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-500">Authorization OTP:</span>
                    <button
                      type="button"
                      onClick={() => setEnteredOtp(generatedOtp)}
                      className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/40 cursor-pointer"
                      title="Click to auto-fill OTP"
                    >
                      {generatedOtp} (Click to Fill)
                    </button>
                  </div>
                </div>

                {forgotError && (
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/20 text-xs font-medium">
                    {forgotError}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    Enter 6-Digit Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    placeholder="e.g. 123456"
                    className="w-full tracking-widest text-center font-mono font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    New Secure Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-9 py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Change email</span>
                  </button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    loading={forgotLoading}
                    icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    Confirm & Update Password
                  </Button>
                </div>
              </form>
            )}

            {/* Step 3: Success Confirmation */}
            {forgotStep === 3 && (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Password Successfully Updated!
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Your credentials have been securely refreshed. Your password field on the login screen has been automatically updated.
                  </p>
                </div>
                <div className="pt-2">
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="w-full justify-center text-xs font-semibold"
                  >
                    Proceed to Sign In
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
