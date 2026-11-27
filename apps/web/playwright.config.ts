import { defineConfig, devices } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const pwCache = path.join(os.homedir(), 'Library/Caches/ms-playwright');
const candidateShellPaths = [
  path.join(pwCache, 'chromium_headless_shell-1255/chrome-headless-shell-mac-arm64/chrome-headless-shell'),
  path.join(pwCache, 'chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell'),
  path.join(pwCache, 'chromium-1194/chrome-mac/Chromium.app/Contents/MacOS/Chromium'),
];

const foundShell = candidateShellPaths.find((p) => fs.existsSync(p));
const launchOptions = foundShell ? { executablePath: foundShell } : undefined;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3100',
    trace: 'on-first-retry',
    launchOptions,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm start -p 3100',
    url: 'http://localhost:3100',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
