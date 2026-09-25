const fs = require('fs');
const db = JSON.parse(fs.readFileSync('src/app/data/movies.json', 'utf8'));
const animes = db.filter(m => m.type === 'anime');
console.log(`There are currently ${animes.length} animes in the database.`);
