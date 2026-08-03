## ADDED Requirements

### Requirement: Unknown paths remain useful
The system SHALL render a branded, readable 404 that clearly explains the dead
end and offers direct routes to home, hobby discovery, and experience ideas.

#### Scenario: Visitor opens an unknown URL
- **WHEN** no route or public record matches the request
- **THEN** the response shows Life Atlas wayfinding without exposing private state

### Requirement: Every canonical hobby owns a detail page
Every hobby in the canonical catalog SHALL map to one unique
`/hobbies/[slug]` URL and SHALL resolve through the shared hobby detail page.

#### Scenario: Catalog grows
- **WHEN** a hobby is added to a canonical category
- **THEN** static parameters include its unique slug without a hand-authored page file
