// Automated Indexing & SEO Submission Script for Hackerland
const HOST = 'www.hackerland.in';
const KEY = 'a8f94d01b972418e950854c86d8b0c4a';
const KEY_LOCATION = `https://${HOST}/indexnow-${KEY}.txt`;

const URLS = [
  'https://www.hackerland.in/',
  'https://www.hackerland.in/manufacturing/pcb',
  'https://www.hackerland.in/manufacturing/physics/3d',
  'https://www.hackerland.in/manufacturing',
  'https://www.hackerland.in/manufacturing/physics',
  'https://www.hackerland.in/manufacturing/physics/drone',
  'https://www.hackerland.in/manufacturing/physics/rocket',
  'https://www.hackerland.in/manufacturing/physics/car',
  'https://www.hackerland.in/manufacturing/physics/ev',
  'https://www.hackerland.in/manufacturing/physics/motorbike',
  'https://www.hackerland.in/manufacturing/physics/bicycle',
  'https://www.hackerland.in/manufacturing/bench',
  'https://www.hackerland.in/manufacturing/circuito',
  'https://www.hackerland.in/manufacturing/spice',
  'https://www.hackerland.in/manufacturing/falstad',
  'https://www.hackerland.in/manufacturing/hdl',
  'https://www.hackerland.in/manufacturing/iss',
  'https://www.hackerland.in/manufacturing/eda',
  'https://www.hackerland.in/manufacturing/tools',
  'https://www.hackerland.in/projects',
  'https://www.hackerland.in/projects/aeroglide',
  'https://www.hackerland.in/projects/saathi-voice',
  'https://www.hackerland.in/projects/open-braille',
  'https://www.hackerland.in/earn',
  'https://www.hackerland.in/feed',
  'https://www.hackerland.in/leaderboard',
  'https://www.hackerland.in/labs',
  'https://www.hackerland.in/learn',
  'https://www.hackerland.in/entrepreneurship',
  'https://www.hackerland.in/how-to-start',
  'https://www.hackerland.in/how-to-start/fab-manufacturing',
  'https://www.hackerland.in/how-to-start/carbon-fiber-hub',
  'https://www.hackerland.in/how-to-start/pcb-plant',
  'https://www.hackerland.in/how-to-start/ev-powertrain',
  'https://www.hackerland.in/how-to-start/aerospace-avionics',
  'https://www.hackerland.in/how-to-start/iot-sensors',
  'https://www.hackerland.in/how-to-start/precision-cnc',
  'https://www.hackerland.in/how-to-start/3d-printing-farm',
  'https://www.hackerland.in/feed.xml',
  'https://www.hackerland.in/sitemap.xml',
  'https://www.hackerland.in/llms.txt',
];

async function submitToIndexNow(endpoint, name) {
  try {
    const payload = {
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: URLS,
    };
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });
    console.log(`[${name}] Status: ${res.status} (${res.statusText})`);
  } catch (err) {
    console.error(`[${name}] Error:`, err.message);
  }
}

async function pingPublicEndpoints() {
  const pings = [
    { name: 'IndexNow Direct API', url: 'https://api.indexnow.org/indexnow' },
    { name: 'Bing IndexNow Gateway', url: 'https://www.bing.com/indexnow' },
    { name: 'Yandex IndexNow Gateway', url: 'https://yandex.com/indexnow' },
  ];

  for (const target of pings) {
    await submitToIndexNow(target.url, target.name);
  }
}

pingPublicEndpoints();
