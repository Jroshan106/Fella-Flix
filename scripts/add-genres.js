const fs = require('fs');

function parseCSV(csvText) {
  let rows = [];
  let cols = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    if (char === '"' && csvText[i+1] === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      cols.push(current);
      current = '';
    } else if (char === '\n' && !inQuotes) {
      cols.push(current);
      rows.push(cols);
      cols = [];
      current = '';
    } else if (char === '\r' && !inQuotes) {
      // skip
    } else {
      current += char;
    }
  }
  if (cols.length > 0) {
    cols.push(current);
    rows.push(cols);
  }
  return rows;
}

const csvData = fs.readFileSync('tmdb_5000_movies.csv', 'utf8');
const rows = parseCSV(csvData);

const idIndex = 3;
const genresIndex = 1;

const genreMap = {};

for (let i = 1; i < rows.length; i++) {
  const cols = rows[i];
  if (cols.length > idIndex) {
    const idStr = cols[idIndex];
    if (!idStr) continue;
    const id = parseInt(idStr.trim(), 10);
    const genreStr = cols[genresIndex];
    if (genreStr && genreStr.startsWith('[')) {
      try {
        const genres = JSON.parse(genreStr);
        genreMap[id] = genres.map(g => g.name);
      } catch(e) {}
    }
  }
}

const dbFile = 'src/app/data/movies.json';
let db = JSON.parse(fs.readFileSync(dbFile, 'utf8'));

let updated = 0;
for (const movie of db) {
  if (genreMap[movie.id]) {
    movie.genres = genreMap[movie.id];
    updated++;
  } else if (!movie.genres) {
    movie.genres = [];
  }
}

fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
console.log(`Updated ${updated} movies with genres from CSV!`);
