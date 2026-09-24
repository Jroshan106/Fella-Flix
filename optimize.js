const fs = require('fs');
const files = [
  'src/app/page.tsx',
  'src/app/movies/page.tsx',
  'src/app/anime/page.tsx',
  'src/app/search/page.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Ensure next/image is imported
  if (!content.includes('import Image from "next/image"')) {
    content = 'import Image from "next/image";\n' + content;
  }
  
  // Replace poster images
  content = content.replace(/<img\s+src=\{movie\.poster_path\}\s+alt=\{movie\.title\}\s+className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110( opacity-90 group-hover:opacity-100)?"\s*\/>/g, 
    '<Image src={movie.poster_path} alt={movie.title} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw" className="object-cover transition-transform duration-500 group-hover:scale-110" />');

  // Replace backdrop image in page.tsx
  content = content.replace(/<img\s+src=\{movie\.backdrop_path\}\s+alt=\{movie\.title\}\s+className="w-full h-full object-cover transform scale-105"\s*\/>/g, 
    '<Image src={movie.backdrop_path} alt={movie.title} fill priority={index === 0} className="object-cover transform scale-105" />');
    
  fs.writeFileSync(file, content);
}
console.log('Optimized images!');
