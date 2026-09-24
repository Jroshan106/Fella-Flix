const fs = require('fs');
const files = [
  'src/app/page.tsx',
  'src/app/movies/page.tsx',
  'src/app/anime/page.tsx',
  'src/app/search/page.tsx'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if import Image is before "use client"
    if (content.startsWith('import Image from "next/image";\n"use client";')) {
      content = content.replace('import Image from "next/image";\n"use client";', '"use client";\nimport Image from "next/image";');
    } else if (content.startsWith('import Image from "next/image";\r\n"use client";')) {
      content = content.replace('import Image from "next/image";\r\n"use client";', '"use client";\r\nimport Image from "next/image";');
    } else if (content.indexOf('"use client"') > 0 && content.indexOf('import Image') === 0) {
      // General fix if it was prepended
      content = content.replace(/^import Image from "next\/image";[\r\n]+/, '');
      content = content.replace(/("use client";[\r\n]+)/, ' Image from "next/image";\n');
    }
    
    fs.writeFileSync(file, content);
  }
}
console.log('Fixed use client directive!');
