'use client';

import type { ReactNode } from 'react';
import { motion } from 'motion/react';

import { cn } from '~/lib/utils';

/**
 * Fade In — a wrapper that fades + slides content in when scrolled into view.
 * Replaces the CSS scroll-reveal with spring-based motion for smoother feel.
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  y = 12,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '0px 0px -50px 0px' }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
      data-animated-reveal
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger Container — wraps staggered children for sequential reveal.
 */
export function StaggerContainer({
  children,
  className,
  delay = 0,
  staggerDelay = 0.06,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  as?: 'div' | 'ul';
}) {
  const Component = as === 'ul' ? motion.ul : motion.div;

  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -50px 0px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={cn(className)}
    >
      {children}
    </Component>
  );
}

/**
 * Stagger Item — child of StaggerContainer for sequential reveal.
 */
export function StaggerItem({
  children,
  className,
  y = 12,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  as?: 'div' | 'li';
}) {
  const Component = as === 'li' ? motion.li : motion.div;

  return (
    <Component
      variants={{
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      className={cn(className)}
      data-animated-reveal
    >
      {children}
    </Component>
  );
}
