import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'istanbul',
      reportsDirectory: './coverage',
      exclude: ['**/browser.ts', '**/handler.ts'],
    },
  },
});
