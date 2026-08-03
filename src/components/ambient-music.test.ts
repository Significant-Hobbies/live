import { describe, expect, it } from 'vitest';
import {
  getYoutubeEmbedUrl,
  normalizeSoundtrackPreferences,
  YOUTUBE_TRACKS,
} from './ambient-music';

describe('YouTube soundtrack', () => {
  it('offers three upbeat song choices', () => {
    expect(Object.keys(YOUTUBE_TRACKS)).toEqual(['springtime', 'lights', 'monogatari']);
  });

  it('uses the privacy-enhanced embed with autoplay and looping', () => {
    const url = new URL(getYoutubeEmbedUrl('springtime'));
    expect(url.hostname).toBe('www.youtube-nocookie.com');
    expect(url.pathname).toContain(YOUTUBE_TRACKS.springtime.youtubeId);
    expect(url.searchParams.get('autoplay')).toBe('1');
    expect(url.searchParams.get('loop')).toBe('1');
    expect(url.searchParams.get('playlist')).toBe(YOUTUBE_TRACKS.springtime.youtubeId);
  });
});

describe('soundtrack preference normalization', () => {
  it('keeps a valid choice', () => {
    expect(normalizeSoundtrackPreferences({ trackId: 'lights', enabled: true })).toEqual({
      trackId: 'lights',
      enabled: true,
    });
  });

  it('falls back from unknown tracks', () => {
    expect(normalizeSoundtrackPreferences({ trackId: 'storm', enabled: false })).toEqual({
      trackId: 'springtime',
      enabled: false,
    });
  });

  it('rejects missing and malformed preference records', () => {
    expect(normalizeSoundtrackPreferences(null)).toBeNull();
    expect(normalizeSoundtrackPreferences('loud')).toBeNull();
  });
});
