

## Purpose
Convert validated mobility signals into actionable intelligence
for Indian cities.

The engine should answer:

1. What is happening?
2. Why is it happening?
3. How severe is it?
4. Is it getting better or worse?
5. Which areas are affected?
6. What action should be taken?

---

## 1. Inputs

### 🚗 Traffic

- Road speed
- Congestion level
- Travel time
- Traffic trend

### 🚨 Incidents

- Accident
- Road closure
- Waterlogging
- Construction
- Vehicle breakdown
- Other hazards

### 👥 Crowd

- Observed crowd level
- Estimated crowd index
- Crowd trend
- Transit demand

### 🌧️ Weather

- Rainfall
- Rain intensity
- Weather warnings
- Other mobility-relevant conditions

### 🎪 Events

- Event location
- Event type
- Event timing
- Expected attendance

### 📍 Geographic Context

- Roads
- Intersections
- Metro stations
- Bus stops
- Markets
- Colleges
- Stadiums
- Other POIs

---

# 2. Signal Processing

Raw Signals
↓
Validation
↓
Normalization
↓
Freshness Check
↓
Confidence
↓
Mobility State

Only validated information should influence
the intelligence engine.

---

# 3. Trend Detection

Compare:

Current value
+
Previous values
+
Rate of change

### Example

Traffic speed:

42 km/h
↓
36 km/h
↓
29 km/h
↓
21 km/h

Result:

**Traffic worsening**

The same approach can be applied to:

- Crowd
- Rainfall
- Incident frequency
- Travel time

---

# 4. Hotspot Detection

A mobility hotspot represents an area where
multiple mobility problems are combining or
rapidly developing.

Potential signals:

- Congestion
- Incident severity
- Crowd level
- Crowd growth
- Traffic deterioration
- Nearby events
- Weather impact
- Number of active incidents

---

# 5. Hotspot Score

This is a proposed TrafficPulse design parameter,
not an established scientific formula.

Example:

Hotspot Score =

35% Congestion
+
25% Incident Severity
+
20% Crowd Level
+
10% Crowd Growth
+
10% Incident Density

The weights remain configurable and must be
validated during implementation.

---

# 6. Hotspot States

### 🟢 NORMAL

No significant mobility pressure.

### 🟡 WATCH

Some signals are changing.

### 🟠 HIGH RISK

Multiple signals indicate substantial mobility pressure.

### 🔴 EMERGING HOTSPOT

Conditions are deteriorating rapidly or multiple
high-impact signals are combining.

Exact thresholds remain to be validated.

---

# 7. Mobility Impact

The engine determines how an event or condition
affects the surrounding transportation network.

Example:

Accident
↓
Affected road
↓
Nearby road segments
↓
Traffic deterioration
↓
Nearby transit/crowd impact
↓
Potential hotspot

---

# 8. Route Impact

Each candidate route receives a dynamic cost.

Concept:

Route Cost =

Travel Time
+
Congestion Penalty
+
Crowd Exposure Penalty
+
Incident Penalty
+
Other validated mobility penalties

A road closure should receive a very high cost
or be excluded from routing.

---

# 9. Route Recommendation

Compare alternative routes.

### Route A

ETA: 24 min
Traffic: High
Incident: Yes
Crowd Exposure: High

### Route B

ETA: 28 min
Traffic: Medium
Incident: No
Crowd Exposure: Low

The system can recommend Route B when its
overall mobility cost is lower.

---

# 10. Explanation Layer

The engine should produce structured reasons.

Example:

Incident:
Accident

Traffic:
Congestion increased 27%

Crowd:
82 / 100

Trend:
Worsening

Alternative:
+4 minutes

### Example explanation

"An accident is increasing congestion while crowd
density near the metro station is high. The
alternative route adds 4 minutes but avoids the
affected corridor."

---

# 11. Confidence

Every important intelligence result should contain:

- Confidence
- Sources
- Timestamp
- Freshness
- Evidence

### Example

Hotspot:
Emerging

Confidence:
High

Evidence:

- Accident report
- Traffic deterioration
- Rising crowd
- Recent observation

Confidence represents evidence quality.

It is NOT automatically an ML probability.

---

# 12. Evidence Types

### OBSERVED

Direct current measurement.

### REPORTED

User/operator/source report.

### HISTORICAL

Historical pattern.

### ESTIMATED

Calculated from multiple signals.

### PREDICTED

Forecast of a future condition.

### SIMULATED

Synthetic hackathon/demo input.

These categories must remain distinguishable.

---

# 13. AI Responsibilities

AI should NOT be the source of truth.

### AI may assist with:

- Incident classification
- Extracting structured information from text
- Event understanding
- Natural-language explanations
- Operator summaries

### Deterministic systems should control:

- Geographic matching
- Freshness
- Provenance
- Confidence rules
- Scoring
- Route costs
- State transitions
- Data validation

---

# 14. Intelligence Pipeline

DATA
↓
VALIDATION
↓
NORMALIZATION
↓
FRESHNESS + PROVENANCE
↓
MOBILITY STATE
↓
TREND DETECTION
↓
HOTSPOT DETECTION
↓
IMPACT ANALYSIS
↓
ROUTE ANALYSIS
↓
EXPLANATION
↓
USER / OPERATOR ACTION

---

# 15. Example Scenario

### Initial State

Traffic:
Medium

Crowd:
Medium

Incidents:
None

---

### New signals

Accident reported
↓
Traffic speed decreases
↓
Rain intensity increases
↓
Metro crowd increases
↓
Hotspot score rises
↓
Area becomes:

**EMERGING HOTSPOT**

↓
Alternative route evaluated
↓
User receives explanation

---

# 16. Research Questions

- Which signals should have the highest weight?
- How should weights be calibrated?
- Which signals should be predictive?
- How should confidence be calculated?
- How should contradictory sources be handled?
- How quickly should hotspot states change?
- How should stale data affect intelligence?
- How should city-specific behavior affect scoring?

---

# 17. Current Status

🟢 Core intelligence pipeline defined

🟢 Inputs identified

🟢 Deterministic vs AI responsibilities separated

🟡 Scoring weights require validation

🟡 Confidence model requires validation

🟡 Final routing technology pending

🟡 Prediction methodology pending

---

## Related Notes

- [[Self-Updating Mobility Intelligence]]
- [[Routing Architecture]]
- [[Crowd Intelligence]]
- [[Incident Intelligence]]
- [[AI Architecture]]
- [[Traffic Data Sources]]