## Purpose

Give a person one dependable place to capture and manage every meaningful someday experience without confusing those items with short-term quests.

## ADDED Requirements

### Requirement: One workspace contains all personal bucket-list items
The `/bucket-list` workspace SHALL show all bucket-list items owned by the current person across useful active and completed states and SHALL provide an in-context add action.

#### Scenario: Person has items from multiple sources
- **WHEN** a person opens `/bucket-list` after adding original and discovered items
- **THEN** every owned item is available in the same workspace without visiting separate boards or discovery pages

#### Scenario: Person adds an item
- **WHEN** a person submits a valid new bucket-list item from the workspace
- **THEN** the item appears in the active collection without leaving the workspace

### Requirement: Workspace supports lightweight organization
The workspace SHALL let a person distinguish active ideas from completed items and SHALL support useful filtering or grouping without requiring every item to belong to a board.

#### Scenario: Person reviews completed experiences
- **WHEN** a person chooses the completed view
- **THEN** completed items are shown separately from active someday items while remaining part of the same personal collection

### Requirement: Bucket lists and Side Quests remain distinct
The workspace SHALL explain that bucket-list items are meaningful someday experiences and Side Quests are smaller near-term actions. Converting or decomposing an item into quests MUST preserve the original bucket-list item.

#### Scenario: Person turns an item into smaller steps
- **WHEN** a person creates Side Quests from a bucket-list item
- **THEN** the source item remains in the bucket-list workspace and the resulting quests are treated as separate near-term actions

### Requirement: Today and Live More provide useful bucket-list context
Today SHALL provide one next-item action. Live More SHALL lead with a substantial owned-list overview using real item state, SHALL provide an in-context fast-add action, and SHALL make Side Quests the primary way to move an owned item forward without duplicating the full editor.

#### Scenario: Person has active items
- **WHEN** the authenticated home renders for a person with bucket-list items
- **THEN** Today shows one useful next action and Live More shows a manageable active-list overview linking to `/bucket-list`

#### Scenario: Person expands or acts on the list
- **WHEN** a person opens Live More
- **THEN** they can add another bucket-list item immediately and can ask for a Side Quest based on an existing item before encountering broad discovery

### Requirement: Live More discovery reveals meaningful breadth
The private Live More surface SHALL draw suggestions from the full owned hobby and experience corpus rather than a small static promotional subset. Suggestions SHALL vary across categories and SHALL provide a brief reason they may fit the person's known interests, goals, or constraints when those signals exist.

#### Scenario: Person asks for new possibilities
- **WHEN** a person opens or refreshes Discover new things
- **THEN** they receive a varied set of actionable possibilities from the owned corpus with a readable fit explanation

#### Scenario: Personal signals are sparse
- **WHEN** the person has provided little preference data
- **THEN** discovery shows diverse possibilities and invites lightweight feedback instead of pretending to know the person

### Requirement: Discovery feedback stays in the flow
Each internal discovery suggestion SHALL support saving, dismissing, adding to the bucket list, or starting a Side Quest without requiring navigation to a separate directory. Feedback SHALL remain private and SHALL influence subsequent suggestion selection where supported by the active source of truth.

#### Scenario: Person saves a possibility
- **WHEN** a person adds a suggestion to their bucket list
- **THEN** the owned bucket-list workspace includes it and discovery visibly acknowledges the action without losing the remaining suggestions

#### Scenario: Person dismisses a possibility
- **WHEN** a person dismisses a suggestion
- **THEN** it leaves the current set and the system avoids immediately recommending the same possibility again
