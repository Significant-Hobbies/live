import type React from 'react';

interface QuizResultCardProps {
  archetype: string;
  archetypeEmoji: string;
  topCategories: string[];
  recommendedHobbies: string[];
  exportRef?: React.RefObject<HTMLDivElement | null>;
}

export function QuizResultCard({
  archetype,
  archetypeEmoji,
  topCategories,
  recommendedHobbies,
  exportRef,
}: QuizResultCardProps) {
  return (
    <div
      ref={exportRef}
      style={{
        width: '600px',
        height: '400px',
        background: 'var(--card)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        boxShadow: '0 0 60px color-mix(in srgb, var(--success) 8%, transparent)',
        borderRadius: '16px',
        padding: '40px',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Emerald glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 70% 40% at 50% -5%, color-mix(in srgb, var(--success) 18%, transparent) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Branding */}
      <div style={{ position: 'relative' }}>
        <p
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--success)',
            margin: 0,
          }}
        >
          significanthobbies
        </p>
      </div>

      {/* Center: archetype */}
      <div
        style={{
          position: 'relative',
          textAlign: 'center',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
        }}
      >
        <div style={{ fontSize: '72px', lineHeight: 1 }}>{archetypeEmoji}</div>
        <div>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--success)',
              margin: '0 0 6px 0',
            }}
          >
            Your Hobby Archetype
          </p>
          <h2
            style={{
              fontSize: '32px',
              fontWeight: 800,
              color: 'var(--foreground)',
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            {archetype}
          </h2>
        </div>

        {/* Top categories */}
        {topCategories.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {topCategories.map((cat) => (
              <span
                key={cat}
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  color: 'var(--field-green-ink)',
                  background: 'var(--field-green)',
                  border: '1px solid var(--border)',
                  borderRadius: '9999px',
                  padding: '3px 10px',
                }}
              >
                {cat}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Recommended hobby pills */}
      {recommendedHobbies.length > 0 && (
        <div style={{ position: 'relative', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {recommendedHobbies.slice(0, 5).map((hobby) => (
            <span
              key={hobby}
              style={{
                fontSize: '11px',
                color: 'var(--muted-foreground)',
                background: 'var(--muted)',
                border: '1px solid var(--border)',
                borderRadius: '9999px',
                padding: '4px 10px',
              }}
            >
              {hobby}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border)',
          paddingTop: '12px',
          marginTop: '12px',
        }}
      >
        <p style={{ fontSize: '11px', color: 'var(--subtle)', margin: 0 }}>
          live.significanthobbies.com/find-your-hobby
        </p>
        <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--success)', margin: 0 }}>
          Take the quiz →
        </p>
      </div>
    </div>
  );
}
