## MODIFIED Requirements

### Requirement: Completed onboarding creates a lightweight private timeline and leads home
The system SHALL turn remembered-hobby answers into a lightweight private personal timeline, SHALL make the dashboard the primary destination after onboarding, and SHALL keep publication as a separate explicit later action from History. Onboarding SHALL NOT expose answers in the URL.

#### Scenario: Onboarding hobby is available
- **WHEN** a user completes onboarding after naming remembered hobbies
- **THEN** Today shows relevant current context and History contains a private timeline starting point

#### Scenario: Hobby was skipped
- **WHEN** a user completes onboarding without naming a hobby
- **THEN** Today and History present a focused timeline-start action without publishing or forcing a template chooser
