const fs = require('fs');
const path = 'src/app/watch/[id]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace useEffect
content = content.replace(
  'useEffect(() => setMounted(true), []);',
  `useEffect(() => {
    setMounted(true);
    const savedServer = localStorage.getItem("fellaflix_preferred_server");
    if (savedServer !== null) {
      const parsed = parseInt(savedServer, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < SERVERS.length) {
        setActiveServer(parsed);
      }
    }
  }, []);

  const handleServerChange = (index: number) => {
    setActiveServer(index);
    localStorage.setItem("fellaflix_preferred_server", index.toString());
  };`
);

// Replace onClick
content = content.replace(
  'onClick={() => setActiveServer(idx)}',
  'onClick={() => handleServerChange(idx)}'
);

fs.writeFileSync(path, content);
console.log('Done');
