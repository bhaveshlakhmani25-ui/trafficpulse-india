# ADR-002 — Traffic Data Strategy

## Status

🟡 PENDING

---

## Decision

How will TrafficPulse obtain traffic information
for the India-wide platform and the hackathon MVP?

---

## Context

TrafficPulse requires traffic information for:

- Current congestion
- Road conditions
- Travel-time estimation
- Route evaluation
- Hotspot detection
- Traffic trends
- Mobility intelligence

A single source may not provide all required
information.

Therefore the project should evaluate a
multi-source traffic strategy.

---

# 1. Requirements

The traffic-data strategy should ideally provide:

- Current or near-real-time traffic information
- Road-level or route-level traffic information
- Travel-time information
- Geographic coverage
- Reliable update frequency
- Programmatic access
- Clear licensing
- Hackathon-feasible access
- Failure tolerance

---

# 2. Candidate Sources

## A. Google Routes

### Potential strengths

- Traffic-aware routing
- Route-level traffic information
- ETA
- Alternative route calculation
- Suitable for route recommendations

### Limitation

Google Routes should not automatically be treated
as a complete city-wide live traffic dataset.

Its strongest role appears to be:

**Route calculation + traffic-aware ETA**

### TrafficPulse role

🟢 Strong candidate for:

- Route evaluation
- ETA
- Alternative routes
- Route-level traffic information

🟡 Limited as the only source for:

- City-wide congestion monitoring
- Independent hotspot detection
- Complete road-network traffic state

### Status

🟡 Candidate

---

# 3. Mapbox Traffic

### Potential strengths

- Traffic-aware routing
- Live traffic information
- Road-segment traffic capability
- Traffic visualization

### Limitation

Raw Mapbox Traffic Data is a separately licensed
commercial data product.

The standard Mapbox developer free tiers should
not automatically be treated as free access to
the raw Traffic Data product.

### TrafficPulse role

🟢 Technically strong for:

- Road-level traffic
- Traffic visualization
- Routing

🔴 Risk for hackathon:

- Licensing / access requirements

### Status

🟡 Candidate

---

# 4. OpenStreetMap

### Strengths

- Road network
- Road geometry
- Intersections
- Road classes
- Geographic context
- POIs

### Limitation

OpenStreetMap is NOT a live traffic source.

### TrafficPulse role

🟢 Base geographic layer

🟢 Road-network foundation

🟢 Routing graph foundation

🔴 Not a live congestion source

### Status

🟢 Base layer candidate

---

# 5. Government / Open Data

### Potential strengths

- Historical traffic information
- Accident datasets
- Infrastructure information
- City-specific mobility datasets
- Periodic government information
- Programmatic APIs for some datasets

### Limitation

We have not established a single nationwide
public API providing continuously updated
road-level traffic speeds for all Indian cities.

### TrafficPulse role

🟢 Historical context

🟢 Infrastructure context

🟢 City-specific datasets

🟢 Additional validation signals

🔴 Not established as the sole live
traffic provider

### Status

🟡 Supporting data layer

---

# 6. Multi-Source Strategy

The current architecture should therefore
support multiple traffic inputs.

```text
OpenStreetMap
      ↓
Road Network

Traffic Provider
      ↓
Current Traffic

Government Data
      ↓
Historical / Context

Weather
      ↓
Environmental Impact

Incidents
      ↓
Disruption Signals

Crowd
      ↓
Human Mobility Context

      ↓

TrafficPulse Data Fusion
      ↓

Mobility State
      ↓

Intelligence
      ↓

Routing
```

---

# 7. Proposed Traffic Data Hierarchy

## Layer 1 — Geographic Foundation

OpenStreetMap

Purpose:

- Roads
- Intersections
- Geographic network
- POIs

---

## Layer 2 — Current Traffic

Possible providers:

- Google Routes
- Mapbox
- Other verified providers
- Public / city-specific traffic feeds

Purpose:

- Traffic state
- Speed
- ETA
- Route impact

---

## Layer 3 — Historical Context

Sources may include:

- Government datasets
- Historical traffic data
- Accident data
- Transit demand

Purpose:

- Baselines
- Trend analysis
- Risk context

---

## Layer 4 — Supporting Signals

- Incidents
- Weather
- Crowd
- Events

Purpose:

Explain and enrich traffic conditions.

---

# 8. Hackathon Requirement

The solution should NOT depend entirely on
a single external traffic provider.

Reason:

If the external provider:

- becomes unavailable
- reaches limits
- changes access
- requires unexpected licensing
- becomes unreliable

the demo should still function.

---

# 9. Fallback Strategy

If a live traffic provider is unavailable:

```text
Primary Traffic Source
        ↓
Unavailable
        ↓
Fallback Source
        ↓
If unavailable
        ↓
Clearly labelled simulation
```

Simulation must never be presented as
real-world live traffic.

---

# 10. Source Metadata

Every traffic signal should ideally retain:

- Source
- Timestamp
- Location
- Data type
- Freshness
- Confidence
- Evidence type

Example:

```text
Traffic:
HIGH

Source:
traffic-provider-01

Observed:
18:42

Freshness:
FRESH

Confidence:
HIGH

Evidence:
OBSERVED
```

---

# 11. Comparison

| Source | Live Traffic | Road-Level | Routing | Historical Context | Free/Accessible | Primary Role |
|---|---|---|---|---|---|---|
| Google Routes | ✅ | Route-specific | ✅ | Limited | 🟡 | Routing / ETA |
| Mapbox Traffic | ✅ | ✅ | ✅ | ✅ | 🟡 / 🔴 | Traffic layer / Routing |
| OpenStreetMap | ❌ | ✅ | Foundation | ❌ | 🟢 | Geographic network |
| Government / Open Data | Varies | Varies | ❌ | ✅ | 🟢 / 🟡 | Context / History |
| Simulation | ✅ simulated | ✅ simulated | ✅ | Configurable | 🟢 | Fallback / Demo |

The exact access, pricing, and geographic coverage
must be verified before implementation.

---

# 12. Research Questions Still Open

- Which traffic provider can we actually use for the MVP?
- Which provider has suitable Indian coverage?
- Can we obtain road-segment information?
- What API limits apply?
- What is the actual cost?
- Is hackathon use permitted?
- Can the source support our intended refresh rate?
- Can we safely use the provider as a dependency?
- What open alternatives exist?
- Which source should be primary?
- Which source should be fallback?

---

# 13. Preliminary Direction

Current research suggests:

### Geographic foundation

OpenStreetMap

### Route intelligence

Potentially Google Routes or another
traffic-aware routing service

### City-wide traffic

Requires additional verified source research

### Historical/context

Government and open datasets

### Fallback

Clearly labelled simulation

This is NOT the final architecture decision.

---

# 14. Final Decision

**PENDING**

---

## Decision Criteria

Before finalizing the traffic source, evaluate:

1. Availability
2. India coverage
3. Real-time capability
4. Road-level detail
5. API limits
6. Cost
7. Licensing
8. Hackathon compatibility
9. Reliability
10. Fallback options

---

## Decision Date

Not decided yet.

---

## Consequences

The final traffic-data decision will determine:

- Routing architecture
- Data ingestion adapters
- Refresh strategy
- API design
- Storage requirements
- Demo reliability
- Fallback architecture

---

## Related Notes

- [[Traffic Data Sources]]
- [[System Architecture]]
- [[Self-Updating Mobility Intelligence]]
- [[Mobility Intelligence Engine]]
- [[Routing Architecture]]
- [[ADR-001-City]]

## Question
How will TrafficPulse obtain traffic information?

## Options
- Google
- Mapbox
- Open/public sources
- Simulated traffic
- Hybrid

## Decision
**PENDING**
