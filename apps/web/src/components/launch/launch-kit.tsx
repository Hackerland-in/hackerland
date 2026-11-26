'use client';

import { useEffect, useMemo, useState } from 'react';
import { Badge, Button, Card, Input, Label, cn } from '@hackerland/ui';
import { Copy, Check, ExternalLink, CheckCircle2, Sparkles } from 'lucide-react';

interface LaunchPlatform {
  id: string;
  name: string;
  badge: string;
  buildTitle: (project: string) => string;
  buildContent: (project: string, url: string, tagline: string) => string;
  shareUrl?: string;
}

const LAUNCH_PLATFORMS: LaunchPlatform[] = [
  {
    id: 'product_hunt',
    name: 'Product Hunt Launch',
    badge: 'Maker Launch',
    buildTitle: (project) => `${project} — Built Openly on Hackerland`,
    buildContent: (project, url, tagline) => `🚀 Announcing ${project}: ${tagline}

We built ${project} collaboratively in public squad rooms on Hackerland—combining open hardware schematics, live circuit simulation, and reproducible build logs.

✨ Highlights:
• Full BOM, schematics & browser-verified testbench specs
• Built with peer reviews & community sprint check-ins
• 100% Open Documentation & Proof-of-Ship Verification

We'd love your feedback & questions!
🔗 Explore & test live: ${url}`,
    shareUrl: 'https://www.producthunt.com/posts/new',
  },
  {
    id: 'hacker_news',
    name: 'Show HN (Hacker News)',
    badge: 'Deep Tech Audience',
    buildTitle: (project) => `Show HN: ${project} – Open hardware & software build with live browser tools`,
    buildContent: (project, url, tagline) => `Show HN: ${project}

Hi HN,

We built ${project} (${url}): ${tagline}.

Instead of gating architecture notes behind PDFs, we documented the full subsystem architecture, trade-offs, BOM constraints, and test verification directly in open community workspaces.

We'd genuinely appreciate technical critique on our design constraints, power budget, and fabrication path!`,
    shareUrl: 'https://news.ycombinator.com/submitlink',
  },
  {
    id: 'twitter_thread',
    name: 'X / Social Launch Thread',
    badge: 'Community Reach',
    buildTitle: (project) => `3-Post Launch Thread for ${project}`,
    buildContent: (project, url, tagline) => `1/3 Meet ${project}: ${tagline} 🧵👇

We shipped every milestone openly on @HackerlandHQ with interactive BOM, squad updates & live verification:
${url}

2/3 Key engineering breakthrough: open-source reference designs anyone can inspect, remix, and fork for local makerspaces without opaque setup.

3/3 Try it out, drop architecture feedback, or join the next sprint squad here: ${url}`,
    shareUrl: 'https://twitter.com/intent/tweet',
  },
  {
    id: 'reddit_electronics',
    name: 'Reddit (r/electronics & r/opensource)',
    badge: 'Open Hardware Peer Review',
    buildTitle: (project) => `I shipped ${project} as an open-source hardware & software build`,
    buildContent: (project, url, tagline) => `Title: I shipped ${project} (${tagline})

Hey makers!

Sharing our open build documentation and engineering breakdown for ${project} (${url}).

Everything is reproducible—complete with component sourcing tradeoffs, enclosure iterations, and firmware tests. Happy to share Gerbers / schematics or answer questions on component selection!`,
    shareUrl: 'https://www.reddit.com/submit',
  },
];

export function LaunchKit() {
  const [projectName, setProjectName] = useState('Hackerland Innovation OS');
  const [tagline, setTagline] = useState(
    'In-browser PCB studio, WebSerial firmware flasher & open builder social network',
  );
  const [projectUrl, setProjectUrl] = useState('https://www.hackerland.in/');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [launchedIds, setLaunchedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('hackerland_launch_channels');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setLaunchedIds(parsed);
      }
    } catch {}
  }, []);

  const toggleLaunched = (id: string) => {
    setLaunchedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem('hackerland_launch_channels', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleCopy = (id: string, text: string) => {
    try {
      navigator.clipboard?.writeText(text);
    } catch {}
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderedPlatforms = useMemo(() => {
    const cleanName = projectName.trim() || 'My Build';
    const cleanUrl = projectUrl.trim() || 'https://www.hackerland.in/';
    const cleanTagline = tagline.trim() || 'Open hardware & software innovation';
    return LAUNCH_PLATFORMS.map((p) => ({
      ...p,
      title: p.buildTitle(cleanName),
      content: p.buildContent(cleanName, cleanUrl, cleanTagline),
    }));
  }, [projectName, projectUrl, tagline]);

  return (
    <div className="space-y-6 min-w-0">
      {/* Live Post Customizer */}
      <Card className="p-5 border-hairline bg-surface-1 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
          <div className="flex items-center gap-2 font-display font-bold text-headline-sm text-fg">
            <Sparkles className="size-4 text-accent" />
            <span>Customize Your Launch Post</span>
          </div>
          <span className="text-body-xs font-mono text-fg-subtle">
            {launchedIds.length} / {LAUNCH_PLATFORMS.length} channels marked launched
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1">
            <Label htmlFor="launch-project-name">Project / Product Name</Label>
            <Input
              id="launch-project-name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="launch-project-url">Canonical Build URL</Label>
            <Input
              id="launch-project-url"
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="launch-project-tagline">One-line Hook</Label>
          <Input
            id="launch-project-tagline"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />
        </div>
      </Card>

      {/* Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderedPlatforms.map((platform) => {
          const isCopied = copiedId === platform.id;
          const isLaunched = launchedIds.includes(platform.id);

          return (
            <Card
              key={platform.id}
              className="border-hairline bg-surface-1 p-5 flex flex-col justify-between space-y-4 min-w-0 [overflow-wrap:anywhere]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge tone="accent" variant="outline">
                    {platform.badge}
                  </Badge>
                  <button
                    type="button"
                    onClick={() => toggleLaunched(platform.id)}
                    aria-pressed={isLaunched}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-display font-semibold border transition-colors',
                      isLaunched
                        ? 'border-success/40 bg-success/10 text-success-fg'
                        : 'border-hairline bg-surface-2/60 text-fg-muted hover:text-accent-fg',
                    )}
                  >
                    <CheckCircle2 className="size-3" />
                    <span>{isLaunched ? 'Launched' : 'Mark Launched'}</span>
                  </button>
                </div>

                <h2 className="font-display text-body-lg font-bold text-fg">{platform.name}</h2>

                <div className="text-body-xs font-semibold text-fg font-mono bg-sunken p-2.5 rounded-xl border border-hairline">
                  {platform.title}
                </div>

                <div className="rounded-xl bg-sunken border border-hairline p-3.5 text-body-xs font-mono text-fg-muted h-44 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {platform.content}
                </div>
              </div>

              <div className="pt-3 border-t border-hairline flex items-center justify-between gap-2.5">
                <Button
                  type="button"
                  variant={isCopied ? 'primary' : 'secondary'}
                  size="sm"
                  className="flex-1"
                  onClick={() => handleCopy(platform.id, `${platform.title}\n\n${platform.content}`)}
                >
                  {isCopied ? (
                    <>
                      <Check className="size-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      <span>Copy Post Text</span>
                    </>
                  )}
                </Button>

                {platform.shareUrl && (
                  <Button asChild variant="soft" size="sm">
                    <a
                      href={platform.shareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Open ${platform.name}`}
                    >
                      <ExternalLink className="size-3.5" />
                      <span>Open</span>
                    </a>
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
