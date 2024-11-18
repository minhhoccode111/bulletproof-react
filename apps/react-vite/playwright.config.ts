import { defineConfig, devices } from '@playwright/test';

const PORT = 3000;

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      testMatch: /.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: `yarn dev --port ${PORT}`,
    timeout: 10 * 1000,
    port: PORT,
    reuseExistingServer: !process.env.CI,
  },
});

/*
The `playwright.config.ts` file is a configuration file for Playwright, a browser automation framework. It's used to define the settings and options for running Playwright tests.

In your `playwright.config.ts` file, you have defined the configuration for your Playwright tests

- The `defineConfig` function is used to define the configuration for Playwright.
- The `testDir` option specifies the directory where your end-to-end tests are located. In this case, it's set to `./e2e`.

Other configurations in your `playwright.config.ts` file include:

* `fullyParallel`: enables parallel testing
* `forbidOnly`: fails the build if `test.only` is used in the code
* `retries`: specifies the number of retries for failed tests
* `workers`: specifies the number of worker processes to use for parallel testing
* `reporter`: specifies the test reporter to use
* `use`: specifies the base URL and other settings for the tests
* `projects`: defines multiple test projects, including a setup project and a Chromium project
* `webServer`: specifies the command to run the development server and the port to use

The `playwright.config.ts` file is used to customize the behavior of Playwright and define the settings for your end-to-end tests.
*/
