
## Purpose

Define the data model required by TrafficPulse India.

The data architecture must support:

- Multiple Indian cities
- Multiple data sources
- Real-time mobility updates
- Historical information
- Geographic data
- Incidents
- Crowd intelligence
- Weather
- Events
- Routing
- Confidence and provenance
- Source failures

---

# 1. Core Data Principle

TrafficPulse should separate:

1. Source data
2. Normalized data
3. Current mobility state
4. Historical state
5. Intelligence results

The system should preserve enough metadata to understand
where every important signal came from and how fresh it is.

---

# 2. Core Entities

TrafficPulse will likely need the following entities:

- City
- Data Source
- Road Segment
- Place / POI
- Traffic State
- Incident
- Crowd State
- Weather State
- Event
- Transit Station
- Mobility State
- Hotspot
- Route
- Alert

The exact schema will be finalized during implementation.

---

# 3. City

Represents an Indian city supported by TrafficPulse.

### Conceptual fields

```text
city_id
name
state
country
timezone
latitude
longitude
status
```

### Example

```text
city_id:
blr

name:
Bengaluru

state:
Karnataka

country:
India
```

---

# 4. Data Source

Represents an external or internal provider
from which mobility information is obtained.

### Conceptual fields

```text
source_id
provider
source_type
data_type
geographic_scope
endpoint
access_type
authentication_type
update_frequency
freshness_limit
reliability
license
status
last_success
last_seen
```

### Example

```text
source_id:
imd-india

provider:
India Meteorological Department

source_type:
Government API

data_type:
Weather / Rainfall

geographic_scope:
India

status:
ACTIVE
```

---

# 5. Road Segment

Represents a section of the road network.

The road network may be derived from
OpenStreetMap or another authorized geographic source.

### Conceptual fields

```text
road_segment_id
city_id
geometry
road_name
road_class
direction
length
base_speed
status
source_id
```

### Possible status

- OPEN
- RESTRICTED
- CLOSED
- UNKNOWN

---

# 6. Place / POI

Represents geographically important locations.

Examples:

- Metro station
- Bus stop
- Market
- College
- Stadium
- Hospital
- Event venue

### Conceptual fields

```text
place_id
city_id
name
type
geometry
source_id
```

---

# 7. Traffic State

Represents the current traffic condition
associated with a road segment or route.

### Conceptual fields

```text
traffic_state_id
road_segment_id
speed
expected_speed
congestion_level
travel_time
trend
observed_at
received_at
source_id
freshness_state
confidence
evidence_type
```

### Example

```text
Road:
Segment 124

Speed:
21 km/h

Expected Speed:
42 km/h

Congestion:
HIGH

Trend:
WORSENING
```

---

# 8. Incident

Represents a mobility disruption.

### Types

- Accident
- Waterlogging
- Road closure
- Construction
- Vehicle breakdown
- Road hazard
- Event disruption
- Transit disruption

### Conceptual fields

```text
incident_id
city_id
type
severity
location
road_segment_id
description
reported_at
updated_at
expires_at
source_id
confidence
status
evidence_type
```

---

# 9. Incident Lifecycle

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

Historical incident records should remain
available for analysis where appropriate.

---

# 10. Crowd State

Represents observed or estimated crowd conditions
for a geographic location.

### Possible locations

- Metro station
- Bus stop
- Market
- Stadium
- College
- Event venue
- Other mobility zones

### Conceptual fields

```text
crowd_state_id
place_id
crowd_index
crowd_level
trend
estimated_count
observed_at
received_at
source_id
confidence
evidence_type
freshness_state
```

---

# 11. Crowd Evidence

Crowd state can be derived from multiple signals.

Possible evidence:

- Live authorized observation
- Transit demand
- Event information
- Time pattern
- Weather
- User reports
- Historical patterns

The source of each important crowd signal
should remain traceable.

---

# 12. Weather State

Represents relevant environmental conditions.

### Conceptual fields

```text
weather_state_id
city_id
location
temperature
rainfall
rainfall_intensity
weather_condition
warning
observed_at
source_id
freshness_state
```

---

# 13. Waterlogging Risk

Waterlogging risk is an intelligence result,
not necessarily a direct data source.

### Conceptual inputs

- Rainfall intensity
- Rainfall accumulation
- Historical flood risk
- Geographic context
- Drainage context
- Traffic deterioration
- Waterlogging reports

### Conceptual output

```text
waterlogging_risk
risk_level
confidence
evidence
last_updated
```

Possible states:

- LOW
- MODERATE
- HIGH
- SEVERE

---

# 14. Event

Represents a planned or active event that may
affect mobility.

### Conceptual fields

```text
event_id
city_id
name
category
venue_id
location
start_time
end_time
expected_attendance
status
source_id
confidence
last_updated
```

### Event states

- PLANNED
- ACTIVE
- COMPLETED
- CANCELLED

---

# 15. Transit Station

Represents a metro or public-transport station.

### Conceptual fields

```text
station_id
city_id
name
type
line
location
source_id
```

Potential additional information:

- Ridership
- Passenger flow
- Service status
- Schedule
- Vehicle position where available

---

# 16. Mobility State

Represents the current combined understanding
of a location or road segment.

This is one of the most important entities.

### Conceptual fields

```text
mobility_state_id
entity_id
entity_type
traffic_state
crowd_state
incident_state
weather_state
waterlogging_risk
event_state
hotspot_state
trend
confidence
updated_at
```

### Example

```text
Entity:
Silk Board Corridor

Traffic:
HIGH

Traffic Trend:
WORSENING

Incident:
ACCIDENT

Crowd:
HIGH

Weather:
HEAVY RAIN

Waterlogging Risk:
HIGH

Hotspot:
EMERGING

Confidence:
HIGH

Updated:
18:42
```

---

# 17. Hotspot

Represents an area where significant mobility
pressure is developing.

### Conceptual fields

```text
hotspot_id
city_id
location
score
severity
trend
causes
affected_entities
confidence
created_at
updated_at
status
```

### Hotspot states

- NORMAL
- WATCH
- HIGH_RISK
- EMERGING

---

# 18. Hotspot Evidence

Each hotspot should retain evidence explaining
why it was detected.

Example:

```text
Accident
+
Traffic deterioration
+
Crowd increase
+
Heavy rainfall
```

The system should be able to trace each
contributing signal to its source.

---

# 19. Route

Represents a route generated by a routing engine.

### Conceptual fields

```text
route_id
origin
destination
geometry
distance
base_duration
traffic_duration
route_score
recommendation_status
generated_at
```

A route can reference the mobility conditions
that were used during scoring.

---

# 20. Route Score

Represents the mobility-aware evaluation of
a candidate route.

### Conceptual components

```text
base_travel_time
congestion_penalty
incident_penalty
crowd_penalty
weather_penalty
waterlogging_penalty
other_penalties
total_score
```

These are configurable design parameters.

---

# 21. Alert

Represents a notification generated by the
TrafficPulse intelligence system.

### Alert types

- Traffic Alert
- Incident Alert
- Crowd Alert
- Weather Alert
- Hotspot Alert
- Route Alert
- Data Source Alert

### Conceptual fields

```text
alert_id
city_id
type
severity
title
message
entity_id
created_at
expires_at
status
source_context
```

---

# 22. Evidence Type

Every dynamic signal should identify what
kind of evidence it represents.

### OBSERVED

Directly measured information.

### REPORTED

Reported by a user, operator, or source.

### HISTORICAL

Derived from historical information.

### ESTIMATED

Calculated from available signals.

### PREDICTED

Forecast of future conditions.

### SIMULATED

Synthetic hackathon/demo information.

These categories should remain distinguishable.

---

# 23. Confidence Metadata

Important dynamic records should retain
confidence information.

Possible fields:

```text
confidence
confidence_reason
source_count
supporting_sources
```

Confidence should represent evidence quality.

It should not automatically be interpreted
as an ML probability.

---

# 24. Freshness Metadata

Dynamic records should retain:

```text
observed_at
received_at
processed_at
expires_at
freshness_state
```

Possible freshness states:

- FRESH
- AGING
- STALE
- EXPIRED

Freshness thresholds should depend on
the specific data source and data type.

---

# 25. Provenance

Important data should be traceable back to
the original source.

The system should preserve:

```text
source_id
provider
original_event_id
observed_at
received_at
processing_version
```

This allows TrafficPulse to answer:

> Where did this information come from?

---

# 26. Entity Relationships

Conceptual relationship:

```text
City
│
├── Road Segments
│     └── Traffic States
│     └── Incidents
│     └── Routes
│
├── Places / POIs
│     └── Crowd States
│     └── Events
│
├── Transit Stations
│     └── Transit States
│
├── Weather States
│
├── Hotspots
│
└── Alerts
```

---

# 27. Source Relationships

```text
Data Source
     ↓
Raw Observation
     ↓
Normalized Entity
     ↓
Mobility State
     ↓
Intelligence
```

Multiple sources can contribute to
the same mobility state.

---

# 28. Historical Data

The system should retain selected historical
states for:

- Trend analysis
- Hotspot analysis
- Historical comparisons
- Prediction research
- Model calibration
- Debugging

Not every raw event needs to be stored forever.

Retention policies remain to be defined.

---

# 29. Geographic Data

Geographic entities may use:

- Coordinates
- LineString geometries
- Polygon geometries
- Geographic IDs
- Road-segment IDs
- Place IDs

A geographic database such as PostGIS is
a potential implementation option.

Final technology remains pending.

---

# 30. Data Quality Rules

Before data can influence mobility state:

1. Validate schema
2. Validate location
3. Validate timestamp
4. Check freshness
5. Check duplicates
6. Check source status
7. Check contradictions
8. Assign confidence
9. Store provenance

---

# 31. Data Lifecycle

```text
RAW
↓
VALIDATED
↓
NORMALIZED
↓
FUSED
↓
ACTIVE STATE
↓
HISTORICAL
↓
ARCHIVED / EXPIRED
```

---

# 32. Privacy

TrafficPulse should prefer aggregate information.

Store where possible:

- Road-level traffic
- Zone-level crowd
- Aggregate transit demand
- Incident metadata
- Event metadata

Avoid unnecessary storage of:

- Individual identities
- Face information
- Individual movement histories
- Unnecessary personal identifiers

---

# 33. Hackathon MVP Data

For the first implementation, prioritize:

### Required

- City
- Road Segment
- Traffic State
- Incident
- Crowd State
- Event
- Mobility State
- Hotspot
- Route
- Alert
- Data Source

### Optional

- Weather State
- Transit State
- Historical analytics
- Advanced prediction data

---

# 34. Long-Term Data Expansion

Future entities may include:

- Bus Route
- Metro Line
- Vehicle Position
- Flood Zone
- Drainage Zone
- Traffic Signal
- Road Work
- Emergency Facility
- Historical Pattern
- Prediction
- Model Version

These should be added only when justified by
actual product requirements.

---

# 35. Current Status

### Defined

- 🟢 Core entities
- 🟢 Mobility state
- 🟢 Incident lifecycle
- 🟢 Crowd state
- 🟢 Traffic state
- 🟢 Hotspot model
- 🟢 Route model
- 🟢 Source provenance
- 🟢 Freshness
- 🟢 Confidence

### Pending

- 🟡 Final database technology
- 🟡 Exact schema
- 🟡 Index strategy
- 🟡 Historical retention
- 🟡 Geographic database implementation
- 🟡 Event-stream storage

---

## Related Notes

- [[System Architecture]]
- [[Self-Updating Mobility Intelligence]]
- [[Mobility Intelligence Engine]]
- [[Routing Architecture]]
- [[Real-Time Architecture]]
- [[ADR-001-City]]
- [[ADR-002-Traffic-Data]]
- [[ADR-003-Routing]]
- [[ADR-004-Crowd-Data]]
- [[ADR-005-Incident-Data]]
- [[ADR-006-AI]]