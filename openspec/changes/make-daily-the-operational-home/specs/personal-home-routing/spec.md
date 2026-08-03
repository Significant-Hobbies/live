## Purpose

Give the public product one inspirational role and each authenticated destination one predictable human question.

## ADDED Requirements

### Requirement: Onboarding state determines the root experience
The system SHALL render the public landing at `/` for signed-out visitors without a completed local profile, the local dashboard at `/` for signed-out people with a completed local profile, the private dashboard at `/` for signed-in people with completed onboarding, and `/onboarding` for signed-in people who have not completed onboarding.

#### Scenario: Anonymous root visit
- **WHEN** a visitor without a session or completed local profile requests `/`
- **THEN** the public inspiration experience is rendered

#### Scenario: Local onboarded root visit
- **WHEN** a visitor without a session but with a completed local profile requests `/`
- **THEN** the local dashboard is rendered at `/`

#### Scenario: Authenticated onboarded root visit
- **WHEN** a person with a valid session and completed onboarding requests `/`
- **THEN** the dashboard is rendered at `/`

#### Scenario: Authenticated incomplete root visit
- **WHEN** a person with a valid session but incomplete onboarding requests `/`
- **THEN** the person is sent to `/onboarding`

### Requirement: Public surfaces inspire without exposing private state
Public navigation SHALL prioritize editorial content, possibilities across hobbies, experiences, Bingo, and Side Quests, and explicitly public profiles of notable or opted-in people. It SHALL NOT expose personalized rankings or private planning state.

#### Scenario: Visitor explores possibilities
- **WHEN** an anonymous visitor browses public discovery
- **THEN** they can understand what is possible and see public examples without seeing private user data

### Requirement: Onboarding unlocks the private workspace
Live More, Daily, History, and the dashboard SHALL be available only after the
person completes onboarding in the active storage mode. Before completion, a
signed-out visitor SHALL retain the public landing and public navigation while
a signed-in person SHALL continue at `/onboarding`. Attempts to enter a private
section before completion SHALL route to `/onboarding`.

#### Scenario: Signed-in person has not completed onboarding
- **WHEN** they request Live More, Daily, or History
- **THEN** onboarding is shown before any empty private section

#### Scenario: Signed-out person opens home before onboarding
- **WHEN** they request `/` without a completed local profile
- **THEN** the public landing renders without redirecting to onboarding

#### Scenario: Signed-in person opens home before onboarding
- **WHEN** they request `/` without completed account onboarding
- **THEN** they are sent to `/onboarding`

#### Scenario: Local person completes onboarding
- **WHEN** the local onboarding profile is saved successfully
- **THEN** the private workspace and its navigation become available on that device

#### Scenario: Visitor browses the public site
- **WHEN** onboarding has not been completed
- **THEN** editorial, possibility, manifesto, and public profile pages remain available

### Requirement: Today answers what matters now
The authenticated root dashboard SHALL show finite-time context, one strong quote, today's journal action, current habit to-dos with management access, and one next bucket-list action. It SHALL not reproduce full managers or analytics.

#### Scenario: Returning person opens Today
- **WHEN** a person has DOB, habits, writing, or bucket-list state
- **THEN** the available current actions appear in the first useful viewport with routes to their canonical homes

### Requirement: Four canonical private destinations own the product
The private product SHALL expose the dashboard at `/`, plus `/live-more`, `/daily`, and `/history`. The SH wordmark SHALL link to the dashboard; global section navigation SHALL list only Live More, Daily, and History. `/live-more` SHALL own possibility and future action, `/daily` SHALL own present practice, and `/history` SHALL own autobiographical and directional reflection.

#### Scenario: Person uses global navigation
- **WHEN** the private shell is rendered on desktop or mobile
- **THEN** the SH home control, Live More, Daily, and History are available without Today, Bingo, Side Quests, Timeline, Trajectory, or Dashboard competing as text navigation sections

### Requirement: Legacy overview routes are absent
The unused `/life-plan`, `/look-back`, and `/dashboard` routes SHALL not be maintained. Internal links SHALL use only the canonical private destinations.

#### Scenario: Private navigation is inspected
- **WHEN** a person follows application navigation or an action destination
- **THEN** no legacy overview URL is emitted

### Requirement: Footer is one cohesive public navigation surface
The footer SHALL group public inspiration, mortality and manifesto context,
project links, and legal links inside one readable contained surface. It SHALL
not advertise private workspace sections to a visitor who has not onboarded.

#### Scenario: Footer is rendered
- **WHEN** a page reaches its global footer
- **THEN** its links and attribution appear as one coherent navigation region with readable contrast
