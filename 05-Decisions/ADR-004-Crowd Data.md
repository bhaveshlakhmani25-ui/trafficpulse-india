# ADR-004 — Crowd Data Strategy

## Status

🟡 PENDING

---

## Decision

How will TrafficPulse obtain or estimate crowd density
across Indian cities?

---

## Context

Crowd intelligence is one of the main differentiators
of TrafficPulse.

The system should understand crowd conditions around:

- Metro stations
- Bus stops
- Markets
- Colleges
- Stadiums
- Event venues
- Other mobility hotspots

The system should combine available observed signals
with estimated and historical signals when direct
live crowd measurements are unavailable.

---

# 1. Requirements

The crowd-data strategy should ideally provide:

- Current crowd condition
- Crowd trend
- Geographic location
- Timestamp
- Source
- Freshness
- Confidence
- Historical context
- City scalability
- Privacy-aware data handling

---

# 2. Direct Live Crowd Data

Possible sources include:

- Authorized CCTV analytics
- Smart-city sensor systems
- IUDX resources
- Transit systems with live passenger information
- Other permitted sensor systems

## Potential advantages

- Direct observation
- Real-time updates
- Actual crowd measurement

## Limitations

- Availability varies by city
- Access may require authorization
- Not all CCTV systems expose public APIs
- Privacy and data-access requirements
- No verified nationwide public live crowd API

## Status

🟡 Potentially useful where authorized

🔴 Not suitable as the only nationwide source

---

# 3. Transit Demand Signals

Potential signals:

- Metro ridership
- Passenger-flow data
- Peak-hour demand
- Station schedules
- GTFS / GTFS-Realtime where available
- Bus demand information

These can provide useful context for estimating
crowd pressure around transit locations.

## Strengths

- Useful for recurring patterns
- Relevant to mobility
- Available from some Indian transit systems

## Limitations

- Often aggregate rather than live
- Coverage varies by city
- Station-by-station live crowd data is not universal

## Status

🟢 Strong supporting signal

---

# 4. Event Signals

Events can create crowd increases around specific locations.

Potential event signals:

- Event location
- Event category
- Start time
- End time
- Expected attendance
- Venue capacity
- Event status

Example:

```text
Large event
+
20,000 expected attendees
+
Metro station nearby
+
Friday evening
↓
Expected crowd pressure increases
```

## Status

🟢 Strong predictive/supporting signal

---

# 5. Time-of-Day Signals

Crowd levels can vary according to:

- Morning commute
- Evening commute
- Weekends
- Holidays
- Festivals
- School/college hours
- Office hours

These patterns can become historical/contextual
inputs to the crowd model.

## Status

🟢 Supporting signal

---

# 6. Weather Signals

Weather may influence crowd movement.

Examples:

- Heavy rainfall
- Extreme heat
- Severe weather
- Flooding/waterlogging conditions

Weather should be treated as a contextual signal,
not direct crowd measurement.

## Status

🟢 Supporting signal

---

# 7. User / Operator Reports

Potential inputs:

- Crowd reports
- Station congestion reports
- Event crowd reports
- Operator observations

Reports should be validated before becoming
high-confidence system state.

## Status

🟡 Useful supplementary signal

---

# 8. Proposed Hybrid Crowd Model

TrafficPulse should combine multiple signals.

```text
Observed Crowd
+
Transit Demand
+
Events
+
Time Pattern
+
Weather
+
User / Operator Reports
+
Location / POI Context

        ↓

Crowd Fusion

        ↓

Crowd Index

        ↓

Trend Detection

        ↓

Mobility Intelligence
```

---

# 9. Crowd Index

This is a TrafficPulse design model,
not an established scientific formula.

Example:

Crowd Index =

30% Observed Crowd
+
20% Transit Demand
+
15% Event Impact
+
15% Time Pattern
+
10% Reported Crowd
+
10% Environmental Context

The weights must remain configurable.

If an observed live signal is unavailable,
the model should reduce its reliance on that signal
and use available evidence.

---

# 10. Crowd States

### LOW

Normal or low crowd pressure.

### MODERATE

Meaningful crowd presence.

### HIGH

Significant crowd concentration.

### SEVERE

Very high crowd pressure or overcrowding risk.

Exact thresholds must be validated during implementation.

---

# 11. Crowd Trend

Current crowd level alone is insufficient.

The system should track:

Current Crowd
+
Previous Crowd
+
Rate of Change

Example:

```text
10 min ago → 48
5 min ago  → 61
Now        → 77
```

Result:

**Rapidly increasing crowd**

This can contribute to emerging-hotspot detection.

---

# 12. Crowd Confidence

Crowd estimates should contain:

- Confidence
- Source count
- Source types
- Timestamp
- Freshness
- Evidence type

Example:

```text
Crowd Index:
82

Confidence:
MEDIUM

Evidence:
- Metro demand pattern
- Active event
- User reports

Last Updated:
18:42
```

Confidence represents evidence quality.

It should not automatically be interpreted
as an ML probability.

---

# 13. Evidence Types

Crowd information should be classified as:

### OBSERVED

Direct authorized measurement or sensor analytics.

### REPORTED

User/operator/source report.

### HISTORICAL

Historical transit or crowd pattern.

### ESTIMATED

Calculated from multiple signals.

### PREDICTED

Forecast of future crowd conditions.

### SIMULATED

Hackathon-generated synthetic information.

The interface must distinguish these categories.

---

# 14. Privacy

TrafficPulse should prefer aggregate information.

Prefer:

- Crowd index
- People count
- Occupancy percentage
- Zone-level density
- Aggregated transit demand

Avoid unnecessary storage of:

- Individual identities
- Face information
- Individual movement histories
- Unnecessary personal identifiers

Camera-based analytics should produce aggregate
outputs whenever possible.

---

# 15. City Scalability

The crowd model should work with different
data availability levels.

### City A

Live sensor + transit + event data

### City B

Transit + event + historical data

### City C

Weather + event + historical + reports

The intelligence engine should adapt to
available evidence.

---

# 16. Missing Data Strategy

If direct crowd data is unavailable:

```text
Live observation unavailable
        ↓
Transit demand
+
Events
+
Time pattern
+
Weather
+
Reports
        ↓
Estimated Crowd Index
```

The UI must label the result as **ESTIMATED**.

---

# 17. Source Failure

If a crowd source becomes unavailable:

1. Mark source as stale
2. Reduce confidence where appropriate
3. Continue using other available signals
4. Update evidence metadata
5. Recover automatically when source returns

The intelligence engine should not stop.

---

# 18. Hackathon MVP Strategy

For the MVP, prioritize:

- Crowd index
- Crowd trend
- Metro / POI context
- Event influence
- Incident interaction
- Clear estimated/simulated labels

If an authorized live crowd source is available,
it can be integrated as an additional signal.

Do not make access to live CCTV or private feeds
a mandatory MVP dependency.

---

# 19. Long-Term Strategy

Future TrafficPulse versions could support:

- More IUDX integrations
- Smart-city sensor feeds
- Transit real-time feeds
- Authorized computer-vision analytics
- More city-specific crowd sources
- Improved predictive models
- Historical crowd baselines
- Multi-modal passenger demand

---

# 20. Comparison

| Source / Signal | Live | Geographic Detail | Nationwide | Privacy Risk | Role |
|---|---|---|---|---|---|
| Authorized CCTV analytics | ✅ | High | ❌ | Higher | Direct observation |
| IUDX / Smart City data | Varies | Varies | ❌ | Varies | City-specific |
| Metro demand | Varies | Station / line | ❌ | Low | Transit context |
| GTFS / GTFS-Realtime | Varies | Transit network | ❌ | Low | Transit context |
| Events | Varies | Venue / area | 🟡 | Low | Predictive signal |
| Weather | ✅ | Regional | ✅ | Low | Context |
| User reports | Near real-time | Location | 🟡 | Medium | Supporting signal |
| Simulation | Simulated | Configurable | ✅ | Low | Hackathon fallback |

---

# 21. Preliminary Direction

Current research suggests:

### Primary approach

Hybrid crowd intelligence.

### Direct observation

Use only where an authorized and accessible
source exists.

### Supporting signals

- Transit demand
- Events
- Time patterns
- Weather
- User/operator reports
- Geographic context

### Fallback

Clearly labelled estimation or simulation.

This is NOT the final decision.

---

# 22. Final Decision

**PENDING**

---

## Decision Criteria

Evaluate:

1. Data availability
2. Live capability
3. Geographic coverage
4. Update frequency
5. Privacy
6. Licensing/access
7. Reliability
8. Integration effort
9. Explainability
10. Fallback options

---

## Decision Date

Not decided yet.

---

## Consequences

The crowd-data decision will determine:

- Crowd-data adapters
- Crowd index design
- Hotspot scoring
- Privacy architecture
- Confidence model
- Data-source requirements
- MVP implementation

---

## Related Notes

- [[Crowd Data]]
- [[Mobility Intelligence Engine]]
- [[Self-Updating Mobility Intelligence]]
- [[System Architecture]]
- [[ADR-001-City]]
- [[ADR-002-Traffic-Data]]
- [[ADR-003-Routing]]
- [[MVP]]

## Question
How will crowd density be measured or estimated?

## Options
- Public datasets
- Transit signals
- Event signals
- User reports
- Explainable simulation
- Hybrid model

## Decision
**PENDING**
