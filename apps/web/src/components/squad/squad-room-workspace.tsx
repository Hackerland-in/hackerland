'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import type {
  ProjectSquadRoom,
  MilestoneEscrow,
  KanbanTask,
} from '@hackerland/core';

interface Props {
  squadRoom: ProjectSquadRoom;
}

export function SquadRoomWorkspace({ squadRoom }: Props) {
  const [activeTab, setActiveTab] = useState<'escrow' | 'kanban' | 'roster'>('escrow');
  const [milestones, setMilestones] = useState<MilestoneEscrow[]>(squadRoom.milestones);
  const [tasks, setTasks] = useState<KanbanTask[]>(squadRoom.tasks);
  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneEscrow | null>(null);
  const [proofUrl, setProofUrl] = useState<string>('');
  const [proofSummary, setProofSummary] = useState<string>('');
  const [proofSuccessMsg, setProofSuccessMsg] = useState<string | null>(null);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskPriority, setNewTaskPriority] = useState<KanbanTask['priority']>('medium');

  const releasedEscrowInr = milestones
    .filter((m) => m.status === 'released')
    .reduce((acc, m) => acc + m.escrowAmountInr, 0);


  const releasedEscrowUsd = milestones
    .filter((m) => m.status === 'released')
    .reduce((acc, m) => acc + m.escrowAmountUsd, 0);


  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMilestone || !proofUrl.trim()) return;

    setMilestones((prev) =>
      prev.map((m) =>
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
          : m
      )
    );

    setProofSuccessMsg(`Proof submitted for "${selectedMilestone.title}"! Escrow will release upon peer review.`);
    setSelectedMilestone(null);
    setProofUrl('');
    setProofSummary('');
    setTimeout(() => setProofSuccessMsg(null), 5000);
  };

  const handleSimulateDisburse = (milestoneId: string) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId ? { ...m, status: 'released' } : m
      )
    );
    setProofSuccessMsg('Escrow disbursed! Verified credential minted to member Personal Innovation Passport.');
    setTimeout(() => setProofSuccessMsg(null), 5000);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const task: KanbanTask = {
      id: `task_${Date.now()}`,
      title: newTaskTitle.trim(),
      status: 'todo',
      priority: newTaskPriority,
      tags: ['Squad'],
    };
    setTasks((prev) => [task, ...prev]);
    setNewTaskTitle('');
  };

  const handleCycleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const next: Record<KanbanTask['status'], KanbanTask['status']> = {
          todo: 'in_progress',
          in_progress: 'review',
          review: 'done',
          done: 'todo',
        };
        return { ...t, status: next[t.status] };
      })
    );
  };

  return (
    <div className="space-y-8">
      {/* Escrow Pool Vault Header */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-neutral-900 to-black p-6 space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Milestone Escrow Active
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                Project: {squadRoom.projectTitle}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Squad Room & Proof-of-Work Vault
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed">
              {squadRoom.tagline}
            </p>
          </div>

          {/* Escrow Pool Vault Counter */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 shrink-0 flex items-center gap-6">
            <div>
              <span className="text-[11px] text-neutral-400 block mb-0.5">Total Escrow Vault</span>
              <div className="text-2xl font-black text-white">
                {currency === 'INR'
                  ? `₹${squadRoom.escrowPoolTotalInr.toLocaleString('en-IN')}`
                  : `$${squadRoom.escrowPoolTotalUsd}`}
              </div>
              <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1">
                <Unlock className="w-3 h-3" />
                {currency === 'INR' ? `₹${releasedEscrowInr.toLocaleString('en-IN')} Disbursed` : `$${releasedEscrowUsd} Disbursed`}
              </div>
            </div>

            <div className="border-l border-neutral-800 pl-4 flex flex-col justify-between">
              <div className="flex rounded-lg bg-neutral-900 border border-neutral-800 p-0.5">
                <button
                  type="button"
                  onClick={() => setCurrency('INR')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                    currency === 'INR' ? 'bg-emerald-500 text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  ₹
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                    currency === 'USD' ? 'bg-emerald-500 text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  $
                </button>
              </div>

              <Link
                href={`/projects/${squadRoom.projectSlug}`}
                className="text-[11px] text-neutral-400 hover:text-white mt-2 flex items-center gap-1"
              >
                Project Details <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Success Alert Banner */}
        {proofSuccessMsg && (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3.5 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{proofSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Workspace Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('escrow')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'escrow'
              ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/10'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          <Lock className="w-3.5 h-3.5" /> Milestone Escrow & Proofs ({milestones.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('kanban')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'kanban'
              ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/10'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          <Kanban className="w-3.5 h-3.5" /> Squad Kanban Board ({tasks.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('roster')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'roster'
              ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/10'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" /> Squad Roster & Roles ({squadRoom.squadMembers.length})
        </button>
      </div>

      {/* TAB 1: Milestone Escrow & Proof-of-Work Vault */}
      {activeTab === 'escrow' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {milestones.map((m, idx) => {
              let statusBadge = (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-neutral-500" /> Escrow Locked
                </span>
              );

              if (m.status === 'in_review') {
                statusBadge = (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1 font-semibold">
                    <Clock className="w-3 h-3 text-amber-400" /> In Peer Review
                  </span>
                );
              } else if (m.status === 'released') {
                statusBadge = (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Disbursed
                  </span>
                );
              }

              return (
                <div
                  key={m.id}
                  className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 transition ${
                    m.status === 'released'
                      ? 'border-emerald-500/40 bg-emerald-950/10'
                      : m.status === 'in_review'
                      ? 'border-amber-500/40 bg-amber-950/10'
                      : 'border-neutral-800 bg-neutral-900/40 hover:border-neutral-700'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-neutral-500">MILESTONE 0{idx + 1}</span>
                      {statusBadge}
                    </div>

                    <h3 className="text-base font-bold text-white leading-snug">{m.title}</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">{m.description}</p>

                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-1">
                      <div className="text-[11px] text-neutral-500">Escrow Bounty:</div>
                      <div className="text-lg font-black text-emerald-400">
                        {currency === 'INR'
                          ? `₹${m.escrowAmountInr.toLocaleString('en-IN')}`
                          : `$${m.escrowAmountUsd}`}
                      </div>
                      <div className="text-[10px] text-neutral-400 flex items-center gap-1 pt-1 border-t border-neutral-800">
                        <Award className="w-3 h-3 text-amber-400" /> Badge: {m.unlockedPassportBadge}
                      </div>
                    </div>

                    {/* Proof Requirements */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">
                        Deliverables Required:
                      </span>
                      <ul className="text-xs text-neutral-400 space-y-1">
                        {m.proofRequirements.map((req) => (
                          <li key={req} className="flex items-start gap-1.5 text-[11px]">
                            <span className="text-emerald-400 mt-0.5">•</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Submitted Proof Card */}
                    {m.submittedProof && (
                      <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-[10px] text-neutral-400">
                          <span>Proof by @{m.submittedProof.submittedBy}</span>
                          <span>{m.submittedProof.submittedAt}</span>
                        </div>
                        <p className="text-[11px] text-neutral-300 italic">{m.submittedProof.summary}</p>
                        <a
                          href={m.submittedProof.proofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:underline"
                        >
                          Inspect Deliverable <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-neutral-800">
                    {m.status === 'escrow_locked' && (
                      <button
                        type="button"
                        onClick={() => setSelectedMilestone(m)}
                        className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10"
                      >
                        <Send className="w-3.5 h-3.5" /> Submit Proof of Work
                      </button>
                    )}

                    {m.status === 'in_review' && (
                      <button
                        type="button"
                        onClick={() => handleSimulateDisburse(m.id)}
                        className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/10"
                      >
                        <Unlock className="w-3.5 h-3.5" /> Approve & Disburse Escrow
                      </button>
                    )}

                    {m.status === 'released' && (
                      <div className="text-center text-xs text-emerald-400 font-medium py-1.5 bg-emerald-950/40 rounded-lg border border-emerald-500/30">
                        ✓ Credited to Passport
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit Proof Modal / Drawer */}
          {selectedMilestone && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-950 p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                      Proof Submission
                    </span>
                    <h3 className="text-base font-bold text-white">{selectedMilestone.title}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedMilestone(null)}
                    className="text-neutral-400 hover:text-white text-xs"
                  >
                    ✕ Close
                  </button>
                </div>

                <form onSubmit={handleSubmitProof} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Proof URL (GitHub PR / Gerber ZIP / Video / Datasheet)
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://github.com/..."
                      value={proofUrl}
                      onChange={(e) => setProofUrl(e.target.value)}
                      className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Summary of Deliverable & Benchmark Results
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Describe test methodology, achieved metrics, and artifacts..."
                      value={proofSummary}
                      onChange={(e) => setProofSummary(e.target.value)}
                      className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300">
                    Bounty on verification: <strong>₹{selectedMilestone.escrowAmountInr.toLocaleString('en-IN')}</strong> ($
                    {selectedMilestone.escrowAmountUsd}) + <strong>{selectedMilestone.unlockedPassportBadge}</strong> badge.
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedMilestone(null)}
                      className="px-4 py-2 rounded-lg bg-neutral-800 text-xs text-neutral-300 hover:bg-neutral-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs"
                    >
                      Submit for Peer Review
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Interactive Squad Kanban Board */}
      {activeTab === 'kanban' && (
        <div className="space-y-6">
          {/* Quick Task Creator */}
          <form onSubmit={handleAddTask} className="flex gap-2">
            <input
              type="text"
              placeholder="Add squad task (e.g. 'Route CAN transceiver termination in PCB Studio')..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1 rounded-xl bg-neutral-950 border border-neutral-800 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value as KanbanTask['priority'])}
              className="rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="critical">Critical Path</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" /> Add Task
            </button>
          </form>

          {/* Kanban Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(
              [
                { id: 'todo', label: 'To Do', color: 'border-neutral-700' },
                { id: 'in_progress', label: 'In Progress', color: 'border-cyan-500/50' },
                { id: 'review', label: 'Peer Review', color: 'border-amber-500/50' },
                { id: 'done', label: 'Completed', color: 'border-emerald-500/50' },
              ] as const
            ).map((col) => {
              const colTasks = tasks.filter((t) => t.status === col.id);
              return (
                <div
                  key={col.id}
                  className={`rounded-2xl border ${col.color} bg-neutral-900/30 p-4 space-y-3 min-h-[350px] flex flex-col justify-between`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">{col.label}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 font-mono">
                        {colTasks.length}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {colTasks.map((t) => {
                        let priorityColor = 'text-neutral-400';
                        if (t.priority === 'high') priorityColor = 'text-orange-400';
                        if (t.priority === 'critical') priorityColor = 'text-rose-400 font-bold';

                        return (
                          <div
                            key={t.id}
                            onClick={() => handleCycleTaskStatus(t.id)}
                            className="cursor-pointer rounded-xl border border-neutral-800 bg-neutral-950 p-3 space-y-2 hover:border-emerald-500/50 transition group"
                            title="Click to advance status"
                          >
                            <p className="text-xs font-medium text-white group-hover:text-emerald-300 leading-snug">
                              {t.title}
                            </p>
                            <div className="flex items-center justify-between text-[10px]">
                              <span className={priorityColor}>
                                {t.priority.toUpperCase()}
                              </span>
                              {t.assigneeHandle ? (
                                <span className="text-neutral-400 font-mono">@{t.assigneeHandle}</span>
                              ) : (
                                <span className="text-neutral-600">Unassigned</span>
                              )}
                            </div>
                            <div className="text-[9px] text-neutral-500 flex justify-end">
                              Click to advance →
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Squad Roster & Role Applications */}
      {activeTab === 'roster' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {squadRoom.squadMembers.map((member) => {
              const isFilled = member.status === 'filled';
              return (
                <div
                  key={member.id}
                  className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 uppercase tracking-wider font-semibold">
                        {member.track} Track
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                          isFilled
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 animate-pulse'
                        }`}
                      >
                        {isFilled ? 'Filled Role' : 'Open for Application'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">{member.roleTitle}</h3>
                    {member.stipend && (
                      <div className="text-xs font-mono text-emerald-400 font-semibold">
                        {member.stipend}
                      </div>
                    )}

                    {isFilled && member.assignee && (
                      <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">
                          {member.assignee.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-white truncate">{member.assignee.name}</div>
                          <div className="text-[10px] text-neutral-500 font-mono">
                            @{member.assignee.handle} • {member.assignee.reputationScore ?? 300} REP
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">
                        Required Core Skills:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {member.skills.map((s) => (
                          <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-800">
                    {!isFilled ? (
                      <Link
                        href={`/projects/${squadRoom.projectSlug}#open-roles`}
                        className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10"
                      >
                        Apply for This Role <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <div className="text-center text-xs text-neutral-500 py-1.5">Active Contributor</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
