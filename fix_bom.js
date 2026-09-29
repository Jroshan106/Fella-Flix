const fs = require('fs');

const content = `@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #394d3e;
  --primary: #394d3e;
  --card: #f3f4f6;
  --card-foreground: #394d3e;
}

:root[data-theme="dark"] {
  --background: #000000;
  --foreground: #8fba96;
  --primary: #8fba96;
  --card: #111111;
  --card-foreground: #8fba96;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
}

body {
  background-color: var(--background);
  color: var(--foreground);
}

body * {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Hide scrollbar for Chrome, Safari and Opera */
::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
* {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
`;

fs.writeFileSync('src/app/globals.css', content, 'utf8');
