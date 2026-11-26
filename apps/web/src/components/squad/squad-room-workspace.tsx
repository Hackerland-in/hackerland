'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Unlock,
  Clock,
  ArrowRight,
  ExternalLink,
  Kanban,
  Plus,
  Send,
  Award,
  X,
} from 'lucide-react';
import { Avatar, Badge, Button, Card, CardBody, Chip, Input, TRACK_TONES, Textarea, cn, type Tone } from '@hackerland/ui';
import type {
  ProjectSquadRoom,
  MilestoneEscrow,
  KanbanTask,
} from '@hackerland/core';
import type { SquadWorkflowState } from '@/lib/data/community-workflows-store';

interface Props {
  squadRoom: ProjectSquadRoom;
}

export function SquadRoomWorkspace({ squadRoom }: Props) {
  const storageKey = `hackerland_squad_${squadRoom.projectSlug}`;
  const [activeTab, setActiveTab] = useState<'escrow' | 'kanban' | 'roster'>('escrow');
  const [milestones, setMilestones] = useState<MilestoneEscrow[]>(squadRoom.milestones);
  const [tasks, setTasks] = useState<KanbanTask[]>(squadRoom.tasks);
  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneEscrow | null>(null);
  const [proofUrl, setProofUrl] = useState<string>('');
  const [proofSummary, setProofSummary] = useState<string>('');
  const [proofSuccessMsg, setProofSuccessMsg] = useState<string | null>(null);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [shareReleaseToFeed, setShareReleaseToFeed] = useState<boolean>(true);
  const [priorityFilter, setPriorityFilter] = useState<KanbanTask['priority'] | 'all'>('all');

  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskPriority, setNewTaskPriority] = useState<KanbanTask['priority']>('medium');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as SquadWorkflowState;
        if (Array.isArray(parsed.milestones)) setMilestones(parsed.milestones);
        if (Array.isArray(parsed.tasks)) setTasks(parsed.tasks);
      }
    } catch {}

    let active = true;
    fetch(`/api/squads/${squadRoom.projectSlug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data?.state) return;
        const srv = data.state as SquadWorkflowState;
        if (Array.isArray(srv.milestones) && srv.milestones.length > 0) {
          setMilestones((prev) =>
            prev.map((m) => srv.milestones.find((sm) => sm.id === m.id) ?? m),
          );
        }
        if (Array.isArray(srv.tasks) && srv.tasks.length > 0) {
          setTasks((prev) => {
            const seen = new Set(prev.map((t) => t.id));
            const merged = [...prev];
            for (const st of srv.tasks) {
              if (!seen.has(st.id)) merged.push(st);
            }
            return merged;
          });
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [squadRoom.projectSlug, storageKey]);

  const persistLocal = (nextMilestones: MilestoneEscrow[], nextTasks: KanbanTask[]) => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ milestones: nextMilestones, tasks: nextTasks }),
      );
    } catch {}
  };

  const releasedEscrowInr = milestones
    .filter((m) => m.status === 'released')
    .reduce((acc, m) => acc + m.escrowAmountInr, 0);

  const releasedEscrowUsd = milestones
    .filter((m) => m.status === 'released')
    .reduce((acc, m) => acc + m.escrowAmountUsd, 0);

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMilestone || !proofUrl.trim()) return;

    const nextMilestones: MilestoneEscrow[] = milestones.map((m) =>
      m.id === selectedMilestone.id
        ? {
            ...m,
            status: 'in_review',
            submittedProof: {
              proofUrl,
              summary: proofSummary || 'Proof of work submitted for peer review.',
              submittedAt: new Date().toISOString().split('T')[0] ?? '',
              submittedBy: 'current_builder',
            },
          }
        : m,
    );

    setMilestones(nextMilestones);
    persistLocal(nextMilestones, tasks);

    setProofSuccessMsg(
      `Proof submitted for "${selectedMilestone.title}"! Funds unlock after peer review.`,
    );
    const targetId = selectedMilestone.id;
    const savedProofUrl = proofUrl;
    const savedSummary = proofSummary;
    setSelectedMilestone(null);
    setProofUrl('');
    setProofSummary('');
    setTimeout(() => setProofSuccessMsg(null), 5000);

    try {
      await fetch(`/api/squads/${squadRoom.projectSlug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_proof',
          milestoneId: targetId,
          proofUrl: savedProofUrl,
          summary: savedSummary,
        }),
      });
    } catch {}
  };

  const handleSimulateDisburse = async (milestoneId: string) => {
    const nextMilestones: MilestoneEscrow[] = milestones.map((m) =>
      m.id === milestoneId ? { ...m, status: 'released' } : m,
    );
    setMilestones(nextMilestones);
    persistLocal(nextMilestones, tasks);
    setProofSuccessMsg('Escrow released! Verified badge credited to squad members.');
    setTimeout(() => setProofSuccessMsg(null), 5000);

    try {
      await fetch(`/api/squads/${squadRoom.projectSlug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'release_escrow',
          milestoneId,
          shareToFeed: shareReleaseToFeed,
        }),
      });
    } catch {}
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const task: KanbanTask = {
      id: `task_${Date.now()}`,
      title: newTaskTitle.trim(),
      status: 'todo',
      priority: newTaskPriority,
      tags: ['Squad'],
    };
    const nextTasks = [task, ...tasks];
    setTasks(nextTasks);
    persistLocal(milestones, nextTasks);
    setNewTaskTitle('');

    try {
      await fetch(`/api/squads/${squadRoom.projectSlug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_task',
          title: task.title,
          priority: task.priority,
        }),
      });
    } catch {}
  };

  const handleCycleTaskStatus = async (taskId: string) => {
    const nextTasks = tasks.map((t) => {
      if (t.id !== taskId) return t;
      const next: Record<KanbanTask['status'], KanbanTask['status']> = {
        todo: 'in_progress',
        in_progress: 'review',
        review: 'done',
        done: 'todo',
      };
      return { ...t, status: next[t.status] };
    });
    setTasks(nextTasks);
    persistLocal(milestones, nextTasks);

    try {
      await fetch(`/api/squads/${squadRoom.projectSlug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cycle_task', taskId }),
      });
    } catch {}
  };

  return (
    <div className="space-y-6 min-w-0">
      {/* Crisp White & Pink Squad Room Header */}
      <Card className="border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft/70">
        <CardBody className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-2 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="earn" variant="outline">
                  <ShieldCheck className="size-3.5" aria-hidden="true" />
                  <span>Milestone Escrow Active</span>
                </Badge>
                <span className="text-[12px] font-medium text-fg-subtle">
                  {squadRoom.projectTitle}
                </span>
              </div>
              <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold text-fg break-words">
                Squad Room &amp; Milestone Vault
              </h1>
              <p className="text-body-sm sm:text-body-md text-fg-muted max-w-2xl">
                {squadRoom.tagline}
              </p>
            </div>

            {/* Escrow Pool Vault Widget */}
            <div className="rounded-2xl border border-hairline bg-surface-1 p-4 shrink-0 flex items-center gap-5 shadow-xs">
              <div>
                <span className="text-[12px] text-fg-subtle block mb-0.5">Total Escrow Pool</span>
                <div className="font-display text-headline-lg font-bold text-fg tabular-nums">
                  {currency === 'INR'
                    ? `₹${squadRoom.escrowPoolTotalInr.toLocaleString('en-IN')}`
                    : `$${squadRoom.escrowPoolTotalUsd}`}
                </div>
                <div className="text-[12px] font-medium text-earn-fg mt-0.5 flex items-center gap-1 tabular-nums">
                  <Unlock className="size-3" aria-hidden="true" />
                  {currency === 'INR'
                    ? `₹${releasedEscrowInr.toLocaleString('en-IN')} released`
                    : `$${releasedEscrowUsd} released`}
                </div>
              </div>

              <div className="border-l border-hairline pl-4 flex flex-col items-end justify-between gap-2">
                <div className="flex rounded-full bg-surface-2 border border-hairline p-0.5">
                  <button
                    type="button"
                    onClick={() => setCurrency('INR')}
                    className={cn(
                      'px-2.5 py-1 rounded-full text-[12px] font-display font-semibold transition-colors',
                      currency === 'INR'
                        ? 'bg-accent text-on-solid'
                        : 'text-fg-muted hover:text-fg',
                    )}
                  >
                    ₹
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency('USD')}
                    className={cn(
                      'px-2.5 py-1 rounded-full text-[12px] font-display font-semibold transition-colors',
                      currency === 'USD'
                        ? 'bg-accent text-on-solid'
                        : 'text-fg-muted hover:text-fg',
                    )}
                  >
                    $
                  </button>
                </div>

                <Link
                  href={`/projects/${squadRoom.projectSlug}`}
                  className="text-[12px] font-display font-medium text-accent-fg hover:underline inline-flex items-center gap-1"
                >
                  <span>Overview</span>
                  <ArrowRight className="size-3" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          {proofSuccessMsg && (
            <div
              role="status"
              className="rounded-xl border border-success/30 bg-success/8 p-3.5 text-body-sm text-success-fg flex items-center gap-2"
            >
              <CheckCircle2 className="size-4 text-success shrink-0" aria-hidden="true" />
              <span>{proofSuccessMsg}</span>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Workspace Pill Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('escrow')}
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-4 py-2 text-body-sm font-display font-semibold transition-all border',
            activeTab === 'escrow'
              ? 'border-accent bg-accent text-on-solid shadow-xs'
              : 'border-hairline bg-surface-1 text-fg-muted hover:border-accent/40 hover:text-fg',
          )}
        >
          <Lock className="size-3.5" aria-hidden="true" />
          <span>Milestone Proofs ({milestones.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('kanban')}
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-4 py-2 text-body-sm font-display font-semibold transition-all border',
            activeTab === 'kanban'
              ? 'border-accent bg-accent text-on-solid shadow-xs'
              : 'border-hairline bg-surface-1 text-fg-muted hover:border-accent/40 hover:text-fg',
          )}
        >
          <Kanban className="size-3.5" aria-hidden="true" />
          <span>Kanban Board ({tasks.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('roster')}
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-4 py-2 text-body-sm font-display font-semibold transition-all border',
            activeTab === 'roster'
              ? 'border-accent bg-accent text-on-solid shadow-xs'
              : 'border-hairline bg-surface-1 text-fg-muted hover:border-accent/40 hover:text-fg',
          )}
        >
          <Users className="size-3.5" aria-hidden="true" />
          <span>Squad Roster ({squadRoom.squadMembers.length})</span>
        </button>
      </div>

      {/* TAB 1: Milestone Proofs */}
      {activeTab === 'escrow' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-hairline bg-surface-1 px-4 py-2.5 shadow-xs">
            <span className="text-body-xs text-fg-muted">
              Milestone proofs and tranche disbursements persist across squad sessions.
            </span>
            <label className="flex items-center gap-2 text-body-xs font-display font-medium text-fg cursor-pointer">
              <input
                type="checkbox"
                checked={shareReleaseToFeed}
                onChange={(e) => setShareReleaseToFeed(e.target.checked)}
                className="accent-accent"
              />
              <span>Broadcast tranche release to Live Feed</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {milestones.map((m, idx) => (
              <Card
                key={m.id}
                accent={m.status === 'released' ? 'earn' : m.status === 'in_review' ? 'make' : 'accent'}
                className="flex flex-col justify-between min-w-0"
              >
                <CardBody className="p-5 space-y-3.5 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-semibold text-fg-subtle">
                      Milestone 0{idx + 1}
                    </span>
                    {m.status === 'released' ? (
                      <Badge tone="success" variant="solid">
                        <CheckCircle2 className="size-3" /> Disbursed
                      </Badge>
                    ) : m.status === 'in_review' ? (
                      <Badge tone="warning" variant="outline">
                        <Clock className="size-3" /> In Review
                      </Badge>
                    ) : (
                      <Badge tone="neutral" variant="outline">
                        <Lock className="size-3" /> Locked
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-display text-headline-sm font-bold text-fg leading-snug">
                    {m.title}
                  </h3>
                  <p className="text-body-sm text-fg-muted leading-relaxed">{m.description}</p>

                  <div className="rounded-xl border border-hairline bg-surface-2/60 p-3 space-y-1">
                    <div className="text-[11px] text-fg-subtle">Escrow Reward</div>
                    <div className="font-display text-headline-sm font-bold text-earn-fg tabular-nums">
                      {currency === 'INR'
                        ? `₹${m.escrowAmountInr.toLocaleString('en-IN')}`
                        : `$${m.escrowAmountUsd}`}
                    </div>
                    <div className="text-[11px] text-fg-muted flex items-center gap-1 pt-1 border-t border-hairline">
                      <Award className="size-3 text-accent" aria-hidden="true" />
                      <span>Unlocks: {m.unlockedPassportBadge}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-display font-semibold text-fg-subtle block">
                      Deliverables
                    </span>
                    <ul className="space-y-1 text-body-sm text-fg-muted">
                      {m.proofRequirements.map((req) => (
                        <li key={req} className="flex items-start gap-1.5 text-[12px]">
                          <span className="text-accent mt-0.5">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {m.submittedProof && (
                    <div className="rounded-xl border border-hairline bg-surface-2/50 p-3 space-y-1 text-[12px]">
                      <div className="flex items-center justify-between text-fg-subtle">
                        <span>@{m.submittedProof.submittedBy}</span>
                        <span>{m.submittedProof.submittedAt}</span>
                      </div>
                      <p className="text-fg-muted italic">{m.submittedProof.summary}</p>
                      <a
                        href={m.submittedProof.proofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-accent-fg hover:underline"
                      >
                        <span>Inspect Deliverable</span>
                        <ExternalLink className="size-3" />
                      </a>
                    </div>
                  )}
                </CardBody>

                <div className="border-t border-hairline px-5 py-3.5 bg-surface-2/30">
                  {m.status === 'escrow_locked' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setSelectedMilestone(m)}
                      className="w-full"
                    >
                      <Send className="size-3.5" aria-hidden="true" />
                      <span>Submit Proof</span>
                    </Button>
                  )}
                  {m.status === 'in_review' && (
                    <Button
                      variant="earn"
                      size="sm"
                      onClick={() => handleSimulateDisburse(m.id)}
                      className="w-full"
                    >
                      <Unlock className="size-3.5" aria-hidden="true" />
                      <span>Approve &amp; Release</span>
                    </Button>
                  )}
                  {m.status === 'released' && (
                    <div className="text-center text-body-sm font-display font-semibold text-success-fg py-1">
                      ✓ Verified &amp; Credited
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* White Proof Submission Dialog */}
          {selectedMilestone && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-50 bg-fg/35 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <div className="w-full max-w-lg rounded-2xl border border-hairline bg-surface-1 p-6 space-y-4 shadow-overlay">
                <div className="flex items-center justify-between border-b border-hairline pb-3">
                  <div>
                    <span className="text-[11px] font-display font-semibold text-accent-fg">
                      Submit Milestone Proof
                    </span>
                    <h3 className="font-display text-headline-sm font-bold text-fg">
                      {selectedMilestone.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedMilestone(null)}
                    className="rounded-full p-1.5 text-fg-subtle hover:bg-surface-2 hover:text-fg"
                    aria-label="Close proof dialog"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <form onSubmit={handleSubmitProof} className="space-y-4">
                  <div>
                    <label className="block font-display text-label-md text-fg mb-1.5">
                      Proof URL (GitHub PR / Gerber ZIP / Video / Datasheet)
                    </label>
                    <Input
                      type="url"
                      required
                      placeholder="https://github.com/..."
                      value={proofUrl}
                      onChange={(e) => setProofUrl(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block font-display text-label-md text-fg mb-1.5">
                      Deliverable &amp; Benchmark Summary
                    </label>
                    <Textarea
                      rows={3}
                      required
                      placeholder="Describe test results, verification checks, and screenshots..."
                      value={proofSummary}
                      onChange={(e) => setProofSummary(e.target.value)}
                    />
                  </div>

                  <div className="rounded-xl border border-earn/25 bg-earn/8 p-3 text-body-sm text-earn-fg">
                    Unlocks{' '}
                    <strong>₹{selectedMilestone.escrowAmountInr.toLocaleString('en-IN')}</strong>{' '}
                    + <strong>{selectedMilestone.unlockedPassportBadge}</strong> badge.
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setSelectedMilestone(null)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary">
                      Submit for Review
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Squad Kanban Board */}
      {activeTab === 'kanban' && (
        <div className="space-y-5">
          <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              placeholder="Add squad task (e.g. 'Route CAN transceiver termination in PCB Studio')..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1"
            />
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value as KanbanTask['priority'])}
              className="h-11 rounded-xl border border-line bg-sunken px-3 text-body-sm text-fg focus:border-accent focus:outline-none"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="critical">Critical Path</option>
            </select>
            <Button type="submit" variant="primary" size="md">
              <Plus className="size-4" aria-hidden="true" />
              <span>Add Task</span>
            </Button>
          </form>

          <div className="flex flex-wrap items-center gap-1.5">
            {(['all', 'critical', 'high', 'medium', 'low'] as const).map((pri) => (
              <button
                key={pri}
                type="button"
                onClick={() => setPriorityFilter(pri)}
                className={cn(
                  'rounded-full px-3 py-1 text-body-xs font-display font-semibold border transition-colors capitalize',
                  priorityFilter === pri
                    ? 'border-accent bg-accent text-on-solid'
                    : 'border-hairline bg-surface-1 text-fg-muted hover:text-fg',
                )}
              >
                {pri === 'all' ? 'All Priorities' : pri}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(
              [
                { id: 'todo', label: 'To Do' },
                { id: 'in_progress', label: 'In Progress' },
                { id: 'review', label: 'Peer Review' },
                { id: 'done', label: 'Completed' },
              ] as const
            ).map((col) => {
              const colTasks = tasks.filter(
                (t) =>
                  t.status === col.id &&
                  (priorityFilter === 'all' || t.priority === priorityFilter),
              );
              return (
                <div
                  key={col.id}
                  className="rounded-2xl border border-hairline bg-surface-1 p-4 space-y-3 min-h-[320px] shadow-xs"
                >
                  <div className="flex items-center justify-between border-b border-hairline pb-2.5">
                    <span className="font-display text-label-md font-bold text-fg">{col.label}</span>
                    <span className="rounded-full bg-surface-2 px-2 py-0.5 font-mono text-[11px] font-semibold text-fg-muted">
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {colTasks.map((t) => (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => handleCycleTaskStatus(t.id)}
                        className="w-full text-left rounded-xl border border-hairline bg-surface-2/50 p-3 space-y-2 hover:border-accent/40 hover:bg-surface-1 transition-all group shadow-xs"
                        title="Click to advance status"
                      >
                        <p className="text-body-sm font-medium text-fg group-hover:text-accent-fg leading-snug">
                          {t.title}
                        </p>
                        <div className="flex items-center justify-between text-[11px]">
                          <span
                            className={cn(
                              'font-display font-semibold capitalize',
                              t.priority === 'critical'
                                ? 'text-danger-fg'
                                : t.priority === 'high'
                                ? 'text-make-fg'
                                : 'text-fg-subtle',
                            )}
                          >
                            {t.priority}
                          </span>
                          {t.assigneeHandle ? (
                            <span className="font-mono text-fg-muted">@{t.assigneeHandle}</span>
                          ) : (
                            <span className="text-fg-subtle">Unassigned</span>
                          )}
                        </div>
                        <div className="text-[10px] font-medium text-accent-fg/80 text-right">
                          Advance status →
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Squad Roster */}
      {activeTab === 'roster' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {squadRoom.squadMembers.map((member) => {
            const isFilled = member.status === 'filled';
            const memberTrackTone: Tone = (TRACK_TONES as readonly string[]).includes(member.track)
              ? (member.track as Tone)
              : 'accent';
            return (
              <Card key={member.id} className="flex flex-col justify-between">
                <CardBody className="p-5 space-y-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <Badge tone={memberTrackTone} variant="outline">
                      {member.track}
                    </Badge>
                    <Badge tone={isFilled ? 'success' : 'accent'} variant={isFilled ? 'outline' : 'solid'}>
                      {isFilled ? 'Filled' : 'Open Role'}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-display text-headline-sm font-bold text-fg">
                      {member.roleTitle}
                    </h3>
                    {member.stipend && (
                      <div className="font-display text-body-sm font-semibold text-earn-fg mt-0.5">
                        {member.stipend}
                      </div>
                    )}
                  </div>

                  {isFilled && member.assignee && (
                    <div className="rounded-xl border border-hairline bg-surface-2/60 p-3 flex items-center gap-2.5">
                      <Avatar name={member.assignee.name} size="sm" />
                      <div className="min-w-0">
                        <div className="text-body-sm font-bold text-fg truncate">
                          {member.assignee.name}
                        </div>
                        <div className="text-[11px] font-mono text-fg-subtle truncate">
                          @{member.assignee.handle} · {member.assignee.reputationScore ?? 300} REP
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5">
                    {member.skills.map((s) => (
                      <Chip key={s} className="text-[11px] py-0.5 px-2.5">
                        {s}
                      </Chip>
                    ))}
                  </div>
                </CardBody>

                <div className="border-t border-hairline px-5 py-3 bg-surface-2/30">
                  {!isFilled ? (
                    <Button asChild size="sm" variant="primary" className="w-full">
                      <Link href={`/projects/${squadRoom.projectSlug}`}>
                        <span>Apply for Role</span>
                        <ArrowRight className="size-3.5" aria-hidden="true" />
                      </Link>
                    </Button>
                  ) : (
                    <div className="text-center text-[12px] text-fg-subtle py-1">
                      Active Squad Contributor
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
