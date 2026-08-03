## Purpose

Turn first use into a resumable past-to-future-to-present journey that creates meaningful private state and explains the four product destinations.

## ADDED Requirements

### Requirement: Onboarding begins with editable identity and exact date of birth
Onboarding SHALL prefill the account name when available, SHALL allow it to be edited, SHALL ask local users for a name, and SHALL capture a validated exact date of birth through the active source of truth.

#### Scenario: Google account provides a name
- **WHEN** an authenticated person begins onboarding with a provider name
- **THEN** the name is prefilled but remains editable before completion

### Requirement: Onboarding creates emotional context without trapping the person
The journey SHALL include a short quote or visual moment about living deliberately. It SHALL remain understandable without sound, be compatible with reduced motion, and provide an accessible visible YouTube player with multiple upbeat song choices, an autoplay attempt, a manual-play fallback, and a stop action.

#### Scenario: Browser blocks autoplay
- **WHEN** the onboarding song cannot begin because of browser autoplay policy
- **THEN** onboarding remains usable and a clear manual play action is available

### Requirement: Onboarding moves from past to future to present
The journey SHALL help a person name hobbies they used to or currently practice, search at least 5,000 distinct curated or structured paths, paste a numbered personal list, preserve all selected or freely entered possibilities up to the stated onboarding limit, independently define one or more goals for the current year, optionally borrow a bucket item as a goal, optionally define a daily habit, and establish an initial Trajectory. The yearly goals SHALL collectively form Trajectory intent. It SHALL NOT require monthly planning or a habit for an episodic goal.

#### Scenario: Person completes activation
- **WHEN** a person finishes the journey
- **THEN** their private timeline, bucket-list possibilities, yearly goals, optional habit, DOB, and available Trajectory framing populate the relevant canonical surfaces

### Requirement: Inspiration precedes capture
Past-hobby capture SHALL show sample public profiles or timelines, and future-experience capture SHALL show varied recommendations from the complete owned corpus before requiring personal input.

#### Scenario: Person does not know what to enter
- **WHEN** a person reaches the past or future capture stage without an answer
- **THEN** they can use visible examples or recommendations to make a selection without leaving onboarding

#### Scenario: Person enters several personal possibilities
- **WHEN** a person adds multiple free-entry bucket-list possibilities
- **THEN** every added possibility remains visible and selectable as a yearly goal rather than only the first entry being represented

#### Scenario: Person has a goal outside the bucket list
- **WHEN** a person enters a yearly goal that is not one of their bucket-list possibilities
- **THEN** the independent goal is preserved and contributes to Trajectory intent without being added to the bucket list

### Requirement: The journey is navigable and durable
Onboarding SHALL show progress, preserve valid answers when moving backward or reloading, provide Back where applicable, permit optional prompts to be skipped, and use responsive controls with at least 44px targets.

#### Scenario: Mobile draft is resumed
- **WHEN** a person returns to onboarding on the same device after leaving mid-journey
- **THEN** the last valid step and answers are restored in a usable mobile layout

### Requirement: Completion is idempotent and private
Completion SHALL write through the authenticated account or shared local source of truth, SHALL deduplicate retried initial records, SHALL keep created content private, and SHALL land on `/`.

#### Scenario: Completion is submitted twice
- **WHEN** a network retry or repeated activation submits the same completed journey
- **THEN** the person has one intended initial set of records and reaches Today at `/`
