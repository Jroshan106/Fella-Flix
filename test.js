const fs = require('fs');
let content = fs.readFileSync('src/app/components/Footer.tsx', 'utf8');
content = content.replace(
  'import { Film, Tv, Github, Twitter } from "lucide-react";',
  'import { Film, Tv } from "lucide-react";'
);
fs.writeFileSync('src/app/components/Footer.tsx', content, 'utf8');
console.log("Removed unused lucide imports");
