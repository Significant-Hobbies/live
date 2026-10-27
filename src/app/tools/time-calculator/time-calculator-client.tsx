'use client';
import { useState } from 'react';
import {
  TimeCalculatorView,
  timeCalculatorDefaults,
} from '~/components/public-pages/time-calculator';
export function TimeCalculatorClient() {
  const [values, setValues] = useState<Record<string, number>>(timeCalculatorDefaults);
  return (
    <TimeCalculatorView
      values={values}
      handleChange={(id, value) => setValues((previous) => ({ ...previous, [id]: value }))}
    />
  );
}
