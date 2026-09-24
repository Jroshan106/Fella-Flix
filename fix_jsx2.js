const fs = require('fs');

function fix(path) {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(/(\s*)\)\s*:\s*\(/, '$1</>\n      ) : (');
  fs.writeFileSync(path, content);
}

fix('src/app/movies/page.tsx');
fix('src/app/anime/page.tsx');
console.log('Fixed');
