import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DeviceBucketImportControls, useDeviceBucketImport } from './device-bucket-import';
import type { LocalBucketSnapshot } from '~/lib/local-bucket-import';

const { read, archive, importItems, download, refresh } = vi.hoisted(() => ({
  read: vi.fn(),
  archive: vi.fn(),
  importItems: vi.fn(),
  download: vi.fn(),
  refresh: vi.fn(),
}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
vi.mock('~/lib/actions/local-bucket-import', () => ({ importLocalBucketItems: vi.fn() }));
vi.mock('~/lib/bucket-list-data', () => ({ downloadBucketJson: download }));
vi.mock('~/lib/local-bucket-import', () => ({
  readLocalBucketSnapshot: read,
  archiveImportedBucketSnapshot: archive,
  importBucketItems: importItems,
}));

let root: Root;
let container: HTMLDivElement;
let state: ReturnType<typeof useDeviceBucketImport>;
function Harness() {
  state = useDeviceBucketImport(true);
  return (
    <>
      <p>{state.message}</p>
      <p role="alert">{state.error}</p>
      <DeviceBucketImportControls state={state} />
    </>
  );
}
function snapshot(invalid = 0): LocalBucketSnapshot {
  const items = [{ id: 'one', title: 'Sail', status: 'planned' as const, steps: [], updates: [] }];
  return {
    envelope: {
      key: 'onboarding:bucket-items',
      domain: 'bucket-list',
      schemaVersion: 1,
      installationId: 'test',
      updatedAt: '2026-11-07T10:00:00.000Z',
      value: {
        items: [...items, ...Array.from({ length: invalid }, () => ({ future: 'unknown' }))],
      },
    },
    items,
    invalid,
  };
}
function button(label: string) {
  return [...container.querySelectorAll('button')].find((node) => node.textContent === label);
}
async function click(label: string) {
  const node = button(label);
  if (!node) throw new Error(`Missing button: ${label}`);
  await act(async () => node.click());
}
async function review() {
  await click('Import device list (1)');
  await click('Keep account versions');
}
beforeEach(async () => {
  vi.resetAllMocks();
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  read.mockResolvedValue(snapshot());
  archive.mockResolvedValue(true);
  importItems.mockResolvedValue({ success: true, imported: 0, matched: 0, conflicts: ['one'] });
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  await act(async () => root.render(<Harness />));
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

describe('device archive recovery controls', () => {
  it('never offers or executes archive before the valid list has been imported', async () => {
    expect(button('Keep account versions')).toBeUndefined();
    await act(async () => state.archiveCopy());
    expect(archive).not.toHaveBeenCalled();
    read.mockResolvedValue(snapshot(1));
    await act(async () => root.render(<Harness key="mixed" />));
    expect(button('Keep account versions')).toBeUndefined();
  });

  it('requires a successful download start and saved-backup acknowledgment before archive', async () => {
    await review();
    expect(button('Archive device copy')?.disabled).toBe(true);
    download.mockImplementationOnce(() => {
      throw new Error('Blocked');
    });
    await click('Download device backup');
    expect(container.querySelector<HTMLInputElement>('input[type="checkbox"]')?.disabled).toBe(
      true
    );
    expect(button('Archive device copy')?.disabled).toBe(true);
    expect(container.textContent).toContain('The backup download could not be started');
    await click('Download device backup');
    expect(archive).not.toHaveBeenCalled();
    expect(button('Archive device copy')?.disabled).toBe(true);
    await act(async () => state.archiveCopy());
    expect(archive).not.toHaveBeenCalled();
    await act(async () =>
      container.querySelector<HTMLInputElement>('input[type="checkbox"]')!.click()
    );
    await click('Archive device copy');
    expect(archive).toHaveBeenCalledOnce();
    expect(container.textContent).toContain(
      'Your account versions are unchanged. The device copy is archived.'
    );
  });

  it('forgets old backup approval after a concurrent snapshot change and requires import again', async () => {
    await review();
    await click('Download device backup');
    await act(async () =>
      container.querySelector<HTMLInputElement>('input[type="checkbox"]')!.click()
    );
    const newer = snapshot();
    newer.envelope.updatedAt = '2026-11-07T11:00:00.000Z';
    newer.items[0]!.title = 'Newer goal';
    read.mockResolvedValue(newer);
    archive.mockResolvedValueOnce(false);
    await click('Archive device copy');
    expect(state.snapshot).toEqual(newer);
    expect(button('Keep account versions')).toBeUndefined();
    expect(button('Archive device copy')).toBeUndefined();
    await act(async () => state.archiveCopy());
    expect(archive).toHaveBeenCalledOnce();
    await review();
    expect(button('Archive device copy')?.disabled).toBe(true);
    expect(container.querySelector<HTMLInputElement>('input[type="checkbox"]')?.checked).toBe(
      false
    );
  });

  it('explains an entirely invalid copy and permits deliberate backup review without importing', async () => {
    const invalid = snapshot(1);
    invalid.items = [];
    invalid.envelope.value.items = [{ future: 'unknown' }];
    read.mockResolvedValue(invalid);
    await act(async () => root.render(<Harness key="invalid" />));
    expect(container.textContent).toContain('No device items can be imported');
    await click('Review device copy');
    expect(button('Archive device copy')?.disabled).toBe(true);
    expect(importItems).not.toHaveBeenCalled();
  });

  it('clears conflict resolution on an unsuccessful retry', async () => {
    await review();
    await click('Cancel archive');
    importItems.mockResolvedValueOnce({ success: false, error: 'Interrupted' });
    await click('Import device list (1)');
    expect(button('Keep account versions')).toBeUndefined();
    await act(async () => state.archiveCopy());
    expect(archive).not.toHaveBeenCalled();
  });

  it('imports valid items before exposing review for a mixed invalid copy', async () => {
    read.mockResolvedValue(snapshot(1));
    importItems.mockResolvedValueOnce({ success: true, imported: 1, matched: 0, conflicts: [] });
    await act(async () => root.render(<Harness key="mixed-success" />));
    expect(button('Keep account versions')).toBeUndefined();
    await click('Import device list (1)');
    expect(importItems).toHaveBeenCalledOnce();
    expect(button('Keep account versions')).toBeDefined();
    expect(archive).not.toHaveBeenCalled();
  });

  it('does not unlock review when the source changes during import', async () => {
    const newer = snapshot();
    newer.envelope.updatedAt = '2026-11-07T12:00:00.000Z';
    read.mockResolvedValueOnce(snapshot()).mockResolvedValueOnce(newer);
    await click('Import device list (1)');
    expect(state.snapshot).toEqual(newer);
    expect(button('Keep account versions')).toBeUndefined();
    expect(container.textContent).toContain('Your device list changed during import');
  });
});
