import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MyList } from './my-list';
import { parseCatalogQuery, searchCatalogSeed } from '~/lib/catalog-seed';
import * as localRecords from '~/lib/local-record-store';

const { addItem, refresh, submit, updateNotes, updateStatus } = vi.hoisted(() => ({
  addItem: vi.fn(),
  refresh: vi.fn(),
  submit: vi.fn(),
  updateNotes: vi.fn(),
  updateStatus: vi.fn(),
}));
vi.mock('~/lib/actions/bucket-list', () => ({
  addBucketListItem: addItem,
  updateBucketListItem: updateNotes,
  updateBucketListItemStatus: updateStatus,
}));
vi.mock('~/lib/actions/bucket-steps', () => ({}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
vi.mock('~/lib/actions/catalog', () => ({ submitCatalogIdea: submit }));

let container: HTMLDivElement;
let root: Root;

beforeEach(async () => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) => ({
      ok: true,
      json: async () =>
        searchCatalogSeed(parseCatalogQuery(new URL(url, 'http://localhost').searchParams)),
    }))
  );
  addItem.mockResolvedValue({ success: true, id: 'saved', added: true });
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  await act(async () => root.render(<MyList initialItems={[]} />));
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

it('ends the opening status when a device read fails without enabling writes or showing empty data', async () => {
  let rejectRead: (error: Error) => void = () => {};
  const put = vi.fn();
  const remove = vi.fn();
  vi.spyOn(localRecords, 'browserRecordAdapter').mockReturnValue({
    get: () =>
      new Promise((_resolve, reject) => {
        rejectRead = reject;
      }),
    put,
    remove,
  });
  await act(async () => root.render(<MyList key="failed-device-read" />));
  expect(container.textContent).toContain('Opening your list…');
  await act(async () => rejectRead(new Error('Storage temporarily unavailable')));
  expect(container.querySelector('[role="alert"]')?.textContent).toContain('Reload to try again');
  expect(container.textContent).not.toContain('Opening your list…');
  expect(container.textContent).not.toContain('Nothing here yet.');
  expect(container.querySelector('input')?.disabled).toBe(true);
  expect(put).not.toHaveBeenCalled();
  expect(remove).not.toHaveBeenCalled();
});

async function input(value: string) {
  const element = container.querySelector('input');
  if (!element) throw new Error('Missing input');
  await act(async () => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(element, value);
    element.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await act(async () => vi.advanceTimersByTimeAsync(160));
}
async function click(label: string) {
  const button = [...container.querySelectorAll('button')].find(
    (element) => element.textContent === label
  );
  if (!button) throw new Error(`Missing button: ${label}`);
  await act(async () => button.click());
}

describe('Account manual entry', () => {
  async function openNotesItem() {
    await act(async () =>
      root.render(
        <MyList
          key="notes"
          initialItems={[
            { id: 'one', title: 'Sail', status: 'planned', steps: [], notes: 'Before' },
            { id: 'two', title: 'Swim', status: 'planned', steps: [] },
          ]}
        />
      )
    );
    await act(async () =>
      (container.querySelector('[aria-label="Open Sail"]') as HTMLButtonElement).click()
    );
    const field = container.querySelector('textarea')!;
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set?.call(
        field,
        'My unsaved notes'
      );
      field.dispatchEvent(new Event('input', { bubbles: true }));
    });
    return field;
  }

  it('retains a failed notes draft after switching away and back', async () => {
    let rejectSave: (error: Error) => void = () => {};
    updateNotes.mockImplementation(
      () =>
        new Promise((_resolve, reject) => {
          rejectSave = reject;
        })
    );
    const field = await openNotesItem();
    await act(async () => {
      field.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
      (container.querySelector('[aria-label="Open Swim"]') as HTMLButtonElement).click();
    });
    await act(async () => rejectSave(new Error('Write failed')));
    await act(async () =>
      (container.querySelector('[aria-label="Open Sail"]') as HTMLButtonElement).click()
    );
    expect(container.querySelector('textarea')?.value).toBe('My unsaved notes');
    expect(container.textContent).toContain('Your draft is still here.');
    expect(container.querySelectorAll('textarea')).toHaveLength(1);
  });

  it('allows a status click during notes autosave and serializes both writes', async () => {
    let finishNotes: () => void = () => {};
    updateNotes.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          finishNotes = resolve;
        })
    );
    updateStatus.mockResolvedValue({ success: true });
    const field = await openNotesItem();
    await act(async () => field.dispatchEvent(new FocusEvent('focusout', { bubbles: true })));
    const doing = [...container.querySelectorAll<HTMLButtonElement>('[role="radio"]')].find(
      (button) => button.textContent === 'Doing'
    )!;
    expect(doing.disabled).toBe(false);
    await act(async () => doing.click());
    expect(updateStatus).not.toHaveBeenCalled();
    await act(async () => finishNotes());
    expect(updateNotes).toHaveBeenCalledWith('one', { description: 'My unsaved notes' });
    expect(updateStatus).toHaveBeenCalledWith('one', 'in_progress');
    expect(container.querySelector('[role="radio"][aria-checked="true"]')?.textContent).toBe(
      'Doing'
    );
  });

  it('saves exact custom wording and updates the row after success', async () => {
    await input('  Teach my niece to make a bowl  ');
    await click('Add');
    expect(addItem).toHaveBeenCalledWith({ title: 'Teach my niece to make a bowl' });
    expect(container.textContent).toContain('To do');
    expect(container.querySelector('input')?.value).toBe('');
    expect(submit).not.toHaveBeenCalled();
  });

  it('passes the selected catalog category and description to account storage', async () => {
    await input('pottery');
    expect(container.querySelectorAll('li').length).toBeGreaterThan(0);
    await click('+ Add');
    expect(addItem).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Take a pottery class and make a finished piece',
        category: 'creative',
      })
    );
    expect(container.textContent).toContain('To do');
  });

  it('shows server-paginated suggestions after the first page', async () => {
    await input('learn');
    const firstTitle = container.querySelector('li')?.textContent;
    expect(container.querySelectorAll('li')).toHaveLength(5);
    await click('Next');
    await act(async () => vi.advanceTimersByTimeAsync(160));
    expect(container.querySelectorAll('li')).toHaveLength(5);
    expect(container.querySelector('li')?.textContent).not.toBe(firstTitle);
    expect(container.textContent).toContain('Page 2 of');
  });

  it('retains input and exposes feedback when saving fails', async () => {
    addItem.mockRejectedValue(new Error('Unavailable'));
    await input('My personal idea');
    await click('Add');
    expect(container.querySelector('input')?.value).toBe('My personal idea');
    expect(container.querySelector('[role="alert"]')?.textContent).toContain('could not be saved');
    expect(refresh).not.toHaveBeenCalled();
  });

  it('submits only with an explicit category and action, independently of the private save', async () => {
    submit.mockResolvedValue({ id: 'submission', status: 'pending' });
    await input('Make a neighbourhood cookbook');
    expect(submit).not.toHaveBeenCalled();
    const select = container.querySelector('select');
    if (!select) throw new Error('Missing category');
    await act(async () => {
      select.value = 'creative';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await click('Submit for review');
    expect(submit).toHaveBeenCalledWith({
      title: 'Make a neighbourhood cookbook',
      category: 'creative',
    });
    expect(addItem).not.toHaveBeenCalled();
    expect(container.textContent).toContain('only after approval');
  });

  it('allows personal wording to be saved even when shared search is unavailable', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: false }))
    );
    await input('My own quiet afternoon');
    expect(container.textContent).toContain('Ideas could not be loaded');
    await click('Add');
    expect(addItem).toHaveBeenCalledWith({ title: 'My own quiet afternoon' });
    expect(submit).not.toHaveBeenCalled();
  });

  it('keeps the latest suggestions when an older search finishes late', async () => {
    const pending = new Map<string, (response: Response) => void>();
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (url: string) =>
          new Promise<Response>((resolve) => {
            pending.set(new URL(url, 'http://localhost').searchParams.get('q') ?? '', resolve);
          })
      )
    );
    await input('learn');
    await input('pottery');
    await act(async () =>
      pending.get('pottery')?.(
        Response.json(
          searchCatalogSeed(parseCatalogQuery(new URLSearchParams('q=pottery&pageSize=5')))
        )
      )
    );
    expect(container.textContent).toContain('Take a pottery class');
    await act(async () =>
      pending.get('learn')?.(
        Response.json(
          searchCatalogSeed(parseCatalogQuery(new URLSearchParams('q=learn&pageSize=5')))
        )
      )
    );
    expect(container.textContent).toContain('Take a pottery class');
    expect(container.textContent).not.toContain('Learn calligraphy');
  });
});
