# Demo Flow

## Purpose

Define the exact end-to-end scenario that will be demonstrated
during the Hack Devengers presentation.

The demo should prove the core TrafficPulse concept:

**Detect → Understand → Evaluate → Recommend**

---

## 1. Demo Scenario

### Scenario

A major mobility disruption develops near a busy urban corridor.

The system receives:

- An incident
- Increasing traffic congestion
- Rising crowd density
- Weather influence

TrafficPulse identifies the developing impact and
recommends an alternative route.

---

# 2. Demo Setup

### City

Demo city will be selected after research.

### Starting State

Traffic:
MEDIUM

Crowd:
MEDIUM

Weather:
NORMAL

Active Incidents:
NONE

Hotspots:
NONE

---

# 3. Demo Step 1 — Normal Conditions

Open the TrafficPulse map.

Show:

- Road network
- Current traffic state
- Metro / transit locations
- Crowd zones
- Important POIs

Narration:

> "TrafficPulse continuously builds a current mobility picture
> by combining multiple mobility signals."

---

# 4. Demo Step 2 — Incident Appears

An operator reports:

### Incident

Type:
Accident

Severity:
HIGH

Location:
Major corridor

Timestamp:
Current

The incident appears on the map.

---

# 5. Demo Step 3 — Traffic Impact

The system processes the new incident.

Expected changes:

- Affected road becomes more congested
- Nearby road segments receive impact
- Travel time increases
- Traffic trend changes to worsening

Narration:

> "The system does not treat the incident as an isolated point.
> It evaluates how the incident affects the surrounding network."

---

# 6. Demo Step 4 — Crowd Increase

Crowd conditions around a nearby:

- Metro station
- Market
- Event venue
- Other major POI

increase.

Example:

```text
Previous Crowd:
54

Current Crowd:
78

Trend:
Rising
```

TrafficPulse updates the crowd state.

---

# 7. Demo Step 5 — Weather Influence

Rainfall / weather conditions increase.

The system evaluates:

- Current rainfall
- Historical risk
- Geographic context
- Existing congestion
- Incident reports

Potential result:

```text
Waterlogging Risk:
HIGH
```

This should be labelled as an intelligence estimate
unless a direct waterlogging observation exists.

---

# 8. Demo Step 6 — Emerging Hotspot

The intelligence engine combines:

- Accident
- Traffic deterioration
- Crowd increase
- Weather influence

The system identifies:

# EMERGING MOBILITY HOTSPOT

Display:

Location:
Affected corridor

Severity:
HIGH

Hotspot Score:
Example value

Trend:
WORSENING

Confidence:
Example value

---

# 9. Demo Step 7 — Explain Why

Open the hotspot details.

Show contributing evidence:

```text
Cause 1:
High-severity accident

Cause 2:
Traffic speed deteriorating

Cause 3:
Crowd density increasing

Cause 4:
Rainfall increasing mobility risk
```

Narration:

> "TrafficPulse doesn't just tell us that this area is congested.
> It explains what is contributing to the disruption."

---

# 10. Demo Step 8 — Route Request

Switch to commuter mode.

User enters:

### Origin

Starting point.

### Destination

Destination point.

TrafficPulse calculates candidate routes.

---

# 11. Demo Step 9 — Route Comparison

Example:

### Route A

ETA:
24 min

Congestion:
HIGH

Incident Impact:
HIGH

Crowd Exposure:
HIGH

### Route B

ETA:
28 min

Congestion:
MEDIUM

Incident Impact:
LOW

Crowd Exposure:
LOW

---

# 12. Demo Step 10 — Recommendation

TrafficPulse recommends:

### Route B

Example explanation:

> "Route B adds 4 minutes but avoids the accident corridor
> and the high-crowd zone."

Display:

- ETA
- Distance
- Route score
- Main reason
- Affected area avoided

---

# 13. Demo Step 11 — Dynamic Change

Introduce another change.

Example:

Traffic deterioration on Route B.

TrafficPulse receives the update.

The system:

```text
New Signal
↓
Mobility State Update
↓
Route Recalculation
↓
Alternative Comparison
↓
Updated Recommendation
```

This demonstrates that the system is dynamic rather than static.

---

# 14. Demo Step 12 — Operator View

Return to the operator dashboard.

Show:

- Emerging hotspot
- Incident
- Traffic trend
- Crowd trend
- Weather influence
- Confidence
- Last update

The operator can understand:

### What is happening?

Mobility disruption.

### Why?

Multiple contributing signals.

### Where?

Affected corridor.

### How severe?

Hotspot severity.

### What changed?

Traffic / crowd / route conditions.

---

# 15. Data Transparency

During the demo, clearly distinguish:

### OBSERVED

Direct measured information.

### REPORTED

Incident or operator/user report.

### HISTORICAL

Past patterns.

### ESTIMATED

Derived from multiple signals.

### PREDICTED

Future estimate.

### SIMULATED

Hackathon-generated data.

Simulated data must never be presented as
real-world live data.

---

# 16. Demo Narrative

The story should follow:

```text
NORMAL CITY
    ↓
DISRUPTION
    ↓
DETECTION
    ↓
IMPACT
    ↓
HOTSPOT
    ↓
EXPLANATION
    ↓
ROUTE EVALUATION
    ↓
RECOMMENDATION
    ↓
DYNAMIC UPDATE
```

---

# 17. Judge Takeaway

The judges should understand that TrafficPulse:

1. Combines multiple mobility signals.
2. Continuously updates mobility state.
3. Detects emerging mobility problems.
4. Explains why they are happening.
5. Evaluates their impact.
6. Recommends an actionable response.

---

# 18. Demo Timing

## 0:00 – 0:30

Problem + normal map.

## 0:30 – 1:00

Incident appears.

## 1:00 – 1:30

Traffic / crowd / weather impact.

## 1:30 – 2:00

Emerging hotspot + explanation.

## 2:00 – 2:30

Route comparison.

## 2:30 – 3:00

Alternative recommendation + dynamic update.

Target demo duration:

**Approximately 3 minutes.**

---

# 19. Demo Safety Rules

Never depend on a single external API
for the entire demonstration.

Have a controlled fallback for:

- Traffic
- Crowd
- Incidents
- Weather

Any simulated fallback must be clearly identified.

Do not expose API keys.

Do not depend on unstable external data
for the critical demo sequence.

---

# 20. Success Criteria

The demo is successful if judges can clearly see:

- [ ] Incident detected
- [ ] Traffic impact appears
- [ ] Crowd changes
- [ ] Hotspot detected
- [ ] Reasons explained
- [ ] Route alternatives compared
- [ ] Alternative recommended
- [ ] Dynamic update demonstrated
- [ ] Data provenance / simulation status visible

---

# 21. Current Status

- 🟢 Demo story defined
- 🟢 Core scenario defined
- 🟢 Intelligence sequence defined
- 🟢 Route demonstration defined
- 🟢 Operator demonstration defined
- 🟡 Demo city pending
- 🟡 Final data sources pending
- 🟡 UI sequence pending

---

## Related Notes

- [[MVP]]
- [[User Flow]]
- [[Mobility Intelligence Engine]]
- [[System Architecture]]
- [[Self-Updating Mobility Intelligence]]