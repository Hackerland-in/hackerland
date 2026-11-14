import {
  COLOR_TOKENS,
  TRACK_TONES,
  TYPE_SCALE,
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  CodeBlock,
  Divider,
  EmptyState,
  FilterChip,
  IconButton,
  Input,
  Kbd,
  Label,
  Panel,
  ProgressBar,
  SearchField,
  SectionHeader,
  SegmentedProgress,
  StatTile,
  StatusDot,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from '@hackerland/ui';
import { TRACK_META, TRACKS, type Track } from '@hackerland/core';
import { Bell, Flame, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Mission Control Design System | Hackerland',
  description: 'Living styleguide for Hackerland tokens, typography, colors, and components.',
};

export default function DesignSystemPage() {
  const statusTones = ['neutral', 'accent', 'success', 'warning', 'danger'] as const;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 space-y-12">
      {/* Page Header */}
      <div className="max-w-4xl space-y-4">
        <p className="font-display text-label-sm uppercase text-accent-fg flex items-center gap-2">
          <StatusDot tone="accent" pulse />
          LIVING STYLEGUIDE
        </p>
        <h1 className="font-display text-headline-xl text-fg">
          Mission Control design system
        </h1>
        <p className="text-body-lg text-fg-muted">
          Tokens, components, and interaction patterns powering the Hackerland open-source network.
          For architectural decisions, rationale, and contracts, consult the specification at{' '}
          <a
            href="https://github.com/hackerland/hackerland/blob/main/packages/ui/DESIGN.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline hover:text-accent-strong"
          >
            packages/ui/DESIGN.md
          </a>
          .
        </p>

        {/* Quick links */}
        <div className="flex flex-wrap gap-2 pt-2 text-body-sm">
          {[
            ['Colours', '#colors'],
            ['Tracks', '#tracks'],
            ['Typography', '#typography'],
            ['Buttons', '#buttons'],
            ['Badges & Chips', '#badges-chips'],
            ['Form Controls', '#forms'],
            ['Data Display', '#data-display'],
            ['Layout', '#layout'],
            ['Navigation', '#navigation'],
            ['Motion & A11y', '#motion-a11y'],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="rounded-sm border border-hairline bg-surface-2 px-2.5 py-1 text-fg-muted hover:border-accent hover:text-fg"
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      <Divider />

      {/* 1. Colours */}
      <div id="colors" className="scroll-mt-20">
        <Panel title="Colours" headingLevel={2}>
          <p className="text-body-md text-fg-muted mb-6">
            The mission-control palette is dark-first, layered in depth from canvas (level 0) up to
            surface-3 (overlays), accented with Ion Cyan and discipline track colors.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {COLOR_TOKENS.map((token) => (
              <div
                key={token.name}
                className="flex flex-col rounded-md border border-hairline bg-surface-2 p-3 space-y-2.5"
              >
                <div
                  className="h-14 w-full rounded border border-hairline"
                  style={{ backgroundColor: token.value }}
                />
                <div>
                  <div className="font-display font-semibold text-fg flex justify-between items-center">
                    <span>{token.name}</span>
                    <span className="font-mono text-label-sm text-fg-subtle">{token.value}</span>
                  </div>
                  <div className="font-mono text-label-sm text-accent-fg mt-0.5">{token.cssVar}</div>
                  <p className="text-body-sm text-fg-muted mt-1 leading-snug">{token.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* 2. Tracks */}
      <div id="tracks" className="scroll-mt-20">
        <Panel title="Tracks & Disciplines" headingLevel={2}>
          <p className="text-body-md text-fg-muted mb-6">
            Six canonical tracks define every project, person, and opportunity in the community.
          </p>

          <div className="space-y-4">
            {TRACKS.map((track: Track) => {
              const meta = TRACK_META[track];
              return (
                <div
                  key={track}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-lg border border-hairline bg-surface-2/60 p-4"
                >
                  <div className="space-y-1 md:w-1/3">
                    <div className="flex items-center gap-2">
                      <Badge tone={track}>{meta.label}</Badge>
                      <h3 className="font-display font-semibold text-headline-sm text-fg">
                        {meta.label}
                      </h3>
                    </div>
                    <p className="text-body-sm text-fg-muted">{meta.description}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Chip tone={track}>Skill Chip</Chip>
                    <FilterChip selected tone={track}>
                      Filter Active
                    </FilterChip>
                    {track === 'make' && (
                      <Button variant="make" size="sm">
                        Make Action
                      </Button>
                    )}
                    {track === 'earn' && (
                      <Button variant="earn" size="sm">
                        Claim Bounty
                      </Button>
                    )}
                    {track === 'code' && (
                      <Button variant="primary" size="sm">
                        View Code
                      </Button>
                    )}
                    <Card accent={track} className="p-3 w-44">
                      <span className="text-body-sm text-fg-muted font-display uppercase">
                        {meta.label} Card
                      </span>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      {/* 3. Typography */}
      <div id="typography" className="scroll-mt-20">
        <Panel title="Typography Scale" headingLevel={2}>
          <p className="text-body-md text-fg-muted mb-6">
            Space Grotesk powers display titles and telemetry numerals; Inter serves body and form controls;
            JetBrains Mono handles code blocks.
          </p>

          <div className="divide-y divide-hairline">
            {TYPE_SCALE.map((token) => (
              <div key={token} className="py-4 flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                <div className="w-56 font-mono text-label-sm text-accent-fg">{token}</div>
                <div className="flex-1 break-words">
                  {token === 'display-hero' && (
                    <div className="font-display text-display-hero text-fg leading-none">
                      Build Together
                    </div>
                  )}
                  {token === 'display-hero-mobile' && (
                    <div className="font-display text-display-hero-mobile text-fg">
                      Build Together
                    </div>
                  )}
                  {token === 'headline-xl' && (
                    <div className="font-display text-headline-xl text-fg">
                      Open Innovation Network
                    </div>
                  )}
                  {token === 'headline-xl-mobile' && (
                    <div className="font-display text-headline-xl-mobile text-fg">
                      Open Innovation
                    </div>
                  )}
                  {token === 'headline-lg' && (
                    <div className="font-display text-headline-lg text-fg">Mission Control Telemetry</div>
                  )}
                  {token === 'headline-md' && (
                    <div className="font-display text-headline-md text-fg">Squad Lead Roster</div>
                  )}
                  {token === 'headline-sm' && (
                    <div className="font-display text-headline-sm text-fg">Autonomous Systems</div>
                  )}
                  {token === 'body-lg' && (
                    <div className="text-body-lg text-fg">
                      Large body text for hero introductions and manifesto declarations.
                    </div>
                  )}
                  {token === 'body-md' && (
                    <div className="text-body-md text-fg">
                      Standard paragraph text with comfortable line-height for readability on dark surfaces.
                    </div>
                  )}
                  {token === 'body-sm' && (
                    <div className="text-body-sm text-fg-muted">
                      Compact body text for secondary metadata, descriptions, and captions.
                    </div>
                  )}
                  {token === 'label-lg' && (
                    <div className="font-display text-label-lg uppercase text-fg">
                      STATUS ACTIVE · ALL SYSTEMS NOMINAL
                    </div>
                  )}
                  {token === 'label-md' && (
                    <div className="font-display text-label-md uppercase text-fg-muted">
                      TELEMETRY FREQUENCY 1420 MHZ
                    </div>
                  )}
                  {token === 'label-sm' && (
                    <div className="font-display text-label-sm uppercase text-fg-subtle">
                      VERIFIED NODE · 2026-11-14
                    </div>
                  )}
                  {token === 'code-inline' && (
                    <div className="font-mono text-code-inline text-accent-fg bg-sunken px-2 py-0.5 rounded inline-block">
                      npm install @hackerland/core
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* 4. Buttons */}
      <div id="buttons" className="scroll-mt-20">
        <Panel title="Buttons & Actions" headingLevel={2}>
          <div className="space-y-6">
            <div>
              <h3 className="font-display text-label-md uppercase text-fg-muted mb-3">Variants</h3>
              <div className="flex flex-wrap gap-3 items-center">
                <Button variant="primary">Primary (Cyan)</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="make">Make (Amber)</Button>
                <Button variant="earn">Earn (Emerald)</Button>
                <Button variant="danger">Danger</Button>
              </div>
            </div>

            <div>
              <h3 className="font-display text-label-md uppercase text-fg-muted mb-3">Sizes</h3>
              <div className="flex flex-wrap gap-3 items-center">
                <Button size="sm">Small (36px)</Button>
                <Button size="md">Medium (44px)</Button>
                <Button size="lg">Large (52px)</Button>
              </div>
            </div>

            <div>
              <h3 className="font-display text-label-md uppercase text-fg-muted mb-3">States</h3>
              <div className="flex flex-wrap gap-3 items-center">
                <Button variant="primary" loading>
                  Loading
                </Button>
                <Button variant="primary" disabled>
                  Disabled
                </Button>
                <Button variant="secondary" disabled>
                  Disabled Secondary
                </Button>
                <IconButton label="Notifications">
                  <Bell />
                </IconButton>
                <IconButton label="Popular">
                  <Flame />
                </IconButton>
              </div>
            </div>
          </div>
        </Panel>
      </div>

      {/* 5. Badges & Chips */}
      <div id="badges-chips" className="scroll-mt-20">
        <Panel title="Badges & Chips" headingLevel={2}>
          <div className="space-y-6">
            <div>
              <h3 className="font-display text-label-md uppercase text-fg-muted mb-3">
                Badges (Outline & Solid)
              </h3>
              <div className="flex flex-wrap gap-2 items-center">
                {TRACK_TONES.map((t) => (
                  <Badge key={t} tone={t}>
                    {t}
                  </Badge>
                ))}
                {statusTones.map((s) => (
                  <Badge key={s} tone={s} variant="solid">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display text-label-md uppercase text-fg-muted mb-3">
                Chips & Filter Chips
              </h3>
              <div className="flex flex-wrap gap-3 items-center">
                <Chip>Default Skill</Chip>
                <Chip tone="accent">Accent Chip</Chip>
                <Chip tone="make">Make Chip</Chip>
                <FilterChip selected={false}>Unselected Filter</FilterChip>
                <FilterChip selected={true}>Selected Filter</FilterChip>
              </div>
            </div>
          </div>
        </Panel>
      </div>

      {/* 6. Form Controls */}
      <div id="forms" className="scroll-mt-20">
        <Panel title="Form Controls" headingLevel={2}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <div>
              <Label htmlFor="demo-input">Standard Input</Label>
              <Input
                id="demo-input"
                placeholder="Autonomous sensor node"
                defaultValue="KiCad 8.0 PCB Design"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="demo-invalid">Invalid State</Label>
              <Input
                id="demo-invalid"
                placeholder="name@domain.com"
                defaultValue="invalid-email-format"
                invalid
                className="mt-1.5"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="demo-search">Search Field</Label>
              <SearchField
                id="demo-search"
                placeholder="Search projects, squad leads, roadmaps..."
                className="mt-1.5"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="demo-textarea">Textarea</Label>
              <Textarea
                id="demo-textarea"
                rows={3}
                placeholder="Enter project specifications or mission brief..."
                className="mt-1.5"
              />
            </div>
          </div>
        </Panel>
      </div>

      {/* 7. Data Display */}
      <div id="data-display" className="scroll-mt-20">
        <Panel title="Data Display" headingLevel={2}>
          <div className="space-y-6">
            <div>
              <h3 className="font-display text-label-md uppercase text-fg-muted mb-3">KPI Tiles</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatTile label="Active Nodes" value="1,248" hint="+14% this month" tone="accent" />
                <StatTile label="Bounties Paid" value="₹12.4L" hint="Direct UPI/Bank" tone="earn" />
                <StatTile label="Squads" value="84" hint="Across 6 tracks" tone="make" />
                <StatTile label="Reputation Pool" value="48,200" hint="Append-only ledger" />
              </div>
            </div>

            <div>
              <h3 className="font-display text-label-md uppercase text-fg-muted mb-3">Progress Indicators</h3>
              <div className="space-y-4 max-w-xl">
                <div>
                  <div className="text-body-sm text-fg-muted mb-1.5">Sprint Goal Funding</div>
                  <ProgressBar value={68} max={100} label="Goal progress" showValue tone="accent" />
                </div>
                <div>
                  <div className="text-body-sm text-fg-muted mb-1.5">Roadmap Stages (3 of 5 complete)</div>
                  <SegmentedProgress total={5} completed={3} label="Milestones" tone="earn" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-display text-label-md uppercase text-fg-muted mb-3">Avatars & Groups</h3>
              <div className="flex items-center gap-6">
                <Avatar name="Meera Iyer" size="lg" tone="code" />
                <Avatar name="Kavya Subramaniam" size="md" tone="make" />
                <Avatar name="Rohan Sharma" size="sm" tone="design" />
                <AvatarGroup
                  people={[
                    { name: 'Aarav Patel' },
                    { name: 'Divya Rao' },
                    { name: 'Vikram Seth' },
                    { name: 'Ananya Gupta' },
                    { name: 'Pooja Hegde' },
                  ]}
                  max={3}
                />
              </div>
            </div>

            <div>
              <h3 className="font-display text-label-md uppercase text-fg-muted mb-3">Code Block</h3>
              <CodeBlock
                filename="apps/web/src/lib/auth.ts"
                language="typescript"
                code={`import { isAuthConfigured, getAuth } from '@/lib/auth';\n\nexport async function GET(req: Request) {\n  if (!isAuthConfigured()) {\n    return Response.json({ error: 'auth_not_configured' }, { status: 503 });\n  }\n  return toNextJsHandler(getAuth()).GET(req);\n}`}
              />
            </div>

            <div>
              <h3 className="font-display text-label-md uppercase text-fg-muted mb-3">Miscellaneous</h3>
              <div className="flex items-center gap-4">
                <StatusDot pulse label="Live" tone="accent" />
                <StatusDot label="Syncing" tone="warning" />
                <span className="text-body-sm text-fg-muted">
                  Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to open quick search.
                </span>
              </div>
            </div>
          </div>
        </Panel>
      </div>

      {/* 8. Layout */}
      <div id="layout" className="scroll-mt-20">
        <Panel title="Layout & Surfaces" headingLevel={2}>
          <div className="space-y-6">
            <div>
              <h3 className="font-display text-label-md uppercase text-fg-muted mb-3">Section Header</h3>
              <SectionHeader
                eyebrow="TELEMETRY HUB"
                title="Universal Discovery Feed"
                description="Live updates, Q&A discussions, and squad recruitments across the network."
                action={<Button variant="primary">New Post</Button>}
              />
            </div>

            <div>
              <h3 className="font-display text-label-md uppercase text-fg-muted mb-3">Card Variants</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card interactive accent="code">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <Badge tone="code">Code</Badge>
                      <span className="font-mono text-label-sm text-fg-subtle">v0.4.0</span>
                    </div>
                    <h4 className="font-display text-headline-sm text-fg mt-2">
                      Autonomous Flight Computer
                    </h4>
                  </CardHeader>
                  <CardBody>
                    <p className="text-body-sm text-fg-muted">
                      Dual-core Cortex-M4 flight controller running real-time navigation telemetry.
                    </p>
                  </CardBody>
                  <CardFooter>
                    <span className="text-body-sm text-fg-subtle">Updated 2h ago</span>
                  </CardFooter>
                </Card>

                <Card interactive accent="earn">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <Badge tone="earn">Bounty</Badge>
                      <span className="font-display font-semibold text-earn">₹40,000</span>
                    </div>
                    <h4 className="font-display text-headline-sm text-fg mt-2">
                      Optimize CAN Bus Decoder
                    </h4>
                  </CardHeader>
                  <CardBody>
                    <p className="text-body-sm text-fg-muted">
                      Rewrite the frame parser in Rust with zero memory allocations on embedded hardware.
                    </p>
                  </CardBody>
                  <CardFooter>
                    <span className="text-body-sm text-fg-subtle">4 applicants</span>
                  </CardFooter>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="font-display text-label-md uppercase text-fg-muted mb-3">Empty State</h3>
              <EmptyState
                icon={<Sparkles />}
                title="No active squad applications"
                description="You have not submitted any join requests yet. Browse open roles in the Projects directory."
                action={<Button variant="secondary">Explore Projects</Button>}
              />
            </div>
          </div>
        </Panel>
      </div>

      {/* 9. Navigation */}
      <div id="navigation" className="scroll-mt-20">
        <Panel title="Navigation" headingLevel={2}>
          <div className="max-w-xl">
            <h3 className="font-display text-label-md uppercase text-fg-muted mb-3">Tabs Component</h3>
            <Tabs defaultValue="overview">
              <TabsList label="Project sections">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="squad">Squad & Roles</TabsTrigger>
                <TabsTrigger value="resources">BOM & Parts</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-4 rounded-md border border-hairline bg-surface-2 p-4">
                <p className="text-body-md text-fg">
                  Overview content: High-level architectural milestones, team objectives, and timeline.
                </p>
              </TabsContent>
              <TabsContent value="squad" className="mt-4 rounded-md border border-hairline bg-surface-2 p-4">
                <p className="text-body-md text-fg">
                  Squad roster and open engineering roles available for recruitment.
                </p>
              </TabsContent>
              <TabsContent value="resources" className="mt-4 rounded-md border border-hairline bg-surface-2 p-4">
                <p className="text-body-md text-fg">
                  Bill of materials, CAD files, KiCad schematics, and component suppliers.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </Panel>
      </div>

      {/* 10. Motion & Accessibility */}
      <div id="motion-a11y" className="scroll-mt-20">
        <Panel title="Motion & Accessibility Notes" headingLevel={2}>
          <div className="space-y-4 text-body-md text-fg-muted max-w-3xl">
            <p>
              <strong className="text-fg font-semibold">Touch Target Minimum:</strong> All interactive
              elements (buttons, filter chips, icon controls) respect a minimum hit area of 44×44px on
              touch devices to guarantee reliable manipulation.
            </p>
            <p>
              <strong className="text-fg font-semibold">Contrast Standards:</strong> Muted text
              (<code className="font-mono text-accent-fg">--color-fg-muted</code>, #A9B6CC) guarantees at least
              4.5:1 contrast against the darkest canvas background (#0A0E17). Primary text achieves &gt; 13:1.
            </p>
            <p>
              <strong className="text-fg font-semibold">Reduced Motion:</strong> Ambient pulses and
              transitions automatically degrade gracefully when{' '}
              <code className="font-mono text-accent-fg">prefers-reduced-motion: reduce</code> is signaled
              by the user operating system.
            </p>
            <p>
              <strong className="text-fg font-semibold">Focus Halos:</strong> Interactive components render
              emissive neon cyan focus rings exclusively on keyboard interaction (<code className="font-mono text-accent-fg">:focus-visible</code>),
              preventing visual distraction during standard pointer clicks while ensuring full WCAG compliance.
            </p>
          </div>
        </Panel>
      </div>
    </div>
  );
}
