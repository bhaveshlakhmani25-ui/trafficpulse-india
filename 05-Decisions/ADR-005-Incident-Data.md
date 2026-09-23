# ADR-005 — Incident Data Strategy

## Status

🟡 PENDING

---

## Decision

How will TrafficPulse detect, validate, update, and
expire mobility incidents across Indian cities?

---

## Context

Incidents are one of the most important dynamic inputs
for TrafficPulse.

Relevant incidents include:

- Accidents
- Waterlogging
- Road closures
- Construction
- Vehicle breakdowns
- Road hazards
- Major events
- Public-transport disruptions

The system should not treat every report as equally
reliable.

TrafficPulse therefore requires:

- Multiple incident sources
- Validation
- Confidence
- Freshness
- Incident lifecycle management
- Source provenance
- Fallback mechanisms

---

# 1. Requirements

The incident strategy should ideally provide:

- Current incidents
- Geographic location
- Incident type
- Severity
- Timestamp
- Status
- Source
- Confidence
- Freshness
- Affected road/network area

---

# 2. Government / Open Data

Government and open-data platforms provide
historical and statistical road-accident information.

Potential uses:

- Historical accident patterns
- Risk baselines
- Hotspot analysis
- Model calibration
- Long-term mobility analysis

### Limitation

Historical accident datasets should not be treated
as current live incident feeds.

### TrafficPulse role

🟢 Historical/contextual intelligence

🔴 Not established as a nationwide live incident source

### Status

🟡 Supporting source

---

# 3. Official City / Traffic Sources

Potential sources include:

- Traffic police systems
- Municipal systems
- Smart-city systems
- Transport authorities
- Official emergency / road-management feeds

### Potential strengths

- Local relevance
- Official information
- Potentially high-confidence incidents

### Limitations

- Availability varies by city
- APIs may not be public
- Some systems may require authorization
- Data formats may differ

### Status

🟡 City-specific source category

---

# 4. Crowdsourced / Partner Incident Sources

Potential examples include:

- Waze partner data
- Commercial mobility providers
- Verified crowd reports
- User reports

### Potential strengths

- Near-real-time information
- Large geographic coverage
- Multiple incident categories
- High-frequency updates

### Limitations

- Access may require partnership
- Licensing may apply
- Reliability varies by source
- Not every report is independently verified

### TrafficPulse role

Potential live incident signal where permitted and
accessible.

### Status

🟡 Candidate

---

# 5. Operator Reports

TrafficPulse should allow authorized operators
to create incidents manually.

Example:

```text
Incident Type:
Accident

Location:
Major Corridor

Severity:
HIGH

Description:
Multi-vehicle collision

Timestamp:
18:40
```

The report enters the validation lifecycle.

---

# 6. User Reports

A future commuter interface may allow users
to report:

- Accident
- Waterlogging
- Road obstruction
- Crowd surge
- Road closure

User reports should initially receive lower
confidence until corroborated.

---

# 7. Incident Normalization

Regardless of source, TrafficPulse should normalize
incident information into a common structure.

Conceptual model:

```text
incident_id
type
location
severity
description
reported_at
updated_at
source_id
confidence
status
expires_at
evidence_type
```

This is a conceptual model and may change during
implementation.

---

# 8. Incident Validation

Incoming incidents should pass through validation.

Possible checks:

- Valid location
- Valid timestamp
- Supported incident type
- Source reliability
- Duplicate detection
- Expiration check
- Contradictory-source check
- Supporting traffic evidence
- Supporting user/operator reports

---

# 9. Multi-Source Confirmation

Example:

```text
Source A:
Accident reported

+

Source B:
Traffic speed decreases

+

Source C:
Second independent report

        ↓

Higher confidence
```

Opposing evidence should reduce confidence
or trigger further validation.

---

# 10. Incident Confidence

Confidence should be based on evidence quality.

Possible contributing signals:

- Official source
- Multiple independent reports
- Recent timestamp
- Traffic deterioration
- Source reliability
- Confirmation by operator
- Supporting sensor information

Confidence should NOT automatically be treated
as an ML probability.

---

# 11. Incident Lifecycle

Every incident should follow a lifecycle:

```text
REPORTED
    ↓
VALIDATING
    ↓
CONFIRMED
    ↓
ACTIVE
    ↓
RESOLVED
    ↓
EXPIRED
```

### REPORTED

A source has submitted an incident.

### VALIDATING

TrafficPulse is checking evidence.

### CONFIRMED

Evidence is sufficient for higher-confidence use.

### ACTIVE

The incident is currently affecting mobility.

### RESOLVED

The source or operator confirms that the
incident is no longer active.

### EXPIRED

The incident has exceeded its validity window
without sufficient fresh evidence.

---

# 12. Incident Severity

Suggested categories:

### LOW

Limited mobility effect.

### MEDIUM

Noticeable local disruption.

### HIGH

Significant disruption to nearby mobility.

### CRITICAL

Major network-level disruption.

The exact thresholds must be validated during
implementation.

---

# 13. Geographic Impact

An incident should not only exist as a point.

TrafficPulse should estimate its affected area.

```text
Incident
↓
Nearest road segment
↓
Affected road
↓
Nearby road network
↓
Potential congestion impact
↓
Transit / crowd impact
↓
Hotspot impact
```

---

# 14. Incident → Traffic Impact

Example:

```text
Accident
↓
Road capacity decreases
↓
Traffic speed deteriorates
↓
Travel time increases
↓
Nearby roads receive additional pressure
```

The actual impact should be determined using
available mobility data.

---

# 15. Incident → Crowd Impact

Example:

```text
Metro disruption
↓
Passenger accumulation
↓
Crowd pressure increases
↓
Nearby road / pedestrian pressure increases
```

Incident and crowd systems should therefore
share mobility-state information.

---

# 16. Incident → Route Impact

When an incident affects a road:

```text
Incident detected
↓
Affected road identified
↓
Incident penalty increases
↓
Candidate routes recalculated
↓
Alternative route evaluated
```

A confirmed road closure may be excluded
from routing completely.

---

# 17. Source Transparency

Each incident should retain:

- Source
- Source ID
- Source timestamp
- Last update
- Confidence
- Evidence type
- Status

Possible evidence types:

### OBSERVED

Direct measurement.

### REPORTED

User / operator / external report.

### HISTORICAL

Historical incident information.

### ESTIMATED

Derived impact estimate.

### SIMULATED

Hackathon-generated event.

---

# 18. Freshness

Dynamic incidents require freshness checks.

Example:

```text
Incident:
Accident

Reported:
18:40

Last Update:
18:42

Freshness:
FRESH
```

Possible states:

- Fresh
- Aging
- Stale
- Expired

Exact thresholds should depend on
the incident type and source.

---

# 19. Duplicate Detection

The system should recognize when different
sources describe the same incident.

Example:

```text
Report A:
Accident at Road X

Report B:
Crash at Road X

Report C:
Traffic slowdown caused by accident at Road X
```

These may represent one underlying incident.

TrafficPulse should attempt to merge related
reports rather than create multiple incidents.

Potential matching signals:

- Location
- Time
- Incident type
- Description similarity
- Nearby road segment

---

# 20. Source Failure

If an incident source stops responding:

1. Mark source as unavailable
2. Record last successful update
3. Mark affected information as aging/stale
4. Reduce confidence where appropriate
5. Continue using other sources
6. Retry according to source policy
7. Restore automatically when available

---

# 21. Hackathon MVP

Prioritize:

- Operator incident reporting
- Accident
- Waterlogging
- Road closure
- Severity
- Timestamp
- Location
- Incident status
- Confidence
- Map update
- Hotspot update
- Route impact

External incident APIs should be treated
as optional enhancements until their
access and reliability are verified.

---

# 22. Long-Term Strategy

Future versions can integrate:

- Official city feeds
- Government sources
- Partner incident feeds
- Smart-city systems
- User reports
- Computer-vision signals
- Weather-driven hazard detection

All sources should enter the same
normalization and validation pipeline.

---

# 23. Comparison

| Source | Real-Time Potential | Official | Geographic Coverage | Access Risk | Primary Role |
|---|---|---|---|---|---|
| Government historical data | ❌ / periodic | ✅ | Varies | Low | Historical context |
| Official city feeds | 🟡 | ✅ | City-specific | Medium | Local incidents |
| Partner feeds | ✅ | Varies | Potentially broad | High | Live incidents |
| User reports | ✅ | ❌ | Variable | Medium | Supporting signal |
| Operator reports | ✅ | ✅ | Operational area | Low | Verified input |
| Simulation | Simulated | N/A | Configurable | Low | Hackathon fallback |

---

# 24. Preliminary Direction

TrafficPulse should use a **multi-source incident model**.

### Primary

Use verified official or authorized
incident sources where available.

### Supporting

Use partner / crowdsourced reports
where permitted and accessible.

### Operator

Allow manual incident creation for
the MVP.

### Validation

Combine source reliability, freshness,
location, and supporting mobility signals.

### Fallback

Use clearly labelled simulation for
the hackathon when required.

This is NOT the final decision.

---

# 25. Final Decision

**PENDING**

---

## Decision Criteria

Evaluate:

1. Real-time capability
2. Indian coverage
3. Source reliability
4. Geographic precision
5. API accessibility
6. Licensing
7. Update frequency
8. Validation capability
9. Privacy
10. Hackathon feasibility
11. Fallback options

---

## Decision Date

Not decided yet.

---

## Consequences

The incident-data decision will determine:

- Incident ingestion adapters
- Validation pipeline
- Confidence model
- Hotspot detection
- Route penalties
- Alert system
- Incident lifecycle
- Data storage

---

## Related Notes

- [[Incident Data India]]
- [[ADR-002-Traffic-Data]]
- [[ADR-004-Crowd-Data]]
- [[Mobility Intelligence Engine]]
- [[Self-Updating Mobility Intelligence]]
- [[System Architecture]]
- [[MVP]]