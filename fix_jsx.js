const fs = require('fs');

function fixJSX(path) {
  let content = fs.readFileSync(path, 'utf8');
  
  // Find the `{paginatedMovies.length > 0 ? (` (Wait, it says `filteredMovies.length > 0 ? (`)
  content = content.replace('{filteredMovies.length > 0 ? (', '{filteredMovies.length > 0 ? (\n        <>');
  content = content.replace('        )}\n      ) : (', '        )}\n        </>\n      ) : (');
  // It might be \r\n
  content = content.replace('        )}\r\n      ) : (', '        )}\r\n        </>\r\n      ) : (');
  
  fs.writeFileSync(path, content);
}

fixJSX('src/app/movies/page.tsx');
fixJSX('src/app/anime/page.tsx');
console.log('Fixed JSX Fragments');
