const https = require('https');
const fs = require('fs');

async function fetchOverpass(query) {
  return new Promise((resolve, reject) => {
    const data = new URLSearchParams({ data: query }).toString();
    const options = {
      hostname: 'lz4.overpass-api.de',
      port: 443,
      path: '/api/interpreter',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error("Invalid JSON: " + body.substring(0, 200)));
        }
      });
    });
    req.on('error', e => reject(e));
    req.write(data);
    req.end();
  });
}

const query = `
[out:json][timeout:25];
(
  way["highway"~"trunk|primary|secondary"](28.58,77.18,28.65,77.25);
);
out body;
>;
out skel qt;
`;

fetchOverpass(query).then(data => {
  fs.writeFileSync('scratch/delhi_raw.json', JSON.stringify(data));
  console.log('Saved.', data.elements.length, 'elements');
}).catch(console.error);
