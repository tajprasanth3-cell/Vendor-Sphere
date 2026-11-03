import React, { useState } from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import { 
  Activity, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Users, 
  Clock, 
  User, 
  Filter,
  AlertCircle,
  Lock
} from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { auditLogs, searchQuery } = useProcurement();
  const [entityFilter, setEntityFilter] = useState<string>('all');

  const totalLogs = auditLogs.length;
  const approvalsCount = auditLogs.filter(
    (l) => l.action.includes('APPROV') || l.action.includes('QC') || l.action.includes('MATCH')
  ).length;
  const poEventsCount = auditLogs.filter(
    (l) => l.entityType === 'PO' || l.action.includes('PO') || l.action.includes('AWARD')
  ).length;
  const uniqueActorsCount = new Set(auditLogs.map((l) => l.user)).size;

  const filtered = auditLogs.filter((log) => {
    const matchesFilter = entityFilter === 'all' || log.entityType === entityFilter;
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="audit-logs-view space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="truncate">Audit Trail & Enterprise Accountability Logs</span>
            </h2>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shrink-0">
              <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>SOC2 / ISO 27001 Immutable</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed break-words">
            Immutable trace of authorization approvals, contract awards, PO dispatches, and compliance activities.
          </p>
        </div>
      </div>

      {/* Audit Executive Metrics Grid */}
      <div className="audit-metrics-grid grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>Audit Events</span>
          </div>
          <div className="mt-1 text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {totalLogs}
          </div>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Authorizations</span>
          </div>
          <div className="mt-1 text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {approvalsCount}
          </div>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
            <FileText className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
            <span>Commitments & POs</span>
          </div>
          <div className="mt-1 text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {poEventsCount}
          </div>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
            <Users className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Authorized Actors</span>
          </div>
          <div className="mt-1 text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {uniqueActorsCount}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="audit-filter-tabs flex items-center gap-1.5 sm:gap-2 pb-1 overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: `All Events (${totalLogs})` },
          { id: 'PR', label: 'Requisitions (PR)' },
          { id: 'PO', label: 'Purchase Orders (PO)' },
          { id: 'RFQ', label: 'Tenders & RFQs' },
          { id: 'DELIVERY', label: 'Logistics & QC' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setEntityFilter(tab.id)}
            className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shrink-0 cursor-pointer ${
              entityFilter === tab.id
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Mobile Cards Layout (< 640px) - Zero Overflow, Adjusted Snug Padding */}
      <div className="sm:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No audit records match your query.</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Try selecting another filter or clearing search keywords.</p>
          </div>
        ) : (
          filtered.map((log) => (
            <div
              key={log.id}
              className="audit-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-2.5 shadow-xs"
            >
              {/* Event Badge & Timestamp */}
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-900/30 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800 break-all">
                  {log.action}
                </span>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 shrink-0 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{log.timestamp}</span>
                </span>
              </div>

              {/* Entity Reference & Actor */}
              <div className="flex items-center justify-between text-xs gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-1 font-mono font-bold text-slate-900 dark:text-white">
                  <span className="text-slate-400 dark:text-slate-500 font-normal">{log.entityType}:</span>
                  <span>{log.entityCode}</span>
                </div>
                <div className="text-right min-w-0">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate text-xs">
                    {log.user}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                    {log.role}
                  </span>
                </div>
              </div>

              {/* Details Box */}
              <div className="audit-details-box bg-slate-50 dark:bg-slate-950/70 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 break-words leading-relaxed">
                {log.details}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 2. Tablet & Desktop Structured Table (>= 640px) */}
      <div className="hidden sm:block audit-table-container bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="audit-table-wrapper overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs min-w-[720px]">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-3 sm:px-4">Timestamp</th>
                <th className="py-3 px-3 sm:px-4">Event Type</th>
                <th className="py-3 px-3 sm:px-4">Entity Ref</th>
                <th className="py-3 px-3 sm:px-4">Actor</th>
                <th className="py-3 px-3 sm:px-4">Role</th>
                <th className="py-3 px-3 sm:px-4">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    No audit records match your query.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 sm:px-4 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                      <span className="font-mono text-[10px] sm:text-[11px] font-bold text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-900/30 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 sm:px-4 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      <span className="text-slate-400 dark:text-slate-500 font-normal mr-1">{log.entityType}:</span>
                      {log.entityCode}
                    </td>
                    <td className="py-3 px-3 sm:px-4 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {log.user}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">
                      {log.role}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-slate-600 dark:text-slate-300 max-w-md break-words">
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
