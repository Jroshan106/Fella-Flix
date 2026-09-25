const fs = require('fs');

function injectGenreDropdown(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Add import
  if (!content.includes('GenreDropdown')) {
    content = content.replace(
      'import { Pagination } from "../components/Pagination";',
      'import { Pagination } from "../components/Pagination";\nimport { GenreDropdown } from "../components/GenreDropdown";'
    );
  }

  // Update state
  content = content.replace(
    'const [selectedGenre, setSelectedGenre] = useState("All");',
    'const [selectedGenres, setSelectedGenres] = useState<string[]>([]);'
  );

  // Update effect dependency
  content = content.replace(
    '}, [localSearch, selectedGenre]);',
    '}, [localSearch, selectedGenres]);'
  );

  // Update filter logic
  content = content.replace(
    'const matchesGenre = selectedGenre === "All" || (movie.genres && movie.genres.includes(selectedGenre));',
    'const matchesGenre = selectedGenres.length === 0 || (movie.genres && movie.genres.some(g => selectedGenres.includes(g)));'
  );

  // Update UI component
  const selectRegex = /<select[\s\S]*?<\/select>/;
  content = content.replace(selectRegex, '<GenreDropdown allGenres={allGenres} selectedGenres={selectedGenres} onChange={setSelectedGenres} />');

  fs.writeFileSync(file, content);
}

injectGenreDropdown('src/app/movies/page.tsx');
injectGenreDropdown('src/app/anime/page.tsx');
console.log("GenreDropdown injected");
