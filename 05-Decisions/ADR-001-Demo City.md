
## 🆕 Hackathon Scope Update — 19 Sep 2026

The original concept considered an India-wide mobility platform.

Because the hackathon build window is limited, the implementation scope has been reduced to major Indian metropolitan / high-mobility cities.

### Product Scope

**Long-term vision**
- Multi-city mobility intelligence platform for India.

**Hackathon MVP**
- Focus on a limited set of major metropolitan cities.
- One primary pilot city will receive the deepest live integration.
- Additional cities may be represented through the same city-agnostic architecture where verified data is available.

### Current Candidate Cities

- Delhi
- Mumbai
- Bengaluru
- Hyderabad
- Chennai
- Kolkata
- Pune
- Ahmedabad

### Decision Status

**Still pending:** primary pilot city.

The pilot city must be selected based on:
- Verified data availability
- Accessibility of useful data
- Real-time capability
- Routing feasibility
- Demo reliability

> The city selection should be evidence-driven and should not block initial platform development.

## Status

🟡 PENDING

---

## Decision

Which Indian city should be used as the primary
demonstration environment for TrafficPulse India?

---

## Context

TrafficPulse is designed as an India-wide mobility
intelligence platform.

The architecture must support multiple Indian cities.

However, the hackathon MVP should focus on a single
pilot city so that the team can build and demonstrate
a complete working mobility-intelligence loop.

The selected city should have sufficient data and
mobility context for the MVP.

---

## Selection Criteria

The demo city should be evaluated using:

### 1. Data Availability

Availability of:

- Traffic data
- Road-network data
- Incident data
- Weather data
- Transit data
- Event data
- Crowd-related signals

### 2. Data Accessibility

Consider:

- Public APIs
- Open datasets
- Structured feeds
- Availability of documentation
- Access requirements

### 3. Mobility Complexity

Consider:

- Traffic congestion
- Metro / transit network
- Major corridors
- Large events
- Crowd concentration
- Weather-related disruption

### 4. Hackathon Feasibility

Consider:

- Ease of integration
- Data reliability
- API limitations
- Free / available access
- Ability to build a convincing demo

### 5. Scalability

The city's architecture should provide a useful
pattern that can later be extended to other
Indian cities.

---

## Candidate Cities

Initial candidates:

- Bengaluru
- Delhi
- Mumbai
- Hyderabad
- Chennai
- Pune
- Kolkata
- Ahmedabad

Additional cities may be added during research.

---

## Evidence-Based Comparison

| City | Traffic / Junction Data | Transit / Occupancy | Crowd / Safety Signals | Flood / Weather | IUDX Mobility Evidence | Current Fit |
|---|---|---|---|---|---|---|
| Bengaluru | 🟡 Documented smart-city / multimodal ecosystem | 🟡 Multimodal transport use case | 🟡 Requires further verification | 🟡 Karnataka weather/disaster layer | 🟢 | Strong candidate |
| Pune | 🟡 Adaptive / mobility ecosystem | 🟡 Transit context | 🟢 Crowd + safety-related data documented | 🟢 Flood monitoring/prediction documented | 🟢 | Very strong candidate |
| Surat | 🟡 Smart mobility ecosystem | 🟢 Real-time bus ETA + occupancy documented | 🟡 Transit crowd signal | 🟡 Supporting environmental data | 🟢 | Very strong candidate |
| Delhi | 🟡 Government / transit ecosystem | 🟢 Strong metro demand information | 🟡 Further research required | 🟡 | 🟡 | Candidate |
| Mumbai | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | Candidate |
| Hyderabad | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | Candidate |
| Chennai | 🟡 | 🟢 Metro demand information | 🟡 | 🟢 Flood-related IUDX use case documented | 🟢 | Candidate |
| Ahmedabad | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | Candidate |

---

## Important Research Finding

IUDX is potentially a major part of the TrafficPulse
India strategy.

Its documented city ecosystem includes data categories such as:

- Adaptive Traffic
- Bus Transit
- Video Samples and Feeds
- Flood Data
- Meteorological Information
- Safety Index
- GIS
- Smart Sensor Locations

These categories directly overlap with the TrafficPulse
data model.

However, the availability of a specific resource does
not mean that the resource is publicly accessible.

IUDX distinguishes between:

- OPEN resources
- SECURE resources

Secure resources require provider consent.

---

## Pune Evidence

IUDX documents Pune use cases involving:

- Crowd-related information
- Surveillance-camera inputs
- Street-light information
- Safety scoring
- Real-time safety updates
- Flood monitoring and prediction

This makes Pune particularly relevant to the
TrafficPulse concept.

---

## Surat Evidence

IUDX documents a real-time public-transport
occupancy and ETA use case in Surat.

The system combines:

- Bus operational data
- Ticketing data
- Real-time bus information

and derives:

- Bus ETA
- Passenger occupancy
- Passenger load on routes

This provides a strong example of real-time
mobility-data fusion.

---

## Bengaluru Evidence

IUDX documents a multimodal transport use case
for Bengaluru covering multiple transportation
modes and intended real-time travel information.

Further research is required to determine which
specific resources are accessible for a hackathon
consumer.

---

## Current Lead

Based on the evidence collected so far:

### Pune

Current lead for:

- Crowd intelligence
- Safety / mobility intelligence
- Flood-risk context
- IUDX data ecosystem

### Surat

Current lead for:

- Real-time transit
- Occupancy
- ETA
- Mobility-data fusion

### Bengaluru

Current lead for:

- Multimodal transportation context
- Large urban mobility ecosystem
- IUDX integration

This is a research ranking for **data-fit only**,
not a final project-city decision.

---

## Remaining Verification

Before selecting the city, we still need to verify:

- Which IUDX resources are actually OPEN
- Which require provider consent
- Whether traffic-density resources are accessible
- Whether required data can be consumed during the hackathon
- Current API/resource availability
- Whether the selected city can support our
  incident → hotspot → route demo without paid dependencies

---

## Preliminary Direction

The current research puts:

1. Pune
2. Surat
3. Bengaluru

---

## IUDX Access Verification

IUDX provides a catalogue through which consumers
can discover resources using spatial, attribute,
text, and relationship searches.

Each resource has an access type:

### OPEN

An Open resource can be accessed through APIs/files
without provider consent.

### SECURE

A Secure resource requires provider consent.

Subscriptions and asynchronous APIs also require
provider consent.

Source:

https://docs.iudx.org.in/docs/consumer/consumer_data_discovery/

---

## Candidate Verification

### Pune

Potentially relevant IUDX capabilities include:

- Crowd-related information
- Surveillance / video systems
- Safety information
- Street-light information
- Flood monitoring / prediction
- Urban mobility information

Source:

https://iudx.org.in/pune-smart-cities/

### Surat

IUDX documents a public-transit use case with:

- Real-time bus information
- Bus ETA
- Passenger occupancy
- Passenger load
- ITMS data
- Ticketing data

Source:

https://iudx.org.in/surat-smart-cities/

This is particularly relevant to TrafficPulse's
crowd and transit intelligence.

### Bengaluru

IUDX documents a multimodal transport use case
covering modes including:

- BMTC
- Namma Metro
- Trains
- Cab aggregators
- E-bikes
- Bicycles

The intended system provides real-time information
for multimodal journey planning.

Source:

https://iudx.org.in/bengaluru-smart-cities/

---

## Critical Verification Rule

A documented IUDX use case does NOT automatically
mean that TrafficPulse can consume the underlying
resource.

Before selecting the city, verify:

- Resource exists in the current catalogue
- Resource is Open OR hackathon access is possible
- API/file access is available
- Required token can be obtained
- Relevant geographic coverage exists
- Data is sufficiently current
- Data can be used within hackathon rules
- No unexpected provider consent is required

---

## Verification Status

### Pune

🟡 Use case verified  
🟡 Resource accessibility still needs verification

### Surat

🟢 Real-time transit/occupancy use case verified  
🟡 Current resource accessibility still needs verification

### Bengaluru

🟢 Multimodal transport use case verified  
🟡 Current resource accessibility still needs verification

---

## Next Action

Use the IUDX Catalogue to verify actual resources
for:

1. Pune
2. Surat
3. Bengaluru

The city decision remains:

**PENDING**