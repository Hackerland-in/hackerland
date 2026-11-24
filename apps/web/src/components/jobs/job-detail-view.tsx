'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Cpu,
  MapPin,
  CheckCircle2,
  ChevronLeft,
  ExternalLink,
  Wrench,
  Check,
  Send,
  Sparkles,
} from 'lucide-react';
import type { HardwareJobPosting } from '@hackerland/core';
import { formatSalaryRangeInr } from '@hackerland/core';

interface JobDetailViewProps {
  job: HardwareJobPosting;
}

export function JobDetailView({ job }: JobDetailViewProps) {
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [hardwareBugStory, setHardwareBugStory] = useState('');
  const [applied, setApplied] = useState(false);

  const salaryText = formatSalaryRangeInr(
    job.salaryInr.minLakhs,
    job.salaryInr.maxLakhs,
    job.salaryInr.equityPercent
  );

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    setApplied(true);
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-neutral-400">
        <Link href="/jobs" className="inline-flex items-center gap-1 hover:text-white transition-colors">
          <ChevronLeft className="size-4" />
          <span>Deep-Tech Jobs & Fellowships</span>
        </Link>
        <span>/</span>
        <span className="text-white font-medium truncate">{job.title}</span>
      </div>

      {/* Hero Header */}
      <div className="rounded-2xl border border-white/10 bg-neutral-900/80 p-6 md:p-8 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            {job.hardwareDomain.replace(/_/g, ' ')}
          </span>
          <span className="text-xs font-mono text-neutral-300 bg-neutral-800 px-2.5 py-0.5 rounded-full">
            {job.roleType.replace(/_/g, ' ')}
          </span>
          <span className="text-xs font-mono text-neutral-400 bg-neutral-800 px-2.5 py-0.5 rounded-full">
            {job.experienceLevel.replace(/_/g, ' ')}
          </span>
          {job.company.verifiedDpiit && (
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              DPIIT Startup India
            </span>
          )}
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
          {job.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-300">
          <span className="text-base font-bold text-white">{job.company.name}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5 text-neutral-400" />
            <span>{job.workLocation}</span>
          </span>
          <span>•</span>
          <span className="text-emerald-400 font-mono font-bold text-sm">{salaryText}</span>
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Responsibilities, Prerequisites, Lab Benches, Proof of Work (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Overview */}
          <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Briefcase className="size-4 text-emerald-400" />
              <span>Role Overview</span>
            </h2>
            <div className="text-xs sm:text-sm text-neutral-300 leading-relaxed whitespace-pre-line space-y-3 font-sans">
              {job.descriptionMarkdown}
            </div>
          </div>

          {/* Key Responsibilities */}
          <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>Key Engineering Responsibilities</span>
            </h2>
            <div className="space-y-2">
              {job.responsibilities.map((resp, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                  <Check className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{resp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prerequisites */}
          <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="size-4 text-emerald-400" />
              <span>Prerequisites & Domain Qualifications</span>
            </h2>
            <div className="space-y-2">
              {job.prerequisites.map((prereq, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                  <span className="size-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                  <span className="leading-relaxed">{prereq}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Physical Lab Benches & Test Equipment */}
          <div className="rounded-xl border border-emerald-500/30 bg-neutral-900/60 p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Wrench className="size-4 text-emerald-400" />
              <span>Physical Lab Benches & Test Equipment</span>
            </h2>
            <p className="text-xs text-neutral-400">
              You will have direct hands-on access to the following instrumentation testbenches:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {job.hardwareBenchesUsed.map((bench, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-white/10 bg-neutral-950 p-3 text-xs font-mono text-neutral-200 flex items-center gap-2"
                >
                  <Cpu className="size-3.5 text-emerald-400 shrink-0" />
                  <span>{bench}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Required Proof of Work */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/15 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-amber-400" />
              <h2 className="text-lg font-bold text-white">Proof-of-Work Application Standard</h2>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              We do not filter by college pedigree or standard PDF resumes. Instead, the hiring engineering lead
              will evaluate your application based on verified evidence of physical hardware built:
            </p>
            <div className="space-y-2 pt-1">
              {job.proofOfWorkRequirements.map((req, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-amber-200/90 font-mono">
                  <span className="text-amber-400 font-bold shrink-0">[{idx + 1}]</span>
                  <span className="leading-relaxed">{req}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Compensation, Company & Application Form (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Compensation Card */}
          <div className="rounded-xl border border-white/10 bg-neutral-900/90 p-6 space-y-4">
            <span className="text-xs font-mono text-neutral-400 uppercase">COMPENSATION PACKAGE</span>
            <div className="space-y-1">
              <span className="text-2xl font-black text-emerald-400 font-mono block">
                {salaryText}
              </span>
              <span className="text-[11px] text-neutral-500 font-mono block">
                Approx. ₹{Math.round((job.salaryInr.minLakhs * 100000) / 12).toLocaleString('en-IN')} – ₹
                {Math.round((job.salaryInr.maxLakhs * 100000) / 12).toLocaleString('en-IN')} / month
              </span>
            </div>

            {job.fellowshipGrantStipendInr && (
              <div className="pt-2 border-t border-white/10 space-y-1 text-xs font-mono">
                <span className="text-neutral-400 block text-[11px]">FELLOWSHIP MONTHLY STIPEND:</span>
                <span className="text-base font-bold text-white">
                  ₹{job.fellowshipGrantStipendInr.toLocaleString('en-IN')} / mo
                </span>
              </div>
            )}
          </div>

          {/* Company Profile Card */}
          <div className="rounded-xl border border-white/10 bg-neutral-900/90 p-6 space-y-3">
            <span className="text-xs font-mono text-neutral-400 uppercase">ORGANIZATION PROFILE</span>
            <h3 className="text-base font-bold text-white">{job.company.name}</h3>
            <div className="space-y-1.5 text-xs text-neutral-300">
              <div className="flex justify-between">
                <span className="text-neutral-500">Location:</span>
                <span>{job.company.city}, {job.company.state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Founded:</span>
                <span className="font-mono">{job.company.foundedYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Stage:</span>
                <span className="font-mono text-emerald-400">{job.company.stage}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10">
              <a
                href={job.company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                <span>Company Website</span>
                <ExternalLink className="size-3.5" />
              </a>
            </div>
          </div>

          {/* Proof-of-Work Application Form */}
          <div className="rounded-xl border border-emerald-500/40 bg-neutral-900/95 p-6 space-y-4 shadow-xl">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-bold">
                <Send className="size-3" />
                <span>DIRECT TO ENGINEERING LEAD</span>
              </div>
              <h3 className="text-base font-bold text-white">Apply with Proof-of-Work</h3>
            </div>

            {applied ? (
              <div className="rounded-lg border border-emerald-500 bg-emerald-500/10 p-4 text-center space-y-2">
                <CheckCircle2 className="size-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Application Received!</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Your proof-of-work submission has been routed directly to the engineering hiring team at{' '}
                  <span className="font-bold text-white">{job.company.name}</span>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-3 text-xs">
                <div>
                  <label className="text-neutral-400 block mb-1">Your Full Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Joshi"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Email Address:</label>
                  <input
                    type="email"
                    required
                    placeholder="vikram@example.com"
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">
                    Proof-of-Work Link (GitHub / Altium / CAD / Video):
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://github.com/my-profile/firmware-repo"
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">
                    Describe a hard hardware bug you encountered and resolved:
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Solved ringing on high-side gate driver by adding ferrite bead and tuned deadtime to 120ns..."
                    value={hardwareBugStory}
                    onChange={(e) => setHardwareBugStory(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-500 text-neutral-950 font-bold text-xs rounded-lg hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  Submit Application with Proof-of-Work
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
