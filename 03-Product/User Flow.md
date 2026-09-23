
## Purpose

Define how users interact with TrafficPulse India.

TrafficPulse has two primary experiences:

1. Commuter
2. City Operator

---

## 1. Commuter Flow

```text
Open TrafficPulse
        ↓
Select / detect city
        ↓
View current mobility map
        ↓
Enter origin
        ↓
Enter destination
        ↓
Request route
        ↓
TrafficPulse evaluates:
- Travel time
- Congestion
- Incidents
- Crowd exposure
- Other validated mobility signals
        ↓
Compare candidate routes
        ↓
Recommended route
        ↓
Show ETA + distance
        ↓
Explain WHY
        ↓
Start navigation / continue monitoring
        ↓
Receive alerts if conditions change
```

---

## 2. Commuter — View Mobility Map

The commuter should understand:

- Traffic conditions
- Active incidents
- Crowd zones
- Important mobility hotspots
- Relevant transit locations
- Current data freshness where appropriate

The map should prioritize the most important active conditions.

---

## 3. Commuter — Route Search

The user provides:

### Origin

Starting location.

### Destination

Target location.

TrafficPulse requests candidate routes.

---

## 4. Route Evaluation

Each route is evaluated using the current mobility state.

```text
Route
↓
Travel Time
+
Congestion
+
Incident Impact
+
Crowd Exposure
+
Other validated penalties
↓
Route Score
```

---

## 5. Route Recommendation

The UI should show:

### Recommended Route

- ETA
- Distance
- Traffic level
- Major incidents
- Crowd exposure
- Reason for recommendation

Example:

> **Route B recommended**
>
> Adds 4 minutes but avoids the accident corridor and a high-crowd zone near the metro station.

---

## 6. Dynamic Route Update

The route should not be considered permanently optimal.

```text
New incident
↓
Traffic deterioration
↓
Mobility state changes
↓
Route scores change
↓
Alternative route evaluated
↓
User receives updated recommendation
```

---

## 7. Commuter Alerts

### Traffic Alert

Congestion increasing on the current route.

### Incident Alert

Accident, closure, or hazard detected.

### Crowd Alert

High or rapidly increasing crowd conditions.

### Weather Alert

Weather conditions may affect mobility.

### Route Alert

Current route is becoming less favorable.

---

## 8. Operator Flow

```text
Open Operator Dashboard
        ↓
Select city
        ↓
View city mobility state
        ↓
Monitor:
- Traffic
- Incidents
- Crowd
- Weather
- Events
        ↓
Identify hotspot
        ↓
Open hotspot details
        ↓
Understand causes
        ↓
Review affected network
        ↓
Take / recommend action
```

---

## 9. Operator Dashboard

### Overview

- Active incidents
- Emerging hotspots
- Traffic deterioration
- Crowd surges
- Weather-related risks

### Map

- Congested roads
- Incident locations
- Crowd zones
- Hotspots
- Transit context

### Intelligence Panel

For each hotspot:

- Score
- Severity
- Causes
- Trend
- Confidence
- Sources
- Last updated

---

## 10. Operator — Incident Reporting

The operator can report:

- Accident
- Waterlogging
- Road closure
- Construction
- Other mobility disruption

Input:

```text
Incident type
Location
Severity
Description
Timestamp
```

After submission:

```text
Incident
↓
Validation
↓
Mobility State Update
↓
Impact Analysis
↓
Hotspot Recalculation
↓
Route Recalculation
```

---

## 11. Hotspot Investigation Flow

### What is happening?

Current mobility state.

### Why?

Contributing signals.

### How severe?

Hotspot score / severity.

### Is it getting worse?

Trend.

### What is affected?

Roads, transit, crowd zones, and nearby areas.

### Confidence

Evidence quality and source freshness.

---

## 12. Example Hotspot

```text
EMERGING MOBILITY HOTSPOT

Location:
Silk Board Corridor

Severity:
HIGH

Traffic:
WORSENING

Incident:
High-severity accident

Crowd:
HIGH

Weather:
Heavy rainfall

Waterlogging Risk:
HIGH

Confidence:
HIGH
```

---

## 13. Source Transparency

Where appropriate, users/operators should be able to understand whether information is:

- Observed
- Reported
- Historical
- Estimated
- Predicted
- Simulated

The interface must not present simulated information as real-world live information.

---

## 14. Data Freshness

Important dynamic information should show:

- Last updated
- Source
- Freshness state where useful

Example:

```text
Traffic
Updated 18:42
Fresh

Crowd
Updated 18:40
Aging
```

Exact freshness thresholds are source-dependent and remain configurable.

---

## 15. Failure Scenario

```text
Source Failure
↓
TrafficPulse detects stale data
↓
Confidence changes
↓
Other available sources continue
↓
System remains operational
```

The user should not see false certainty.

---

## 16. Core Experience

### Commuter

```text
SEE
↓
UNDERSTAND
↓
CHOOSE
↓
MONITOR
↓
ADAPT
```

### Operator

```text
MONITOR
↓
DETECT
↓
UNDERSTAND
↓
PRIORITIZE
↓
RESPOND
```

---

## 17. MVP Flow

```text
Normal Conditions
        ↓
Incident Appears
        ↓
Traffic Changes
        ↓
Crowd Changes
        ↓
Hotspot Detected
        ↓
Cause Explained
        ↓
Route Evaluated
        ↓
Alternative Recommended
```

This is the primary end-to-end experience for the hackathon demonstration.

---

## Current Status

- 🟢 Commuter flow defined
- 🟢 Operator flow defined
- 🟢 Route interaction defined
- 🟢 Incident interaction defined
- 🟢 Hotspot interaction defined
- 🟢 Data transparency defined
- 🟢 MVP flow defined

---

## Related Notes

- [[MVP]]
- [[Demo Flow]]
- [[Mobility Intelligence Engine]]
- [[System Architecture]]
- [[Self-Updating Mobility Intelligence]]