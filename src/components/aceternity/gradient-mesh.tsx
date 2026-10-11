import { cn } from '~/lib/utils';

interface Props {
  className?: string;
  /** Variant: 'gold' for warm gold/sage mesh, 'sage' for cooler tones. */
  variant?: 'gold' | 'sage';
}

/**
 * Gradient Mesh — subtle radial gradient orbs for premium header backgrounds.
 * Gold + sage radial gradients that sit behind content like a Linear/Stripe
 * hero. Pointer-events-none, purely decorative.
 */
export function GradientMesh({ className, variant = 'gold' }: Props) {
  const orbs =
    variant === 'gold'
      ? [
          {
            background:
              'radial-gradient(circle, color-mix(in srgb, var(--brand) 8%, transparent), transparent 60%)',
            top: '-20%',
            right: '10%',
            size: '400px',
          },
          {
            background:
              'radial-gradient(circle, color-mix(in srgb, var(--success) 6%, transparent), transparent 60%)',
            bottom: '-30%',
            left: '5%',
            size: '350px',
          },
          {
            background:
              'radial-gradient(circle, color-mix(in srgb, var(--brand) 4%, transparent), transparent 50%)',
            top: '20%',
            left: '40%',
            size: '300px',
          },
        ]
      : [
          {
            background:
              'radial-gradient(circle, color-mix(in srgb, var(--success) 8%, transparent), transparent 60%)',
            top: '-20%',
            right: '10%',
            size: '400px',
          },
          {
            background:
              'radial-gradient(circle, color-mix(in srgb, var(--brand) 5%, transparent), transparent 60%)',
            bottom: '-30%',
            left: '5%',
            size: '350px',
          },
        ];

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden="true"
    >
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            background: orb.background,
            top: orb.top,
            right: orb.right,
            bottom: orb.bottom,
            left: orb.left,
            width: orb.size,
            height: orb.size,
          }}
        />
      ))}
    </div>
  );
}
