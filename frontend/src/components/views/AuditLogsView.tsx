import React from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import { Activity } from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { auditLogs, searchQuery } = useProcurement();

  const filtered = auditLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Audit Trail & Enterprise Accountability Logs
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Immutable trace of authorization approvals, contract awards, PO dispatches, and compliance activities.
          </p>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
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
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 sm:px-4 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-3 sm:px-4">
                    <span className="font-mono text-[10px] sm:text-[11px] font-bold text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-500/20">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 sm:px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {log.entityCode}
                  </td>
                  <td className="py-3 px-3 sm:px-4 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                    {log.user}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                    {log.role}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-slate-600 dark:text-slate-300 max-w-md">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
