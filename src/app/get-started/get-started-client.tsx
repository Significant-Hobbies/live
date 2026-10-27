'use client';
import { useEffect, useRef, useState } from 'react';
import { GetStartedView, type CheckState } from '~/components/public-pages/get-started';
function validateUsername(value: string): string | null {
  if (value.length < 3) return 'At least 3 characters required';
  if (value.length > 20) return 'Maximum 20 characters';
  if (!/^[a-z0-9-]+$/.test(value)) return 'Only lowercase letters, numbers, and hyphens';
  return null;
}

export function GetStartedClient() {
  const [input, setInput] = useState('');
  const [state, setState] = useState<CheckState>('idle');
  const [validationError, setValidationError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setInput(raw);

    if (!raw) {
      setState('idle');
      setValidationError(null);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      return;
    }

    const err = validateUsername(raw);
    if (err) {
      setState('invalid');
      setValidationError(err);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      return;
    }

    setValidationError(null);
    setState('checking');

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/check-username?username=${encodeURIComponent(raw)}`);
        const data = (await res.json()) as { available: boolean; reason: string | null };
        if (data.available) {
          setState('available');
        } else if (data.reason === 'taken') {
          setState('taken');
        } else {
          setState('invalid');
          setValidationError('Invalid username');
        }
      } catch {
        setState('idle');
      }
    }, 500);
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <GetStartedView
      input={input}
      state={state}
      validationError={validationError}
      handleChange={handleChange}
    />
  );
}
