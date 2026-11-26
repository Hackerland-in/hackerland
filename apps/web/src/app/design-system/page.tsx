import {
  COLOR_TOKENS,
  DARK_COLOR_TOKENS,
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
import { Bell, Heart, Moon, Sparkles, Sun } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/theme-toggle';

export const metadata = {
  title: 'Rosepaper Social Design System | Hackerland',
  description: 'Living styleguide for the Pink & White social Hackerland design system.',
};

export default function DesignSystemPage() {
  const statusTones = ['neutral', 'accent', 'success', 'warning', 'danger'] as const;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12 space-y-12">
      {/* Page Header */}
      <div className="max-w-4xl space-y-4">
        <p className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 font-display text-label-sm text-accent-fg">
          <StatusDot tone="accent" pulse />
          Hackerland UI · v2.0 Pink & White
        </p>
        <h1 className="font-display text-headline-xl text-fg tracking-tight">
          Rosepaper Social Design System
        </h1>
        <p className="text-body-lg text-fg-muted">
          The signature Hackerland Pink (<code className="font-mono text-accent-fg">#FA1681</code>) and crisp white social community design language powering feeds, maker profiles, squad rooms, and interactive labs.
        </p>

        {/* Theme Mode Control Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-hairline bg-surface-1 shadow-module">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-display font-semibold text-fg">Theme Polarity</span>
              <Badge tone="accent" variant="outline">Crisp White Default</Badge>
            </div>
            <p className="text-body-sm text-fg-muted">
              Hackerland defaults to Pure White & Off-White Canvas (#F7F7FA / #FFFFFF) with Signature Pink (#FA1681), plus an optional Midnight Dark Mode.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle variant="labeled" />
          </div>
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap gap-2 pt-1 text-body-sm">
          {[
            ['Colours', '#colors'],
            ['Channels', '#tracks'],
            ['Typography', '#typography'],
            ['Buttons', '#buttons'],
            ['Pills & Chips', '#badges-chips'],
            ['Form Controls', '#forms'],
            ['Community Cards', '#layout'],
            ['Navigation', '#navigation'],
            ['Guidelines', '#rules'],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="rounded-full border border-hairline bg-surface-1 px-3.5 py-1.5 text-fg-muted hover:border-accent/40 hover:text-accent-fg transition-colors shadow-xs"
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      <Divider />

      {/* 1. Colours */}
      <div id="colors" className="scroll-mt-20">
        <Panel title="Colours & Dual Theme Tokens" headingLevel={2}>
          <p className="text-body-md text-fg-muted mb-6">
            White-first social hierarchy powered by semantic CSS variables so every community surface stays airy and crisp in daylight while remaining adaptable to Midnight Pink dark mode.
          </p>

          <Tabs defaultValue="light">
            <TabsList label="Theme palettes" className="mb-6">
              <TabsTrigger value="light">
                <Sun className="size-3.5 mr-1.5" />
                White & Pink (Default)
              </TabsTrigger>
              <TabsTrigger value="dark">
                <Moon className="size-3.5 mr-1.5" />
                Midnight Pink (Optional Dark)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="light">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {COLOR_TOKENS.map((token) => (
                  <div
                    key={token.name}
                    className="flex flex-col rounded-2xl border border-hairline bg-surface-1 p-3 space-y-2.5 shadow-xs"
                  >
                    <div
                      className="h-14 w-full rounded-xl border border-hairline"
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
            </TabsContent>

            <TabsContent value="dark">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {DARK_COLOR_TOKENS.map((token) => (
                  <div
                    key={token.name}
                    className="flex flex-col rounded-2xl border border-hairline bg-surface-1 p-3 space-y-2.5 shadow-xs"
                  >
                    <div
                      className="h-14 w-full rounded-xl border border-hairline"
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
            </TabsContent>
          </Tabs>
        </Panel>
      </div>

      {/* 2. Tracks */}
      <div id="tracks" className="scroll-mt-20">
        <Panel title="Community Channels & Tracks" headingLevel={2}>
          <p className="text-body-md text-fg-muted mb-6">
            Six creator channels categorize posts, projects, bounties, and builder skills across the network.
          </p>

          <div className="space-y-4">
            {TRACKS.map((track: Track) => {
              const meta = TRACK_META[track];
              return (
                <div
                  key={track}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-hairline bg-surface-2/60 p-4"
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
                    <Chip tone={track}>#{meta.label.toLowerCase()}</Chip>
                    <FilterChip selected tone={track}>
                      Following
                    </FilterChip>
                    {track === 'make' && (
                      <Button variant="make" size="sm">
                        Share Build
                      </Button>
                    )}
                    {track === 'earn' && (
                      <Button variant="earn" size="sm">
                        Claim Bounty
                      </Button>
                    )}
                    {track === 'design' && (
                      <Button variant="primary" size="sm">
                        Post Concept
                      </Button>
                    )}
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
            Space Grotesk gives maker headlines personality; Inter provides effortless social reading comfort; JetBrains Mono renders embedded code blocks cleanly.
          </p>

          <div className="divide-y divide-hairline">
            {TYPE_SCALE.map((token) => (
              <div key={token} className="py-4 flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                <div className="w-56 font-mono text-label-sm text-accent-fg">{token}</div>
                <div className="flex-1 break-words">
                  {token === 'display-hero' && (
                    <div className="font-display text-display-hero text-fg leading-none">
                      Build in the open
                    </div>
                  )}
                  {token === 'display-hero-mobile' && (
                    <div className="font-display text-display-hero-mobile text-fg">
                      Build in the open
                    </div>
                  )}
                  {token === 'headline-xl' && (
                    <div className="font-display text-headline-xl text-fg">
                      Where India&apos;s makers hang out
                    </div>
                  )}
                  {token === 'headline-xl-mobile' && (
                    <div className="font-display text-headline-xl-mobile text-fg">
                      Community Square
                    </div>
                  )}
                  {token === 'headline-lg' && (
                    <div className="font-display text-headline-lg text-fg">Trending Builds Today</div>
                  )}
                  {token === 'headline-md' && (
                    <div className="font-display text-headline-md text-fg">People to Follow</div>
                  )}
                  {token === 'headline-sm' && (
                    <div className="font-display text-headline-sm text-fg">Wind Tunnel Test Log</div>
                  )}
                  {token === 'body-lg' && (
                    <div className="text-body-lg text-fg">
                      Friendly readable intro prose for community stories and showcases.
                    </div>
                  )}
                  {token === 'body-md' && (
                    <div className="text-body-md text-fg">
                      Standard feed post body text tuned for crisp contrast on white cards.
                    </div>
                  )}
                  {token === 'body-sm' && (
                    <div className="text-body-sm text-fg-muted">
                      Compact text for handles, replies, and timestamps.
                    </div>
                  )}
                  {token === 'label-lg' && (
                    <div className="font-display text-label-lg text-fg">Publish Build Update</div>
                  )}
                  {token === 'label-md' && (
                    <div className="font-display text-label-md text-fg-muted">142 Reactions · 18 Replies</div>
                  )}
                  {token === 'label-sm' && (
                    <div className="font-display text-label-sm text-fg-subtle">Shipped 2h ago</div>
                  )}
                  {token === 'code-inline' && (
                    <div className="font-mono text-code-inline text-accent-fg bg-sunken px-2.5 py-0.5 rounded-lg inline-block">
                      git push origin main
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
        <Panel title="Buttons & Social Actions" headingLevel={2}>
          <div className="space-y-6">
            <div>
              <h3 className="font-display text-label-md text-fg-muted mb-3">Variants</h3>
              <div className="flex flex-wrap gap-3 items-center">
                <Button variant="primary">Post Update (Pink)</Button>
                <Button variant="soft">Follow Maker</Button>
                <Button variant="secondary">Comment</Button>
                <Button variant="ghost">Share</Button>
                <Button variant="make">Submit Build</Button>
                <Button variant="earn">Claim Bounty</Button>
                <Button variant="danger">Report</Button>
              </div>
            </div>

            <div>
              <h3 className="font-display text-label-md text-fg-muted mb-3">States & Icon Actions</h3>
              <div className="flex flex-wrap gap-3 items-center">
                <Button variant="primary" size="sm" loading>
                  Publishing
                </Button>
                <Button variant="secondary" size="sm" disabled>
                  Following
                </Button>
                <IconButton label="Notifications">
                  <Bell />
                </IconButton>
                <IconButton label="Like post" variant="secondary">
                  <Heart className="text-accent" />
                </IconButton>
              </div>
            </div>
          </div>
        </Panel>
      </div>

      {/* 5. Badges & Chips */}
      <div id="badges-chips" className="scroll-mt-20">
        <Panel title="Social Pills, Hashtags & Filters" headingLevel={2}>
          <div className="space-y-6">
            <div>
              <h3 className="font-display text-label-md text-fg-muted mb-3">
                Badges (Soft Outline & Solid Pink)
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
              <h3 className="font-display text-label-md text-fg-muted mb-3">
                Topics & Timeline Filters
              </h3>
              <div className="flex flex-wrap gap-3 items-center">
                <Chip>#open-hardware</Chip>
                <Chip tone="accent">#pink-design</Chip>
                <Chip tone="make">#robotics</Chip>
                <FilterChip selected={true}>For You</FilterChip>
                <FilterChip selected={false}>Following</FilterChip>
                <FilterChip selected={false}>Showcases</FilterChip>
              </div>
            </div>
          </div>
        </Panel>
      </div>

      {/* 6. Forms */}
      <div id="forms" className="scroll-mt-20">
        <Panel title="Composer & Search Controls" headingLevel={2}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <div className="md:col-span-2">
              <Label htmlFor="demo-search">Pill Search Bar</Label>
              <SearchField
                id="demo-search"
                placeholder="Search builders, projects, #tags, or bounties..."
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="demo-input">Input</Label>
              <Input
                id="demo-input"
                placeholder="What did you build?"
                defaultValue="STM32H7 Flight Controller Rev B"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="demo-invalid">Validation Error</Label>
              <Input
                id="demo-invalid"
                placeholder="@handle"
                defaultValue="invalid handle"
                invalid
                className="mt-1.5"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="demo-textarea">Social Composer Box</Label>
              <Textarea
                id="demo-textarea"
                rows={3}
                placeholder="Share a quick build photo log, milestone, or question with the community..."
                className="mt-1.5"
              />
            </div>
          </div>
        </Panel>
      </div>

      {/* 7. Layout */}
      <div id="layout" className="scroll-mt-20">
        <Panel title="Feed Cards & Social Building Blocks" headingLevel={2}>
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatTile label="Active Makers" value="2,480" hint="+18% this week" tone="accent" />
              <StatTile label="Bounties Paid" value="₹12.4L" hint="Verified escrow" tone="earn" />
              <StatTile label="Live Squads" value="84" hint="Across 6 channels" tone="make" />
              <StatTile label="Posts Today" value="312" hint="Build logs & Q&A" />
            </div>

            <SectionHeader
              eyebrow="Community Feed"
              title="Fresh builds from Makers"
              description="Live progress notes, demos, and questions shared by builders right now."
              action={<Button variant="primary">New Post</Button>}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card interactive accent="accent">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <Badge tone="accent">Showcase</Badge>
                    <span className="text-body-sm text-fg-subtle">2h ago</span>
                  </div>
                  <h4 className="font-display text-headline-sm text-fg mt-2">
                    OpenBraille 40-Cell Tactile Display
                  </h4>
                </CardHeader>
                <CardBody>
                  <p className="text-body-sm text-fg-muted">
                    Hit $68 BOM cost using recycled PLA and custom 5V micro-solenoid latches!
                  </p>
                </CardBody>
                <CardFooter className="justify-between text-fg-subtle text-body-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-accent-fg font-medium">67 Likes</span>
                    <span>14 Comments</span>
                  </div>
                  <AvatarGroup
                    people={[
                      { name: 'Zoya Khan' },
                      { name: 'Lena Fischer' },
                      { name: 'Kabir Shah' },
                    ]}
                    max={3}
                  />
                </CardFooter>
              </Card>

              <EmptyState
                icon={<Sparkles />}
                title="No saved bookmarks yet"
                description="Tap Bookmark on any community post or build log to save it for later."
                action={<Button variant="soft">Browse Feed</Button>}
              />
            </div>

            <div className="space-y-3 max-w-xl">
              <div className="text-body-sm text-fg-muted">Milestone Progress</div>
              <ProgressBar value={74} max={100} label="Funding progress" showValue tone="accent" />
              <SegmentedProgress total={5} completed={4} label="Build stages" tone="accent" />
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Avatar name="Dr. Meera Iyer" size="lg" tone="design" />
              <Avatar name="Kabir Shah" size="md" tone="code" />
              <StatusDot pulse label="Online now" tone="accent" />
              <span className="text-body-sm text-fg-muted">
                Quick search: <Kbd>⌘</Kbd> <Kbd>K</Kbd>
              </span>
            </div>

            <CodeBlock
              filename="post-stream.ts"
              language="typescript"
              code={`const post = await feed.publish({\n  kind: 'showcase',\n  theme: 'pink-white',\n  tags: ['open-hardware', 'build-in-public'],\n});`}
            />
          </div>
        </Panel>
      </div>

      {/* 8. Navigation & Guidelines */}
      <div id="navigation" className="scroll-mt-20">
        <Panel title="Segmented Navigation & Tabs" headingLevel={2}>
          <div className="max-w-xl">
            <Tabs defaultValue="foryou">
              <TabsList label="Timeline tabs">
                <TabsTrigger value="foryou">For You</TabsTrigger>
                <TabsTrigger value="following">Following</TabsTrigger>
                <TabsTrigger value="squads">Squad Calls</TabsTrigger>
              </TabsList>
              <TabsContent value="foryou" className="mt-4 rounded-2xl border border-hairline bg-surface-1 p-4">
                <p className="text-body-md text-fg">Curated stream of trending maker posts, questions, and demos.</p>
              </TabsContent>
              <TabsContent value="following" className="mt-4 rounded-2xl border border-hairline bg-surface-1 p-4">
                <p className="text-body-md text-fg">Updates strictly from makers and projects you follow.</p>
              </TabsContent>
              <TabsContent value="squads" className="mt-4 rounded-2xl border border-hairline bg-surface-1 p-4">
                <p className="text-body-md text-fg">Teams actively looking for engineers, designers, and makers.</p>
              </TabsContent>
            </Tabs>
          </div>
        </Panel>
      </div>

      <div id="rules" className="scroll-mt-20">
        <Panel title="Design System Governance Rules" headingLevel={2}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-body-sm text-fg-muted">
            <div className="rounded-2xl border border-danger/25 bg-danger/5 p-4 space-y-2">
              <span className="font-display font-semibold text-danger-fg text-headline-sm">Don&apos;t</span>
              <ul className="space-y-1.5 list-disc list-inside">
                <li>Never hardcode raw hex codes (`#FA1681`, `#FFFFFF`, `#000000`) inside components.</li>
                <li>Avoid heavy dark sci-fi HUD boxes on community pages.</li>
                <li>Never display numeric age badges (India DPDP Act 2023 safety compliance).</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-success/25 bg-success/5 p-4 space-y-2">
              <span className="font-display font-semibold text-success-fg text-headline-sm">Do</span>
              <ul className="space-y-1.5 list-disc list-inside">
                <li>Use `bg-canvas`, `bg-surface-1`, `text-fg`, `text-accent-fg`, `border-hairline`.</li>
                <li>Use pill buttons (`rounded-full`) and cozy cards (`rounded-2xl`) for a welcoming social UX.</li>
                <li>Always include `min-w-0` and `break-words` so mobile viewports stay overflow-free.</li>
              </ul>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
