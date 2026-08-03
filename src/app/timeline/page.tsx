import { redirect } from 'next/navigation';

export const metadata = { title: 'History — SignificantHobbies' };

export default function TimelinePage() {
  redirect('/history#personal-timeline');
}
