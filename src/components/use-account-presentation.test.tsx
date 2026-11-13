import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccountPresentation } from './use-account-presentation';
import { Nav } from './nav';

const sessionState = vi.hoisted(() => ({ isPending: true, data: null }));
vi.mock('~/lib/auth-client', () => ({ authClient: { useSession: () => sessionState } }));
vi.mock('next/navigation', () => ({
  usePathname: () => '/blog/example',
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

let root: Root;
let host: HTMLDivElement;
let current: ReturnType<typeof useAccountPresentation>;
const fetchPresentation = vi.fn<typeof fetch>();

function Account({ userId }: { userId: string | null }) {
  current = useAccountPresentation(userId);
  return null;
}

async function render(userId: string | null) {
  await act(async () => root.render(<Account userId={userId} />));
}

const payload = (id: string, username = id) =>
  Response.json({ user: { id, name: id, image: null, username } });

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  vi.stubGlobal('fetch', fetchPresentation);
  fetchPresentation.mockReset();
  sessionState.isPending = true;
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
});

afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
  vi.unstubAllGlobals();
});

describe('account presentation lifetime', () => {
  it('never fetches private presentation for signed-out visitors', async () => {
    await render(null);
    await act(async () => current.refresh());
    expect(fetchPresentation).not.toHaveBeenCalled();
    expect(current.user).toBeNull();
  });

  it('shows the current username and refreshes it when the account menu reopens', async () => {
    fetchPresentation.mockResolvedValueOnce(payload('owner', 'old-name'));
    await render('owner');
    expect(current.user?.username).toBe('old-name');
    expect(fetchPresentation.mock.calls[0]?.[1]).toMatchObject({
      credentials: 'same-origin',
      cache: 'no-store',
    });
    fetchPresentation.mockResolvedValueOnce(payload('owner', 'new-name'));
    await act(async () => current.refresh());
    expect(current.user?.username).toBe('new-name');
  });

  it('aborts old requests and never shows another account after an account switch or logout', async () => {
    const pending: Array<(response: Response) => void> = [];
    fetchPresentation.mockImplementation(() => new Promise((resolve) => pending.push(resolve)));
    await render('account-a');
    const oldSignal = fetchPresentation.mock.calls[0]?.[1]?.signal;
    await render('account-b');
    expect(oldSignal?.aborted).toBe(true);
    await act(async () => pending[0]!(payload('account-a', 'private-a')));
    expect(current.user).toBeNull();
    await act(async () => pending[1]!(payload('account-b', 'private-b')));
    expect(current.user?.id).toBe('account-b');
    await act(async () => current.refresh());
    const lastSignal = fetchPresentation.mock.calls[2]?.[1]?.signal;
    await render(null);
    expect(lastSignal?.aborted).toBe(true);
    expect(current.user).toBeNull();
    await act(async () => pending[2]!(payload('account-b', 'late-private-b')));
    expect(current.user).toBeNull();
  });

  it('retains the same verified account presentation when a refresh is unavailable', async () => {
    fetchPresentation.mockResolvedValueOnce(payload('owner', 'known-name'));
    await render('owner');
    fetchPresentation.mockResolvedValueOnce(new Response(null, { status: 503 }));
    await act(async () => current.refresh());
    expect(current.user?.username).toBe('known-name');
  });

  it('ignores a response for a different user and tolerates unavailable presentation', async () => {
    fetchPresentation.mockResolvedValueOnce(payload('another-account', 'private-name'));
    await render('owner');
    expect(current.user).toBeNull();
    fetchPresentation.mockResolvedValueOnce(new Response(null, { status: 401 }));
    await act(async () => current.refresh());
    expect(current.user).toBeNull();
    fetchPresentation.mockRejectedValueOnce(new Error('offline'));
    await act(async () => current.refresh());
    expect(current.user).toBeNull();
  });
});

describe('navigation session resolution', () => {
  it('keeps desktop and mobile Sign in steady during a signed-out refetch', async () => {
    await act(async () => root.render(<Nav />));
    const menu = host.querySelector('button[aria-label="Open menu"]');
    expect(menu).not.toBeNull();
    await act(async () => menu?.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    const pendingLinks = host.querySelectorAll('a[aria-busy="true"]');
    expect(pendingLinks).toHaveLength(2);
    expect([...pendingLinks].every((link) => link.getAttribute('href') === '/bucket-list')).toBe(
      true
    );
    sessionState.isPending = false;
    await act(async () => root.render(<Nav />));
    expect(host.querySelectorAll('a[href="/login"]')).toHaveLength(2);
    expect(host.querySelectorAll('a[aria-busy="true"]')).toHaveLength(0);
    sessionState.isPending = true;
    await act(async () => root.render(<Nav />));
    expect(host.querySelectorAll('a[href="/login"]')).toHaveLength(2);
    expect(host.querySelectorAll('a[aria-busy="true"]')).toHaveLength(0);
    expect(fetchPresentation).not.toHaveBeenCalled();
  });
});
