
# Event Data India

## 🎯 Research Question

How can TrafficPulse automatically discover events that may
increase traffic and crowd density in Indian cities?

---

## 1. Why Events Matter

Events can create mobility changes before a traffic incident
is reported.

Examples:

- Concerts
- Sports matches
- Festivals
- Religious gatherings
- Exhibitions
- Conferences
- Public celebrations
- Government events
- Fairs

Event signal
    ↓
Expected attendance
    ↓
Affected location
    ↓
Expected time window
    ↓
Crowd / traffic risk
    ↓
Mobility Intelligence

---

## 2. Incredible India

### Official source

Ministry of Tourism — Incredible India

Source:
https://www.incredibleindia.gov.in/en/festivals-and-events

### Available information

The platform provides a searchable Festivals & Events section
with filters including:

- Year
- Month
- State / UT
- Event type / interest
- Festivals
- Events

Examples of categories include:

- Music & Arts
- Cultural & Spiritual
- Sports & Adventure
- Food & Recreation
- Shopping
- National occasions

### TrafficPulse usefulness

🟢 National event discovery

🟢 Location/context for major public events

🟢 Date/time information for planned events

🟡 Better suited to major/public events than all local events

### Important limitation

This is a web-based event catalogue.

We have NOT established a public API that guarantees
machine-readable real-time updates for every listed event.

Status:
🟢 Useful source
🟡 Automated ingestion needs further investigation

---

## 3. City / Municipal Event Sources

### Example: Bengaluru

Greater Bengaluru Authority publishes city information,
events/news and city-management information.

Source:
https://bbmp.gov.in/

### Potential use

City-specific event information may provide
more local context than a national tourism calendar.

### Limitation

A standardized nationwide event API is not established.

Different cities may expose:

- Web pages
- RSS feeds
- calendars
- PDFs
- APIs
- no machine-readable feed

Therefore the source registry must support different
input formats.

Status:
🟡 Useful city-level source
🟡 Format varies by city

---

## 4. Commercial Event Platforms

### Eventbrite

Eventbrite's public event-search API was shut down
on December 12, 2019.

Source:
https://www.eventbrite.com/platform/new/api

### TrafficPulse conclusion

❌ Do not depend on the old Eventbrite public
event-search API.

Other event platforms should be evaluated individually
for current API access and usage rights.

---

## 5. Google Places

Google Places API can find places and place information,
but it should NOT be treated as a general event-search API.

Source:
https://developers.google.com/maps/documentation/places/web-service

### TrafficPulse role

🟢 Useful for:

- Event venue discovery
- Place information
- Venue geographic context

🔴 Not established as our event feed.

---

## 6. Event Data Model

Every event entering TrafficPulse should be normalized:

Event ID
+
Name
+
Category
+
Venue
+
Latitude
+
Longitude
+
Start time
+
End time
+
Expected attendance
+
Source
+
Source URL
+
Confidence
+
Last updated

---

## 7. Event Impact Model

Not every event has the same mobility impact.

TrafficPulse should estimate:

### Event Impact Score

Factors:

- Expected attendance
- Venue capacity
- Event category
- Start/end time
- Duration
- Location
- Nearby transit
- Nearby roads
- Historical impact
- Current traffic
- Weather

Example:

Large concert
+
20,000 expected attendees
+
Friday 6 PM
+
Near metro station
+
Nearby arterial road
        ↓
HIGH MOBILITY IMPACT

---

## 8. Planned vs Actual

### PLANNED

The event is scheduled.

### ACTIVE

Current time is inside the event window.

### COMPLETED

Event window has ended.

### CANCELLED

Source reports cancellation.

The state should automatically change based on
timestamps and source updates.

---

## 9. Event → Crowd Prediction

Event detected
      ↓
Venue location
      ↓
Expected attendance
      ↓
Nearby metro / bus / roads
      ↓
Time-of-day
      ↓
Weather
      ↓
Historical pattern
      ↓
Expected crowd pressure

This is a prediction, not a direct measurement.

---

## 10. Event → Traffic Prediction

Event
   ↓
Nearby road network
   ↓
Expected attendance
   ↓
Expected arrival/departure window
   ↓
Expected road demand
   ↓
Traffic impact score

This can be combined with live traffic signals
when available.

---

## 11. Self-Updating Event Pipeline

Official event source
        ↓
Source discovery / ingestion
        ↓
Event normalization
        ↓
Duplicate detection
        ↓
Validation
        ↓
Location matching
        ↓
Impact estimation
        ↓
Mobility State
        ↓
Crowd / traffic intelligence

---

## 12. Source Reliability

Each event should store:

Source
Freshness
Last updated
Confidence
Verification state

Example:

Official government event:
High confidence

Official venue:
High confidence

Established ticket/event platform:
Medium/High depending on source

User-submitted event:
Low/Medium until verified

---

## 13. Important Finding

There is no single verified nationwide public API
that provides every event relevant to urban mobility
in India.

Therefore TrafficPulse should use a source-registry
approach rather than depend on one event provider.

---

## 14. Proposed India-Wide Strategy

NATIONAL
- Incredible India / government event calendars

CITY
- Municipal / smart-city sources
- Metro / stadium / venue calendars

OPTIONAL COMMERCIAL
- Event platforms with permitted API access

USER / OPERATOR
- Verified event reports

FALLBACK
- Operator-created events for missing information

---

## Research Status

🟢 Event data is available from official national sources

🟡 City-level machine-readable availability varies

🔴 Nationwide universal event API unresolved

🟢 Event-impact modelling is feasible
## Status
🔴 Research not started

## Question

## Findings

## Sources

## Decision
**Pending**
