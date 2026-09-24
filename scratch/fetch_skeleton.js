const fs = require('fs');
const https = require('https');

const cities = {
  delhi: [
    [77.2177, 28.6304], // CP
    [77.2295, 28.6129], // India Gate
    [77.2396, 28.6562], // Red Fort
    [77.2588, 28.5535], // Lotus Temple
    [77.1855, 28.5244]  // Qutub Minar
  ]
};

async function fetchRoute(p1, p2) {
  return new Promise((resolve, reject) => {
    const url = `https://router.project-osrm.org/route/v1/driving/${p1[0]},${p1[1]};${p2[0]},${p2[1]}?geometries=geojson&overview=full`;
    https.get(url, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    }).on('error', reject);
  });
}

async function buildSkeleton() {
  const points = cities.delhi;
  const segments = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const data = await fetchRoute(points[i], points[j]);
      if (data.routes && data.routes.length > 0) {
        segments.push({
           from: i, to: j,
           distance: data.routes[0].distance,
           geometry: data.routes[0].geometry.coordinates
        });
      }
      // Wait to avoid rate limits
      await new Promise(r => setTimeout(r, 500));
    }
  }
  fs.writeFileSync('scratch/delhi_skeleton.json', JSON.stringify(segments));
  console.log('Saved', segments.length, 'segments');
}

buildSkeleton().catch(console.error);
