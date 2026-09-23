---
trigger: always_on
---

# TrafficPulse Project Rules

## Project Role

TrafficPulse is a hackathon project for Hack Devengers.

Obsidian is the project's knowledge base and permanent project memory.

The active project folder contains the TrafficPulse Obsidian vault and implementation files.

## Source of Truth

Before implementing a feature, inspect the relevant TrafficPulse notes in:

- 02-Research
- 03-Product
- 04-Architecture
- 05-Decisions
- 06-Build

Do not invent project decisions that already exist in these notes.

If research and implementation conflict, report the conflict instead of silently choosing one.

## Build Philosophy

Follow:

Research → Evidence → Decision → Architecture → Build → Verify

During the hackathon:

Build → Verify → Update Research → Improve

Do not unnecessarily block implementation while research is still being completed.

## Data Integrity

Never represent simulated data as live data.

Clearly label:
- simulated data
- mock data
- demo data
- estimated data

When using an external data source, preserve its provenance.

Do not let AI become the source of truth for:
- coordinates
- traffic measurements
- ETA
- route cost
- freshness
- source reliability

## Architecture

Keep the system city-agnostic.

City-specific differences should be isolated through configuration/adapters where practical.

Separate:
- ingestion
- normalization
- validation
- data fusion
- mobility state
- routing
- AI
- presentation

Prefer simple and reliable implementations suitable for a 24-hour hackathon.

## Verification

After implementing a feature:

1. Run the relevant checks/tests.
2. Verify the feature in the browser when applicable.
3. Check error states.
4. Check loading states.
5. Check responsive behaviour where relevant.
6. Report exactly what was changed.
7. Report what was verified.
8. Report anything still unresolved.

Never claim a feature is working without verification.

## File Safety

Do not delete or rewrite major project areas unnecessarily.

Inspect existing code before replacing it.

Preserve existing functionality unless the task explicitly requires changing it.

## Obsidian Synchronization

Important discoveries, architectural changes, decisions, blockers, and verified implementation facts should eventually be recorded in the appropriate Obsidian note.

Do not create duplicate research documents when an existing note is appropriate.

## Communication

When reporting work, use:

### Changed
- ...

### Verified
- ...

### Not Verified / Remaining
- ...

### Suggested Next Step
- ...
