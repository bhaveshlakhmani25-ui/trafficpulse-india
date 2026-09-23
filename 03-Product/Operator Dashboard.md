
## Purpose

Provide city and traffic-control operators with a unified
view of mobility conditions and the intelligence needed
to identify, understand, and prioritize emerging problems.

The dashboard is designed around:

**Monitor → Detect → Understand → Prioritize → Respond**

---

# 1. Dashboard Overview

The main dashboard should provide a quick summary of
the city's current mobility state.

### Key Metrics

- Active incidents
- Emerging hotspots
- High-congestion zones
- Crowd surges
- Weather-related mobility risks
- Route disruptions
- Data freshness

---

# 2. City Selector

The operator should be able to select:

- City
- State / region
- Relevant operational area

Example:

```text
City:
Bengaluru

Region:
Karnataka

Last Updated:
18:42
```

The architecture must support switching between
Indian cities without changing the core intelligence engine.

---

# 3. Main Mobility Map

The map is the primary operational interface.

It should display:

### Traffic

- Normal traffic
- Moderate congestion
- High congestion
- Severe congestion

### Incidents

- Accident
- Waterlogging
- Road closure
- Construction
- Vehicle breakdown
- Other verified hazards

### Crowd

- Metro station crowd
- Market crowd
- Event crowd
- Other significant crowd zones

### Hotspots

- Watch
- High Risk
- Emerging Hotspot

---

# 4. Map Layers

Operators should be able to toggle:

- Traffic
- Incidents
- Crowd
- Hotspots
- Weather
- Transit
- Events
- Important POIs

This allows operators to focus on the
information relevant to the current situation.

---

# 5. Incident Panel

Display active incidents in a list.

Each incident should contain:

- Type
- Location
- Severity
- Timestamp
- Status
- Source
- Confidence
- Freshness

Example:

```text
ACCIDENT
Silk Board Corridor

Severity:
HIGH

Status:
ACTIVE

Reported:
18:40

Confidence:
HIGH
```

---

# 6. Incident Details

Selecting an incident opens its details.

### Information

- Incident type
- Exact/approximate location
- Description
- Source
- Report time
- Last update
- Severity
- Confidence
- Affected roads
- Estimated impact

### Related intelligence

- Traffic deterioration
- Crowd conditions
- Weather conditions
- Nearby events
- Hotspot status

---

# 7. Hotspot Panel

Show currently detected mobility hotspots.

Each hotspot should include:

- Location
- Hotspot state
- Score
- Severity
- Trend
- Main causes
- Confidence
- Last updated

Example:

```text
EMERGING MOBILITY HOTSPOT

Location:
Silk Board Corridor

Score:
84

Severity:
HIGH

Trend:
WORSENING

Confidence:
HIGH
```

---

# 8. Hotspot Explanation

The operator should be able to answer:

### What is happening?

Current mobility condition.

### Why is it happening?

Contributing signals.

### Is it getting worse?

Trend analysis.

### What is affected?

Roads, transit, crowd zones, and nearby areas.

### How reliable is the information?

Source confidence and freshness.

---

# 9. Intelligence Panel

For the selected location, display:

### Traffic

Current traffic level and trend.

### Crowd

Current crowd index and trend.

### Incidents

Active incidents and severity.

### Weather

Current relevant weather conditions.

### Events

Nearby active or upcoming events.

### Waterlogging Risk

Estimated risk where sufficient signals are available.

---

# 10. Trend Visualization

Operators should be able to see how conditions
change over time.

Examples:

### Traffic

```text
42 km/h
↓
36 km/h
↓
29 km/h
↓
21 km/h
```

### Crowd

```text
48
↓
59
↓
68
↓
77
```

The dashboard should emphasize:

- Current value
- Direction of change
- Rate of change
- Time window

---

# 11. Incident Reporting

Operators can manually create an incident.

### Input

- Incident type
- Location
- Severity
- Description
- Timestamp
- Optional evidence/source

### Supported types

- Accident
- Waterlogging
- Road closure
- Construction
- Vehicle breakdown
- Other disruption

---

# 12. Incident Lifecycle

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

The lifecycle prevents stale incidents
from remaining active indefinitely.

---

# 13. Network Impact

After an incident is created or detected,
the system evaluates its impact.

```text
Incident
↓
Affected road
↓
Nearby road segments
↓
Traffic impact
↓
Transit impact
↓
Crowd impact
↓
Hotspot impact
```

---

# 14. Route Impact

Operators should be able to see how an incident
changes route conditions.

Example:

```text
Before Incident

Route A:
24 min

After Incident

Route A:
35 min

Alternative Route B:
28 min
```

The system should show which route conditions
changed and why.

---

# 15. Alerts

The operator dashboard may generate alerts for:

### Emerging Hotspot

Multiple mobility signals combine.

### Rapid Congestion Increase

Traffic deteriorates beyond a configurable threshold.

### Crowd Surge

Crowd level increases rapidly.

### Major Incident

High-severity incident detected.

### Weather Risk

Weather conditions may create mobility disruption.

### Data Source Failure

Important source becomes stale or unavailable.

---

# 16. Alert Priority

Example priority levels:

### Critical

Immediate mobility impact.

### High

Significant disruption developing.

### Medium

Condition requires monitoring.

### Low

Informational or early signal.

The exact thresholds remain configurable.

---

# 17. Recommended Operator Actions

The system may provide decision-support suggestions such as:

- Monitor affected corridor
- Review nearby intersections
- Check alternative routes
- Monitor nearby transit station
- Review crowd conditions
- Verify incident
- Monitor waterlogging risk

TrafficPulse should present these as
decision-support suggestions, not autonomous
authority commands.

---

# 18. Source Transparency

For each major intelligence result, operators
should be able to inspect:

- Source
- Timestamp
- Freshness
- Evidence type
- Confidence

Evidence types:

- Observed
- Reported
- Historical
- Estimated
- Predicted
- Simulated

---

# 19. Data Quality Indicator

The dashboard should communicate data quality.

Example:

```text
Traffic
● Fresh

Crowd
● Fresh

Weather
● Fresh

Incident
● Verified

Historical
● Reference
```

For stale data:

```text
⚠ Data Aging
```

For unavailable data:

```text
⚠ Source Unavailable
```

Operators should not receive false certainty.

---

# 20. Operator Workflow

```text
OPEN DASHBOARD
      ↓
VIEW CITY STATE
      ↓
SCAN MAP
      ↓
IDENTIFY ALERT / HOTSPOT
      ↓
OPEN DETAILS
      ↓
UNDERSTAND CAUSES
      ↓
REVIEW AFFECTED NETWORK
      ↓
MONITOR / VERIFY / RESPOND
```

---

# 21. MVP Operator Dashboard

For the hackathon MVP, prioritize:

- Main mobility map
- Active incident panel
- Hotspot panel
- Hotspot explanation
- Traffic trend
- Crowd trend
- Incident reporting
- Route impact
- Data freshness / simulation indicator

Advanced operator features can be added later.

---

# 22. Long-Term Dashboard

Future versions may add:

- Multi-city monitoring
- Historical dashboards
- Corridor analytics
- Predictive alerts
- Infrastructure analytics
- Transit coordination
- Advanced event impact analysis
- Automated reporting
- City-level mobility KPIs

---

# 23. Current Status

- 🟢 Dashboard purpose defined
- 🟢 Core map layers defined
- 🟢 Incident workflow defined
- 🟢 Hotspot workflow defined
- 🟢 Intelligence panel defined
- 🟢 MVP dashboard scope defined
- 🟡 Final visual design pending
- 🟡 Final alert thresholds pending
- 🟡 Final data integrations pending

---

## Related Notes

- [[MVP]]
- [[User Flow]]
- [[Demo Flow]]
- [[Target Users]]
- [[Mobility Intelligence Engine]]
- [[System Architecture]]
- [[Self-Updating Mobility Intelligence]]