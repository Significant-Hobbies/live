'use client';

import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { authClient } from '~/lib/auth-client';
import { useAccountPresentation } from './use-account-presentation';

import { MobileMenu } from './mobile-menu';
import { NavLinks } from './nav-links';
import { NavSignOut } from './nav-sign-out';

const NAV_LINKS = [
  { href: '/experiences', label: 'Explore' },
  { href: '/bucket-list', label: 'My list' },
  { href: '/journal', label: 'Journal' },
  { href: '/life-in-weeks', label: 'Life in weeks' },
];

export function Nav() {
  const { data: session, isPending } = authClient.useSession();
  const presentation = useAccountPresentation(session?.user.id ?? null);
  const user = session?.user ? { ...session.user, username: null, ...presentation.user } : null;
  const links = NAV_LINKS;

  return (
    <nav data-site-nav className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-4">
        <Link
          href={user ? '/bucket-list' : '/experiences'}
          prefetch={false}
          className="group inline-flex min-h-11 items-center gap-2.5 text-base font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <svg aria-hidden="true" viewBox="0 0 26 26" className="size-[26px]">
            <rect width="26" height="26" rx="7" fill="var(--muted)" />
            <circle cx="13" cy="13" r="6.5" fill="none" stroke="var(--brand)" strokeWidth="2" />
            <circle cx="13" cy="13" r="2.2" fill="var(--brand)" />
          </svg>
          <span>Live</span>
        </Link>

        {/* Desktop nav */}
        {/* lg, not md. The desktop nav needs ~734px of its own, so at exactly 768px
            (Tailwind's md) it rendered and overflowed the viewport by 120px —
            caught by the content-flywheel overflow check on /blog. Labels and
            order are unchanged; only the switch point moves. */}
        <div className="hidden items-center gap-3 lg:flex">
          <div className="flex items-center gap-7">
            <NavLinks links={links} />
          </div>

          {isPending ? (
            <Button
              asChild
              className="h-11 rounded-xl bg-transparent px-5 normal-case text-muted-foreground hover:bg-muted"
            >
              <Link href="/bucket-list" prefetch={false} aria-busy="true">
                Account
                <span role="status" className="sr-only">
                  Checking account…
                </span>
              </Link>
            </Button>
          ) : user ? (
            <DropdownMenu onOpenChange={(open) => open && presentation.refresh()}>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Open account menu"
                  className="flex size-11 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-foreground/30"
                >
                  <Avatar className="h-10 w-10 border-2 border-foreground shadow-[0_2px_8px_color-mix(in_srgb,var(--scrim)_14%,transparent)]">
                    <AvatarImage src={user.image ?? ''} />
                    <AvatarFallback className="bg-foreground/10 text-foreground text-sm">
                      {user.name?.[0] ?? 'U'}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {user.username ? (
                  <DropdownMenuItem asChild>
                    <Link href={`/u/${user.username}`} prefetch={false}>
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/bucket-list" prefetch={false}>
                      My list
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/settings" prefetch={false}>
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <NavSignOut />
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              className="h-11 rounded-xl bg-transparent px-5 normal-case text-muted-foreground hover:bg-muted"
            >
              <Link href="/login" prefetch={false}>
                Sign in
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile nav */}
        <div className="flex items-center gap-2 lg:hidden">
          {user && (
            <DropdownMenu onOpenChange={(open) => open && presentation.refresh()}>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Open account menu"
                  className="flex size-11 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-foreground/30"
                >
                  <Avatar className="h-10 w-10 border-2 border-foreground shadow-[0_2px_8px_color-mix(in_srgb,var(--scrim)_14%,transparent)]">
                    <AvatarImage src={user.image ?? ''} />
                    <AvatarFallback className="bg-foreground/10 text-foreground text-sm">
                      {user.name?.[0] ?? 'U'}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {user.username ? (
                  <DropdownMenuItem asChild>
                    <Link href={`/u/${user.username}`} prefetch={false}>
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/bucket-list" prefetch={false}>
                      My list
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/settings" prefetch={false}>
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <NavSignOut />
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <MobileMenu links={links} isLoggedIn={!!user} accountPending={isPending} />
        </div>
      </div>
    </nav>
  );
}
