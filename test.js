const https = require('https');
const options = {
  hostname: 'tmdb-id-lookup-proxy.dpegan20.workers.dev',
  path: '/3/movie/popular?language=en-US&page=1',
  method: 'GET',
  headers: {
    'Origin': 'https://davecollections.github.io',
    'User-Agent': 'Mozilla/5.0'
  }
};
const req = https.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data.substring(0, 500)));
});
req.end();
