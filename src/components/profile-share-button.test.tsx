import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ProfileShareButton } from './profile-share-button';

const originalShare = navigator.share;

afterEach(() => {
  Object.defineProperty(navigator, 'share', {
    configurable: true,
    value: originalShare,
  });
});

function renderWithShare(value: typeof navigator.share | undefined) {
  Object.defineProperty(navigator, 'share', {
    configurable: true,
    value,
  });

  return renderToString(<ProfileShareButton username="avery" displayName="Avery Rowan" />);
}

describe('ProfileShareButton', () => {
  it('renders the same markup regardless of Web Share support', () => {
    const clipboardMarkup = renderWithShare(undefined);
    const nativeShareMarkup = renderWithShare(vi.fn());

    expect(nativeShareMarkup).toBe(clipboardMarkup);
    expect(nativeShareMarkup).toContain('lucide-share');
  });
});
