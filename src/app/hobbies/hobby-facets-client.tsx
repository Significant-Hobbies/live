'use client';
import { useState } from 'react';
import { HobbyFacetsView } from '~/components/public-pages/hobby-facets';
import type { HobbyFacet } from '~/lib/hobbies';
export function HobbyFacetsClient() {
  const [selected, setSelected] = useState<HobbyFacet[]>([]);
  function toggle(facet: HobbyFacet) {
    setSelected((previous) =>
      previous.includes(facet) ? previous.filter((value) => value !== facet) : [...previous, facet]
    );
  }
  return <HobbyFacetsView selected={selected} toggle={toggle} setSelected={setSelected} />;
}
