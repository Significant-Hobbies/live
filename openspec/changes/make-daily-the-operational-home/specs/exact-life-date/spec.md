## Purpose

Use a person's exact date of birth to make Life in Weeks more accurate, durable, and usable without requiring an account.

## ADDED Requirements

### Requirement: Life in Weeks accepts an exact date of birth
Life in Weeks SHALL accept a calendar date rather than only a birth year, SHALL reject future or invalid dates, and SHALL calculate elapsed time from that exact date through the current local date.

#### Scenario: Valid date is entered
- **WHEN** a person submits a valid past date of birth
- **THEN** elapsed weeks and derived remaining-time framing are recalculated from that date

#### Scenario: Future date is entered
- **WHEN** a person submits a date after the current local date
- **THEN** the system explains the validation problem and retains the editable input

### Requirement: Date of birth follows the active source of truth
The system SHALL save and restore the date of birth through the application-wide storage mode. Anonymous people SHALL use validated local storage and authenticated people SHALL use their owner-scoped account data when that domain is available.

#### Scenario: Anonymous person returns
- **WHEN** an anonymous person saves a valid date of birth and returns in the same browser
- **THEN** Life in Weeks restores the date without asking for it again

#### Scenario: Stored date is invalid
- **WHEN** a stored date is malformed or outside the supported range
- **THEN** it is not used for mortality calculations and the person is asked for a valid date

#### Scenario: Onboarding already captured a valid date
- **WHEN** the person later opens Today, History, or Life in Weeks
- **THEN** each surface uses the shared valid date without requesting it again

### Requirement: Mortality framing is explicitly non-predictive
Life in Weeks SHALL describe remaining-time figures as population framing rather than an individual prediction and SHALL keep the lived-week calculation distinct from estimated remaining time.

#### Scenario: Results are shown
- **WHEN** a valid date produces the Life in Weeks view
- **THEN** the interface distinguishes exact lived time from the non-predictive population estimate
