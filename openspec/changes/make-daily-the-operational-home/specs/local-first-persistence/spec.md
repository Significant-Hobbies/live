## ADDED Requirements

### Requirement: Shared profile facts do not use page-specific storage
Private profile facts adopted by multiple surfaces, including date of birth, SHALL use the shared local/account source-of-truth contract rather than an isolated page-specific key. A migrated surface SHALL restore a valid value instead of asking for the same fact again.

#### Scenario: Person revisits a migrated surface
- **WHEN** the active source of truth already contains a valid profile fact required by that surface
- **THEN** the surface uses that value and does not ask the person to re-enter it

#### Scenario: Authentication changes the source of truth
- **WHEN** a local user signs in and account data exists for the same profile fact
- **THEN** the account value remains authoritative and the local value is handled by the safe sign-in handoff

### Requirement: Onboarding domains share the application storage authority
Onboarding drafts and completed name, DOB, remembered hobbies, desired experiences, independent yearly goals, optional initial habit, and Trajectory framing SHALL use the same account/local authority as their destination surfaces. A completed local journey SHALL remain useful across Today, Live More, Daily, and History without requiring sign-in. Soundtrack preferences remain device-local presentation state.

#### Scenario: Local person finishes onboarding
- **WHEN** a signed-out person completes the journey and visits the four canonical surfaces
- **THEN** each surface reads the relevant shared local records rather than isolated onboarding-only values
