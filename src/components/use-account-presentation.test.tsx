import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccountPresentation } from './use-account-presentation';

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
