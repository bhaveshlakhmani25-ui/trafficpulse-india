# Commuter Experience

## Purpose

Define the commuter-facing experience of TrafficPulse India.

The commuter experience should focus on one core goal:

**Help people understand changing mobility conditions and make better route decisions.**

---

# 1. Core Experience

The commuter journey follows:

SEE  
↓  
UNDERSTAND  
↓  
CHOOSE  
↓  
MONITOR  
↓  
ADAPT

---

# 2. Home Screen

The commuter should see:

- Current city
- Mobility map
- Traffic conditions
- Important incidents
- Crowd hotspots
- Active mobility alerts
- Search / route input

The interface should prioritize active and relevant conditions.

---

# 3. Mobility Map

The map should communicate:

### Traffic

- Normal
- Moderate
- High
- Severe

### Incidents

- Accident
- Waterlogging
- Road closure
- Construction
- Other hazards

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

# 4. Location Search

The commuter can provide:

### Origin

Current location or selected location.

### Destination

Search for a destination.

TrafficPulse then evaluates available routes.

---

# 5. Route Results

Each route should display:

- ETA
- Distance
- Traffic condition
- Incident exposure
- Crowd exposure
- Route status
- Recommendation reason

Example:

### Route A

ETA:
24 min

Traffic:
HIGH

Incident:
YES

Crowd Exposure:
HIGH

---

### Route B

ETA:
28 min

Traffic:
MEDIUM

Incident:
NO

Crowd Exposure:
LOW

---

# 6. Recommended Route

TrafficPulse should recommend a route based on
the current mobility state.

Example:

> **Route B recommended**
>
> It adds 4 minutes but avoids the accident corridor
> and high-crowd zone.

The recommendation must be explainable.

---

# 7. Route Cost Concept

Candidate routes are evaluated using:

Travel Time  
+  
Congestion Penalty  
+  
Crowd Exposure Penalty  
+  
Incident Penalty  
+  
Other validated mobility penalties

The exact scoring model remains configurable.

---

# 8. Why This Route?

Every recommendation should answer:

### What is affecting the current route?

Examples:

- Accident
- Congestion
- Crowd
- Waterlogging risk
- Road closure
- Event

### What does the alternative avoid?

Examples:

- Accident corridor
- High-crowd zone
- Severe congestion
- Waterlogging-risk area

---

# 9. Dynamic Route Changes

A selected route should be continuously evaluated
while mobility conditions change.

Example:

Current route  
↓  
New accident detected  
↓  
Traffic worsens  
↓  
Mobility state changes  
↓  
Route score changes  
↓  
Alternative route evaluated  
↓  
Updated recommendation

---

# 10. Commuter Alerts

## Traffic Alert

Traffic on the selected route is increasing.

Example:

> Traffic is worsening ahead. Your ETA may increase.

---

## Incident Alert

A new incident affects the current route.

Example:

> Accident detected ahead on your route.

---

## Crowd Alert

Crowd conditions are increasing near the route.

Example:

> Crowd density is rising near the metro station ahead.

---

## Weather Alert

Weather may affect mobility.

Example:

> Heavy rainfall may increase travel disruption
> in this corridor.

---

## Route Alert

The current route is becoming less favorable.

Example:

> A faster alternative is now available.

---

# 11. Alert Priority

Possible levels:

### Critical

Major immediate disruption.

### High

Significant impact on the route.

### Medium

Condition requires attention.

### Low

Informational update.

Thresholds remain configurable.

---

# 12. Data Transparency

The commuter should not be shown false certainty.

Important information may be classified as:

### Observed

Direct measurement.

### Reported

Incident or user/operator report.

### Historical

Based on historical patterns.

### Estimated

Calculated from multiple signals.

### Predicted

Future estimate.

### Simulated

Hackathon-generated data.

---

# 13. Data Freshness

For important dynamic information, show:

- Last updated
- Source where appropriate
- Freshness state

Example:

Traffic  
Updated 18:42  
Fresh

Crowd  
Updated 18:40  
Aging

---

# 14. Hotspot Information

When a commuter selects a hotspot, show:

- Location
- Severity
- Hotspot score
- Main causes
- Traffic condition
- Crowd condition
- Incident information
- Weather influence
- Confidence
- Last updated

Example:

## Emerging Mobility Hotspot

Location:
Silk Board Corridor

Severity:
HIGH

Traffic:
WORSENING

Crowd:
HIGH

Incident:
Accident

Weather:
Heavy Rain

---

# 15. Evidence Explanation

The commuter should be able to understand
why the system believes a condition exists.

Example:

> Congestion is increasing because an accident
> was reported on the corridor while crowd density
> near the metro station is also rising.

This explanation should be generated from
structured evidence.

---

# 16. Source Failure

If an important data source becomes unavailable:

TrafficPulse should:

1. Detect stale information
2. Reduce confidence where appropriate
3. Continue using other available sources
4. Inform the user when important information
   may be outdated

The system should not present stale information
as current with high certainty.

---

# 17. Privacy

The commuter experience should minimize
unnecessary personal-data storage.

Prefer:

- Approximate / route-level mobility information
- Aggregated crowd information
- Route state
- Anonymous system-level signals

Avoid unnecessary storage of:

- Personal identities
- Individual tracking histories
- Unnecessary location history

---

# 18. Accessibility

The commuter interface should support:

- Clear visual hierarchy
- Readable text
- High-contrast status indicators
- Clear icons
- Simple explanations
- Color plus text for important states

Important information should not depend
on color alone.

---

# 19. MVP Commuter Experience

For the hackathon, prioritize:

- Mobility map
- Origin / destination search
- Route comparison
- Recommended route
- Reason for recommendation
- Incident alert
- Crowd alert
- Hotspot explanation
- Dynamic route change

---

# 20. Long-Term Commuter Experience

Future possibilities:

- Personalized commuting patterns
- Predictive travel warnings
- Multimodal route planning
- Metro + bus + road combinations
- Advanced trip planning
- Event-aware route planning
- Weather-aware trip planning
- Historical travel insights

These are outside the initial hackathon MVP.

---

# 21. Core Value Proposition

TrafficPulse should not simply say:

> "Traffic is heavy."

It should help answer:

> **What is happening?**

> **Why is it happening?**

> **How will it affect my trip?**

> **What alternative should I consider?**

---

# 22. Example End-to-End Experience

Normal traffic  
↓  
User enters destination  
↓  
TrafficPulse finds routes  
↓  
User selects recommended route  
↓  
Accident appears  
↓  
Traffic worsens  
↓  
Crowd increases near transit  
↓  
Hotspot detected  
↓  
Route re-evaluated  
↓  
Alternative becomes preferable  
↓  
User receives explanation

---

## Current Status

- 🟢 Home experience defined
- 🟢 Map experience defined
- 🟢 Route experience defined
- 🟢 Alert experience defined
- 🟢 Hotspot experience defined
- 🟢 Transparency defined
- 🟢 MVP scope defined
- 🟡 Final UI design pending
- 🟡 Final route engine pending
- 🟡 Final data integrations pending

---

## Related Notes

- [[MVP]]
- [[User Flow]]
- [[Demo Flow]]
- [[Target Users]]
- [[Operator Dashboard]]
- [[Mobility Intelligence Engine]]
- [[System Architecture]]
- [[Self-Updating Mobility Intelligence]]