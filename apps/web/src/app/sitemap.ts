import type { MetadataRoute } from 'next';
import { listProjects } from '@/lib/data/queries';
import { listBuildStories } from '@/lib/data/stories-data';
import { listProblems } from '@/lib/data/problems-data';
import { TEARDOWNS_DATA } from '@/lib/data/teardowns-data';
import { MUSEUM_EXHIBITS } from '@/lib/data/museum-data';
import { SQUADS_DATA } from '@/lib/data/squads-data';
import { CLUBS_DATA } from '@/lib/data/clubs-data';
import { IP_DEFENSE_PUBLICATIONS } from '@/lib/data/ip-defense-data';
import { CAMPAIGN_REGISTRY } from '@/lib/data/launchpad-data';
import { HARDWARE_JOBS_REGISTRY } from '@/lib/data/jobs-data';
import { FIRMWARE_REGISTRY } from '@/lib/data/firmware-data';
import { COMPLIANCE_ROADMAPS } from '@/lib/data/compliance-data';
import { TESTBED_FACILITIES } from '@/lib/data/testbeds-data';
import { SPRINTS_CATALOG } from '@/lib/data/sprints-data';
import { COMPONENT_SOURCING_REGISTRY } from '@/lib/data/sourcing-data';
import { PCBA_ASSEMBLY_CATALOG } from '@/lib/data/assembly-data';
import { EMC_SCAN_REGISTRY } from '@/lib/data/emc-data';
import { RF_PRESETS } from '@/lib/data/rf-data';
import { BATTERY_EIS_REGISTRY } from '@/lib/data/battery-eis-data';
import { THERMAL_PROFILES_REGISTRY } from '@/lib/data/thermal-data';
import { SOLAR_MPPT_PROJECTS_REGISTRY } from '@/lib/data/solar-mppt-data';
import { MOTOR_FOC_PROJECTS_REGISTRY } from '@/lib/data/motor-foc-data';

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
    { path: '/teardowns/submit', priority: 0.9, changeFrequency: 'monthly' },
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
    { path: '/copilot', priority: 0.95, changeFrequency: 'daily' },
    { path: '/telemetry', priority: 0.95, changeFrequency: 'daily' },
    { path: '/firmware', priority: 0.95, changeFrequency: 'daily' },
    { path: '/compliance', priority: 0.95, changeFrequency: 'daily' },
    { path: '/testbeds', priority: 0.95, changeFrequency: 'daily' },
    { path: '/sprints', priority: 0.95, changeFrequency: 'daily' },
    { path: '/sourcing', priority: 0.95, changeFrequency: 'daily' },
    { path: '/assembly', priority: 0.95, changeFrequency: 'daily' },
    { path: '/emc', priority: 0.95, changeFrequency: 'daily' },
    { path: '/rf-calc', priority: 0.95, changeFrequency: 'daily' },
    { path: '/battery-eis', priority: 0.95, changeFrequency: 'daily' },
    { path: '/thermal', priority: 0.95, changeFrequency: 'daily' },
    { path: '/solar-mppt', priority: 0.95, changeFrequency: 'daily' },
    { path: '/motor-foc', priority: 0.95, changeFrequency: 'daily' },
    { path: '/launchpad', priority: 0.95, changeFrequency: 'daily' },
    { path: '/jobs', priority: 0.95, changeFrequency: 'daily' },
    { path: '/young-innovators', priority: 0.95, changeFrequency: 'daily' },
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

  // Dynamic Hardware Launchpad Routes
  for (const camp of CAMPAIGN_REGISTRY) {
    sitemapEntries.push({
      url: `${BASE_URL}/launchpad/${camp.slug}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    });
  }

  // Dynamic Hardware Jobs Routes
  for (const job of HARDWARE_JOBS_REGISTRY) {
    sitemapEntries.push({
      url: `${BASE_URL}/jobs/${job.slug}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    });
  }

  // Dynamic Firmware Registry Routes
  for (const fw of FIRMWARE_REGISTRY) {
    sitemapEntries.push({
      url: `${BASE_URL}/firmware/${fw.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // Dynamic Compliance Roadmaps Routes
  for (const rm of COMPLIANCE_ROADMAPS) {
    sitemapEntries.push({
      url: `${BASE_URL}/compliance/${rm.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // Dynamic Testbed Facilities Routes
  for (const tb of TESTBED_FACILITIES) {
    sitemapEntries.push({
      url: `${BASE_URL}/testbeds/${tb.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // Dynamic Sprint Routes
  for (const sprint of SPRINTS_CATALOG) {
    sitemapEntries.push({
      url: `${BASE_URL}/sprints/${sprint.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // Dynamic Component Sourcing Routes
  for (const rec of COMPONENT_SOURCING_REGISTRY) {
    sitemapEntries.push({
      url: `${BASE_URL}/sourcing/${rec.mpn}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // Dynamic PCBA Assembly Routes
  for (const proj of PCBA_ASSEMBLY_CATALOG) {
    sitemapEntries.push({
      url: `${BASE_URL}/assembly/${proj.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // Dynamic EMI/EMC Scan Routes
  for (const proj of EMC_SCAN_REGISTRY) {
    sitemapEntries.push({
      url: `${BASE_URL}/emc/${proj.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // Dynamic RF Transmission Line Synthesizer Routes
  for (const preset of RF_PRESETS) {
    sitemapEntries.push({
      url: `${BASE_URL}/rf-calc/${preset.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // Dynamic Battery EIS & SoH Routes
  for (const proj of BATTERY_EIS_REGISTRY) {
    sitemapEntries.push({
      url: `${BASE_URL}/battery-eis/${proj.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // Dynamic Thermal Management Routes
  for (const proj of THERMAL_PROFILES_REGISTRY) {
    sitemapEntries.push({
      url: `${BASE_URL}/thermal/${proj.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // Dynamic Solar PV & MPPT Simulator Routes
  for (const proj of SOLAR_MPPT_PROJECTS_REGISTRY) {
    sitemapEntries.push({
      url: `${BASE_URL}/solar-mppt/${proj.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // Dynamic Motor FOC & SVPWM Simulator Routes
  for (const proj of MOTOR_FOC_PROJECTS_REGISTRY) {
    sitemapEntries.push({
      url: `${BASE_URL}/motor-foc/${proj.slug}`,
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
