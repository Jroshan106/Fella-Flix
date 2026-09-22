const fs = require('fs');
const path = require('path');

const existingMoviesPath = path.join(__dirname, 'src', 'app', 'data', 'movies.json');
let movies = JSON.parse(fs.readFileSync(existingMoviesPath, 'utf8'));

const newMovies = [
  { id: 299534, title: "Avengers: Endgame", type: "movie", year: "2019", vote: 8.3 },
  { id: 299536, title: "Avengers: Infinity War", type: "movie", year: "2018", vote: 8.3 },
  { id: 155, title: "The Dark Knight", type: "movie", year: "2008", vote: 8.5 },
  { id: 27205, title: "Inception", type: "movie", year: "2010", vote: 8.3 },
  { id: 603, title: "The Matrix", type: "movie", year: "1999", vote: 8.2 },
  { id: 19995, title: "Avatar", type: "movie", year: "2009", vote: 7.5 },
  { id: 597, title: "Titanic", type: "movie", year: "1997", vote: 7.9 },
  { id: 238, title: "The Godfather", type: "movie", year: "1972", vote: 8.7 },
  { id: 680, title: "Pulp Fiction", type: "movie", year: "1994", vote: 8.5 },
  { id: 13, title: "Forrest Gump", type: "movie", year: "1994", vote: 8.5 },
  { id: 120, title: "The Lord of the Rings: The Fellowship of the Ring", type: "movie", year: "2001", vote: 8.4 },
  { id: 98, title: "Gladiator", type: "movie", year: "2000", vote: 8.2 },
  { id: 329, title: "Jurassic Park", type: "movie", year: "1993", vote: 8.2 },
  { id: 11, title: "Star Wars: Episode IV - A New Hope", type: "movie", year: "1977", vote: 8.2 },
  { id: 8587, title: "The Lion King", type: "movie", year: "1994", vote: 8.3 },
  { id: 12, title: "Finding Nemo", type: "movie", year: "2003", vote: 8.2 },
  { id: 862, title: "Toy Story", type: "movie", year: "1995", vote: 8.3 },
  { id: 293660, title: "Deadpool", type: "movie", year: "2016", vote: 7.6 },
  { id: 475557, title: "Joker", type: "movie", year: "2019", vote: 8.2 },
  { id: 634649, title: "Spider-Man: No Way Home", type: "movie", year: "2021", vote: 8.0 },
  { id: 414906, title: "The Batman", type: "movie", year: "2022", vote: 7.7 },
  { id: 1726, title: "Iron Man", type: "movie", year: "2008", vote: 7.6 },
  { id: 284054, title: "Black Panther", type: "movie", year: "2018", vote: 7.4 },
  { id: 284052, title: "Doctor Strange", type: "movie", year: "2016", vote: 7.4 },
  { id: 118340, title: "Guardians of the Galaxy", type: "movie", year: "2014", vote: 7.9 },
  
  // Animes
  { id: 635302, title: "Demon Slayer: Mugen Train", type: "anime", year: "2020", vote: 8.3 },
  { id: 810693, title: "Jujutsu Kaisen 0", type: "anime", year: "2021", vote: 8.2 },
  { id: 4935, title: "Howl's Moving Castle", type: "anime", year: "2004", vote: 8.4 },
  { id: 128, title: "Princess Mononoke", type: "anime", year: "1997", vote: 8.4 },
  { id: 8392, title: "My Neighbor Totoro", type: "anime", year: "1988", vote: 8.1 },
  { id: 12477, title: "Grave of the Fireflies", type: "anime", year: "1988", vote: 8.4 },
  { id: 568160, title: "Weathering with You", type: "anime", year: "2019", vote: 7.9 },
  { id: 378064, title: "A Silent Voice", type: "anime", year: "2016", vote: 8.4 },
  { id: 10494, title: "Perfect Blue", type: "anime", year: "1997", vote: 8.3 },
  { id: 9323, title: "Ghost in the Shell", type: "anime", year: "1995", vote: 7.9 }
];

newMovies.forEach(nm => {
  if (!movies.some(m => m.id === nm.id)) {
    movies.push({
      id: nm.id,
      title: nm.title,
      poster_path: `https://placehold.co/500x750/111111/8fba96?text=${encodeURIComponent(nm.title)}`,
      backdrop_path: "https://image.tmdb.org/t/p/original/pbrkL804c8yAv3zBZR4QPEafpAR.jpg",
      overview: `Enjoy watching ${nm.title} instantly. Use the Admin Panel to update this poster with a real TMDB image link!`,
      release_date: `${nm.year}-01-01`,
      vote_average: nm.vote,
      type: nm.type
    });
  }
});

fs.writeFileSync(existingMoviesPath, JSON.stringify(movies, null, 2));
console.log(`Added ${newMovies.length} movies to the database.`);
