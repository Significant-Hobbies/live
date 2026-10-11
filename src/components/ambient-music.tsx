'use client';

import { ChevronDown, Music, SlidersHorizontal, Square } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const SOUNDTRACK_STORAGE_KEY = 'significant-hobbies:soundtrack:v2';

export const YOUTUBE_TRACKS = {
  springtime: {
    label: 'Springtime',
    artist: 'Vlad Gluschenko',
    mood: 'Bright, warm, ready to begin',
    youtubeId: 'cFTaVq5htGs',
  },
  lights: {
    label: 'Lights',
    artist: 'Ikson',
    mood: 'Sunny, open, quietly energetic',
    youtubeId: 'bqk80OOCxOQ',
  },
  monogatari: {
    label: 'Monogatari',
    artist: 'Piki',
    mood: 'Playful, curious, moving forward',
    youtubeId: '5dMPH8W_K_M',
  },
} as const;

export type YoutubeTrackId = keyof typeof YOUTUBE_TRACKS;

export type SoundtrackPreferences = {
  trackId: YoutubeTrackId;
  enabled: boolean;
};

export function normalizeSoundtrackPreferences(value: unknown): SoundtrackPreferences | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Partial<SoundtrackPreferences>;
  const trackId =
    typeof candidate.trackId === 'string' && candidate.trackId in YOUTUBE_TRACKS
      ? (candidate.trackId as YoutubeTrackId)
      : 'springtime';

  return { trackId, enabled: candidate.enabled === true };
}

export function getYoutubeEmbedUrl(trackId: YoutubeTrackId) {
  const videoId = YOUTUBE_TRACKS[trackId].youtubeId;
  const parameters = new URLSearchParams({
    autoplay: '1',
    controls: '1',
    loop: '1',
    playlist: videoId,
    playsinline: '1',
    rel: '0',
  });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${parameters.toString()}`;
}

function readPreferences() {
  try {
    const stored = window.localStorage.getItem(SOUNDTRACK_STORAGE_KEY);
    return stored ? normalizeSoundtrackPreferences(JSON.parse(stored)) : null;
  } catch {
    return null;
  }
}

function writePreferences(preferences: SoundtrackPreferences) {
  try {
    window.localStorage.setItem(SOUNDTRACK_STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    // The player remains usable when storage is unavailable.
  }
}

/** A compact, visible YouTube player for the reflective parts of the product. */
export function AmbientMusic({
  autoPlay = false,
  className = '',
}: {
  autoPlay?: boolean;
  className?: string;
}) {
  const pathname = usePathname();
  const [trackId, setTrackId] = useState<YoutubeTrackId>('springtime');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);
  const playerRef = useRef<HTMLDivElement | null>(null);
  const track = YOUTUBE_TRACKS[trackId];

  function play() {
    setIsPlaying(true);
    setPlayerOpen(true);
    writePreferences({ trackId, enabled: true });
  }

  function stop() {
    setIsPlaying(false);
    writePreferences({ trackId, enabled: false });
  }

  function chooseTrack(nextTrackId: YoutubeTrackId) {
    setTrackId(nextTrackId);
    setIsPlaying(true);
    setPlayerOpen(true);
    writePreferences({ trackId: nextTrackId, enabled: true });
  }

  useEffect(() => {
    const preferences = readPreferences() ?? { trackId: 'springtime' as const, enabled: true };
    setTrackId(preferences.trackId);

    if (autoPlay && preferences.enabled) {
      const autoplayTimer = window.setTimeout(() => {
        setIsPlaying(true);
        setPlayerOpen(true);
      }, 650);
      return () => window.clearTimeout(autoplayTimer);
    }
  }, [autoPlay, pathname]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!isPlaying && playerRef.current && !playerRef.current.contains(event.target as Node)) {
        setPlayerOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsPlaying(false);
        setPlayerOpen(false);
        writePreferences({ trackId, enabled: false });
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying, trackId]);

  return (
    <div ref={playerRef} className={`relative ${className}`}>
      <div
        className={`inline-flex min-h-11 items-stretch overflow-hidden rounded-full border shadow-[0_3px_0_color-mix(in_srgb,var(--scrim)_8%,transparent)] transition-colors ${
          isPlaying
            ? 'border-brand/45 bg-field-sun text-muted-foreground'
            : 'border-border bg-card/95 text-muted-foreground'
        }`}
      >
        <button
          type="button"
          onClick={isPlaying ? stop : play}
          className="inline-flex min-h-11 items-center gap-2.5 px-3.5 py-2 text-xs font-semibold transition-colors hover:bg-scrim/[0.035] focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
          aria-label={isPlaying ? `Stop ${track.label}` : `Play ${track.label} by ${track.artist}`}
          aria-pressed={isPlaying}
        >
          {isPlaying ? (
            <span className="flex h-4 w-4 items-end justify-center gap-0.5" aria-hidden="true">
              <span className="h-2 w-0.5 animate-pulse rounded-full bg-current motion-reduce:animate-none" />
              <span className="h-3.5 w-0.5 animate-pulse rounded-full bg-current [animation-delay:180ms] motion-reduce:animate-none" />
              <span className="h-2.5 w-0.5 animate-pulse rounded-full bg-current [animation-delay:360ms] motion-reduce:animate-none" />
            </span>
          ) : (
            <Music className="h-4 w-4" aria-hidden="true" />
          )}
          <span>{isPlaying ? track.label : 'Play music'}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            if (playerOpen) {
              stop();
              setPlayerOpen(false);
            } else {
              setPlayerOpen(true);
            }
          }}
          className="inline-flex min-h-11 w-10 items-center justify-center border-l border-current/15 transition-colors hover:bg-scrim/[0.035] focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
          aria-label="Choose music"
          aria-expanded={playerOpen}
          aria-controls="soundtrack-player"
        >
          {playerOpen ? (
            <ChevronDown className="h-4 w-4 rotate-180" aria-hidden="true" />
          ) : (
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {playerOpen ? (
        <div
          id="soundtrack-player"
          role="dialog"
          aria-label="Music player"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[min(16.5rem,calc(100vw-1.5rem))] rounded-2xl bg-card p-2.5 text-foreground shadow-[0_12px_30px_color-mix(in_srgb,var(--scrim)_18%,transparent)] ring-1 ring-ring"
        >
          <div className="flex min-h-10 items-center justify-between gap-3 px-1 pb-2">
            <p className="font-serif font-medium tracking-[-0.02em]">
              {track.label}{' '}
              <span className="font-sans text-xs text-muted-foreground">· {track.artist}</span>
            </p>
            {isPlaying ? (
              <button
                type="button"
                onClick={stop}
                className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl px-2 text-xs font-bold hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <Square className="size-3 fill-current" aria-hidden="true" /> Stop
              </button>
            ) : null}
          </div>

          {isPlaying ? (
            <iframe
              key={track.youtubeId}
              title={`${track.label} by ${track.artist}`}
              src={getYoutubeEmbedUrl(trackId)}
              className="aspect-video w-full rounded-xl bg-surface"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={play}
              className="flex aspect-video w-full flex-col items-center justify-center rounded-xl bg-primary px-5 text-center text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              <Music className="mb-2 size-6 text-brand" aria-hidden="true" />
              <span className="font-bold">Play {track.label}</span>
              <span className="mt-1 text-xs text-muted-foreground">by {track.artist}</span>
            </button>
          )}

          <div className="mt-2 grid grid-cols-3 gap-1" role="radiogroup" aria-label="Choose a song">
            {(Object.keys(YOUTUBE_TRACKS) as YoutubeTrackId[]).map((id) => {
              const option = YOUTUBE_TRACKS[id];
              const selected = id === trackId;
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => chooseTrack(id)}
                  title={`${option.artist} · ${option.mood}`}
                  className={`min-h-11 min-w-0 rounded-xl px-1.5 text-center text-[11px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                    selected ? 'bg-field-sun' : 'hover:bg-muted'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <p className="px-1 pt-2 text-[10px] leading-4 text-muted-foreground">
            YouTube · If autoplay pauses, tap the video once.
          </p>
        </div>
      ) : null}
    </div>
  );
}
