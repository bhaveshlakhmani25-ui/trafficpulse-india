# ADR-006 — AI Strategy

## Status

🟡 PENDING

---

## Decision

Where should Artificial Intelligence be used in
TrafficPulse India?

---

## Context

TrafficPulse combines multiple mobility signals:

- Traffic
- Incidents
- Crowd
- Weather
- Events
- Transit
- Geographic context

AI can help interpret unstructured information
and communicate mobility intelligence.

However, AI should not control deterministic
mobility calculations where predictable and
auditable logic is required.

---

# 1. AI Design Principle

## AI assists the intelligence layer.

AI should:

- Interpret
- Classify
- Extract
- Summarize
- Explain
- Assist prediction where appropriate

AI should NOT independently become the source
of truth for mobility state.

---

# 2. AI Use Case — Incident Classification

Input:

```text
"Heavy waterlogging reported near the metro station.
Vehicles are moving very slowly."
```

AI output:

```text
Incident Type:
WATERLOGGING

Severity:
HIGH

Possible Impact:
TRAFFIC DISRUPTION

Relevant Location:
Nearby metro corridor
```

The output should then pass through
normal validation rules.

---

# 3. AI Use Case — Structured Extraction

Unstructured information can be converted
into structured mobility data.

Example:

```text
Raw Report
↓
AI Extraction
↓
Incident Type
Location
Severity
Time
Description
↓
Validation
↓
Mobility State
```

AI extraction must not automatically
activate a high-impact incident without
validation.

---

# 4. AI Use Case — Event Understanding

Input:

```text
"Music festival at XYZ Stadium on Saturday
from 6 PM to 11 PM."
```

AI can extract:

- Event name
- Event category
- Venue
- Start time
- End time
- Potential mobility relevance

The event should then enter the normal
event validation pipeline.

---

# 5. AI Use Case — Natural-Language Explanation

The deterministic intelligence engine generates
structured evidence.

Example:

```text
Incident:
Accident

Traffic:
+27% congestion

Crowd:
82 / 100

Alternative ETA:
28 minutes
```

AI converts these structured facts into:

> An accident is increasing congestion while crowd
> density near the metro station is high. The
> alternative route adds 4 minutes but avoids the
> affected corridor.

The AI must only explain information already
available from validated system data.

---

# 6. AI Use Case — Operator Summary

The operator dashboard can provide a short summary.

Example:

```text
Current Situation

A high-severity accident is affecting the main
corridor. Traffic is worsening and crowd density
near the adjacent metro station is increasing.

Priority:
Monitor the affected corridor and nearby transit zone.
```

The underlying evidence should remain inspectable.

---

# 7. AI Use Case — Prediction

AI/ML may eventually help estimate:

- Future congestion
- Crowd growth
- Event impact
- Waterlogging risk
- Travel-time changes

However, predictions should be clearly labelled:

**PREDICTED**

They should not be presented as observed facts.

---

# 8. AI Use Case — Anomaly Detection

AI/ML can potentially identify unusual patterns.

Example:

Typical traffic:

40 km/h

Current:

18 km/h

Historical expectation:

38–42 km/h

Potential anomaly:

**Significant deterioration**

This should then be combined with
incident and other mobility signals.

---

# 9. AI Must NOT Control Directly

The following should remain deterministic
or rule-based unless there is a strong
validated reason otherwise:

- Geographic matching
- Coordinate validation
- Timestamp validation
- Source provenance
- Data freshness
- Data lifecycle
- Confidence metadata
- Road closure state
- Route cost calculation
- Basic hotspot scoring
- Incident expiration
- Access control
- API authentication

---

# 10. Route Recommendation Boundary

AI should not simply say:

> "Take Route B."

Instead:

```text
Routing Engine
↓
Candidate Routes
↓
Deterministic Route Scoring
↓
Recommended Route
↓
AI Explanation
```

This makes the recommendation auditable.

---

# 11. Hotspot Detection Boundary

Hotspot detection should primarily use
structured mobility signals.

```text
Traffic
+
Incident
+
Crowd
+
Weather
+
Events
↓
Deterministic / configurable scoring
↓
Hotspot State
↓
AI Explanation
```

AI may assist with interpreting unusual
patterns later, but the basic hotspot
state should remain explainable.

---

# 12. AI Input Rules

AI should receive only the information
necessary for its task.

Example:

```text
Incident:
Accident

Location:
Road segment ID

Severity:
HIGH

Traffic:
WORSENING

Crowd:
HIGH

Confidence:
0.86
```

Avoid sending unnecessary personal information.

---

# 13. AI Output Rules

AI outputs should be:

- Structured where possible
- Validated
- Traceable to input evidence
- Limited to the requested task
- Explicit about uncertainty

Example:

```text
{
  "incident_type": "accident",
  "severity": "high",
  "confidence": "medium"
}
```

The application should validate the structure
before using the result.

---

# 14. Model Strategy

TrafficPulse should not become permanently
dependent on one AI provider.

The AI layer should use an abstraction such as:

```text
Application
    ↓
AI Service Layer
    ↓
Model Provider
```

This allows different compatible models
to be evaluated without redesigning the
application architecture.

Potential providers can be evaluated later.

---

# 15. OpenRouter Role

OpenRouter may be used as an AI model gateway
during development if it satisfies:

- API access
- Model availability
- Cost requirements
- Rate limits
- Reliability
- Hackathon compatibility

OpenRouter should be treated as an implementation
option, not a permanent architectural requirement.

The actual API key must never be stored in:

- Obsidian
- GitHub
- Source code
- Public documentation

Secrets should be stored through environment
variables or a secret-management mechanism.

---

# 16. AI Fallback

If the AI provider is unavailable:

```text
AI unavailable
↓
Core deterministic system continues
↓
Structured intelligence remains available
↓
Natural-language explanation may fall back
to predefined templates
```

Example fallback:

> Accident detected. Traffic is worsening on
> the affected corridor. Alternative route
> avoids the incident area.

The platform should remain functional
without the AI layer.

---

# 17. Hallucination Protection

AI-generated claims must be grounded in
validated system data.

The model should NOT invent:

- Incidents
- Traffic values
- Crowd values
- Sources
- ETAs
- Locations
- Weather conditions

The explanation should reference only
provided evidence.

---

# 18. Transparency

AI-generated information should be distinguishable
from directly observed information.

Example:

```text
Observed:
Traffic speed = 21 km/h

Estimated:
Waterlogging risk = HIGH

AI Explanation:
Generated from validated mobility evidence
```

---

# 19. Privacy

Do not send unnecessary personal information
to an external AI provider.

Prefer sending:

- Aggregated traffic state
- Incident metadata
- Crowd index
- Geographic zone / road ID
- Event information
- Weather information

Avoid:

- Names
- Personal identities
- Individual movement histories
- Unnecessary user data

---

# 20. Hackathon MVP

For the first MVP, prioritize AI for:

- Incident classification
- Structured text extraction
- Event understanding
- Mobility explanations

Do NOT make the MVP dependent on:

- A complex predictive ML model
- Fully autonomous agents
- AI-controlled routing
- AI-generated traffic truth

The core demo should still work if the
AI service is temporarily unavailable.

---

# 21. Long-Term AI Strategy

Future versions could explore:

- Congestion prediction
- Crowd prediction
- Event impact prediction
- Waterlogging prediction
- Multi-source anomaly detection
- Mobility forecasting
- Automated operator reports
- Advanced multimodal analysis

These should be validated separately before
becoming core decision systems.

---

# 22. AI Architecture

```text
Validated Mobility Data
        ↓
AI Service Layer
        ↓
┌───────────────────────────────┐
│ Incident Classification       │
│ Text Extraction               │
│ Event Understanding           │
│ Explanation                   │
│ Operator Summary              │
│ Future Prediction             │
└───────────────────────────────┘
        ↓
Validated / Structured Output
        ↓
TrafficPulse Application
```

---

# 23. Deterministic Core

```text
Traffic Data
Incident Data
Crowd Data
Weather Data
Event Data
        ↓
Validation
        ↓
Mobility State
        ↓
Route Scoring
        ↓
Hotspot Detection
        ↓
Decision
```

AI sits alongside this core rather than
replacing it.

---

# 24. Decision Principle

TrafficPulse should remain useful even when:

- AI is unavailable
- One data provider fails
- One city lacks a specific data source
- Some signals are stale
- Some signals are estimated

The system should degrade gracefully.

---

# 25. Preliminary Direction

### AI for interpretation

Use AI where natural-language or
unstructured information is involved.

### Deterministic intelligence

Use explicit rules and algorithms for
core mobility decisions.

### Provider abstraction

Keep the AI provider replaceable.

### Grounded explanations

AI explanations must come from validated
system evidence.

This is NOT the final implementation decision.

---

# 26. Final Decision

**PENDING**

---

## Decision Criteria

Evaluate:

1. AI capability
2. Structured-output reliability
3. Cost
4. Rate limits
5. Latency
6. Model availability
7. API accessibility
8. Hackathon compatibility
9. Fallback options
10. Privacy
11. Hallucination risk

---

## Decision Date

Not decided yet.

---

## Consequences

The AI decision will determine:

- AI service architecture
- Model/provider integration
- Prompt strategy
- Structured-output validation
- Secret management
- Fallback behavior
- AI-related costs
- Explanation system

---

## Related Notes

- [[AI Architecture]]
- [[Mobility Intelligence Engine]]
- [[System Architecture]]
- [[Self-Updating Mobility Intelligence]]
- [[ADR-002-Traffic-Data]]
- [[ADR-003-Routing]]
- [[ADR-004-Crowd-Data]]
- [[ADR-005-Incident-Data]]
- [[MVP]]