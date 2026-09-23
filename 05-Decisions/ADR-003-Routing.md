# ADR-003 — Routing Engine

## Status

🟡 PENDING

---

## Decision

Which routing approach should TrafficPulse use
to calculate routes and evaluate mobility conditions?

---

## Context

TrafficPulse requires routing for:

- Origin → destination navigation
- Alternative route generation
- ETA
- Traffic-aware routing
- Incident avoidance
- Crowd-zone avoidance
- Dynamic route recalculation
- Mobility-aware route recommendations

The routing system must also work with the
TrafficPulse intelligence layer.

---

# 1. Routing Requirements

The routing system should support:

- Indian road networks
- OSM-based geographic data where possible
- Multiple route alternatives
- ETA / travel time
- Route geometry
- Dynamic routing
- Avoiding closed or heavily affected roads
- Integration with congestion information
- Integration with incident information
- Integration with crowd information
- Reasonable hackathon complexity
- A fallback strategy

---

# 2. Google Routes API

## Capabilities

Google Routes API supports routing preferences including:

- TRAFFIC_UNAWARE
- TRAFFIC_AWARE
- TRAFFIC_AWARE_OPTIMAL

`TRAFFIC_AWARE` calculates routes using live traffic.

`TRAFFIC_AWARE_OPTIMAL` also uses live traffic while
prioritizing more accurate route calculation.

Source:

https://developers.google.com/maps/documentation/routes

## Strengths

- Traffic-aware routing
- Live-traffic-aware ETA
- Route calculation
- Alternative routing capabilities
- Managed infrastructure
- Low implementation complexity

## Limitations

Google Routes should not automatically be treated
as our complete city-wide traffic state.

Its strongest fit is:

**Route calculation + traffic-aware travel time**

rather than:

**Independent nationwide road-network traffic engine**

## TrafficPulse role

🟢 Strong candidate for:

- Route calculation
- ETA
- Traffic-aware routing
- Route alternatives

🟡 Requires another mobility-data layer for:

- Independent hotspot detection
- City-wide mobility state
- Crowd intelligence
- Incident fusion

## Status

🟡 Candidate

---

# 3. Mapbox Directions API

## Capabilities

Mapbox Directions API provides:

- Driving routes
- Driving-traffic routes
- Walking routes
- Cycling routes
- Alternative routes
- Route geometry
- Duration
- Speed annotations
- Turn-by-turn instructions

The `mapbox/driving-traffic` profile uses current
and historical traffic conditions where traffic
coverage is available.

Source:

https://docs.mapbox.com/api/navigation/directions/

## Strengths

- Traffic-aware routing
- Alternative routes
- Route geometry
- Traffic annotations
- Strong map integration
- Useful for dynamic rerouting

## Limitations

- Traffic coverage varies by geography
- Requires a Mapbox access token
- Usage is billed according to Mapbox pricing
- Raw Mapbox Traffic Data is a separate product

## TrafficPulse role

🟢 Candidate for:

- Route calculation
- Traffic-aware ETA
- Route alternatives
- Route visualization

🟡 Requires verification of Indian traffic coverage
before becoming a core dependency

## Status

🟡 Candidate

---

# 4. OSRM

## What is it?

OSRM (Open Source Routing Machine) is an
open-source routing engine designed for
OpenStreetMap data.

Source:

https://project-osrm.org/

## Capabilities

OSRM provides:

- Route service
- Alternative routes
- Turn-by-turn route steps
- Route geometry
- Distance
- Duration
- Table / matrix calculations
- Map matching
- Nearest-road lookup

## Strengths

- Open source
- OSM-based
- Can be self-hosted
- No mandatory commercial routing API dependency
- Full control over routing infrastructure
- Useful for custom infrastructure

## Limitations

OSRM itself does not provide a complete
live traffic data feed.

Live traffic intelligence would need to be
provided by TrafficPulse separately.

This means we would need:

OSM
+
Traffic signals
+
Incident signals
+
Crowd signals
+
Dynamic route weighting

to create our TrafficPulse routing behavior.

## TrafficPulse role

🟢 Strong candidate for:

- Base routing
- OSM road network
- Self-hosted routing
- Controlled hackathon architecture

🟡 Requires additional work for:

- Dynamic traffic weights
- Crowd penalties
- Incident penalties
- Custom mobility-aware routing

## Status

🟢 Strong open-source candidate

---

# 5. GraphHopper

## What is it?

GraphHopper is an OpenStreetMap-based routing
engine with customizable routing models.

Source:

https://www.graphhopper.com/

## Capabilities

GraphHopper supports:

- Route calculation
- Route optimization
- Matrix calculations
- Map matching
- Custom routing profiles
- Custom routing models

GraphHopper's custom routing model can modify
routing behavior based on road attributes
and other conditions.

## Strengths

- OSM-based
- Customizable routing
- Open-source engine available
- Can be self-hosted
- Custom routing rules
- Good fit for mobility-aware routing concepts

## TrafficPulse relevance

Custom routing can potentially represent
TrafficPulse-specific penalties such as:

- Congestion
- Restricted roads
- Road conditions
- Road classes
- Other routing rules

## Limitations

- More setup complexity than a hosted routing API
- Live traffic still requires additional data
- Dynamic mobility penalties require architecture
  around the routing engine

## TrafficPulse role

🟢 Strong candidate for a future custom
mobility-aware routing engine

🟡 May be more engineering than necessary
for the initial hackathon MVP

## Status

🟡 Candidate

---

# 6. Custom OSM Graph

TrafficPulse could theoretically build its own
road graph from OpenStreetMap.

Concept:

OSM
↓
Road graph
↓
Nodes + edges
↓
Dynamic edge weights
↓
Dijkstra / A*
↓
TrafficPulse route

Each road edge could contain:

- Distance
- Base travel time
- Current congestion
- Incident penalty
- Crowd penalty
- Weather penalty
- Closure state

## Example

```text
Edge A
Base Time: 5 min
Congestion: +3 min
Incident: +8 min
Crowd: +1 min

Dynamic Cost:
17 min
```

## Strengths

- Maximum control
- Fully custom routing model
- Direct integration with TrafficPulse intelligence

## Limitations

- High implementation effort
- Requires significant routing engineering
- Network preparation required
- Harder to validate during a short hackathon
- More opportunities for routing bugs

## Status

🔴 Long-term option

🟡 Not preferred for first MVP unless research
shows a strong reason

---

# 7. Comparison

| Option | OSM-Based | Live Traffic | Alternatives | Custom Weights | Self-Host | Complexity |
|---|---|---|---|---|---|---|
| Google Routes | Not our base graph | ✅ | ✅ | Limited from our side | ❌ | Low |
| Mapbox Directions | ✅ ecosystem | ✅ where supported | ✅ | Limited | ❌ | Low |
| OSRM | ✅ | ❌ by itself | ✅ | ✅ through custom setup | ✅ | Medium |
| GraphHopper | ✅ | ❌ by itself | ✅ | ✅ | ✅ | Medium |
| Custom OSM Graph | ✅ | We build it | ✅ | ✅✅ | ✅ | High |

---

# 8. Important Architectural Distinction

TrafficPulse should separate:

### Routing Engine

Answers:

**"What road path can connect A to B?"**

### Mobility Intelligence

Answers:

**"What is happening on those roads?"**

### Route Scoring

Answers:

**"Which available route is currently preferable
given the mobility state?"**

This separation is important.

---

# 9. Proposed Architecture

```text
Origin + Destination
        ↓
Routing Engine
        ↓
Candidate Routes
        ↓
Mobility Intelligence
        ↓
Traffic
+
Incidents
+
Crowd
+
Weather
+
Closures
        ↓
Route Scoring
        ↓
Recommended Route
        ↓
Explanation
```

---

# 10. Route Cost Model

TrafficPulse can calculate a higher-level
route score on top of the routing engine.

Concept:

```text
Route Cost =

Base Travel Time
+
Congestion Penalty
+
Incident Penalty
+
Crowd Exposure Penalty
+
Weather / Waterlogging Penalty
```

The weights remain configurable.

They are TrafficPulse design parameters,
not established scientific constants.

---

# 11. Dynamic Rerouting

When new mobility information arrives:

```text
New Signal
↓
Mobility State Update
↓
Affected Road Identified
↓
Route Costs Updated
↓
Candidate Routes Recalculated
↓
Recommendation Updated
```

This is the key connection between
the routing engine and the intelligence engine.

---

# 12. Hackathon Requirements

The routing solution must:

- Work reliably during the demo
- Support the chosen pilot city
- Produce route alternatives
- Have predictable API behavior
- Avoid unnecessary external dependencies
- Support our mobility scoring layer
- Have a fallback

---

# 13. Fallback Strategy

Primary routing service
↓
If unavailable
↓
Secondary routing option
↓
If unavailable
↓
Controlled demo route dataset

The fallback must be clearly identified
internally as a demo/development fallback.

---

# 14. Current Research Direction

The current architecture suggests three
main approaches:

### Option A

Hosted traffic-aware routing

Examples:

Google Routes  
Mapbox Directions

Advantages:

- Fast integration
- Traffic-aware ETA
- Low implementation complexity

---

### Option B

Self-hosted OSM routing

Examples:

OSRM  
GraphHopper

Advantages:

- More control
- Lower dependence on proprietary routing
- Better integration with custom mobility logic

Disadvantage:

Requires additional engineering.

---

### Option C

Custom routing engine

Build directly on an OSM graph.

Advantages:

- Maximum control
- Custom edge costs

Disadvantage:

Too much implementation complexity
for the initial MVP unless necessary.

---

# 15. Research Questions Still Open

- Which routing engine has the best Indian coverage?
- Which option can be used within hackathon constraints?
- Which option provides sufficient route alternatives?
- Which option is easiest to integrate?
- Which option allows our mobility penalties?
- Do we need self-hosting?
- Can the routing engine work independently
  from the traffic-data provider?
- What is the best fallback?

---

# 16. Preliminary Direction

Current research suggests:

### MVP

Use a reliable hosted or open-source
routing engine rather than implementing
a full custom graph engine.

### Mobility Intelligence

Keep our own TrafficPulse scoring layer
separate from the routing engine.

### Long Term

Evaluate OSRM / GraphHopper or a custom
OSM graph if deeper control is required.

This is NOT the final decision.

---

# 17. Final Decision

**PENDING**

---

## Decision Criteria

Evaluate:

1. India coverage
2. Route quality
3. Traffic support
4. Alternative routes
5. Customization
6. Cost
7. API limits
8. Licensing
9. Reliability
10. Integration effort
11. Fallback options

---

## Decision Date

Not decided yet.

---

## Consequences

The routing decision will determine:

- Route API architecture
- Data integration
- Dynamic route scoring
- Mobility penalties
- ETA handling
- Fallback design
- Backend implementation

---

## Related Notes

- [[Traffic Data Sources]]
- [[ADR-002-Traffic-Data]]
- [[Mobility Intelligence Engine]]
- [[System Architecture]]
- [[Self-Updating Mobility Intelligence]]
- [[MVP]]

## Question
Which routing engine will support dynamic routing with mobility penalties?

## Decision
**PENDING**
