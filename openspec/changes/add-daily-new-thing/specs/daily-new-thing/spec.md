## Purpose

Pair private journal reflection with one approachable daily invitation to make the day contain something unfamiliar, without turning novelty into another performance metric.

## ADDED Requirements

### Requirement: Daily offers one approachable new thing
The system SHALL show one stable, clearly described new-thing invitation for the person’s current calendar day beside the journal. Suggestions SHALL come from a curated first-party set, SHALL normally fit within one hour, and SHALL not require purchase, travel booking, publication, or another person’s consent.

#### Scenario: First Daily visit of the day
- **WHEN** a person opens Daily and has no stored new-thing choice for the current day
- **THEN** the system shows a deterministic suggestion that stays the same across refreshes

#### Scenario: Return later that day
- **WHEN** the person returns to Daily on the same calendar day
- **THEN** the system shows the same suggestion and its saved completion state

### Requirement: Person can choose another idea
The system SHALL let the person replace today’s suggestion with another eligible idea and SHALL persist the replacement without changing journal writing.

#### Scenario: Replace today’s suggestion
- **WHEN** the person asks for another idea
- **THEN** the system immediately presents a different eligible suggestion, stores it for that day, and leaves the journal unchanged

#### Scenario: Replacement cannot be saved
- **WHEN** persistence fails while replacing an idea
- **THEN** the system restores the previous suggestion and explains that the new choice was not saved

### Requirement: Person can choose their own new thing
The system SHALL let the person replace the suggested activity with a short,
plain-text intention of their own. The custom choice SHALL use the same
completion, restoration, history, and storage behavior as a catalog suggestion.

#### Scenario: Person writes their own intention
- **WHEN** the person enters a non-empty intention and saves it
- **THEN** it becomes today's new thing without changing the journal

#### Scenario: Custom intention is empty or too long
- **WHEN** the person attempts to save blank text or text over the documented limit
- **THEN** the system does not persist it and explains how to correct the input

### Requirement: Completion is reversible and non-scoring
The system SHALL let the person mark today’s suggestion done or not done. The state SHALL create no score, streak, badge, commitment proof, habit log, public activity, or requirement to complete the journal.

#### Scenario: Mark the new thing done
- **WHEN** the person marks today’s suggestion done
- **THEN** the system persists completion, confirms it accessibly, and gently invites reflection without altering journal text

#### Scenario: Restore an accidental completion
- **WHEN** the person marks a completed suggestion not done
- **THEN** the system restores the open state without penalty or data loss

### Requirement: Daily history keeps the lived detail
The system SHALL show a stored new-thing choice and completion state when the person browses the matching day in journal history. Daily SHALL also provide one consolidated, chronological view of completed new things so the person can revisit what they actually did without opening days one at a time.

#### Scenario: Browse a past completed day
- **WHEN** the person selects a past journal day with a completed new thing
- **THEN** the system shows what they did as read-only context beside that day’s writing

#### Scenario: Browse a past day without a stored choice
- **WHEN** the person selects a past journal day that has no stored new-thing record
- **THEN** the system does not invent a historical suggestion or imply that one was completed

#### Scenario: Review completed new things
- **WHEN** the person opens the completed-new-things history in Daily
- **THEN** every stored completed catalog suggestion and every item from a completed custom daily list appears with its date, newest first, without a score or streak

### Requirement: Current storage authority owns the record
The system SHALL persist the daily choice and completion through the application’s current storage mode: browser storage when signed out and owner-scoped D1 data when signed in.

#### Scenario: Signed-out use
- **WHEN** a signed-out person replaces or completes a daily suggestion
- **THEN** the system stores the updated per-day record in the existing local Daily state and restores it after reload

#### Scenario: Signed-in use
- **WHEN** an authenticated person replaces or completes a daily suggestion
- **THEN** the system writes only that owner’s matching calendar-day record in D1
