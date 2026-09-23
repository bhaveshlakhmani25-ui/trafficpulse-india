
# Crowd Data India

## 🎯 Research Question

How can TrafficPulse estimate or obtain crowd density
around Indian roads, metro stations, markets, colleges,
events and other mobility hotspots?

---

## 1. Current Finding

There is no single nationwide public API that we have
verified for live pedestrian/crowd density across Indian cities.

Therefore TrafficPulse should use a multi-signal approach.

---

## 2. India Urban Data Exchange (IUDX)

### What is it?

IUDX is an urban-data exchange platform created to allow
Indian cities and urban agencies to share and access
city-related datasets.

It is implemented by IISc Bengaluru under the Smart Cities
Mission / Ministry of Housing and Urban Affairs ecosystem.

Source:
https://iudx.org.in/

### Relevant capability

IUDX includes city feeds and files from video systems
deployed in smart cities.

These can include:

- Surveillance cameras
- Traffic-junction cameras
- Special-purpose monitoring cameras
- Flood monitoring
- Traffic monitoring

Source:
https://iudx.org.in/cities/

### TrafficPulse relevance

🟢 Important potential architecture/data source

🟡 Actual availability depends on the city and resource

🟡 Access permissions / authentication may apply

❌ Do not assume all CCTV feeds are publicly accessible

---

## 3. Indian Smart-City Overcrowding Analytics

MoHUA's city-data use-case documentation describes
overcrowding analytics deployed using CCTV systems.

The system can:

- Configure occupancy parameters
- Detect overcrowding
- Generate alerts
- Support real-time response by authorities

Source:
https://mohua.gov.in/dmaf/assets/pdf/Data_Compendium.pdf

### Important finding

This proves that real-time crowd/overcrowding analytics
is already being used in Indian smart-city deployments.

However, this does NOT mean TrafficPulse can directly
access every such camera feed.

---

## 4. CCTV-Based Crowd Detection

A possible technical input is computer vision applied
to authorized camera feeds.

Concept:

Camera / video
    ↓
Person detection
    ↓
People count / density estimation
    ↓
Area occupancy
    ↓
Crowd index
    ↓
TrafficPulse

Possible outputs:

- People count
- Density level
- Occupancy %
- Crowd trend
- Unusual crowd increase

---

## 5. Privacy / Access Constraint

TrafficPulse should not depend on unrestricted access
to individual-level location or surveillance data.

The preferred signal is an aggregated result such as:

- people_count
- density_level
- occupancy_percentage
- trend
- timestamp
- geographic zone

The system should avoid storing unnecessary
person-level information.

---

## 6. Other Crowd Signals

When live computer-vision data is unavailable,
TrafficPulse can estimate crowd conditions from:

### Transit demand

- Metro ridership
- Peak-hour demand
- Station schedules
- Passenger-flow statistics

### Location context

- Metro stations
- Bus stops
- Markets
- Colleges
- Stadiums
- Hospitals
- Event venues

### Time patterns

- Morning rush
- Evening rush
- Weekends
- Holidays
- Festival periods

### Events

- Concerts
- Sports events
- Public gatherings
- Exhibitions

### Weather

- Heavy rain
- Heat
- Extreme weather

### User reports

- Crowd reports
- Station congestion reports
- Roadside crowd reports

---

## 7. Proposed TrafficPulse Crowd Index

This is a TrafficPulse design proposal,
NOT an established scientific formula.

Inputs:

Transit demand
+
POI type
+
Time-of-day
+
Event signal
+
Weather
+
User reports
+
Live crowd observation (when available)

        ↓

Crowd Index

        ↓

0–39   Low
40–59  Moderate
60–74  High
75–100 Severe

The thresholds must be validated during development
and should be treated as configurable model parameters.

---

## 8. Trend Detection

Current crowd level alone is not enough.

TrafficPulse should also detect:

Current crowd
+
Previous crowd
+
Rate of increase

Example:

10 min ago → 48
5 min ago  → 61
Now        → 77

        ↓

Rapidly increasing crowd

        ↓

Potential emerging hotspot

---

## 9. Confidence

Every crowd estimate should include:

- Source
- Timestamp
- Freshness
- Confidence
- Signal type

Example:

Crowd Index: 82
Confidence: Medium
Source:
- Metro demand pattern
- Event
- User reports
Last updated: 2 minutes ago

---

## 10. Multi-Source Crowd Intelligence

Live CCTV analytics
+
Metro demand
+
Events
+
Time pattern
+
POI context
+
Weather
+
User reports

        ↓

Crowd Intelligence Engine

        ↓

Estimated Crowd State

        ↓

Hotspot Detection

---

## 11. Real vs Estimated

### REAL / OBSERVED

Actual authorized sensor or CCTV analytics

### HISTORICAL

Metro ridership / historical demand pattern

### ESTIMATED

Model-generated crowd index from multiple signals

### REPORTED

User/operator submitted crowd observation

### SIMULATED

Hackathon-only synthetic signal

The UI and system metadata should clearly distinguish
these categories.

---

## 12. Important Limitation

We have NOT established:

❌ A single nationwide live pedestrian-density API

❌ Universal access to Indian smart-city CCTV feeds

❌ Live crowd counts for every metro station

Therefore TrafficPulse should use a hybrid crowd model.

---

## 13. Preliminary Architecture

              CROWD SIGNALS
                    │
       ┌────────────┼─────────────┐
       ↓            ↓             ↓
    Sensors       Transit       Context
    / CCTV        demand         / events
       │            │             │
       └────────────┼─────────────┘
                    ↓
             Crowd Fusion
                    ↓
             Crowd Index
                    ↓
          Trend / Anomaly
                    ↓
           Hotspot Engine
                    ↓
        Route + Operator Alerts

---

## Research Status

🟢 Real-time crowd analytics is technically demonstrated
in Indian smart-city deployments.

🟢 IUDX provides an important urban-data exchange pathway.

🟡 Live feed accessibility varies by city/resource.

🔴 Nationwide public live crowd API unresolved.

🟢 Hybrid crowd-estimation model is feasible as a
TrafficPulse design direction.
## Status
🔴 Research not started

## Question

## Findings

## Sources

## Decision
**Pending**
