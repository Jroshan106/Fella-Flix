const fs = require('fs');

function addImport(file) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('import { Pagination }')) {
    content = content.replace(
      'import Link from "next/link";',
      'import Link from "next/link";\nimport { Pagination } from "../components/Pagination";'
    );
    fs.writeFileSync(file, content);
  }
}

addImport('src/app/movies/page.tsx');
addImport('src/app/anime/page.tsx');
console.log("Imports added");
