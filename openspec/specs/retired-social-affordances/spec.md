# retired-social-affordances Specification

## Purpose
TBD - created by archiving change retire-silent-social-affordances. Update Purpose after archive.
## Requirements
### Requirement: Public profiles do not promise follow relationships
The system SHALL present public profiles without follow controls, follower
counts, or active follow-state reads. Existing profile sharing and owner
actions SHALL remain available.

#### Scenario: Visitor opens another person's profile
- **WHEN** a signed-in or signed-out visitor opens a public user profile
- **THEN** the profile shows the person's public artifacts without a Follow action or follower count

#### Scenario: Owner opens their profile
- **WHEN** an owner opens their own public profile
- **THEN** the profile retains its edit, create, visibility, and share actions without social relationship metrics

### Requirement: Public timelines do not accept or display reactions
The system SHALL present canonical and legacy timeline routes without like or
comment controls, counts, lists, or active reaction-state reads. Timeline
sharing, comparison, export, visibility, and owner editing SHALL remain
available according to their existing authorization rules.

#### Scenario: Visitor opens a public timeline
- **WHEN** a visitor opens a public or otherwise authorized timeline
- **THEN** the timeline renders its hobby journey and existing artifact actions without likes or comments

#### Scenario: Owner opens a private timeline
- **WHEN** an owner opens their private timeline
- **THEN** the owner controls and timeline content remain available without social controls

### Requirement: Explore ranks artifacts without engagement data
The system SHALL build Explore from public timeline content and update metadata
without reading likes. Explore SHALL NOT offer engagement counts or a
most-liked sort.

#### Scenario: Public timelines exist
- **WHEN** Explore loads one or more public timelines
- **THEN** cards and summary metrics use phases, hobbies, spans, and update times rather than like data

#### Scenario: Visitor chooses a sort
- **WHEN** a visitor selects an Explore sort option
- **THEN** the available options are limited to all, phase count, hobby count, and recency

### Requirement: Retired social data remains preserved
The system MUST retain the `Like`, `Comment`, and `Follow` schema declarations
and existing rows while runtime readers and writers remain retired. This change
MUST NOT generate or apply a destructive data migration.

#### Scenario: Runtime retirement ships
- **WHEN** the social affordance retirement is released
- **THEN** no active route or action reads or writes the retired tables while their schema declarations remain unchanged

#### Scenario: Schema tooling runs later
- **WHEN** a future migration is generated from the application schema
- **THEN** this retirement alone does not propose dropping the retired social tables

