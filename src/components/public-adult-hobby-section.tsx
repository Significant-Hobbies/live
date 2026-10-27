import Link from 'next/link';
import { FadeIn, SpotlightCard, StaggerContainer, StaggerItem } from './aceternity';
type Hobby = { name: string; desc: string };
function hobbySlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-');
}
export function HobbyCard({ hobby }: { hobby: Hobby }) {
  return (
    <SpotlightCard className="shadow-soft" innerClassName="rounded-lg p-4">
      <div className="flex-1">
        <Link
          href={`/hobbies/${hobbySlug(hobby.name)}`}
          className="font-semibold text-foreground hover:text-foreground transition-colors"
          prefetch={false}
        >
          {hobby.name}
        </Link>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{hobby.desc}</p>
      </div>
    </SpotlightCard>
  );
}

export function AdultHobbySection({
  title,
  hobbies,
  color,
}: {
  title: string;
  hobbies: Hobby[];
  color: string;
}) {
  return (
    <FadeIn className="mb-10">
      <section className="mb-10">
        <h2 className={`text-xl font-bold mb-4 ${color}`}>{title}</h2>
        <StaggerContainer className="space-y-3">
          {hobbies.map((h) => (
            <StaggerItem key={h.name}>
              <HobbyCard hobby={h} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>
    </FadeIn>
  );
}
