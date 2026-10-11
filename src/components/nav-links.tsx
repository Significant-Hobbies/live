'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinksProps {
  links: { href: string; label: string }[];
}

export function NavLinks({ links }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
        const activeClass =
          link.href === '/bucket-list' || link.href === '/experiences'
            ? 'bg-field-sun text-foreground shadow-[0_2px_0_var(--border)]'
            : link.href === '/journal'
              ? 'bg-field-lilac text-foreground shadow-[0_2px_0_var(--border)]'
              : 'bg-field-sky text-foreground shadow-[0_2px_0_var(--border)]';
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? 'page' : undefined}
            className={`inline-flex min-h-11 items-center rounded-xl px-4 text-base font-semibold transition-[background-color,color,transform,box-shadow] hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              isActive ? activeClass : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}
