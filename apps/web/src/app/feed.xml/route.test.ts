// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { listProjects } from '@/lib/data/queries';
import { GET } from './route';

describe('/feed.xml', () => {
  it('describes each project with its summary and last-updated date', async () => {
    const [first] = await listProjects();
    const response = await GET();
    const xml = await response.text();

    expect(first).toBeDefined();
    expect(xml).toContain(`<description><![CDATA[${first!.summary}]]></description>`);
    expect(xml).toContain(`<pubDate>${new Date(first!.updatedAt).toUTCString()}</pubDate>`);
    expect(xml).not.toContain('Invalid Date');
  });
});
