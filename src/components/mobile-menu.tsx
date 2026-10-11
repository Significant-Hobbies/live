'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface MobileMenuProps {
  links: { href: string; label: string }[];
  isLoggedIn: boolean;
}

export function MobileMenu({ links, isLoggedIn }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

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
        className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-[0_3px_0_var(--border)] transition-transform hover:-translate-y-0.5"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-site-menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" strokeWidth={2.5} />}
      </button>

      {open && (
        <div
          id="mobile-site-menu"
          className="absolute left-0 top-[4.5rem] z-50 w-full border-b border-border bg-card shadow-[0_16px_32px_color-mix(in_srgb,var(--scrim)_14%,transparent)]"
        >
          <div className="flex flex-col gap-2 px-4 py-4">
            {links.map((link) => {
              const isActive = pathname === link.href;
              const colorClass =
                link.href === '/'
                  ? 'bg-card text-foreground border border-border'
                  : link.href === '/experiences' || link.href === '/bucket-list'
                    ? 'bg-field-sun text-foreground'
                    : link.href === '/journal'
                      ? 'bg-field-lilac text-foreground'
                      : 'bg-field-sky text-foreground';
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  className={`flex min-h-14 items-center justify-between rounded-xl px-4 text-lg font-bold transition-transform hover:translate-x-1 ${colorClass}`}
                >
                  <span>{link.label}</span>
                  <span aria-hidden="true">{isActive ? '●' : '→'}</span>
                </Link>
              );
            })}
            <div className="my-1 border-t border-border" />
            {isLoggedIn ? (
              <Link
                href="/settings"
                prefetch={false}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center justify-center rounded-xl bg-primary px-4 text-center text-base font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Account settings
              </Link>
            ) : (
              <Link
                href="/login"
                prefetch={false}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center justify-center rounded-xl bg-primary px-4 text-center text-base font-bold text-primary-foreground transition-colors hover:bg-primary/90"
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
