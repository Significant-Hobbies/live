'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { NavLinks } from './nav-links';

interface MobileMenuProps {
  links: { href: string; label: string }[];
  isLoggedIn: boolean;
}

export function MobileMenu({ links, isLoggedIn }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-site-menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" strokeWidth={2.5} />}
      </button>

      {open && (
        <div
          id="mobile-site-menu"
          className="absolute left-0 top-16 z-50 w-full border-b border-border bg-background"
        >
          <div className="flex flex-col gap-2 px-4 py-4">
            <NavLinks links={links} mobile onNavigate={() => setOpen(false)} />
            <div className="my-1 border-t border-border" />
            {isLoggedIn ? (
              <Link
                href="/settings"
                prefetch={false}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center justify-center rounded-xl bg-muted px-4 text-center text-base text-foreground"
              >
                Account settings
              </Link>
            ) : (
              <Link
                href="/login"
                prefetch={false}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center justify-center rounded-xl bg-muted px-4 text-center text-base text-foreground"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
