const fs = require('fs');

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

const raw = JSON.parse(fs.readFileSync('scratch/delhi_osm.json', 'utf8'));
const nodes = {};
for (const element of raw.elements) {
    if (element.type === 'node') {
        nodes[element.id] = [element.lon, element.lat];
    }
}

const segments = [];
for (const element of raw.elements) {
    if (element.type === 'way') {
        const coords = [];
        let lengthKm = 0;
        let prevNode = null;
        for (const nodeId of element.nodes) {
            const coord = nodes[nodeId];
            if (coord) {
                coords.push(coord);
                if (prevNode) {
                    lengthKm += haversineDistance(prevNode, coord);
                }
                prevNode = coord;
            }
        }
        
        if (coords.length > 1) {
            const tags = element.tags || {};
            const roadClass = tags.highway || 'secondary';
            let laneCount = parseInt(tags.lanes) || (roadClass === 'trunk' || roadClass === 'motorway' ? 3 : roadClass === 'primary' ? 2 : 1);
            let freeFlowSpeed = parseInt(tags.maxspeed) || (roadClass === 'trunk' || roadClass === 'motorway' ? 60 : roadClass === 'primary' ? 50 : 40);
            
            segments.push({
                id: 'seg-del-' + element.id,
                roadName: tags.name || (roadClass + ' road'),
                coordinates: coords,
                lengthKm: parseFloat(lengthKm.toFixed(3)),
                laneCount: laneCount,
                freeFlowSpeedKmh: freeFlowSpeed,
                currentSpeedKmh: freeFlowSpeed,
                trafficState: 'free-flow',
                estimatedDensityVehPerKmPerLane: 10,
                estimatedFlowVehPerHour: freeFlowSpeed * 10 * laneCount,
                direction: 'forward',
                trend: 'stable',
                sourceType: 'simulation',
                provenance: 'CITY_SIMULATION',
                dataClass: 'SIMULATED',
                timestamp: new Date().toISOString()
            });
        }
    }
}

console.log('Processed', segments.length, 'segments');
fs.writeFileSync('scratch/delhi_processed.json', JSON.stringify(segments));
