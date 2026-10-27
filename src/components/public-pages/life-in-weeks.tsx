import type { FormEvent } from 'react';
export function LifeInWeeksIntro() {
  return (
    <>
      {' '}
      <h1
        className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl"
        style={{ textWrap: 'balance', lineHeight: 1.12 }}
      >
        Your life, in weeks.
      </h1>
      <p className="mt-5 max-w-[62ch] text-lg text-muted-foreground" style={{ lineHeight: 1.6 }}>
        One square for every week you have lived, and every week people your age tend to have left.
        Your exact date makes the lived weeks precise. The estimate ahead is population context, not
        a prediction.
      </p>
    </>
  );
}
export function BirthDateForm({
  raw,
  hasResult,
  invalid,
  onSubmit,
  setRaw,
  setInvalid,
  setEditingBirthDate,
}: {
  raw: string;
  hasResult: boolean;
  invalid: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  setRaw: (value: string) => void;
  setInvalid: (value: boolean) => void;
  setEditingBirthDate: (value: boolean) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="mt-10">
      <label htmlFor="birth-date" className="block font-serif text-2xl text-foreground sm:text-3xl">
        {hasResult ? 'Change your birth date' : 'What date were you born?'}
      </label>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <input
          id="birth-date"
          name="birthDate"
          type="date"
          autoComplete="bday"
          value={raw}
          onChange={(event) => {
            setRaw(event.target.value);
            setInvalid(false);
          }}
          aria-invalid={invalid}
          aria-describedby={invalid ? 'birth-date-error' : undefined}
          className="min-w-64 rounded-xl border-2 border-border bg-card px-4 py-3 font-mono text-xl tabular-nums text-foreground focus-visible:border-primary focus-visible:outline-none"
        />
        <button
          type="submit"
          className="min-h-12 rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:outline-none"
        >
          {hasResult ? 'Update' : 'Show me'}
        </button>
        {hasResult ? (
          <button
            type="button"
            onClick={() => {
              setEditingBirthDate(false);
              setInvalid(false);
            }}
            className="min-h-12 px-3 text-sm font-semibold text-muted-foreground underline underline-offset-4"
          >
            Cancel
          </button>
        ) : null}
      </div>

      {invalid ? (
        <p id="birth-date-error" role="alert" className="mt-3 text-base text-destructive">
          Choose a real date in the past.
        </p>
      ) : null}
    </form>
  );
}
