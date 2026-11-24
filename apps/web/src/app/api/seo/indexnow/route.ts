import { NextResponse } from 'next/server';

const INDEXNOW_KEY = 'a8f94d01b972418e950854c86d8b0c4a';
const HOST = 'www.hackerland.in';
const SITEMAP_URL = 'https://www.hackerland.in/sitemap.xml';

const KEY_URLS = [
  'https://www.hackerland.in/',
  'https://www.hackerland.in/manufacturing/pcb',
  'https://www.hackerland.in/manufacturing/physics/3d',
  'https://www.hackerland.in/manufacturing',
  'https://www.hackerland.in/manufacturing/physics',
  'https://www.hackerland.in/projects',
  'https://www.hackerland.in/earn',
  'https://www.hackerland.in/feed',
  'https://www.hackerland.in/leaderboard',
  'https://www.hackerland.in/labs',
  'https://www.hackerland.in/learn',
  'https://www.hackerland.in/entrepreneurship',
  'https://www.hackerland.in/how-to-start',
];

export async function POST(req: Request) {
  try {
    let customUrls: string[] = [];
    try {
      const body = await req.json();
      if (Array.isArray(body?.urls)) {
        customUrls = body.urls;
      }
    } catch {
      // Use default URLs
    }

    const urlList = customUrls.length > 0 ? customUrls : KEY_URLS;

    // 1. Submit to IndexNow API (Broadcasts to Bing, Yandex, Seznam, Naver)
    const indexNowPayload = {
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: `https://${HOST}/indexnow-${INDEXNOW_KEY}.txt`,
      urlList,
    };

    const indexNowRes = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(indexNowPayload),
    });

    const indexNowStatus = indexNowRes.status;

    // 2. Ping Google and Bing sitemaps
    const pings = await Promise.allSettled([
      fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`),
      fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`),
    ]);

    return NextResponse.json({
      success: true,
      submittedUrls: urlList.length,
      indexNow: {
        status: indexNowStatus,
        message: indexNowStatus === 200 || indexNowStatus === 202 ? 'URLs accepted for indexing' : `IndexNow response code: ${indexNowStatus}`,
      },
      sitemapPings: {
        google: pings[0]?.status === 'fulfilled' ? pings[0].value.status : 'failed',
        bing: pings[1]?.status === 'fulfilled' ? pings[1].value.status : 'failed',
      },
      sitemapUrl: SITEMAP_URL,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: (error instanceof Error && error.message) || 'Failed to submit search engine indexing ping' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'IndexNow & SEO indexing endpoint active',
    host: HOST,
    sitemap: SITEMAP_URL,
    keyLocation: `https://${HOST}/indexnow-${INDEXNOW_KEY}.txt`,
    defaultUrlsSubmitted: KEY_URLS.length,
  });
}
