const fs = require('fs');
const https = require('https');
const path = require('path');

const DB_FILE = path.join(__dirname, '../src/app/data/movies.json');
const PROXY_URL = 'tmdb-id-lookup-proxy.dpegan20.workers.dev';

let db = [];
if (fs.existsSync(DB_FILE)) {
  db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}
const existingIds = new Set(db.map(m => m.id));
const existingTitles = new Set(db.map(m => m.title.toLowerCase()));

function fetchJson(options) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch(e) {
          resolve(null);
        }
      });
    });
    req.on('error', () => resolve(null));
    req.end();
  });
}

async function run() {
  let count = 0;
  
  for (let offset = 0; offset < 500; offset += 20) {
    console.log(`Fetching Kitsu Anime Page (Offset: ${offset})...`);
    const kitsuData = await fetchJson("https://kitsu.io/api/edge/anime?filter[subtype]=movie&sort=popularityRank&page[limit]=20&page[offset]=" + offset);
    
    if (!kitsuData || !kitsuData.data) continue;
    
    for (const anime of kitsuData.data) {
      if (count >= 500) break;
      
      const title = anime.attributes.canonicalTitle || anime.attributes.en;
      if (!title || existingTitles.has(title.toLowerCase())) {
        console.log(`Skipping existing/missing title: ${title}`);
        continue;
      }
      
      console.log(`Searching TMDB for: ${title}`);
      const tmdbSearch = await fetchJson({
        hostname: PROXY_URL,
        path: `/3/search/movie?query=${encodeURIComponent(title)}&language=en-US`,
        headers: { 'Origin': 'https://davecollections.github.io' }
      });
      
      if (!tmdbSearch || !tmdbSearch.results || tmdbSearch.results.length === 0) {
        console.log(`- Not found on TMDB`);
        await new Promise(r => setTimeout(r, 1000));
        continue;
      }
      
      const tmdbId = tmdbSearch.results[0].id;
      if (existingIds.has(tmdbId)) continue;
      
      const tmdbData = await fetchJson({
        hostname: PROXY_URL,
        path: `/3/movie/${tmdbId}?language=en-US`,
        headers: { 'Origin': 'https://davecollections.github.io' }
      });
      
      if (tmdbData && tmdbData.title && tmdbData.poster_path) {
        const movieObj = {
          id: tmdbData.id,
          title: tmdbData.title,
          poster_path: `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`,
          backdrop_path: tmdbData.backdrop_path ? `https://image.tmdb.org/t/p/original${tmdbData.backdrop_path}` : `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`,
          overview: tmdbData.overview || "No description available.",
          release_date: tmdbData.release_date || "N/A",
          vote_average: tmdbData.vote_average || 0,
          type: "anime",
          genres: tmdbData.genres ? tmdbData.genres.map(g => g.name) : ["Animation"]
        };
        
        db.unshift(movieObj);
        fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
        existingIds.add(movieObj.id);
        existingTitles.add(movieObj.title.toLowerCase());
        console.log(`+ Added: ${movieObj.title}`);
        count++;
      }
      
      await new Promise(r => setTimeout(r, 1500));
    }
    
    if (count >= 500) break;
  }
  
  console.log(`Finished adding ${count} new anime movies!`);
}

run();
