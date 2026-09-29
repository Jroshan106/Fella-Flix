const fs = require('fs');

const files = [
  'src/app/page.tsx',
  'src/app/movies/page.tsx',
  'src/app/anime/page.tsx',
  'src/app/search/page.tsx'
];

const oldClass = 'className="group block relative rounded-xl overflow-hidden bg-card shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2"';
const newClass = 'className="group block relative rounded-xl overflow-hidden bg-card shadow-md transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(143,186,150,0.4)] hover:ring-2 hover:ring-primary/50"';

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(new RegExp(oldClass.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newClass);
    fs.writeFileSync(file, content, 'utf8');
  }
}
console.log("Updated card hover classes");
