# Real-Time Architecture

## Purpose

Define how TrafficPulse receives, processes, validates,
and distributes changing mobility information.

The system should be capable of continuously updating
the current mobility state without requiring manual
database updates.

---

# 1. Core Principle

TrafficPulse should treat mobility information as a
continuously changing stream of events.

```text
Source
↓
New Data
↓
Ingestion
↓
Validation
↓
Normalization
↓
Data Fusion
↓
Mobility State Update
↓
Intelligence Update
↓
Frontend / Operator Update
```

---

# 2. Real-Time Data Sources

Potential dynamic sources include:

- Traffic
- Incidents
- Weather
- Transit
- Crowd
- Events
- City / government feeds
- IUDX resources
- User/operator reports

Not every source will be truly real-time.

Each source must define its own:

- Update frequency
- Freshness limit
- Availability
- Reliability

---

# 3. Update Mechanisms

TrafficPulse should support multiple mechanisms
depending on the provider.

## Polling

TrafficPulse periodically requests new data.

```text
TrafficPulse
↓
Request source
↓
New data
↓
Process
↓
Wait
↓
Request again
```

Useful for APIs that do not provide push updates.

---

## Webhooks

A provider sends updates when something changes.

```text
Provider
↓
Webhook
↓
TrafficPulse
↓
Process update
```

Useful where provider-side event notifications
are supported.

---

## Streaming / Subscription

A source continuously provides updates.

```text
Source
↓↓↓↓↓↓↓↓
Continuous events
↓↓↓↓↓↓↓↓
TrafficPulse
```

Useful for high-frequency mobility data where supported.

---

## File / Feed Updates

Some providers may publish:

- JSON
- CSV
- GeoJSON
- XML
- RSS
- GTFS
- GTFS-Realtime

TrafficPulse periodically checks for new versions.

---

# 4. Source Scheduler

For polling-based sources, TrafficPulse maintains
a source-specific schedule.

Example:

```text
Source:
Weather API

Update interval:
5 minutes
```

Another source may use:

```text
Source:
Historical government dataset

Update interval:
Daily / weekly / monthly
```

The system must NOT apply the same refresh interval
to every data source.

---

# 5. Ingestion Workers

Each source should have an ingestion process.

Example:

```text
Traffic Worker
Weather Worker
Incident Worker
Transit Worker
Crowd Worker
Event Worker
```

Each worker:

1. Connects to its source
2. Retrieves new information
3. Records retrieval time
4. Passes data to validation
5. Reports failures
6. Continues according to source policy

---

# 6. Event Pipeline

Every newly received update should follow:

```text
RAW EVENT
↓
SCHEMA VALIDATION
↓
LOCATION VALIDATION
↓
TIMESTAMP VALIDATION
↓
DUPLICATE CHECK
↓
FRESHNESS CHECK
↓
NORMALIZATION
↓
CONFIDENCE
↓
DATA FUSION
↓
MOBILITY STATE
```

---

# 7. Event Identity

Every incoming event should have a way to identify
whether it is:

- New
- Updated
- Duplicate
- Resolved
- Expired

Potential identifiers:

- Provider event ID
- Source ID + timestamp
- Geographic key
- Internal event ID

This prevents repeated source updates from creating
duplicate records.

---

# 8. Freshness

Every dynamic signal should contain:

```text
observed_at
received_at
processed_at
expires_at
freshness_state
```

Example:

```text
Observed:
18:42:00

Received:
18:42:04

Processed:
18:42:05

Age:
5 seconds

State:
FRESH
```

---

# 9. Freshness States

Possible states:

### FRESH

Data is within the expected freshness window.

### AGING

Data is becoming old but may still be useful.

### STALE

Data has exceeded its normal freshness threshold.

### EXPIRED

Data should no longer influence current mobility state.

Thresholds should be configured per source and
data type.

---

# 10. Real-Time Mobility State

The system maintains a current state for:

- Road segments
- Intersections
- Transit stations
- Crowd zones
- Incidents
- Events
- Weather areas

Example:

```text
Location:
Road Segment 124

Traffic:
HIGH

Incident:
ACCIDENT

Crowd:
MEDIUM

Weather:
HEAVY RAIN

Waterlogging Risk:
HIGH

Hotspot:
EMERGING

Last Updated:
18:42:05
```

---

# 11. State Updates

When a new event arrives:

```text
New Event
↓
Affected Entity Identified
↓
Current State Retrieved
↓
State Recalculated
↓
New State Stored
↓
Related Intelligence Recalculated
```

Only affected areas should be recalculated
where practical.

---

# 12. Dependency Propagation

A single event may affect several parts
of the system.

Example:

```text
Accident
↓
Road Segment
↓
Traffic Impact
↓
Nearby Routes
↓
Hotspot Score
↓
User Alerts
```

Another example:

```text
Metro disruption
↓
Station crowd
↓
Nearby road pressure
↓
Crowd hotspot
↓
Route evaluation
```

---

# 13. Real-Time Intelligence Trigger

Important state changes should trigger
recalculation.

Possible triggers:

- Major incident
- Road closure
- Large traffic change
- Crowd surge
- Heavy rainfall
- Waterlogging detection
- Major event activation
- Transit disruption

The threshold for triggering intelligence
should remain configurable.

---

# 14. Push to Frontend

After the backend mobility state changes:

```text
Mobility State Update
↓
Frontend Notification
↓
Map Update
↓
Panel Update
↓
Route Update
```

Possible technologies:

- WebSockets
- Server-Sent Events
- Short polling

Final technology selection remains pending.

---

# 15. WebSockets

Potential use:

```text
Backend
⇄
Frontend
```

Useful for:

- Live map updates
- Incident updates
- Hotspot changes
- Operator dashboard changes
- Route status changes

Advantages:

- Two-way communication
- Low-latency updates
- Useful for interactive dashboards

Limitations:

- More connection management
- Requires careful scaling
- More infrastructure complexity

---

# 16. Server-Sent Events

Potential use:

```text
Backend
↓↓↓↓
Frontend
```

Useful when the primary requirement is
server-to-client updates.

Potential use cases:

- Incident alerts
- Hotspot updates
- Mobility-state updates
- Dashboard events

Final choice remains pending.

---

# 17. Polling

The frontend periodically requests state.

Example:

```text
Every 10 seconds
↓
GET latest mobility state
↓
Update UI
```

Advantages:

- Very simple
- Easy to debug
- Easy fallback

Limitations:

- More repeated requests
- Less efficient
- Less immediate than push-based updates

Polling may be sufficient for parts of
the MVP.

---

# 18. Recommended Hybrid Approach

The system does not need to use one mechanism
for everything.

Possible architecture:

```text
External APIs
↓
Polling / Webhooks / Feeds
↓
Backend
↓
Mobility State
↓
WebSocket / SSE
↓
Frontend
```

For slower-changing information:

```text
Polling
```

For important live changes:

```text
Push update
```

The final implementation choice is pending.

---

# 19. Source Failure

If a source fails:

```text
Source Failure
↓
Record Error
↓
Record Last Successful Update
↓
Mark Source Stale
↓
Reduce Confidence
↓
Continue Other Sources
↓
Retry
```

When the source returns:

```text
Source Recovers
↓
Fetch Latest Data
↓
Validate
↓
Restore Source State
```

---

# 20. Out-of-Order Events

Events may arrive late or in the wrong order.

Example:

```text
Event A:
18:40

Event B:
18:42

Event A arrives after Event B
```

TrafficPulse should use timestamps and
source event identifiers to prevent older
events from incorrectly overwriting newer state.

---

# 21. Duplicate Events

The same incident may be received from
multiple sources.

Example:

```text
Official report
+
User report
+
Partner feed
```

These may refer to one real-world event.

The system should identify related events
using:

- Location
- Time
- Type
- Description
- Provider IDs

and combine them where appropriate.

---

# 22. Event Resolution

A dynamic event should not remain active forever.

```text
REPORTED
↓
VALIDATING
↓
ACTIVE
↓
RESOLVED
↓
EXPIRED
```

Expiration depends on:

- Source
- Incident type
- Last update
- Resolution signal

---

# 23. Real-Time Data Storage

Potential architecture:

### Persistent database

Stores:

- Mobility state
- Incidents
- Sources
- Historical events
- Route information
- Confidence metadata

### Fast state layer

Potentially stores:

- Current mobility state
- Temporary event state
- Frequently accessed data

Final technology is pending.

---

# 24. Historical Event Storage

Real-time events should not simply disappear.

Important state changes may be retained
for:

- Trend analysis
- Historical comparisons
- Hotspot analysis
- Model development
- System debugging

Retention policy remains to be defined.

---

# 25. Real-Time Security

Real-time endpoints must:

- Authenticate protected users
- Validate incoming events
- Rate-limit requests
- Protect WebSocket/SSE connections
- Prevent unauthorized event injection
- Keep API credentials secret

Operator incident creation should require
appropriate authorization.

---

# 26. Real-Time Privacy

Real-time systems should avoid unnecessary
individual-level data.

Prefer:

- Aggregated crowd state
- Zone-level mobility
- Road-segment traffic
- Anonymized system signals

Avoid unnecessary storage of:

- Personal identities
- Individual trajectories
- Unnecessary device identifiers

---

# 27. Hackathon MVP

The MVP should demonstrate:

- New incident update
- Traffic state change
- Crowd state change
- Hotspot recalculation
- Map update
- Route recalculation
- Operator dashboard update

The demo may use controlled simulation for
missing live signals, provided those signals
are clearly labelled as simulated.

---

# 28. Example Real-Time Demo

```text
Operator reports accident
        ↓
Backend receives event
        ↓
Incident validated
        ↓
Road segment identified
        ↓
Mobility state updated
        ↓
Traffic impact calculated
        ↓
Hotspot score recalculated
        ↓
Route scores recalculated
        ↓
Frontend receives update
        ↓
Map changes
        ↓
Recommended route changes
```

---

# 29. Long-Term Real-Time Vision

Future versions could support:

- Streaming mobility feeds
- More IUDX resources
- City-level real-time sensors
- Live transit positions
- Live crowd analytics
- Advanced event streams
- Predictive state transitions
- Multi-city monitoring

---

# 30. Current Status

### Defined

- 🟢 Real-time event pipeline
- 🟢 Source-specific ingestion
- 🟢 Freshness model
- 🟢 Event lifecycle
- 🟢 Failure handling
- 🟢 Data propagation
- 🟢 Frontend update concept

### Pending

- 🟡 WebSockets vs SSE vs polling
- 🟡 Queue/event-bus technology
- 🟡 Storage technology
- 🟡 Exact refresh intervals
- 🟡 Scaling strategy
- 🟡 Final source implementations

---

## Related Notes

- [[Self-Updating Mobility Intelligence]]
- [[System Architecture]]
- [[Mobility Intelligence Engine]]
- [[Routing Architecture]]
- [[Incident Data India]]
- [[Crowd Data]]
- [[Weather Data India]]
- [[Event Data]]
- [[MVP]]