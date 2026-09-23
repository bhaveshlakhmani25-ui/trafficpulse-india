
## 🎯 Research Question

What mobility-related data does the Indian government already publish
that TrafficPulse can use?

---

## 1. Open Government Data (OGD)

India's Open Government Data (OGD) Platform is the national platform
for publishing government datasets and web services/APIs.

The platform is hosted by the National Informatics Centre (NIC),
Ministry of Electronics & Information Technology.

Source:
https://data.gov.in/

---

## 2. Road Accident Data

### Ministry of Road Transport & Highways

The OGD platform contains road-accident datasets from the Ministry
of Road Transport & Highways.

Examples include:

- Road accidents by State/UT
- Persons killed/injured
- Accident statistics by different parameters
- City-wise accident information for some datasets

The data is collected through the Transport Research Wing (TRW).

Source:
https://data.gov.in/catalog/road-accidents-india-2021

---

## 3. City / Traffic-Related Data

The Smart Cities Mission Data Portal contains city-level catalogs.

Example:

### Bengaluru

Available catalogs include:

- Traffic light locations
- CCTV camera locations
- Police station locations
- Environment data
- Other city datasets

Source:
https://smartcities.data.gov.in/ministrydepartment/Bengaluru

---

## 4. Traffic Lights

Bengaluru has a government dataset containing the number and
locations of traffic lights.

**Usefulness for TrafficPulse:**
Can help build the static infrastructure/context layer.

**Real-time traffic?**
❌ No.

**Source:**
https://data.gov.in/catalog/bangalore-traffic-lights

---

## 5. Historical Accident Data

Government datasets can provide historical accident patterns.

Potential uses:

- Identify historically risky locations
- Build baseline hotspot information
- Train / calibrate future prediction models
- Compare current conditions against historical patterns

**Important:**
Historical accident data should NOT be presented as current live
incidents.

---

## 6. Real-Time Traffic?

### Current finding

Government open-data sources we have found so far are useful for:

✅ Historical accident information

✅ Static infrastructure/context

✅ City-level datasets

✅ Periodically updated government information

But we have NOT yet established a nationwide government source
providing a continuously updating live road-speed/congestion feed
for all Indian cities.

**Status:**
🟡 Research continues.

---

## 7. Role in TrafficPulse

Government/Open Data
        ↓
Historical patterns
        +
Static infrastructure
        +
City context
        +
Available periodic feeds
        ↓
TrafficPulse Data Fusion
        ↓
Mobility Intelligence

---

## 8. Important Finding

Government data can be an important part of the
self-updating ecosystem, but it cannot yet be treated as the
single nationwide real-time traffic source.

We need to combine:

- Government data
- OSM
- Traffic providers
- Weather
- Incident reports
- Crowd signals
- Other city-specific feeds

---

## 9. Research Status

🟡 Useful data ecosystem identified.

❓ Nationwide live traffic source still unresolved.

---
## 10. Government APIs & Web Services

### Can TrafficPulse automatically consume government data?

YES — potentially.

India's Open Government Data (OGD) Platform supports APIs and
web services for programmatic access to published resources.

The portal currently reports:
- 203 sourced Web Services/APIs
- API key generation for registered users
- Programmatic API access to published datasets

Source:
https://data.gov.in/

### Important limitation

Not every dataset has an API.

Some resources are downloadable datasets only, while others expose
API/web-service access. Each candidate source must be checked
individually.

### TrafficPulse requirement

For every government source we discover, record:

- API available?
- API key required?
- Update frequency
- Geographic coverage
- Data type
- Historical or current?
- Response format
- Reliability
- Licensing
- Can TrafficPulse poll it automatically?

### Research status

🟡 Promising infrastructure, but we need to identify
mobility-specific APIs.

## Sources

- https://data.gov.in/
- https://data.gov.in/catalog/road-accidents-india-2021
- https://smartcities.data.gov.in/ministrydepartment/Bengaluru
- https://data.gov.in/catalog/bangalore-traffic-lights
## Status
🔴 Research not started

## Question

## Findings

## Sources

## Decision
**Pending**
