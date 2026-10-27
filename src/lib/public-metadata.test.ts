import { describe, expect, it } from 'vitest';
import { withPublicMetadata } from './public-metadata';
import { publicIdentity } from './public-identity';

describe('public document metadata', () => {
  it('reuses the canonical description and retains existing metadata', () => {
    const metadata = withPublicMetadata({
      title: 'About',
      description: 'Authored description.',
      alternates: { canonical: 'https://live.significanthobbies.com/about' },
      robots: { index: true },
      other: { existing: 'retained' },
    });
    expect(metadata.other).toEqual({ existing: 'retained', 'ai-summary': 'Authored description.' });
    expect(metadata.alternates?.types?.['text/markdown']).toBe(
      'https://live.significanthobbies.com/about.md'
    );
    expect(metadata.robots).toEqual({ index: true });
  });
  it('resolves the home alternate and shared identity relationships', () => {
    expect(
      withPublicMetadata({ alternates: { canonical: '/' } }).alternates?.types?.['text/markdown']
    ).toBe('https://live.significanthobbies.com/index.md');
    const site = publicIdentity['@graph'].find((node) => node['@type'] === 'WebSite');
    expect(site?.publisher).toEqual({ '@id': 'https://significanthobbies.com/#org' });
    expect(publicIdentity['@graph'].some((node) => node['@type'] === 'Person')).toBe(true);
    expect(publicIdentity['@graph'].some((node) => node['@type'] === 'Organization')).toBe(true);
  });
});
