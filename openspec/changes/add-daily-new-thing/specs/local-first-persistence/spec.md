## ADDED Requirements

### Requirement: Daily novelty follows the Daily storage authority
The system SHALL store signed-out daily novelty choices and completion states inside the versioned local Daily domain and SHALL include them in the same deliberate, idempotent account-import boundary as private journal and habit data.

#### Scenario: Local Daily restoration
- **WHEN** a signed-out person changes or completes a new-thing invitation and reloads Daily
- **THEN** the choice and completion state are restored from the local Daily record with the journal and habits

#### Scenario: Account import
- **WHEN** a newly authenticated owner approves importing local Daily work
- **THEN** each local novelty record is associated with its matching owner/day without duplicating or overwriting newer account data
