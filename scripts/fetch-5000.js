const fs = require('fs');
const https = require('https');
const path = require('path');

const CSV_FILE = path.join(__dirname, '../tmdb_5000_movies.csv');
const DB_FILE = path.join(__dirname, '../src/app/data/movies.json');
const PROXY_URL = 'tmdb-id-lookup-proxy.dpegan20.workers.dev';

// Read CSV to extract IDs
console.log("Reading CSV...");
const csvData = fs.readFileSync(CSV_FILE, 'utf8');
const lines = csvData.split('\n');

// Find 'id' column index from header
const header = lines[0].split(',');
let idIndex = header.indexOf('id');
if (idIndex === -1) idIndex = 3; // Default based on sample

let movieIds = [];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (!line) continue;
  
  // Basic regex to find ID (assuming it's between commas)
  // But a robust CSV parser is better.
  // Instead, since ID is just numeric, we can extract all numbers 
  // wait, budget is numeric. Let's just use the index if simple split works for that column.
  
  // A simple parse looking at characters
  let cols = [];
  let current = '';
  let inQuotes = false;
  for (let j = 0; j < line.length; j++) {
    if (line[j] === '"') {
      inQuotes = !inQuotes;
    } else if (line[j] === ',' && !inQuotes) {
      cols.push(current);
      current = '';
    } else {
      current += line[j];
    }
  }
  cols.push(current);
  
  if (cols.length > idIndex) {
    const id = parseInt(cols[idIndex], 10);
    if (!isNaN(id)) {
      movieIds.push(id);
    }
  }
}

console.log(`Found ${movieIds.length} IDs in CSV. Starting background fetch...`);

// Load existing DB
let db = [];
if (fs.existsSync(DB_FILE)) {
  db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}
const existingIds = new Set(db.map(m => m.id));

async function fetchMovie(id) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: PROXY_URL,
      path: `/3/movie/${id}?language=en-US`,
      method: 'GET',
      headers: {
        'Origin': 'https://davecollections.github.io',
        'User-Agent': 'Mozilla/5.0'
      }
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch(e) {
            resolve(null);
          }
        } else {
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
  for (const id of movieIds) {
    if (existingIds.has(id)) continue;
    
    console.log(`Fetching TMDB ID: ${id}...`);
    const tmdbData = await fetchMovie(id);
    
    if (tmdbData && tmdbData.title && tmdbData.poster_path) {
      const isAnime = tmdbData.original_language === 'ja' && tmdbData.genres && tmdbData.genres.some(g => g.name === 'Animation');
      
      const movieObj = {
        id: tmdbData.id,
        title: tmdbData.title,
        poster_path: `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`,
        backdrop_path: tmdbData.backdrop_path ? `https://image.tmdb.org/t/p/original${tmdbData.backdrop_path}` : `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`,
        overview: tmdbData.overview || "No description available.",
        release_date: tmdbData.release_date || "N/A",
        vote_average: tmdbData.vote_average || 0,
        type: isAnime ? "anime" : "movie"
      };
      
      db.unshift(movieObj); // Add to top
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
      console.log(`Added: ${movieObj.title} (${movieObj.type})`);
      count++;
    } else {
      console.log(`Skipped ID: ${id} (Missing data or poster)`);
    }
    
    // Pause for 1.5 seconds to avoid rate limiting
    await new Promise(r => setTimeout(r, 1500));
  }
  
  console.log(`Finished adding ${count} new movies!`);
}

run();
