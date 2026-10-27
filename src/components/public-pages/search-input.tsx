import { Search } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { Input } from '~/components/ui/input';
export function PublicSearchInput({
  value,
  handleChange,
}: {
  value: string;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
      <Input
        value={value}
        onChange={handleChange}
        placeholder="Search timelines, people, hobbies..."
        className="h-12 border-border bg-card pl-10 text-base placeholder:text-subtle"
        autoFocus
      />
    </div>
  );
}
