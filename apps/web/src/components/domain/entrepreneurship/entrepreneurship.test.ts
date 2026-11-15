import { describe, it, expect } from 'vitest';
import {
  ENTREPRENEUR_COURSES,
  CURATED_ESSAYS,
  OPEN_SOURCE_FOUNDER_DOCS,
} from './entrepreneurship-data';

describe('Open Source Entrepreneurship Data & Academy', () => {
  it('contains verified courses with complete syllabi and valid links', () => {
    expect(ENTREPRENEUR_COURSES.length).toBeGreaterThanOrEqual(6);

    for (const course of ENTREPRENEUR_COURSES) {
      expect(course.title).toBeTruthy();
      expect(course.provider).toBeTruthy();
      expect(course.instructor).toBeTruthy();
      expect(course.externalUrl).toMatch(/^https?:\/\//);
      expect(course.syllabus.length).toBeGreaterThan(0);
      expect(course.tags.length).toBeGreaterThan(0);

      // Verify that all free badges are non-commercial/free
      expect(['100% Free', 'OpenCourseWare', 'Open Source', 'Govt Certified']).toContain(
        course.freeBadge
      );
    }
  });

  it('includes Stanford CS183B with YouTube playlist link', () => {
    const cs183b = ENTREPRENEUR_COURSES.find((c) => c.id === 'cs183b-how-to-start-a-startup');
    expect(cs183b).toBeDefined();
    expect(cs183b?.playlistUrl).toBe(
      'https://www.youtube.com/playlist?list=PLUdqnrHmtdXRb-uyCBGCk41iJ6iBkwhpH'
    );
    expect(cs183b?.syllabus.some((s) => s.speaker?.includes('Sam Altman'))).toBe(true);
    expect(cs183b?.syllabus.some((s) => s.speaker?.includes('Paul Graham'))).toBe(true);
  });

  it('includes YC Startup School curriculum with practical user interview takeaways', () => {
    const ycss = ENTREPRENEUR_COURSES.find((c) => c.id === 'yc-startup-school');
    expect(ycss).toBeDefined();
    expect(ycss?.freeBadge).toBe('100% Free');
    expect(ycss?.playlistUrl).toBe(
      'https://www.youtube.com/playlist?list=PLQ-uHSnFig5M9fW16o2l35jrfdsxGknNB'
    );
    expect(ycss?.syllabus.some((s) => s.title.includes('Talk to Users'))).toBe(true);
  });

  it('includes MIT Disciplined Entrepreneurship 24 steps', () => {
    const mit = ENTREPRENEUR_COURSES.find((c) => c.id === 'mit-disciplined-entrepreneurship');
    expect(mit).toBeDefined();
    expect(mit?.freeBadge).toBe('OpenCourseWare');
    expect(mit?.externalUrl).toBe(
      'https://executive.mit.edu/course/disciplined-entrepreneurship/a056g00000URaagAAD.html'
    );
    expect(mit?.playlistUrl).toBe(
      'https://www.youtube.com/playlist?list=PLUl4u3cNGP63CLq-GxVm4VSr-0iKAS-07'
    );
    expect(mit?.syllabus.some((s) => s.title.includes('Beachhead'))).toBe(true);
  });

  it('includes Steve Blank Lean LaunchPad with Udacity playlist', () => {
    const sb = ENTREPRENEUR_COURSES.find((c) => c.id === 'steve-blank-lean-launchpad');
    expect(sb).toBeDefined();
    expect(sb?.freeBadge).toBe('100% Free');
    expect(sb?.playlistUrl).toBe(
      'https://www.youtube.com/playlist?list=PLAwxTw4SYaPnxzSuovATBMrNowGaaEBmW'
    );
    expect(sb?.syllabus.some((s) => s.title.includes('Business Model'))).toBe(true);
  });

  it('contains curated seminal essays with core operating rules', () => {
    expect(CURATED_ESSAYS.length).toBeGreaterThanOrEqual(4);
    for (const essay of CURATED_ESSAYS) {
      expect(essay.title).toBeTruthy();
      expect(essay.author).toBeTruthy();
      expect(essay.url).toMatch(/^https?:\/\//);
      expect(essay.readTimeMin).toBeGreaterThan(0);
      expect(essay.coreRule).toBeTruthy();
    }
  });

  it('contains standard open-source founder documents', () => {
    expect(OPEN_SOURCE_FOUNDER_DOCS.length).toBeGreaterThanOrEqual(3);
    const safeDoc = OPEN_SOURCE_FOUNDER_DOCS.find((d) => d.id === 'yc-safe');
    expect(safeDoc).toBeDefined();
    expect(safeDoc?.url).toContain('ycombinator.com');
  });
});
