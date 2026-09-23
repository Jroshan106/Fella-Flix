const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'data', 'movies.json');
let movies = JSON.parse(fs.readFileSync(filePath, 'utf8'));

let updatedCount = 0;
movies = movies.map(movie => {
  if (movie.overview && movie.overview.includes("Use the Admin Panel to update this poster with a real TMDB image link!")) {
    movie.overview = movie.overview.replace(" Use the Admin Panel to update this poster with a real TMDB image link!", "");
    // also catch the case without leading space
    movie.overview = movie.overview.replace("Use the Admin Panel to update this poster with a real TMDB image link!", "").trim();
    updatedCount++;
  }
  return movie;
});

fs.writeFileSync(filePath, JSON.stringify(movies, null, 2));
console.log(`Removed the admin panel text from ${updatedCount} overviews!`);
