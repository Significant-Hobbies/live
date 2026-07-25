'use client';

import { useEffect } from 'react';
import { motion, stagger, useAnimate } from 'motion/react';

import { cn } from '~/lib/utils';

/** Elements a generated headline may render as. */
type HeadingTag = 'div' | 'h1' | 'h2' | 'h3' | 'p' | 'span';

/**
 * Aceternity Text Generate Effect — reveals text word-by-word with a fade+blur
 * animation when scrolled into view. Great for hero headlines.
 *
 * Pass `as` to render a semantic element. It used to be hardcoded to a `div`,
 * which is how eleven SEO landing pages ended up with no `<h1>` at all — the
 * one on-page element those pages most need. `div` stays the default so
 * decorative uses are unaffected.
 */
export function TextGenerateEffect({
  words,
  className,
  filter = true,
  duration = 0.5,
  as = 'div',
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  as?: HeadingTag;
}) {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(' ');
  const Tag = motion[as] as typeof motion.div;

  useEffect(() => {
    animate(
      'span',
      {
        opacity: 1,
        filter: filter ? 'blur(0px)' : 'none',
      },
      {
        duration: duration,
        delay: stagger(0.08),
      }
    );
  }, [scope.current]);

  return (
    <Tag ref={scope} className={cn('font-serif', className)}>
      {wordsArray.map((word, idx) => (
        <motion.span
          key={word + idx}
          className="opacity-0"
          style={{
            filter: filter ? 'blur(8px)' : 'none',
          }}
        >
          {word}{' '}
        </motion.span>
      ))}
    </Tag>
  );
}
