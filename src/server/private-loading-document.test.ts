import { describe, expect, it } from 'vitest';

import {
  privateLoadingDocumentEligible,
  withPrivateLoadingDocument,
} from '../../private-loading-document.mjs';

const path = '/bucket-list';
const origin = 'https://significanthobbies.com';
const documentHeaders = { Accept: 'text/html,application/xhtml+xml' };

type UnchangedCase = {
  path?: string;
  method?: string;
  query?: string;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
  status?: number;
};

function render(headers: Record<string, string> = {}, status = 200) {
  return new Response('<html><head></head><body>Private fixture</body></html>', {
    status,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
      'Cache-Control': 'private, no-store',
      ...headers,
    },
  });
}

describe('the private loading document boundary', () => {
  it.each(['/bucket-list', '/journal'])('accepts the full browser document at %s', (route) => {
    const request = new Request(origin + route, {
      headers: { ...documentHeaders, Cookie: 'fixture=browser' },
    });
    expect(privateLoadingDocumentEligible(request, render(), route)).toBe(true);
  });

  const unchangedCases: UnchangedCase[] = [
    { path: '/history' },
    { path: '/bucket-list/other' },
    { path: '/journal/' },
    { method: 'HEAD' },
    { method: 'POST' },
    { query: '?_rsc=local' },
    { requestHeaders: { Accept: '*/*' } },
    { requestHeaders: { RSC: '1' } },
    { requestHeaders: { 'Next-Router-State-Tree': 'fixture' } },
    { requestHeaders: { 'Next-Router-Prefetch': '1' } },
    { requestHeaders: { 'Sec-Purpose': 'prefetch' } },
    { requestHeaders: { Range: 'bytes=0-4' } },
    { requestHeaders: { 'If-None-Match': '"fixture"' } },
    { status: 503 },
    { responseHeaders: { 'Content-Type': 'text/x-component' } },
    { responseHeaders: { 'Content-Security-Policy': "script-src 'self'" } },
    { responseHeaders: { 'Content-Encoding': 'br' } },
  ];
  it.each(unchangedCases)('preserves an out-of-scope response exactly (%j)', (testCase) => {
    const route = testCase.path ?? path;
    const request = new Request(origin + route + (testCase.query ?? ''), {
      method: testCase.method ?? 'GET',
      headers: { ...documentHeaders, ...testCase.requestHeaders },
    });
    const response = render(testCase.responseHeaders, testCase.status);
    expect(privateLoadingDocumentEligible(request, response, route)).toBe(false);
    expect(withPrivateLoadingDocument(request, response, route)).toBe(response);
    expect(response.bodyUsed).toBe(false);
  });
});
