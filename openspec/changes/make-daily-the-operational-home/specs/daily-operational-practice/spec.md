## Purpose

Make Daily a calm working surface where journal writing and humane habit check-ins are the primary actions rather than decorative progress reporting.

## ADDED Requirements

### Requirement: Journal and habits lead the Daily hierarchy
The Daily page SHALL place the current journal and today's habits in the first working viewport on common desktop and mobile sizes. Greeting, date, and AM/PM ritual state SHALL remain compact supporting context. A complete chronological journal archive and habit management/tracking SHALL be available from the same surface without becoming top-level navigation.

#### Scenario: Person opens Daily
- **WHEN** a person opens `/daily`
- **THEN** they can begin writing or check a habit without scrolling past a large greeting or progress panel

#### Scenario: Person wants recent context
- **WHEN** a person opens Daily after writing or checking habits on earlier days
- **THEN** they can reach past journal entries and humane habit continuity context without leaving the Daily product area
- **AND** the archive shows the actual saved AM and PM writing rather than only a generated summary

### Requirement: Habit states are immediately understandable
Each habit SHALL expose a clear unchecked state, checked state, and reversible check-in action for the current day without scores or competitive progress. An empty habit list SHALL explain the value of one small repeatable practice and provide a direct add action.
Daily habit rows SHALL read as one calm checklist and SHALL NOT show streaks,
progress bars, weekly completion dots, or other performance decoration.

#### Scenario: Unchecked habit is completed
- **WHEN** a person activates an unchecked habit
- **THEN** the habit visibly becomes checked and can be undone without leaving the page

#### Scenario: Person has no habits
- **WHEN** a person opens Daily with no active habits
- **THEN** a focused empty state offers creation of a first habit and does not show a meaningless zero-percent dashboard

### Requirement: Daily language supports beginning again
The Daily or activation experience SHALL present the line “Today is the first day of the rest of your life” as supportive editorial context, not as a blocking modal or repeated notification.

#### Scenario: Quote is presented
- **WHEN** a person reaches the selected Daily or activation moment
- **THEN** the quote appears legibly and does not displace the primary journal or habit action
