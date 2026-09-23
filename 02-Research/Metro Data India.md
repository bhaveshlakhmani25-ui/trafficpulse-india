
## 🎯 Research Question

Can TrafficPulse use Indian metro data to understand
transit activity and improve crowd / hotspot intelligence?

---

## 1. Namma Metro — Bengaluru

### Official source

Bangalore Metro Rail Corporation Limited (BMRCL)

### Available information

- Metro network information
- Station information
- Train timings
- Ridership / passenger-flow information
- Travel information

BMRCL's official timetable page notes that train service can be
increased from selected intermediate stations when travel demand
increases, and that planned activities can change train timings.

Source:
https://english.bmrc.co.in/metro-timings/

BMRCL also maintains a ridership page with passenger-flow and
ticketing categories.

Source:
https://english.bmrc.co.in/ridership/

### Real-time station crowding?

❓ Not established from the public official pages researched.

### Live vehicle positions?

❓ Not established from the public official pages researched.

### GTFS

An unofficial BMRCL GTFS dataset exists and is derived from timetable
information published by BMRCL.

Important caveat:
The official timetable does not provide intermediate-stop timings,
so the unofficial feed estimates those timings.

Source:
https://github.com/Vonter/bmrcl-gtfs

### TrafficPulse usefulness

🟢 Strong for:
- Station/network context
- Schedules
- Transit routing
- Historical/aggregate ridership context

🟡 Potentially useful for:
- Crowd estimation
- Demand-pattern modelling

🔴 Not yet established as:
- Live station crowd sensor
- Guaranteed live train-position feed

---

## 2. Delhi Metro

### Official source

Delhi Metro Rail Corporation (DMRC)

### Available information

DMRC publishes passenger-journey reports containing:
- Line
- Origin/destination corridor
- Monthly passenger journeys
- Average daily passenger journeys
- Cumulative passenger journeys
- Peak-hour-per-direction traffic (PHPDT)

For example, DMRC's May 2026 report contains line-level passenger
journeys and PHPDT measurements.

Source:
https://backend.delhimetrorail.com/documents/10937/Passenger-Journey-May2026.pdf

### Example

For May 2026, the report records:
- Total passenger journeys: 181,449,780
- Average daily passenger journeys: 5,853,219

These are aggregate/operational statistics, not live
station-by-station crowd counts.

### TrafficPulse usefulness

🟢 Historical / current aggregate demand context

🟢 Peak-demand indicators

🟡 Crowd modelling

🔴 Not established as a public live station crowd feed

---

## 3. Chennai Metro

### Official source

Chennai Metro Rail Limited (CMRL)

### Available information

The official Commuters Corner provides:
- Timetable
- Fare information
- Monthly ridership
- Passenger flow
- Peak Hour Per Direction Traffic (PHPDT)
- Station parking information

Source:
https://chennaimetrorail.org/commuters-corner/

CMRL also publishes current passenger-flow information and monthly
ridership updates.

### TrafficPulse usefulness

🟢 Station/network context

🟢 Historical and monthly demand

🟢 Peak-demand indicators

🟡 Crowd estimation

🔴 Not established as a public live pedestrian-density feed

---

## 4. Hyderabad Metro

### Official source

Hyderabad Metro Rail / L&T Metro

### Available information

- Station network
- Metro lines
- Train timings
- Journey planning
- Station/landmark information
- Ridership information

Sources:
https://ltmetro.com/train-timings/
https://ltmetro.com/find-trip-details/
https://ltmetro.com/

The official network includes:
- Red Line
- Green Line
- Blue Line

### TrafficPulse usefulness

🟢 Station/network context

🟢 Timetable information

🟢 Aggregate ridership context

🟡 Crowd estimation

🔴 Live station crowding not established from the public
official information researched

---

## 5. Mumbai Metro

### Official source

Mumbai Metro Rail Corporation Limited (MMRCL)

MMRCL publishes Metro Line 3 operational/planning information,
including capacity and PHPDT-related information in official
project documentation.

Source:
https://corporate.mmrcl.com/

### TrafficPulse usefulness

🟢 Network context

🟢 Capacity / demand modelling

🟡 Historical/planning crowd estimates

🔴 Live station crowding not established from the public
information researched

---

# 6. GTFS and Transit Data Standard

GTFS (General Transit Feed Specification) is a standard format
for public-transit schedules and geographic information.

Static GTFS commonly represents:
- Stops
- Routes
- Trips
- Stop times
- Shapes
- Calendar/service information

Source:
https://developers.google.com/transit/gtfs

GTFS-Realtime extends GTFS for:
- Vehicle positions
- Trip updates
- Service alerts

Source:
https://developers.google.com/transit/gtfs

---

# 7. Important Finding

Metro operators publish useful information, but the public
official data we found is mostly:

- Static network information
- Timetables
- Aggregate ridership
- Peak-demand statistics
- Passenger-flow information

We have NOT established a nationwide public API that provides
live station-by-station passenger density across Indian metro
systems.

Therefore TrafficPulse should NOT claim:

"Live metro crowd data from all Indian cities"

unless a specific live source has been verified.

---

# 8. Proposed Crowd Intelligence Approach

Metro data can become one input into an estimated crowd index.

Example:

Time of day
+
historical ridership
+
peak-hour indicators
+
station type
+
nearby events
+
weather
+
traffic conditions
+
verified user reports

        ↓

Estimated Crowd Index

        ↓

Confidence + freshness

        ↓

Mobility Intelligence

The output should be labelled as an estimate unless we have
a real measured crowd signal.

---

# 9. Research Status

🟢 Metro network and schedule data: available

🟢 Aggregate ridership data: available for several systems

🟡 GTFS / structured transit data: available in some ecosystems

🔴 Nationwide live station crowd data: not established

🔴 Nationwide live metro vehicle-position data: not established

## Status
🔴 Research not started

## Question

## Findings

## Sources

## Decision
**Pending**
