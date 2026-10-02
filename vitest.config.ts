import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

const generatedWorkerModules = new Set([
  resolve(__dirname, '.open-next/worker.js'),
  resolve(__dirname, '.open-next/cache-release.mjs'),
]);

// Plain Vitest config (formerly @saas-maker/test-config/vitest factory).
export default defineConfig({
  plugins: [
    {
      // Edge tests supply vi.mock factories for generated bindings. Resolve
      // them without requiring a Cloudflare build in a fresh checkout.
      name: 'mock-generated-worker-modules',
      resolveId(id, importer) {
        if (!importer || !id.startsWith('.')) return;
        const target = resolve(importer, '..', id);
        if (generatedWorkerModules.has(target)) return target;
      },
      load(id) {
        if (generatedWorkerModules.has(id)) return 'export {};';
      },
    },
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', 'dist', '.next', '.wrangler', 'e2e/**'],
    testTimeout: 15_000,
    coverage: {
      provider: 'v8',
      // Selective thresholds on core logic modules with co-located tests,
      // following the swe-interview-prep fleet model. UI/config/data files
      // are excluded so thresholds reflect real logic coverage, not surface
      // area. Add a file here when it gains a co-located *.test.ts.
      include: [
        'src/lib/accountability-circles.ts',
        'src/lib/bucket-list-insights.ts',
        'src/lib/hobby-roadmap.ts',
        'src/lib/insights.ts',
        'src/lib/personality.ts',
        'src/lib/rate-limit.ts',
        'src/lib/recommendations.ts',
        'src/lib/rediscovery.ts',
        'src/lib/slug.ts',
        'src/lib/trajectory.ts',
      ],
      exclude: [
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.d.ts',
        '**/index.ts',
        'node_modules',
        'dist',
        '.next',
        '.wrangler',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '~': resolve(__dirname, './src'),
    },
  },
});
