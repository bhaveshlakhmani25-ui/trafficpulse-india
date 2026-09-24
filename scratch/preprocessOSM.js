const fs = require('fs');
const path = require('path');

function haversineDistance(coords1, coords2) {
    const R = 6371; // km
    const dLat = (coords2[1] - coords1[1]) * Math.PI / 180;
    const dLon = (coords2[0] - coords1[0]) * Math.PI / 180;
    const lat1 = coords1[1] * Math.PI / 180;
    const lat2 = coords2[1] * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c;
}

const speedMap = {
    'motorway': 80,
    'trunk': 60,
    'primary': 50,
    'secondary': 40,
    'tertiary': 30,
    'residential': 20,
    'service': 15,
    'unclassified': 25
};

const laneMap = {
    'motorway': 3,
    'trunk': 3,
    'primary': 2,
    'secondary': 2,
    'tertiary': 1,
    'residential': 1,
    'service': 1,
    'unclassified': 1
};

function processCity(cityName, cityId) {
    const rawPath = path.join(__dirname, `${cityName}_osm_full.json`);
    if (!fs.existsSync(rawPath)) return;
    
    console.log(`Processing ${cityName}...`);
    const raw = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
    
    const nodes = {};
    const wayNodes = {};
    let parsedWays = 0;
    let unnamedCount = 0;
    
    // First pass: identify intersection nodes to split ways
    const nodeUsageCount = {};
    for (const element of raw.elements) {
        if (element.type === 'node') {
            nodes[element.id] = [element.lon, element.lat];
        } else if (element.type === 'way') {
            parsedWays++;
            for (const nodeId of element.nodes) {
                nodeUsageCount[nodeId] = (nodeUsageCount[nodeId] || 0) + 1;
            }
        }
    }
    
    const segments = [];
    let splitSegments = 0;
    let disconnectedRemoved = 0;
    
    for (const element of raw.elements) {
        if (element.type === 'way') {
            const tags = element.tags || {};
            const roadClass = tags.highway || 'unclassified';
            const roadName = tags.name || 'Unnamed road';
            if (roadName === 'Unnamed road') unnamedCount++;
            
            let laneCount = parseInt(tags.lanes) || laneMap[roadClass] || 1;
            let freeFlowSpeed = parseInt(tags.maxspeed) || speedMap[roadClass] || 30;
            
            let currentCoords = [];
            let currentLength = 0;
            let prevCoord = null;
            
            for (let i = 0; i < element.nodes.length; i++) {
                const nodeId = element.nodes[i];
                const coord = nodes[nodeId];
                if (!coord) continue;
                
                currentCoords.push(coord);
                if (prevCoord) {
                    currentLength += haversineDistance(prevCoord, coord);
                }
                prevCoord = coord;
                
                // Split if intersection (usage > 1) and not first/last node of this way
                // OR if it's the last node
                const isIntersection = nodeUsageCount[nodeId] > 1;
                const isLast = i === element.nodes.length - 1;
                
                if ((isIntersection && currentCoords.length > 1 && i !== 0) || isLast) {
                    if (currentCoords.length > 1) {
                        splitSegments++;
                        segments.push({
                            id: `seg-${cityId}-${element.id}-${splitSegments}`,
                            cityId: cityId,
                            roadName: roadName,
                            roadClass: roadClass,
                            coordinates: [...currentCoords],
                            lengthKm: parseFloat(currentLength.toFixed(3)),
                            laneCount: laneCount,
                            freeFlowSpeedKmh: freeFlowSpeed,
                            capacity: Math.floor(freeFlowSpeed * laneCount * 25)
                        });
                    } else if (isLast) {
                        disconnectedRemoved++;
                    }
                    // Start new segment from this intersection
                    currentCoords = [coord];
                    currentLength = 0;
                }
            }
        }
    }
    
    const outPath = path.join(__dirname, `../public/data/cities/${cityId}-roads.json`);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(segments));
    
    const sizeMB = (fs.statSync(outPath).size / (1024 * 1024)).toFixed(2);
    
    console.log(`REPORT FOR ${cityName.toUpperCase()}:`);
    console.log(`- OSM Ways Parsed: ${parsedWays}`);
    console.log(`- Segments after splitting: ${segments.length}`);
    console.log(`- Unnamed roads: ${unnamedCount}`);
    console.log(`- Dataset size: ${sizeMB} MB`);
    console.log(`- Disconnected/invalid removed: ${disconnectedRemoved}`);
    console.log('---------------------------------');
}

processCity('delhi', 'delhi');
processCity('mumbai', 'mumbai');
processCity('bengaluru', 'bengaluru');

