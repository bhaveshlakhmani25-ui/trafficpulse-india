# Traffic Data Sources
# Traffic Data Sources

## 🎯 Research Question

How can TrafficPulse automatically obtain traffic information
across Indian cities?

---

## 1. Traffic APIs

### Google Maps / Routes
**Coverage:**
Google Maps Platform lists India as having coverage for its core mapping
features, including the Traffic Layer and Driving Directions / Snap to Roads.
Coverage quality can vary by feature and location.

**Real-time data:**
YES.

Routes API supports:
- TRAFFIC_AWARE
- TRAFFIC_AWARE_OPTIMAL

Both calculate routes using live traffic conditions.

**Road-segment information:**
PARTIAL / ROUTE-SPECIFIC.

Google can return traffic information along the returned route polyline,
with speed categories such as NORMAL, SLOW, and TRAFFIC_JAM.

This is useful for visualizing traffic on a calculated route, but it is
not the same as receiving a complete live traffic dataset for every road
in an entire Indian city.

**Update frequency:**
Google documents the traffic information as live/current for
TRAFFIC_AWARE routing. The API does not give us a simple public
"refresh every X seconds" guarantee that we should hard-code into
TrafficPulse.

**API limits:**
Compute Routes:
3,000 queries per minute.

Compute Route Matrix:
3,000 elements per minute.

Additional limits apply depending on the request type.

**Cost:**
Google Maps Platform uses pay-as-you-go billing.

For eligible India-based customers, the current India pricing page
shows 70,000 free monthly billable events for the Routes Essentials
SKU, with additional usage billed according to the India price list.

**Hackathon usability:**
HIGH for route calculation and traffic-aware ETA.

MEDIUM for our city-wide live congestion-map requirement because
Routes API gives traffic information associated with requested routes,
rather than acting as a complete nationwide road-traffic feed.

**Source:**
Google Maps Platform — Routes API
https://developers.google.com/maps/documentation/routes
## Preliminary Conclusion

Google Routes is a strong candidate for:
- Traffic-aware routing
- ETA
- Route alternatives
- Route-level traffic visualization

Google Routes alone is insufficient as the sole source for:
- Nationwide road-level traffic state
- Independent city-wide hotspot detection
- A complete continuously updating traffic map

Next:
Compare Mapbox and open/public traffic sources.4

**Research status:**
🟡 Candidate — not final.

**Coverage:**

**Real-time data:**

**Road-segment information:**

**Update frequency:**

**API limits:**

**Cost:**
India-eligible Google Maps Platform customers currently receive
70,000 free monthly billable events for most Essentials SKUs.
Routes Compute Routes Essentials is an Essentials SKU.

Usage beyond the free threshold is pay-as-you-go.

A billing account is required.

**Hackathon verdict:**
✅ Potentially usable within free quota for a controlled demo.
⚠️ Must configure billing/budget limits.

**Hackathon usability:**

**Source:**

---

### Mapbox Traffic

**Coverage:**
Mapbox Traffic Data is described by Mapbox as having global coverage,
but traffic availability varies by geographic market. Specific coverage
for a market should be confirmed with Mapbox.

**Real-time data:**
YES.

Mapbox provides:
- Live traffic speeds
- Typical traffic speeds

Live speeds are based on observations from the previous 15 minutes.

**Road-segment information:**
YES.

Mapbox Traffic Data provides estimated speeds for individual road
segments and can be used for custom routing, traffic analysis,
and simulation.

Mapbox also provides a Traffic vector tileset for displaying
real-time traffic conditions on road geometries.

**Update frequency:**
Live traffic data is updated approximately every 5 minutes.
The live estimates are based on data no more than 15 minutes old.

**API / Data access:**
Mapbox Directions API provides the `mapbox/driving-traffic`
profile for traffic-aware routing.

However, access to the underlying raw Mapbox Traffic Data requires
a separate Traffic Data license.

**Cost:**
⚠️ RAW MAPBOX TRAFFIC DATA IS NOT A NORMAL FREE-TIER PRODUCT.

Mapbox states that Traffic Data is available through an Enterprise
plan and licensed annually for a specific geographic region.

The standard Mapbox developer platform has free usage tiers for
many products, but that does NOT mean raw Traffic Data is free.

**Hackathon usability:**
🟡 Traffic-aware routing may be useful through Mapbox Directions.

🔴 Raw Mapbox Traffic Data is not suitable as a guaranteed free
hackathon dependency because it requires a Traffic Data license.

**Important limitation:**
Mapbox's public documentation says real-time traffic availability
varies by country/geography. India-specific live traffic coverage
must therefore be verified before relying on it.

**Source:**
Mapbox Traffic Data
https://www.mapbox.com/traffic-data

Mapbox Traffic Data Documentation
https://docs.mapbox.com/data/traffic/guides/

Mapbox Directions API
https://docs.mapbox.com/api/navigation/directions/

**Research status:**
🟡 Candidate — not selected.

**Coverage:**

**Real-time data:**

**Road-segment information:**

**Update frequency:**

**API limits:**

**Cost:**

**Hackathon usability:**

**Source:**

---

### Open / Alternative Sources

**Source:**

**Coverage:**

**Real-time data:**

**Limitations:**

**Source:**

---

## 2. Government / Public Data

### India

**Source:**

**Type of data:**

**Update frequency:**

**Geographic coverage:**

**API available:**

**Limitations:**

**Source:**

---

## 3. What We Can Actually Use

### ✅ Real

-

### 🟡 Near Real-Time

-

### 🔵 Historical

-

### 🟣 Simulated

-

---

## 4. Self-Updating Architecture

How can TrafficPulse automatically obtain and refresh data?

-

---

## 5. Reliability

**Freshness:**

**Source reliability:**

**Validation:**

**Confidence:**

---

## 6. Final Decision

**Pending research**

---

## 7. Related Notes

- [[India Mobility Data Landscape]]
- [[System Architecture]]
- [[Self-Updating Mobility Intelligence]]

## Question
What real-time or near-real-time traffic data can TrafficPulse India practically use for an Indian-city hackathon demo?

## Options to Research
- Google Routes / traffic-aware routing
- Mapbox traffic
- Open-source / public traffic feeds
- Government/open-data sources
- Clearly labelled simulated traffic

## Required Evidence
- Data availability
- Real-time capability
- Road-segment detail
- API limits
- Cost
- Licensing / hackathon use
- Reliability

## Decision
**PENDING**
