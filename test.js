const fs = require('fs');

function injectPagination(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Add import
  if (!content.includes('Pagination')) {
    content = content.replace(
      'import Link from "next/link";',
      'import Link from "next/link";\nimport { Pagination } from "../components/Pagination";'
    );
  }

  // Replace old pagination
  const regex = /\{totalPages > 1 && \([\s\S]*?<\/div>\s*\)\}/;
  content = content.replace(regex, '<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />');

  fs.writeFileSync(file, content);
}

injectPagination('src/app/movies/page.tsx');
injectPagination('src/app/anime/page.tsx');
console.log("Pagination injected");
