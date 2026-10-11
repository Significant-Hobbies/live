import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WeeklyLogSurface } from './weekly-log-surface';

let container: HTMLDivElement;
let root: Root;
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

async function type(text: string) {
  const textarea = container.querySelector('textarea')!;
  await act(async () => {
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set?.call(
      textarea,
      text
    );
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  });
}
async function click(text: string) {
  const button = [...container.querySelectorAll('button')].find(
    (item) => item.textContent === text
  )!;
  await act(async () => button.click());
}

describe('Journal original week keys', () => {
  it.each([
    ['monday', 'sunday', '2026-10-05'],
    ['sunday', 'monday', '2026-10-04'],
  ] as const)('updates the original %s key after switching to %s', async (from, to, original) => {
    const save = vi.fn(async () => true);
    const weekStart = vi.fn(async () => {});
    await act(async () =>
      root.render(
        <WeeklyLogSurface
          data={{
            today: '2026-10-11',
            weekStartsOn: from,
            entries: [
              {
                id: 'saved-entry',
                weekOf: original,
                text: 'I made pasta.',
                promptText: 'My original prompt',
                turns: [{ questionText: 'Old prompt', answer: 'Old answer' }],
              },
            ],
          }}
          actions={{ onSave: save, onWeekStartsOnChange: weekStart }}
        />
      )
    );
    expect(container.querySelector('textarea')?.value).toBe('I made pasta.');
    const select = container.querySelector('select')!;
    await act(async () => {
      select.value = to;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
    expect(weekStart).toHaveBeenCalledWith(to);
    expect(container.querySelector('textarea')?.value).toBe('I made pasta.');
    expect(container.textContent).not.toContain('Earlier weeks');
    await type('I made pasta and sailed.');
    expect(select.disabled).toBe(true);
    await click('Update this week');
    expect(save).toHaveBeenCalledWith(original, 'I made pasta and sailed.', 'My original prompt');
    expect(container.textContent).toContain('Saved.');
    expect(container.textContent).not.toContain('Earlier weeks');
    await type('A new draft');
    expect(container.textContent).not.toContain('Saved.');
  });

  it('clears Saved when changing weeks and retains an unsaved draft when returning', async () => {
    await act(async () =>
      root.render(
        <WeeklyLogSurface
          data={{ today: '2026-10-11', weekStartsOn: 'monday', entries: [] }}
          actions={{ onSave: async () => true, onWeekStartsOnChange: async () => {} }}
        />
      )
    );
    await type('An honest paragraph.');
    await click('Save this week');
    expect(container.textContent).toContain('Saved.');
    await act(async () =>
      (container.querySelector('[aria-label="Previous week"]') as HTMLButtonElement).click()
    );
    expect(container.textContent).not.toContain('Saved.');
    await type('Earlier draft');
    await act(async () =>
      (container.querySelector('[aria-label="Next week"]') as HTMLButtonElement).click()
    );
    expect(container.querySelector('textarea')?.value).toBe('An honest paragraph.');
    await act(async () =>
      (container.querySelector('[aria-label="Previous week"]') as HTMLButtonElement).click()
    );
    expect(container.querySelector('textarea')?.value).toBe('Earlier draft');
  });
});
