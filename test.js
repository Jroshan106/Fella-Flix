const fs = require('fs');
let content = fs.readFileSync('src/app/watch/[id]/page.tsx', 'utf8');

const oldUI = `<div className="mb-4 flex flex-wrap items-center gap-3 bg-card p-3 rounded-xl border border-primary/20">`;
const newUI = `{SERVERS.length > 1 && (<div className="mb-4 flex flex-wrap items-center gap-3 bg-card p-3 rounded-xl border border-primary/20">`;

const oldUIEnd = `))}
            </div>`;
const newUIEnd = `))}
            </div>)}`;

content = content.replace(oldUI, newUI).replace(oldUIEnd, newUIEnd);
fs.writeFileSync('src/app/watch/[id]/page.tsx', content, 'utf8');
console.log("Hidden server bar");
