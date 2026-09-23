
## 🎯 Research Question

How can TrafficPulse automatically detect and update
road incidents across Indian cities?

---

## 1. Government / Open Data

### India OGD

The Indian Open Government Data platform contains
historical road-accident and traffic-related datasets.

Examples include:

- State/UT/city-wise traffic accidents
- Number of people injured/killed
- Accident counts by time period
- City accident profiles

Source:
https://data.gov.in/

Traffic-related datasets:
https://ap.data.gov.in/keywords/Traffic

### Important limitation

Most government accident datasets are historical or
periodically published.

They are useful for:

- Historical risk patterns
- Hotspot baselines
- Analytics
- Model calibration

They are NOT yet established as a nationwide
real-time incident feed.

Status:
🟡 Useful historical source
🔴 Not our live incident source

---

## 2. Bengaluru Traffic Police

Bengaluru Traffic Police operates a traffic-management
ecosystem including traffic signals, surveillance
cameras, a Traffic Management Center and other BTRAC
components.

Source:
https://btp.gov.in/

The official site documents traffic-management
infrastructure and traffic-related operations.

### Important limitation

We have not established a public, documented API
that provides a continuously updating nationwide
or city-wide incident JSON feed directly from
Bengaluru Traffic Police.

Status:
🟡 Potential official information source
🔴 Public real-time API not established

---

## 3. Waze Incident Data

Waze provides a partner data feed containing
real-time traffic incidents and traffic information.

The feed can include:

- Traffic accidents
- Hazards
- Construction
- Potholes
- Stopped vehicles
- Objects on road
- Missing signs
- Traffic jams
- Unusual traffic

The Waze Data Feed is updated every 2 minutes.

Waze also provides reliability and confidence
information for incident reports.

Sources:
https://support.google.com/waze/partners/answer/10618035
https://support.google.com/waze/partners/answer/13458165

### Reliability

Waze reports include:
- Reliability score
- Confidence score
- User reactions
- Report metadata

This is highly relevant to TrafficPulse's
data-validation layer.

### Important limitation

The Waze Data Feed is provided through the
Waze for Cities / Partner ecosystem.

It should NOT be assumed to be a free public
API available to every hackathon project.

Status:
🟢 Technically very relevant
🟡 Access/partnership needs verification
🔴 Do not make it a mandatory dependency

---

## 4. MapmyIndia / Mappls

MapmyIndia provides real-time traffic intelligence
for mobility applications.

Its traffic offering combines road-map data with
traffic information, incidents, events and
crowd-sourced signals.

MapmyIndia states that its traffic system processes
more than 200 million GPS data points per day from
multiple sources.

Source:
https://about.mappls.com/traffic/

### TrafficPulse relevance

Potentially useful for:

- Real-time traffic
- Incidents
- Road conditions
- Indian geographic coverage

### Important limitation

This is a commercial provider.

Pricing, API access and hackathon availability
must be verified before depending on it.

Status:
🟡 Strong commercial candidate
🔴 Not assumed free

---

# 5. Incident Types We Need

TrafficPulse should normalize incidents into a
common schema.

### Core incidents

- Accident
- Waterlogging / flooding
- Road closure
- Construction
- Road hazard
- Vehicle breakdown
- Major event
- Public-transport disruption

---

# 6. Incident Normalization

Regardless of source, convert the event into:

Source
+
Timestamp
+
Location
+
Incident type
+
Severity
+
Status
+
Expiry
+
Confidence

Example:

{
  "type": "accident",
  "location": "...",
  "severity": "high",
  "reported_at": "...",
  "source": "...",
  "confidence": 0.82,
  "status": "active"
}

---

# 7. Incident Validation

TrafficPulse should NOT trust every incoming
incident immediately.

Possible validation signals:

Official source
+
Multiple independent reports
+
Traffic-speed deterioration
+
Nearby camera / verified source
+
Historical consistency

        ↓

Confidence score

        ↓

Mobility State

---

# 8. Incident Lifecycle

REPORTED
    ↓
VALIDATING
    ↓
CONFIRMED
    ↓
IMPACT ANALYSIS
    ↓
ACTIVE
    ↓
RESOLVED / EXPIRED

This prevents old or unverified incidents
from permanently affecting the map.

---

# 9. TrafficPulse Intelligence

Incident
    ↓
Find affected road segment
    ↓
Estimate traffic impact
    ↓
Check nearby crowd
    ↓
Check nearby transit
    ↓
Calculate hotspot score
    ↓
Recalculate route
    ↓
Explain impact

---

# 10. Research Findings

### Strong candidates

🟢 Government/open data for historical patterns

🟢 Waze for real-time crowdsourced incidents,
if partnership/access is available

🟢 MapmyIndia for India-focused commercial
traffic/incident intelligence

### Not established yet

🔴 Free nationwide real-time incident API

🔴 Free nationwide road-closure feed

🔴 Free nationwide verified waterlogging feed

---

# 11. Preliminary Data Strategy

TrafficPulse should use a multi-source model:

Government data
+
Commercial traffic providers
+
Official city feeds
+
Crowdsourced signals
+
Weather / event signals
+
Controlled simulation when necessary

The system should attach provenance,
freshness and confidence to every incident.

---

## Research Status

🟡 Research ongoing

## Status
🔴 Research not started

## Question

## Findings

## Sources

## Decision
**Pending**
