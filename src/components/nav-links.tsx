'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinksProps {
  links: { href: string; label: string }[];
  onNavigate?: () => void;
  mobile?: boolean;
}

export function NavLinks({ links, onNavigate, mobile = false }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const isActive =
          pathname === link.href ||
          pathname.startsWith(`${link.href}/`) ||
          (link.href === '/experiences' && pathname === '/explore');
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? 'page' : undefined}
            prefetch={false}
            onClick={onNavigate}
            className={`inline-flex items-center border-b-2 ${mobile ? 'min-h-14 text-base' : 'min-h-16 text-sm'} focus-visible:ring-2 focus-visible:ring-ring ${isActive ? 'border-brand text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}
