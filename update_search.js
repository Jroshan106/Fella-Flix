const fs = require('fs');
const file = 'src/app/search/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add imports
if (!content.includes('import { Pagination }')) {
  content = content.replace(
    'import { Suspense } from "react";',
    'import { Suspense, useEffect } from "react";\nimport { Pagination } from "../components/Pagination";'
  );
}

// Update filter
content = content.replace(
  /const results = mockMovies\.filter\(movie =>\s*movie\.title\.toLowerCase\(\)\.includes\(query\) \|\|\s*movie\.overview\.toLowerCase\(\)\.includes\(query\)\s*\);/m,
  `const results = mockMovies.filter(movie => 
    movie.title.toLowerCase().includes(query)
  );`
);

// Add Pagination State
if (!content.includes('ITEMS_PER_PAGE')) {
  content = content.replace(
    'const [localQuery, setLocalQuery] = useState(query);',
    `const [localQuery, setLocalQuery] = useState(query);
  const ITEMS_PER_PAGE = 24;
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const paginatedResults = results.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );`
  );
}

// Replace mapping and add component
content = content.replace(
  /\{results\.map\(\(movie\)/g,
  '{paginatedResults.map((movie)'
);

content = content.replace(
  /<\/motion\.div>\s*\)\s*:\s*\(/m,
  '</motion.div>\n\n        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />\n      ) : ('
);

// We should also wrap the motion div and pagination in a Fragment if it's the root of the ternary.
content = content.replace(
  /<motion\.div\s*variants=\{container\}\s*initial="hidden"\s*animate="show"\s*className="grid/m,
  '<>\n        <motion.div \n          variants={container}\n          initial="hidden"\n          animate="show"\n          className="grid'
);

content = content.replace(
  /<Pagination currentPage=\{currentPage\} totalPages=\{totalPages\} onPageChange=\{setCurrentPage\} \/>\s*\)\s*:\s*\(/m,
  '<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />\n        </>\n      ) : ('
);

fs.writeFileSync(file, content);
console.log("Search page updated");
