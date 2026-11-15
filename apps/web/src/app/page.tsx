import Link from 'next/link';
import {
  Code2,
  Cpu,
  Palette,
  Atom,
  Coins,
  GraduationCap,
  ArrowRight,
  Sparkles,
  Users,
  Compass,
  Trophy,
} from 'lucide-react';
import {
  Button,
  Card,
  CardBody,
  SectionHeader,
  StatTile,
} from '@hackerland/ui';
import { TRACKS, TRACK_META, formatMoney, type Track } from '@hackerland/core';
import {
  getPlatformStats,
  listOpportunities,
  listProjects,
} from '@/lib/data/queries';
import { ProjectCard } from '@/components/domain/project-card';
import { OpportunityCard } from '@/components/domain/opportunity-card';

const TRACK_ICONS: Record<Track, typeof Code2> = {
  code: Code2,
  make: Cpu,
  design: Palette,
  research: Atom,
  earn: Coins,
  learn: GraduationCap,
};

const TRACK_ROUTES: Record<
  Track,
  {
    href: string;
    actionLabel: string;
    hubBadge: string;
  }
> = {
  code: {
    href: '/projects?track=code',
    actionLabel: 'Explore Software Projects',
    hubBadge: 'Software & AI',
  },
  make: {
    href: '/manufacturing',
    actionLabel: 'Launch Manufacturing Suite',
    hubBadge: 'Hardware & Simulators',
  },
  design: {
    href: '/projects?track=design',
    actionLabel: 'Explore Design Projects',
    hubBadge: 'UI/UX & Systems',
  },
  research: {
    href: '/labs',
    actionLabel: 'Explore Research Labs & ATL',
    hubBadge: 'Deep-Tech & Labs',
  },
  earn: {
    href: '/earn',
    actionLabel: 'Explore Bounties & Grants',
    hubBadge: 'Funded Bounties',
  },
  learn: {
    href: '/learn',
    actionLabel: 'Explore Roadmaps & Courses',
    hubBadge: 'Curated Roadmaps',
  },
};

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Find a project',
    description:
      'Explore community initiatives across avionics, edge AI, assistive hardware, and scientific computing.',
    icon: Compass,
  },
  {
    step: '02',
    title: 'Join a squad',
    description:
      'Match your skills with open roles. Collaborate alongside experienced mentors, domain scientists, and student makers.',
    icon: Users,
  },
  {
    step: '03',
    title: 'Build in the open',
    description:
      'Publish progress updates, share schematics, and review pull requests on public telemetry feeds.',
    icon: Sparkles,
  },
  {
    step: '04',
    title: 'Earn & level up',
    description:
      'Claim funded bounties, secure hardware seed grants, and build verified reputation on your open-source innovator record.',
    icon: Trophy,
  },
];

export default async function HomePage() {
  const [stats, projects, opportunities] = await Promise.all([
    getPlatformStats(),
    listProjects(),
    listOpportunities(),
  ]);

  const featuredProjects = projects.slice(0, 3);
  const featuredOpportunities = opportunities.slice(0, 3);

  return (
    <div className="flex flex-col gap-20 py-8 md:py-16">
      {/* 1. Hero Section */}
      <section className="mx-auto w-full max-w-page px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <SectionHeader
            as="h1"
            size="hero"
            eyebrow="OPEN-SOURCE INNOVATION NETWORK"
            title="Build together. Earn together."
            description="The decentralized community where students, designers, programmers, makers and innovators launch ambitious open-hardware and software projects, assemble cross-disciplinary squads, and earn through bounties and grants."
            action={
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
                <Button asChild size="lg" variant="primary">
                  <Link href="/new">Start project</Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/projects">Explore projects</Link>
                </Button>
              </div>
            }
          />

          {/* Stat Strip */}
          <div className="mt-12 grid w-full grid-cols-2 gap-4 md:grid-cols-4">
            <StatTile
              label="Members"
              value={stats.members.toLocaleString()}
              hint="Active makers & engineers"
              tone="accent"
            />
            <StatTile
              label="Projects"
              value={stats.projects}
              hint="Open-source initiatives"
              tone="make"
            />
            <StatTile
              label="Opportunities"
              value={stats.openOpportunities}
              hint="Bounties & paid roles"
              tone="earn"
            />
            <StatTile
              label="Rewards Pool"
              value={formatMoney(stats.rewardsPool.amount, stats.rewardsPool.currency)}
              hint="Funded bounties & grants"
              tone="earn"
            />
          </div>
        </div>
      </section>

      {/* 2. Six tracks, one community */}
      <section className="mx-auto w-full max-w-page px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="EXPLORE DISCOVERY"
          title="Six tracks, one community"
          description="Every project integrates cross-disciplinary skills. Find where your strengths fit best."
        />

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TRACKS.map((track) => {
            const Icon = TRACK_ICONS[track];
            const meta = TRACK_META[track];
            const route = TRACK_ROUTES[track];

            return (
              <Card
                key={track}
                accent={track}
                interactive
                asChild
                className="group relative overflow-hidden"
              >
                <Link href={route.href}>
                  <CardBody className="p-6 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-lg border border-line bg-surface-2 transition-transform duration-200 group-hover:scale-105"
                        >
                          <Icon className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <span className="font-mono text-[11px] uppercase text-accent font-semibold px-2 py-0.5 rounded bg-accent/10 border border-accent/20">
                          {route.hubBadge}
                        </span>
                      </div>

                      <h3 className="mt-4 font-display text-headline-sm font-semibold text-fg group-hover:text-accent transition-colors">
                        {meta.label}
                      </h3>
                      <p className="mt-2 text-body-sm text-fg-muted">
                        {meta.description}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center gap-1.5 text-caption font-mono font-medium text-accent group-hover:translate-x-1 transition-transform pt-3 border-t border-hairline/60">
                      <span>{route.actionLabel}</span>
                      <ArrowRight className="size-3.5" />
                    </div>
                  </CardBody>
                </Link>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 3. How it works */}
      <section className="mx-auto w-full max-w-page px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="THE MISSION CYCLE"
          title="How it works"
          description="From spark of an idea to certified deployment, build alongside a global network of peers."
        />

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="relative flex flex-col justify-between rounded-lg border border-hairline bg-surface-1 p-6"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-headline-sm font-bold text-accent">
                      {step.step}
                    </span>
                    <Icon className="h-5 w-5 text-fg-subtle" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 font-display text-headline-sm font-medium text-fg">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-body-sm text-fg-muted">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Featured projects */}
      <section className="mx-auto w-full max-w-page px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="MISSION SPOTLIGHT"
          title="Featured projects"
          description="High-impact hardware and software built entirely in the open."
          action={
            <Button asChild variant="ghost" size="sm">
              <Link href="/projects" className="inline-flex items-center gap-1.5">
                <span>View all projects</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          }
        />

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      {/* 5. Open bounties & paid roles */}
      <section className="mx-auto w-full max-w-page px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="EARN WITH IMPACT"
          title="Open bounties & paid roles"
          description="Earn stipends, complete technical challenges, and secure micro-grants for your hardware build."
          action={
            <Button asChild variant="ghost" size="sm">
              <Link href="/earn" className="inline-flex items-center gap-1.5">
                <span>View all opportunities</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          }
        />

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredOpportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      </section>

      {/* 6. Closing CTA panel */}
      <section className="mx-auto w-full max-w-page px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-xl border border-hairline bg-surface-1 px-6 py-12 text-center md:px-12 md:py-16 shadow-overlay">
          <div className="mx-auto max-w-2xl">
            <div className="font-mono text-label-sm uppercase tracking-widest text-accent mb-2">
              INITIATE NEW VECTOR
            </div>
            <h2 className="font-display text-display-hero-mobile md:text-headline-xl font-bold text-fg">
              Ready to build the future?
            </h2>
            <p className="mt-4 text-body-lg text-fg-muted">
              Whether you are an aerospace scientist with decades of experience or a student building your first LoRa probe, there is a squad waiting for you.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" variant="primary">
                <Link href="/new">Start project</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/feed">Browse community feed</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

