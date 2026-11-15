'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Cpu,
  Gauge,
  Atom,
  Factory,
  Layers,
  Wrench,
  Sparkles,
  Box,
} from 'lucide-react';
import { cn } from '@hackerland/ui';

export function ManufacturingSubnav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/manufacturing',
      label: 'Manufacturing Hub',
      shortLabel: 'Hub',
      icon: Cpu,
      isActive: pathname === '/manufacturing',
      badge: '8 Domains',
    },
    {
      href: '/manufacturing/physics',
      label: 'Simulators Suite',
      shortLabel: 'Simulators',
      icon: Gauge,
      isActive: pathname === '/manufacturing/physics',
      badge: '60 FPS',
    },
    {
      href: '/manufacturing/physics/3d',
      label: '3D Simulator Labs',
      shortLabel: '3D Labs',
      icon: Box,
      isActive: pathname === '/manufacturing/physics/3d',
      badge: '3D WebGL',
    },
    {
      href: '/labs',
      label: 'Makerspaces & Labs',
      shortLabel: 'Labs',
      icon: Atom,
      isActive: pathname === '/labs' || pathname.startsWith('/labs/'),
      badge: 'India Map',
    },
    {
      href: '/manufacturing/eda',
      label: 'CAD & Silicon Studios',
      shortLabel: 'Studios',
      icon: Layers,
      isActive:
        pathname === '/manufacturing/eda' ||
        pathname === '/manufacturing/spice' ||
        pathname === '/manufacturing/falstad' ||
        pathname === '/manufacturing/hdl' ||
        pathname === '/manufacturing/bench' ||
        pathname === '/manufacturing/circuito' ||
        pathname === '/manufacturing/iss',
    },
    {
      href: '/manufacturing/tools',
      label: 'Industrial Tooling',
      shortLabel: 'Tooling',
      icon: Wrench,
      isActive: pathname === '/manufacturing/tools',
    },
    {
      href: '/how-to-start',
      label: 'Factory Blueprints',
      shortLabel: 'Blueprints',
      icon: Factory,
      isActive: pathname.startsWith('/how-to-start'),
      badge: 'CapEx',
    },
  ];

  return (
    <div className="w-full border-b border-hairline bg-surface-1/90 backdrop-blur sticky top-16 z-30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 overflow-x-auto py-2.5 scrollbar-none">
          <nav
            aria-label="Manufacturing & Simulator Navigation"
            className="flex items-center gap-1.5 shrink-0"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={item.isActive ? 'page' : undefined}
                  className={cn(
                    'group flex items-center gap-2 px-3 py-1.5 rounded-lg text-body-xs font-display font-medium transition-all whitespace-nowrap',
                    item.isActive
                      ? 'bg-accent/15 text-accent border border-accent/30 font-semibold shadow-xs'
                      : 'text-fg-muted hover:text-fg hover:bg-surface-2 border border-transparent'
                  )}
                >
                  <Icon
                    className={cn(
                      'size-3.5 shrink-0 transition-transform group-hover:scale-110',
                      item.isActive ? 'text-accent' : 'text-fg-subtle'
                    )}
                  />
                  <span>
                    <span className="hidden sm:inline">{item.label}</span>
                    <span className="sm:hidden">{item.shortLabel}</span>
                  </span>
                  {item.badge && (
                    <span
                      className={cn(
                        'hidden md:inline-block font-mono text-[9px] uppercase px-1.5 py-0.2 rounded',
                        item.isActive
                          ? 'bg-accent/20 text-accent font-bold'
                          : 'bg-surface-2 text-fg-subtle'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick status pill on right */}
          <div className="hidden xl:flex items-center gap-2 shrink-0 text-caption font-mono text-fg-subtle">
            <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Cyber-Physical Simulation Mesh</span>
          </div>
        </div>
      </div>
    </div>
  );
}
