const fs = require('fs');

function addGenreFilter(path) {
  let content = fs.readFileSync(path, 'utf8');

  // Add state
  content = content.replace(
    'const [localSearch, setLocalSearch] = useState("");',
    'const [localSearch, setLocalSearch] = useState("");\n  const [selectedGenre, setSelectedGenre] = useState("All");\n\n  const allGenres = Array.from(new Set(mockMovies.filter(m => m.type === (path.includes("anime") ? "anime" : "movie")).flatMap(m => m.genres || []))).sort();'
  );
  
  // Replace filter logic
  content = content.replace(
    /const filteredMovies = sortedMovies\.filter\(movie =>\s*movie\.title\.toLowerCase\(\)\.includes\(localSearch\.toLowerCase\(\)\)\s*\);/m,
    `const filteredMovies = sortedMovies.filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(localSearch.toLowerCase());
      const matchesGenre = selectedGenre === "All" || (movie.genres && movie.genres.includes(selectedGenre));
      return matchesSearch && matchesGenre;
    });`
  );

  // Replace useEffect dependency
  content = content.replace(
    '  }, [localSearch]);',
    '  }, [localSearch, selectedGenre]);'
  );

  // Replace JSX for Search
  content = content.replace(
    '<div className="relative w-full md:w-72">',
    `<div className="flex items-center gap-4 w-full md:w-auto">
          <select 
            value={selectedGenre} 
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="block w-full md:w-48 pl-3 pr-8 py-2.5 border border-primary/30 rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm"
          >
            <option value="All">All Genres</option>
            {allGenres.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <div className="relative w-full md:w-72">`
  );
  
  // Close the new wrapper div
  content = content.replace(
    /(\s*)<\/div>\s*<\/div>\s*\{filteredMovies\.length > 0 \? \(/m,
    '$1</div>\n        </div>\n      </div>\n\n      {filteredMovies.length > 0 ? ('
  );

  // Note: the hardcoded `path.includes` hack inside the string won't execute inside the component correctly! 
  // Let's fix that.
  content = content.replace(
    /path\.includes\("anime"\) \? "anime" : "movie"/g,
    path.includes("anime") ? '"anime"' : '"movie"'
  );

  fs.writeFileSync(path, content);
}

addGenreFilter('src/app/movies/page.tsx');
addGenreFilter('src/app/anime/page.tsx');
console.log('Genres filter added');
