const fs = require('fs');
const file = 'src/app/search/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// We need to move the pagination block below the results block.
// Let's just do a string replacement.
const badBlock = `const ITEMS_PER_PAGE = 24;
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const paginatedResults = results.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );`;

content = content.replace(badBlock, '');

content = content.replace(
  'const results = mockMovies.filter(movie => \n    movie.title.toLowerCase().includes(query)\n  );',
  'const results = mockMovies.filter(movie => \n    movie.title.toLowerCase().includes(query)\n  );\n\n  ' + badBlock
);
content = content.replace(
  'const results = mockMovies.filter(movie => \r\n    movie.title.toLowerCase().includes(query)\r\n  );',
  'const results = mockMovies.filter(movie => \r\n    movie.title.toLowerCase().includes(query)\r\n  );\n\n  ' + badBlock
);

fs.writeFileSync(file, content);
console.log("Fixed results scope");
