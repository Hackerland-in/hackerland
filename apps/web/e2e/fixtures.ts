import { test as base, expect } from '@playwright/test';

/** 1×1 transparent PNG served in place of third-party images. */
const BLANK_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64',
);

const isLocal = (url: URL) => url.hostname === 'localhost' || url.hostname === '127.0.0.1';

/**
 * Keeps e2e runs hermetic: requests to third-party hosts (e.g. image CDNs)
 * never leave the machine, so tests check our app rather than the network.
 */
export const test = base.extend<{ hermeticNetwork: void }>({
  hermeticNetwork: [
    async ({ page }, use) => {
      await page.route(
        (url) => !isLocal(url),
        (route) =>
          route.request().resourceType() === 'image'
            ? route.fulfill({ contentType: 'image/png', body: BLANK_PNG })
            : route.fulfill({ status: 204, body: '' }),
      );
      await use();
    },
    { auto: true },
  ],
});

export { expect };
