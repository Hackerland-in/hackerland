'use client';

import { useState } from 'react';
import {
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';

interface LaunchPlatform {
  id: string;
  name: string;
  badge: string;
  title: string;
  content: string;
  shareUrl?: string;
}

const LAUNCH_PLATFORMS: LaunchPlatform[] = [
  {
    id: 'product_hunt',
    name: 'Product Hunt Launch',
    badge: 'Rank #1 of the Day',
    title: 'Hackerland — The Global Innovation Operating System for Makers',
    content: `🚀 Announcing Hackerland: From Imagination to Impact

Most makerspaces and hacker communities are just forums where people talk about ideas.
We built Hackerland so anyone—from a 10-year-old curious student to a deep-tech aerospace engineer—can actually BUILD.

✨ What's inside Hackerland today:
1. In-Browser PCB Studio: Zero-install schematic capture, live IPC-2221 DRC, 3D photorealistic viewer & Gerber RS-274X export.
2. WebSerial Firmware Flasher: Plug your ESP32 or Raspberry Pi Pico into USB and flash code straight from Chrome.
3. 3D Virtual Physics Labs: 60 FPS multibody physics for rockets, EVs, drones, and satellites.
4. Stage Zero IdeaLab: 7-stage guided incubator with instant AI feasibility analysis.
5. Decision Archaeology: Chapter-by-chapter case studies on how SpaceX, Ather Energy, and NVIDIA survived early failures.
6. Personal Innovation Passport: Cryptographically verifiable proof-of-work for hardware builds.

100% Free & Open Source. We'd love your feedback!
🔗 Try it live: https://www.hackerland.in/`,
    shareUrl: 'https://www.producthunt.com/posts/new',
  },
  {
    id: 'hacker_news',
    name: 'Show HN (Hacker News)',
    badge: 'Frontpage Tech Audience',
    title: 'Show HN: Hackerland – In-browser PCB studio, physics lab, and maker network',
    content: `Show HN: Hackerland – In-browser PCB studio, physics lab, and maker network

Hi HN,

We built Hackerland (https://www.hackerland.in/) because hardware prototyping is still too fragmented. If you want to design a circuit, simulate aerodynamics, and find collaborators, you currently need to download KiCad, install Python toolchains, configure WebAssembly solvers, and browse disparate discord channels.

Hackerland runs the entire innovation workflow in your browser:

1. PCB & Circuit Studio: Client-side netlist routing, real-time Design Rule Checks (DRC), and Gerber export (https://www.hackerland.in/manufacturing/pcb).
2. WebSerial Hardware Flasher: Flash ESP32/RP2040 microcontrollers directly over USB using the Web Serial API (https://www.hackerland.in/manufacturing/flasher).
3. Physics Simulation Engine: 60 FPS multibody dynamics for drones, rockets, and EVs (https://www.hackerland.in/manufacturing/physics/3d).
4. Reverse Engineering Teardowns: Chip-level schematics and BOM cost teardowns of Ather 450 BMS and DJI drones (https://www.hackerland.in/teardowns).

The stack is a modular Next.js monorepo with Turborepo, pure client-side WebGL/Canvas rendering, and typed schemas.

We'd love your honest feedback and critique!`,
    shareUrl: 'https://news.ycombinator.com/submitlink?u=https%3A%2F%2Fwww.hackerland.in%2F&t=Show+HN%3A+Hackerland+%E2%80%93+In-browser+PCB+studio%2C+physics+lab%2C+and+maker+network',
  },
  {
    id: 'twitter_thread',
    name: 'Twitter / X Launch Thread',
    badge: 'Viral Developer Reach',
    title: '6-Tweet Announcement Thread',
    content: `1/6 What if you could design a PCB, run 3D aerodynamics simulations, flash an ESP32 over USB, and find co-founders—all inside your browser with zero installs?

Introducing Hackerland (@HackerlandHQ): The Global Innovation Operating System for human curiosity. 🧵👇
https://www.hackerland.in/

2/6 🛠️ In-Browser PCB Studio:
Laying out circuits shouldn't require multi-gigabyte IDE downloads.
Our canvas includes real-time DRC clearances, Veroboard/Breadboard modes, a photorealistic 3D renderer, and instant Gerber RS-274X export.
Try: https://www.hackerland.in/manufacturing/pcb

3/6 ⚡ WebSerial In-Browser Hardware Flasher:
Plug in an ESP32, Raspberry Pi Pico, or Arduino via USB and flash firmware with 1 click using the Web Serial API. Live UART terminal included.
Try: https://www.hackerland.in/manufacturing/flasher

4/6 🚀 3D Multibody Physics Labs:
Run 60 FPS aerodynamic & propulsion simulations for quadcopters, rockets, electric vehicles, and orbital mechanics.
Try: https://www.hackerland.in/manufacturing/physics/3d

5/6 🔍 Reverse Engineering & Teardowns:
We tore down the Ather 450 EV Battery Management System, DJI drone flight controllers, and Smart Grid LoRa meters to publish exact component BOM costs.
Explore: https://www.hackerland.in/teardowns

6/6 Stop just discussing ideas. Start building.
Hackerland is live, open, and free worldwide.
Check it out and let us know what you build today: https://www.hackerland.in/`,
    shareUrl: 'https://twitter.com/intent/tweet?text=Introducing%20Hackerland%3A%20In-browser%20PCB%20studio%2C%203D%20physics%20labs%2C%20and%20maker%20network%20https%3A%2F%2Fwww.hackerland.in%2F',
  },
  {
    id: 'reddit_electronics',
    name: 'Reddit (r/electronics & r/arduino)',
    badge: 'Open Hardware Community',
    title: 'I built an open-source in-browser PCB designer and WebSerial flasher for makers',
    content: `Title: I built an open-source in-browser PCB designer and WebSerial flasher for makers

Hey everyone!

Over the past few months, we've been working on Hackerland (https://www.hackerland.in/), a platform designed to make electronics and hardware prototyping accessible without cumbersome local installations.

Key features you might find handy:
- PCB Design Studio: Interactive schematic canvas, real-time trace clearance DRC, and instant Gerber RS-274X export for JLCPCB, PCBWay, or domestic fab houses.
- WebSerial Flasher: Flash ESP32 and RP2040 boards straight from Chrome via the Web Serial API with a built-in serial monitor.
- Hardware Teardowns: Full BOM analysis and architectural teardown of devices like the Ather 450 BMS and DJI Mavic Mini.

Everything runs client-side with zero tracking or paywalls. Would love to hear what components or ICs you'd like to see added to the library!`,
    shareUrl: 'https://www.reddit.com/submit?url=https%3A%2F%2Fwww.hackerland.in%2F&title=I+built+an+open-source+in-browser+PCB+designer+and+WebSerial+flasher+for+makers',
  },
];

export function LaunchKit() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {LAUNCH_PLATFORMS.map((platform) => {
          const isCopied = copiedId === platform.id;
          return (
            <div
              key={platform.id}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/30">
                    {platform.badge}
                  </span>
                  <span className="text-sm font-bold text-white">{platform.name}</span>
                </div>

                <div className="text-xs font-semibold text-neutral-300 font-mono bg-neutral-950 p-2.5 rounded-lg border border-neutral-800/80">
                  {platform.title}
                </div>

                <div className="rounded-xl bg-neutral-950/80 border border-neutral-800 p-3.5 text-xs font-mono text-neutral-400 h-44 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {platform.content}
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleCopy(platform.id, `${platform.title}\n\n${platform.content}`)}
                  className={`flex-1 py-2 rounded-lg font-semibold text-xs transition flex items-center justify-center gap-1.5 ${
                    isCopied
                      ? 'bg-emerald-500 text-black'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Post Text
                    </>
                  )}
                </button>

                {platform.shareUrl && (
                  <a
                    href={platform.shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black transition flex items-center justify-center shrink-0"
                    title={`Open ${platform.name}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
