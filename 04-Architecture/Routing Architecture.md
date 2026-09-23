
## Purpose

Define how TrafficPulse generates, evaluates, and
updates routes using the road network and current
mobility intelligence.

The routing architecture must keep three responsibilities
separate:

1. Routing Engine
2. Mobility Intelligence
3. Route Scoring

---

# 1. Core Routing Principle

The routing engine answers:

> What possible road paths connect the origin and destination?

The mobility intelligence engine answers:

> What is happening on those roads?

The route-scoring layer answers:

> Which available route is currently preferable
> given the mobility state?

---

# 2. High-Level Routing Flow

```text
Origin
   +
Destination
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

# 3. Routing Engine

The routing engine is responsible for:

- Route generation
- Road-network traversal
- Distance calculation
- Base travel time
- Route geometry
- Alternative routes
- Road snapping / map matching where supported

Possible technologies:

- Google Routes API
- Mapbox Directions API
- OSRM
- GraphHopper
- Custom OSM routing

Final implementation is pending.

---

# 4. Geographic Foundation

OpenStreetMap can provide the geographic
road-network foundation.

Potential data:

- Roads
- Road geometry
- Intersections
- Road classes
- One-way restrictions
- Geographic POIs

OSM is not a live traffic source.

It provides the network on which dynamic
mobility information can be evaluated.

Source:

https://www.openstreetmap.org/

---

# 5. Candidate Routing Approaches

## Option A — Google Routes

Google Routes supports:

- `TRAFFIC_UNAWARE`
- `TRAFFIC_AWARE`
- `TRAFFIC_AWARE_OPTIMAL`

The traffic-aware modes consider live traffic
when calculating routes.

Potential role:

- Traffic-aware ETA
- Route calculation
- Alternative route evaluation

Source:

https://developers.google.com/maps/documentation/routes

---

## Option B — Mapbox Directions

Mapbox Directions provides:

- Driving routes
- Traffic-aware driving routes
- Alternative routes
- Route geometry
- Duration
- Speed annotations

The `mapbox/driving-traffic` profile incorporates
current and historical traffic where traffic
coverage is available.

Source:

https://docs.mapbox.com/api/navigation/directions/

---

## Option C — OSRM

OSRM is an open-source routing engine built
around OpenStreetMap road data.

Potential role:

- Self-hosted routing
- Route generation
- OSM network traversal
- Alternative routes
- Matrix / routing calculations

Important:

OSRM itself does not provide our complete
live mobility state.

TrafficPulse would supply dynamic mobility
information separately.

Source:

https://project-osrm.org/

---

## Option D — GraphHopper

GraphHopper is an OSM-based routing engine
that supports customizable routing models.

Potential role:

- Custom routing
- OSM-based network
- Custom routing rules
- Self-hosted architecture
- Advanced mobility-aware routing

Source:

https://docs.graphhopper.com/

---

# 6. Candidate Route Generation

The routing engine should generate one or more
candidate routes.

Example:

```text
Origin
  ↓
Routing Engine
  ↓
Route A
Route B
Route C
```

Each candidate contains:

- Geometry
- Distance
- Base duration
- Road segments
- Waypoints
- Routing metadata

---

# 7. Mobility State Matching

Each candidate route is compared against
the current Mobility State.

Potential signals:

- Traffic
- Congestion
- Incidents
- Crowd
- Weather
- Waterlogging
- Road closure
- Events

---

# 8. Dynamic Route Cost

TrafficPulse can calculate an additional
mobility-aware route cost.

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
+
Other Validated Penalties
```

These weights are TrafficPulse design parameters.

They are not assumed to be scientifically optimal.

The weights should remain configurable.

---

# 9. Road Segment Cost

The route can be evaluated segment by segment.

Example:

```text
Road Segment A

Base Travel Time:
5 min

Congestion Penalty:
+3 min

Incident Penalty:
+8 min

Crowd Penalty:
+1 min

Total Dynamic Cost:
17 min
```

The same process can be applied to
each relevant route segment.

---

# 10. Road Closure

If a road is confirmed closed:

```text
Road Closure
↓
Affected Segment
↓
Very High Cost
or
Excluded from Routing
```

A closure should not normally be treated
as ordinary congestion.

---

# 11. Incident Impact

An incident can change route cost.

Example:

```text
Accident
↓
Affected Road Segment
↓
Incident Severity
↓
Incident Penalty
↓
Route Cost Increases
```

The penalty should depend on:

- Incident type
- Severity
- Confidence
- Freshness
- Estimated network impact

---

# 12. Crowd Exposure

A route passing through a high-crowd zone
may receive a higher crowd-exposure penalty.

Example:

```text
Route A
↓
High-crowd metro zone
↓
Crowd Penalty ↑
```

The purpose is not automatically to
avoid every crowded area.

The system should balance:

- Travel time
- Mobility disruption
- User context
- Route alternatives

---

# 13. Weather / Waterlogging

Weather should influence routes only when
there is evidence of mobility impact.

Example:

```text
Heavy Rain
+
Known flood-prone area
+
Traffic deterioration
↓
Higher waterlogging risk
↓
Route penalty
```

Rain alone should not automatically imply
a road is flooded.

---

# 14. Route Comparison

Example:

## Route A

ETA:
24 min

Congestion:
HIGH

Incident:
HIGH

Crowd Exposure:
HIGH

Dynamic Cost:
82

---

## Route B

ETA:
28 min

Congestion:
MEDIUM

Incident:
LOW

Crowd Exposure:
LOW

Dynamic Cost:
61

---

## Route C

ETA:
31 min

Congestion:
LOW

Incident:
NONE

Crowd Exposure:
LOW

Dynamic Cost:
64

---

# 15. Recommendation Logic

The system should compare the total
mobility-aware cost of candidate routes.

A route with a slightly longer ETA may
become preferable if it significantly
reduces exposure to disruptions.

The recommendation must remain explainable.

Example:

> Route B adds 4 minutes but avoids the
> accident corridor and high-crowd zone.

---

# 16. Explanation Layer

The route-scoring layer produces structured evidence.

Example:

```text
Route:
B

ETA Difference:
+4 minutes

Avoids:
- Accident corridor
- High-crowd zone

Traffic:
Medium

Confidence:
High
```

The explanation layer converts those
facts into natural language.

AI may assist with wording, but it should
not invent route facts.

---

# 17. Dynamic Rerouting

The route should be continuously reevaluated
when important mobility signals change.

```text
New Incident
↓
Mobility State Update
↓
Affected Segment Identified
↓
Route Cost Updated
↓
Candidate Routes Recalculated
↓
Recommendation Updated
```

---

# 18. Rerouting Triggers

Potential triggers:

- Major new incident
- Road closure
- Significant traffic deterioration
- Major crowd increase
- Severe weather-related risk
- Route becomes unavailable
- Better alternative becomes available

Thresholds should be configurable.

---

# 19. Routing Confidence

Each recommendation can expose:

- Data freshness
- Source reliability
- Route-source availability
- Number of supporting signals
- Confidence

Example:

```text
Recommendation Confidence:
HIGH

Supporting Signals:
- Live traffic
- Verified accident
- Crowd increase
- Recent weather update
```

---

# 20. Source Failure

If the primary routing service fails:

```text
Primary Routing Engine
↓
Failure
↓
Fallback Routing Engine
↓
If unavailable
↓
Controlled demonstration fallback
```

The application should remain usable.

---

# 21. Routing and Mobility Intelligence Separation

## Routing Engine

Produces:

- Candidate routes
- Geometry
- Base travel time
- Distance

## Mobility Intelligence

Produces:

- Traffic state
- Incident state
- Crowd state
- Weather impact
- Hotspots
- Confidence

## Route Scoring

Combines:

Routing Output
+
Mobility Intelligence

to produce:

**Recommended Route**

---

# 22. Example End-to-End Scenario

```text
Origin + Destination
        ↓
Routing Engine
        ↓
3 Candidate Routes
        ↓
Current Mobility State
        ↓
Route A:
Accident + high congestion
        ↓
Route B:
Moderate traffic
        ↓
Route C:
Low traffic + longer distance
        ↓
Route Scoring
        ↓
Route B selected
        ↓
Explanation generated
```

---

# 23. Hackathon MVP

For the first implementation, prioritize:

- Origin / destination input
- Candidate route generation
- ETA
- Route alternatives
- Traffic impact
- Incident penalties
- Crowd penalties
- Recommended route
- Explanation
- Dynamic rerouting demonstration

Do not attempt a completely custom
routing engine unless research proves it necessary.

---

# 24. Long-Term Routing Vision

Future versions may support:

- Multimodal routing
- Metro + bus + road combinations
- Predictive traffic-aware routing
- Personalized route preferences
- Advanced road restrictions
- Custom OSM graph
- More city-specific routing signals
- Network-level optimization

---

# 25. Current Status

### Defined

- 🟢 Routing responsibilities
- 🟢 Routing / intelligence separation
- 🟢 Dynamic route-cost concept
- 🟢 Incident penalties
- 🟢 Crowd penalties
- 🟢 Weather / waterlogging concept
- 🟢 Dynamic rerouting
- 🟢 Fallback principle

### Pending

- 🟡 Routing engine
- 🟡 Traffic provider
- 🟡 Exact scoring weights
- 🟡 Rerouting thresholds
- 🟡 Final API design
- 🟡 Final fallback implementation

---

## Research References

### Google Routes

https://developers.google.com/maps/documentation/routes

### Mapbox Directions

https://docs.mapbox.com/api/navigation/directions/

### OSRM

https://project-osrm.org/

### GraphHopper

https://docs.graphhopper.com/

### OpenStreetMap

https://www.openstreetmap.org/

---

## Related Notes

- [[ADR-003-Routing]]
- [[ADR-002-Traffic-Data]]
- [[Mobility Intelligence Engine]]
- [[Self-Updating Mobility Intelligence]]
- [[System Architecture]]
- [[MVP]]
- [[User Flow]]
- [[Demo Flow]]
## Existing Concept
Dynamic route cost can combine:
- Expected travel time
- Congestion penalty
- Crowd-exposure penalty
- Incident penalty

## Decision
**PENDING**
