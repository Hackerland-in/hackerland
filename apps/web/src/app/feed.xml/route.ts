import { NextResponse } from 'next/server';
import { listProjects } from '@/lib/data/queries';

const BASE_URL = 'https://www.hackerland.in';

export async function GET() {
  let projects: Awaited<ReturnType<typeof listProjects>> = [];
  try {
    projects = await listProjects();
  } catch {
    projects = [];
  }

  const itemsXml = projects
    .map(
      (p) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${BASE_URL}/projects/${p.slug}</link>
      <guid>${BASE_URL}/projects/${p.slug}</guid>
      <description><![CDATA[${p.summary}]]></description>
      <pubDate>${new Date(p.updatedAt).toUTCString()}</pubDate>
    </item>`
    )
    .join('\n');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Hackerland - Open Hardware &amp; Innovation Network</title>
    <link>${BASE_URL}</link>
    <description>Open-source hardware, PCB Design Studio, 3D Simulator Labs, and bounties.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <item>
      <title><![CDATA[A-Z PCB Design & Real-Time Circuit Studio Released]]></title>
      <link>${BASE_URL}/manufacturing/pcb</link>
      <guid>${BASE_URL}/manufacturing/pcb</guid>
      <description><![CDATA[In-browser circuit simulation with live SPICE nodal analysis, Veroboard track cutter, 3D WebGL inspection, and RS-274X Gerber export.]]></description>
      <pubDate>${new Date().toUTCString()}</pubDate>
    </item>
    <item>
      <title><![CDATA[3D WebGL Virtual Simulator Labs]]></title>
      <link>${BASE_URL}/manufacturing/physics/3d</link>
      <guid>${BASE_URL}/manufacturing/physics/3d</guid>
      <description><![CDATA[Interactive 3D WebGL physics simulators for drones, rockets, racecars, electric vehicles, and embedded circuit boards.]]></description>
      <pubDate>${new Date().toUTCString()}</pubDate>
    </item>
    ${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
