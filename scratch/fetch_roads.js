const fs = require('fs');
const https = require('https');

async function fetchOverpass(query) {
  return new Promise((resolve, reject) => {
    const data = new URLSearchParams({ data: query }).toString();
    const options = {
      hostname: 'overpass-api.de',
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
      res.on('end', () => resolve(JSON.parse(body)));
    });
    req.on('error', e => reject(e));
    req.write(data);
    req.end();
  });
}

// Just a small bbox around Connaught place for testing to see how large the data is
const query = `
[out:json][timeout:25];
(
  way["highway"~"trunk|primary|secondary|tertiary"](28.62,77.21,28.64,77.23);
);
out body;
>;
out skel qt;
`;

fetchOverpass(query).then(data => {
  fs.writeFileSync('scratch/delhi_test.json', JSON.stringify(data));
  console.log('Saved.', data.elements.length, 'elements');
}).catch(console.error);
