---
name: Significant Hobbies
description: A life atlas for choosing, living, and remembering what matters.
colors:
  background: "#120e09"
  foreground: "#f7f3e9"
  card: "#1e1812"
  surface: "#17130d"
  muted: "#26211a"
  muted-foreground: "#b7b0a3"
  border: "#3b342a"
  atlas-gold: "#e7bf57"
  brand-foreground: "#1d1409"
  destructive: "#f66d67"
  lived-sage: "#62bb78"
typography:
  display:
    fontFamily: "var(--font-serif), Georgia, serif"
    fontWeight: 500
    letterSpacing: "-0.02em"
  body:
    fontFamily: "var(--font-sans), system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  control: "12px"
  surface: "16px"
spacing:
  tight: "8px"
  group: "16px"
  section: "48px"
components:
  button-primary:
    backgroundColor: "{colors.atlas-gold}"
    textColor: "{colors.brand-foreground}"
    rounded: "{rounded.control}"
    padding: "12px 20px"
---

# Design System: Significant Hobbies

## Overview

**Creative North Star: “The Life Atlas”**

The interface is a map of a finite, inhabited life. Live uses paths, horizons, clusters, and wayfinding to turn possibility into a next move. History uses the same atlas language as chronology: week fields, dated markers, bends in direction, and remembered evidence. The weekly journal is a focused close-up scale of the same world.

**Owner decision, 11 October 2026: dark everywhere.** The public Astro landing and the Next.js app share one warm night canvas, atlas-gold actions with ink text, tonal cards, and quiet borders. Dark is the only theme, independent of system preference; it is the product shell as well as the storytelling space. Keep Geist, Fraunces, and Geist Mono.

## Colors

The canonical roles are background `#120e09` (approximately `oklch(0.165 0.012 72)`), foreground `#f7f3e9`, card `#1e1812`, surface `#17130d`, muted `#26211a`, muted foreground `#b7b0a3`, border `#3b342a`, primary/brand atlas gold `#e7bf57`, brand/primary foreground ink `#1d1409`, destructive `#f66d67`, and growth/sage `#62bb78`. Base radius is `0.75rem`: controls use 12px corners and bounded surfaces 16px.

One palette. Every surface uses the neutral dark family (background, surface, card, muted, border). Atlas gold is reserved for the primary action and the active state (active nav underline, selected segment). No per-section or per-page tints; no indigo, lilac, coral, rust, sky or green panels. Sage is not used for decoration.

The Significant Hobbies Hub renders in its independent repository. Delegated Hub pages and their design are outside this decision's implementation scope here.

Photography is candid, tactile evidence of ordinary adults living: hands making things, friends outdoors, accessible local adventures, natural daylight, real texture, and imperfect motion. Avoid generic stock smiles, luxury travel, staged influencer imagery, and motivational text embedded in images.

## Typography

Display serif gives reflective statements and life chapters gravity. The sans-serif workhorse carries controls, labels, and dense reading. Large type creates landmarks; small uppercase labels are used only for true map notation, not as a universal eyebrow.

## Layout

Primary pages use one dominant spatial field followed by quieter supporting passages. Related content connects through paths, timelines, alignment, and proximity before containers. Equal card grids are avoided unless the objects are genuinely equivalent. Desktop compositions can be asymmetric; mobile preserves the same semantic order as a vertical route.

Live leads with a verb and an immediate invitation. It must make the user want to choose an activity, not admire a planning system. Mortality belongs in History and acts as context, never as the dominant emotional register of the action surface.

The global shell exposes Explore, My list, Journal, and Life in weeks. These reuse the incumbent shell and workspaces. The bucket-list cleanup removes competing steps and navigation without replacing typography, colors, imagery, or layout.

Completion logging stays in My list. There is no Habits page or navigation link; its old URL redirects to My list. The old Daily URL redirects to the weekly journal.

## Elevation & Depth

Depth comes primarily from tonal layers and spatial overlap. Shadows are reserved for selected or floating controls and must have visible offset and soft blur. Wide surfaces do not combine a border with a generic ambient shadow.

## Shapes

Controls use 12px corners and major bounded surfaces use 16px corners. Paths, contour lines, week cells, and circular waypoints provide the characteristic geometry. Pills are reserved for compact status and filter controls.

## Components

### Navigation

The wordmark is the Live ring mark plus 'Live'. Explore, My list, Journal, and Life in weeks are direct links in that order on desktop and mobile. Keep the responsive menu and use a gold underline for the active link.

### Cards / Containers

Containers earn their boundary through interaction or meaningful grouping. Prefer open regions, dividers, map paths, and typographic hierarchy over stacks of bordered rounded rectangles.

### Buttons

Primary actions use atlas gold on night. Secondary actions use quiet tonal surfaces. All actions have explicit labels, visible focus, and at least a 44px touch target.

## Do's and Don'ts

### Do:

- **Do** make mortality concrete without using fear, score, or shame.
- **Do** connect possibilities, present action, and remembered evidence spatially.
- **Do** use real personal content as the visual material of private surfaces.
- **Do** make Live feel sunny, playful, physical, and in motion.
- **Do** keep one weekly journal entry and completion logging in My list.

### Don't:

- **Don't** build pages from a grid of equal cards with icon-heading-description anatomy.
- **Don't** use progress metrics where reflection or simple check-in is the product job.
- **Don't** let decorative gradients, glass, or glow substitute for content and structure.
- **Don't** make the whole product feel like a memorial, archive, or solemn productivity system.
