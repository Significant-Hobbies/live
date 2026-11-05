import { experienceImage } from '~/lib/experience-images';

export function ExperiencePhoto({
  title,
  category,
  className = '',
  sizes = '(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw',
  eager = false,
  decorative = false,
}: {
  title: string;
  category?: unknown;
  className?: string;
  sizes?: string;
  eager?: boolean;
  decorative?: boolean;
}) {
  const image = experienceImage(title, category);
  if (!image) return null;
  return (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={sizes}
      alt={decorative ? '' : image.alt}
      width={800}
      height={533}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={`object-cover ${className}`}
    />
  );
}
