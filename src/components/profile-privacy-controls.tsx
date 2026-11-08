'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { setProfileVisibility } from '~/lib/actions/profile-privacy';

function PublicUsernameField({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  return (
    <div>
      <label htmlFor="public-username" className="mb-2 block text-sm font-medium text-foreground">
        Public username
      </label>
      <input
        id="public-username"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={20}
        disabled={disabled}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        aria-describedby="public-username-help"
        className="min-h-11 w-full rounded-xl border border-border bg-card/40 px-3 text-sm text-foreground"
      />
      <p id="public-username-help" className="mt-2 text-xs text-muted-foreground">
        3–20 lowercase letters, numbers or hyphens.
      </p>
    </div>
  );
}

function ProfilePublicLink({
  confirmed,
  visibility,
  username,
}: {
  confirmed: boolean;
  visibility: 'private' | 'public';
  username: string;
}) {
  if (!confirmed) return null;
  return visibility === 'public' && username ? (
    <Link href={`/u/${username}`} className="inline-block text-sm underline underline-offset-4">
      View your public profile
    </Link>
  ) : (
    <p className="text-sm text-muted-foreground">Your profile is hidden from other people.</p>
  );
}

function ProfilePrivacyIntro() {
  return (
    <div>
      <h2 id="profile-privacy-heading" className="font-serif text-3xl font-medium text-foreground">
        Profile privacy
      </h2>
      <p id="profile-privacy-help" className="mt-2 text-sm leading-relaxed text-muted-foreground">
        A public profile shows your name, bio, creed, website, life grid and the items you choose to
        share. New list items stay private. Notes, steps and progress updates are only for you.
      </p>
    </div>
  );
}

export function ProfilePrivacyControls({
  ownerId,
  initialVisibility,
  username,
}: {
  ownerId: string;
  initialVisibility: 'private' | 'public';
  username: string;
}) {
  const router = useRouter();
  const [selection, setSelection] = useState(initialVisibility);
  const [saved, setSaved] = useState(initialVisibility);
  const [handle, setHandle] = useState(username);
  const [savedHandle, setSavedHandle] = useState(username);
  const [confirmed, setConfirmed] = useState(true);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function save() {
    setError(null);
    setMessage(null);
    setConfirmed(false);
    startTransition(async () => {
      try {
        const result = await setProfileVisibility(
          ownerId,
          selection,
          username ? undefined : handle
        );
        if (!result.success) {
          setError(result.error ?? 'Profile visibility could not be saved.');
          return;
        }
        setSaved(selection);
        setSavedHandle(result.username);
        setConfirmed(true);
        setMessage(selection === 'public' ? 'Your profile is public.' : 'Your profile is private.');
        router.refresh();
      } catch {
        setError('We could not confirm the change. Reload to check your current visibility.');
      }
    });
  }

  return (
    <section aria-labelledby="profile-privacy-heading" className="space-y-4">
      <ProfilePrivacyIntro />
      <label htmlFor="profile-visibility" className="block text-sm font-medium text-foreground">
        Who can see your profile?
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          id="profile-visibility"
          aria-describedby="profile-privacy-help"
          value={selection}
          disabled={pending}
          onChange={(event) => setSelection(event.target.value as 'private' | 'public')}
          className="min-h-11 flex-1 rounded-xl border border-border bg-card/40 px-3 text-sm text-foreground"
        >
          <option value="private">Private — only you</option>
          <option value="public">Public — anyone can visit</option>
        </select>
        <button
          type="button"
          onClick={save}
          disabled={pending || (selection === saved && confirmed)}
          className="min-h-11 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {pending ? 'Saving…' : 'Save profile visibility'}
        </button>
      </div>
      {!username && selection === 'public' ? (
        <PublicUsernameField value={handle} onChange={setHandle} disabled={pending} />
      ) : null}
      <ProfilePublicLink confirmed={confirmed} visibility={saved} username={savedHandle} />
      <p className="text-xs leading-relaxed text-muted-foreground">
        Individually shared timelines keep their own visibility. Change an item’s visibility in My
        list.
      </p>
      {message ? (
        <p role="status" className="text-sm text-foreground">
          {message}
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </section>
  );
}
