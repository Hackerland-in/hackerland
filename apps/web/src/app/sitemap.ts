import type { MetadataRoute } from 'next';
import { listProjects } from '@/lib/data/queries';
import { listBuildStories } from '@/lib/data/stories-data';
import { listProblems } from '@/lib/data/problems-data';
import { TEARDOWNS_DATA } from '@/lib/data/teardowns-data';
import { MUSEUM_EXHIBITS } from '@/lib/data/museum-data';
import { SQUADS_DATA } from '@/lib/data/squads-data';
import { CLUBS_DATA } from '@/lib/data/clubs-data';
import { IP_DEFENSE_PUBLICATIONS } from '@/lib/data/ip-defense-data';

const BASE_URL = 'https://www.hackerland.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // Core Static Routes
  const staticRoutes: { path: string; priority: number; changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' }[] = [
    { path: '', priority: 1.0, changeFrequency: 'daily' },
    { path: '/observatory', priority: 0.95, changeFrequency: 'daily' },
    { path: '/stories', priority: 0.95, changeFrequency: 'daily' },
    { path: '/museum', priority: 0.95, changeFrequency: 'daily' },
    { path: '/ideas', priority: 0.95, changeFrequency: 'daily' },
    { path: '/problems', priority: 0.95, changeFrequency: 'daily' },
    { path: '/passport', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/teardowns', priority: 0.95, changeFrequency: 'daily' },
    { path: '/launch', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/prototype', priority: 0.95, changeFrequency: 'daily' },
    { path: '/manufacturing/pcb', priority: 0.95, changeFrequency: 'daily' },
    { path: '/manufacturing/rfq', priority: 0.95, changeFrequency: 'daily' },
    { path: '/manufacturing/flasher', priority: 0.95, changeFrequency: 'daily' },
    { path: '/manufacturing/physics/3d', priority: 0.95, changeFrequency: 'daily' },
    { path: '/manufacturing', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/manufacturing/physics', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/projects', priority: 0.9, changeFrequency: 'daily' },
    { path: '/clubs', priority: 0.95, changeFrequency: 'daily' },
    { path: '/network/ip', priority: 0.95, changeFrequency: 'daily' },
    { path: '/squads', priority: 0.95, changeFrequency: 'daily' },
    { path: '/earn', priority: 0.85, changeFrequency: 'daily' },
    { path: '/feed', priority: 0.85, changeFrequency: 'daily' },
    { path: '/leaderboard', priority: 0.8, changeFrequency: 'daily' },
    { path: '/labs', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/learn', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/entrepreneurship', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/how-to-start', priority: 0.8, changeFrequency: 'weekly' },
    // Manufacturing Domain Physics Simulators
    { path: '/manufacturing/physics/drone', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/manufacturing/physics/rocket', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/manufacturing/physics/car', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/manufacturing/physics/ev', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/manufacturing/physics/motorbike', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/manufacturing/physics/bicycle', priority: 0.8, changeFrequency: 'weekly' },
    // Manufacturing Labs & Tools
    { path: '/manufacturing/bench', priority: 0.75, changeFrequency: 'monthly' },
    { path: '/manufacturing/circuito', priority: 0.75, changeFrequency: 'monthly' },
    { path: '/manufacturing/spice', priority: 0.75, changeFrequency: 'monthly' },
    { path: '/manufacturing/falstad', priority: 0.75, changeFrequency: 'monthly' },
    { path: '/manufacturing/hdl', priority: 0.75, changeFrequency: 'monthly' },
    { path: '/manufacturing/iss', priority: 0.75, changeFrequency: 'monthly' },
    { path: '/manufacturing/eda', priority: 0.75, changeFrequency: 'monthly' },
    { path: '/manufacturing/tools', priority: 0.75, changeFrequency: 'monthly' },
    // How-To-Start Factory Blueprints
    { path: '/how-to-start/fab-manufacturing', priority: 0.75, changeFrequency: 'monthly' },
    { path: '/how-to-start/carbon-fiber-hub', priority: 0.75, changeFrequency: 'monthly' },
    { path: '/how-to-start/pcb-plant', priority: 0.75, changeFrequency: 'monthly' },
    { path: '/how-to-start/ev-powertrain', priority: 0.75, changeFrequency: 'monthly' },
    { path: '/how-to-start/aerospace-avionics', priority: 0.75, changeFrequency: 'monthly' },
    { path: '/how-to-start/iot-sensors', priority: 0.75, changeFrequency: 'monthly' },
    { path: '/how-to-start/precision-cnc', priority: 0.75, changeFrequency: 'monthly' },
    { path: '/how-to-start/3d-printing-farm', priority: 0.75, changeFrequency: 'monthly' },
    { path: '/u', priority: 0.7, changeFrequency: 'daily' },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: currentDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Dynamic Stories Routes
  try {
    const stories = await listBuildStories();
    for (const story of stories) {
      sitemapEntries.push({
        url: `${BASE_URL}/stories/${story.slug}`,
        lastModified: story.updatedAt ? new Date(story.updatedAt) : currentDate,
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    }
  } catch {}

  // Dynamic Teardowns Routes
  for (const teardown of TEARDOWNS_DATA) {
    sitemapEntries.push({
      url: `${BASE_URL}/teardowns/${teardown.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // Dynamic Museum Routes
  for (const exhibit of MUSEUM_EXHIBITS) {
    sitemapEntries.push({
      url: `${BASE_URL}/museum/${exhibit.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // Dynamic Squad Room Routes
  for (const squad of SQUADS_DATA) {
    sitemapEntries.push({
      url: `${BASE_URL}/projects/${squad.projectSlug}/squad`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    });
  }

  // Dynamic Club Chapter Routes
  for (const club of CLUBS_DATA) {
    sitemapEntries.push({
      url: `${BASE_URL}/clubs/${club.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // Dynamic IP Defense Ledger Routes
  for (const pub of IP_DEFENSE_PUBLICATIONS) {
    sitemapEntries.push({
      url: `${BASE_URL}/network/ip/${pub.id}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // Dynamic Project Routes
  try {
    const projects = await listProjects();
    for (const project of projects) {
      sitemapEntries.push({
        url: `${BASE_URL}/projects/${project.slug}`,
        lastModified: project.updatedAt ? new Date(project.updatedAt) : currentDate,
        changeFrequency: 'weekly',
        priority: 0.85,
      });
    }
  } catch {
    // If DB unavailable during static generation, staticRoutes suffice
  }

  return sitemapEntries;
}
