'use client';
import { useEffect, useState } from 'react';
import {
  CostCalculatorView,
  SEED_ITEMS,
  PRESETS,
  type LineItem,
} from '~/components/public-pages/cost-calculator';
const STORAGE_KEY = 'sh-cost-calculator-v1';
function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}
export default function CostCalculatorClient() {
  const [items, setItems] = useState<LineItem[]>(SEED_ITEMS);
  const [hobbyName, setHobbyName] = useState('My hobby');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (Array.isArray(parsed.items)) setItems(parsed.items);

      if (typeof parsed.hobbyName === 'string') setHobbyName(parsed.hobbyName);
    } catch {
      /* ignore corrupt state */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, hobbyName }));
  }, [items, hobbyName]);

  function addItem() {
    setItems((prev) => [
      ...prev,
      { id: uid(), label: 'New line item', amount: 0, cadence: 'monthly' },
    ]);
  }

  function updateItem(id: string, patch: Partial<LineItem>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  function loadPreset(name: string) {
    setHobbyName(name);
    setItems(PRESETS[name].map((it) => ({ ...it, id: uid() })));
  }

  return (
    <CostCalculatorView
      items={items}
      setItems={setItems}
      hobbyName={hobbyName}
      setHobbyName={setHobbyName}
      addItem={addItem}
      updateItem={updateItem}
      removeItem={removeItem}
      loadPreset={loadPreset}
    />
  );
}
