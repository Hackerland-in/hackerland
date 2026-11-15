'use client';

import { useState } from 'react';
import type { ModerationAction, ModerationReport, ReportStatus } from '@/lib/data/types';
import { Badge, Button, EmptyState } from '@hackerland/ui';
import {
  AlertTriangle,
  Ban,
  CheckCircle,
  EyeOff,
  Filter,
} from 'lucide-react';

interface ModerationDashboardProps {
  initialReports: ModerationReport[];
}

export function ModerationDashboard({ initialReports }: ModerationDashboardProps) {
  const [reports, setReports] = useState<ModerationReport[]>(initialReports);
  const [filter, setFilter] = useState<ReportStatus | 'all'>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  const filteredReports = reports.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const counts = {
    all: reports.length,
    pending: reports.filter((r) => r.status === 'pending').length,
    reviewed: reports.filter((r) => r.status === 'reviewed').length,
    actioned: reports.filter((r) => r.status === 'actioned').length,
    dismissed: reports.filter((r) => r.status === 'dismissed').length,
  };

  const handleAction = async (reportId: string, action: ModerationAction, newStatus: ReportStatus = 'actioned') => {
    setActionLoading(reportId);
    setBannerMessage(null);

    try {
      await fetch(`/api/moderation/reports/${reportId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, status: newStatus }),
      });

      // Optimistically update even if offline/fixture mode
      setReports((prev) =>
        prev.map((r) => {
          if (r.id === reportId) {
            return {
              ...r,
              status: newStatus,
              actionTaken: action,
              resolvedBy: 'mod_admin',
              resolvedAt: new Date().toISOString(),
            };
          }
          return r;
        })
      );

      setBannerMessage(
        `Incident #${reportId} updated to ${newStatus.toUpperCase()}${action !== 'none' ? ` with action [${action.toUpperCase()}]` : ''}.`
      );
    } catch {
      // Fallback local update
      setReports((prev) =>
        prev.map((r) => {
          if (r.id === reportId) {
            return {
              ...r,
              status: newStatus,
              actionTaken: action,
              resolvedBy: 'mod_admin',
              resolvedAt: new Date().toISOString(),
            };
          }
          return r;
        })
      );
      setBannerMessage(`Incident #${reportId} updated locally (offline mode).`);
    } finally {
      setActionLoading(null);
    }
  };

  const getReasonTone = (reason: string): 'danger' | 'warning' | 'neutral' => {
    if (reason === 'child_safety' || reason === 'malicious_code') return 'danger';
    if (reason === 'scam' || reason === 'harassment') return 'warning';
    return 'neutral';
  };

  return (
    <div className="space-y-6 min-w-0">
      {/* Banner */}
      {bannerMessage && (
        <div
          role="status"
          className="flex items-center justify-between rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-body-sm text-accent-fg"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{bannerMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setBannerMessage(null)}
            className="text-label-xs font-mono underline hover:text-fg"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-4">
        <div
          role="navigation"
          aria-label="Filter reports by status"
          className="flex flex-wrap items-center gap-2"
        >
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`rounded-md px-3 py-1.5 text-label-sm font-display font-medium transition-colors ${
              filter === 'all'
                ? 'bg-accent text-on-solid'
                : 'bg-surface-2 text-fg-muted hover:text-fg'
            }`}
          >
            All ({counts.all})
          </button>
          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={`rounded-md px-3 py-1.5 text-label-sm font-display font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-warning text-on-solid'
                : 'bg-surface-2 text-fg-muted hover:text-fg'
            }`}
          >
            Pending ({counts.pending})
          </button>
          <button
            type="button"
            onClick={() => setFilter('reviewed')}
            className={`rounded-md px-3 py-1.5 text-label-sm font-display font-medium transition-colors ${
              filter === 'reviewed'
                ? 'bg-surface-3 text-fg border border-accent/30'
                : 'bg-surface-2 text-fg-muted hover:text-fg'
            }`}
          >
            Reviewed ({counts.reviewed})
          </button>
          <button
            type="button"
            onClick={() => setFilter('actioned')}
            className={`rounded-md px-3 py-1.5 text-label-sm font-display font-medium transition-colors ${
              filter === 'actioned'
                ? 'bg-danger text-on-solid'
                : 'bg-surface-2 text-fg-muted hover:text-fg'
            }`}
          >
            Actioned ({counts.actioned})
          </button>
          <button
            type="button"
            onClick={() => setFilter('dismissed')}
            className={`rounded-md px-3 py-1.5 text-label-sm font-display font-medium transition-colors ${
              filter === 'dismissed'
                ? 'bg-surface-3 text-fg-subtle border border-hairline'
                : 'bg-surface-2 text-fg-muted hover:text-fg'
            }`}
          >
            Dismissed ({counts.dismissed})
          </button>
        </div>

        <div className="flex items-center gap-2 text-label-xs font-mono text-fg-subtle">
          <Filter className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Showing {filteredReports.length} of {reports.length} incidents</span>
        </div>
      </div>

      {/* Incidents Queue */}
      {filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredReports.map((report) => {
            const tone = getReasonTone(report.reason);
            const isLoading = actionLoading === report.id;

            return (
              <div
                key={report.id}
                className="rounded-xl border border-hairline bg-surface-1 p-5 transition-all hover:border-line min-w-0 space-y-4"
              >
                {/* Incident Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-label-sm font-bold text-accent">
                      #{report.id}
                    </span>
                    <Badge tone={tone}>
                      {report.reason.replace(/_/g, ' ').toUpperCase()}
                    </Badge>
                    <span className="rounded bg-surface-2 px-2 py-0.5 font-mono text-label-xs uppercase text-fg-subtle border border-hairline">
                      Target: {report.targetType} ({report.targetId})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-label-xs font-mono font-medium ${
                        report.status === 'pending'
                          ? 'border border-warning/40 bg-warning/10 text-warning-fg'
                          : report.status === 'actioned'
                          ? 'border border-danger/40 bg-danger/10 text-danger-fg'
                          : report.status === 'reviewed'
                          ? 'border border-accent/40 bg-accent/10 text-accent-fg'
                          : 'border border-hairline bg-surface-2 text-fg-subtle'
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                      {report.status.toUpperCase()}
                      {report.actionTaken !== 'none' ? ` · [${report.actionTaken}]` : ''}
                    </span>
                    <span className="text-label-xs font-mono text-fg-subtle">
                      {new Date(report.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Details Body */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-body-xs text-fg-subtle">
                    <span>Reported by: <code className="font-mono text-fg-muted">{report.reporterId}</code></span>
                    {report.resolvedBy && (
                      <>
                        <span>•</span>
                        <span>Resolved by: <code className="font-mono text-accent">{report.resolvedBy}</code></span>
                      </>
                    )}
                  </div>
                  {report.details ? (
                    <div className="rounded-lg border border-hairline bg-sunken p-3 text-body-sm text-fg break-words">
                      {report.details}
                    </div>
                  ) : (
                    <p className="text-body-xs italic text-fg-subtle">
                      No additional context provided by reporter.
                    </p>
                  )}
                </div>

                {/* Action Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="text-body-xs text-fg-subtle font-mono">
                    Actions:
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={isLoading || (report.status === 'actioned' && report.actionTaken === 'hidden')}
                      onClick={() => handleAction(report.id, 'hidden', 'actioned')}
                      className="text-body-xs"
                    >
                      <EyeOff className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                      Hide Content
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={isLoading || (report.status === 'actioned' && report.actionTaken === 'warned')}
                      onClick={() => handleAction(report.id, 'warned', 'actioned')}
                      className="text-body-xs"
                    >
                      <AlertTriangle className="h-3.5 w-3.5 mr-1 text-warning" aria-hidden="true" />
                      Warn Contributor
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={isLoading || (report.status === 'actioned' && report.actionTaken === 'banned')}
                      onClick={() => handleAction(report.id, 'banned', 'actioned')}
                      className="text-body-xs border-danger/30 hover:bg-danger/10 hover:text-danger-fg text-danger-fg"
                    >
                      <Ban className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                      Ban Account
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={isLoading || report.status === 'dismissed'}
                      onClick={() => handleAction(report.id, 'none', 'dismissed')}
                      className="text-body-xs text-fg-subtle"
                    >
                      <CheckCircle className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title={`No ${filter !== 'all' ? filter : ''} reports found`}
          description={
            filter !== 'all'
              ? `There are currently no reports marked as "${filter}". Check another queue status.`
              : 'The Trust & Safety moderation queue is clean. No active incidents.'
          }
          action={
            <Button variant="secondary" onClick={() => setFilter('all')}>
              Show All Reports
            </Button>
          }
        />
      )}
    </div>
  );
}
