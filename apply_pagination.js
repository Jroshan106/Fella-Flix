const fs = require('fs');

const paginationCode = `
  // Pagination
  const ITEMS_PER_PAGE = 30;
  const [currentPage, setCurrentPage] = useState(1);
  
  // Reset page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [localSearch]);

  const totalPages = Math.ceil(filteredMovies.length / ITEMS_PER_PAGE);
  const paginatedMovies = filteredMovies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
`;

const paginationUI = `
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 gap-4">
            <button 
              onClick={() => {
                setCurrentPage(p => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-card border border-primary/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition-colors text-foreground font-medium"
            >
              Previous
            </button>
            <span className="text-foreground/70 font-medium text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => {
                setCurrentPage(p => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-card border border-primary/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition-colors text-foreground font-medium"
            >
              Next
            </button>
          </div>
        )}
`;

function processFile(path) {
  let content = fs.readFileSync(path, 'utf8');
  
  if (!content.includes('useEffect')) {
    content = content.replace('import { useState } from "react";', 'import { useState, useEffect } from "react";');
  }

  if (!content.includes('ITEMS_PER_PAGE')) {
    content = content.replace(
      '  return (',
      paginationCode + '\n  return ('
    );
  }

  content = content.replace(/filteredMovies\.map/g, 'paginatedMovies.map');

  if (!content.includes('Page {currentPage}')) {
    content = content.replace(
      '        </motion.div>',
      '        </motion.div>\n' + paginationUI
    );
  }

  content = content.replace(/<img\s*src=\{movie\.poster_path\}[\s\S]*?className="(.*?)"\s*\/>/m, 
    '<Image src={movie.poster_path} alt={movie.title} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw" className="$1 object-cover" />'
  );

  fs.writeFileSync(path, content);
}

processFile('src/app/movies/page.tsx');
processFile('src/app/anime/page.tsx');

console.log('Pagination and images updated');
