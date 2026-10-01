const fs = require('fs');
let content = fs.readFileSync('src/app/watch/[id]/page.tsx', 'utf8');
content = content.replace(
  '            {SERVERS.length > 1 && (<div className="mb-4 flex flex-wrap items-center gap-3 bg-card p-3 rounded-xl border border-primary/20">',
  '            <div className="mb-4 flex flex-wrap items-center gap-3 bg-card p-3 rounded-xl border border-primary/20">'
);
content = content.replace(
  '            <div className="mb-4 flex flex-wrap items-center gap-3 bg-card p-3 rounded-xl border border-primary/20">',
  '            {SERVERS.length > 1 && (<div className="mb-4 flex flex-wrap items-center gap-3 bg-card p-3 rounded-xl border border-primary/20">'
);

// find the closing div of that block
const serverBlockStart = content.indexOf('{SERVERS.length > 1 && (<div');
const beforeMap = content.indexOf('{SERVERS.map', serverBlockStart);
const afterMap = content.indexOf('</div>', beforeMap);
// Replace the exact </div> with </div>)}
content = content.substring(0, afterMap) + '</div>)}' + content.substring(afterMap + 6);

// Wait, what if there's already a )}? Let's clean it up completely.
let lines = fs.readFileSync('src/app/watch/[id]/page.tsx', 'utf8').split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('{SERVERS.length > 1 && (<div')) {
    let j = i;
    while (!lines[j].includes('))}')) j++;
    while (!lines[j].includes('</div>')) j++;
    if (!lines[j].includes('</div>)}')) {
      lines[j] = lines[j].replace('</div>', '</div>)}');
    }
    break;
  }
}
fs.writeFileSync('src/app/watch/[id]/page.tsx', lines.join('\n'), 'utf8');

console.log("Fixed JSX syntax");
