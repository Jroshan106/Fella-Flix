const fs = require('fs');
const data = JSON.parse(fs.readFileSync('kitsu.json', 'utf8'));
data.data.forEach(a => console.log(a.attributes.canonicalTitle, a.attributes.subtype));
