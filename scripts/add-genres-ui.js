const fs = require('fs');
let content = fs.readFileSync('src/app/watch/[id]/page.tsx', 'utf8');

const replacement = `              <h1 className="text-3xl md:text-5xl font-black text-foreground mb-2">{movie.title}</h1>
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 mb-3">
                  {movie.genres.map((g: string) => (
                    <span key={g} className="px-3 py-1 text-xs font-semibold bg-primary/20 text-primary rounded-full border border-primary/20">
                      {g}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-foreground/70 max-w-3xl">{movie.overview}</p>`;

content = content.replace('              <h1 className="text-3xl md:text-5xl font-black text-foreground mb-2">{movie.title}</h1>\r\n              <p className="text-foreground/70 max-w-3xl">{movie.overview}</p>', replacement);
content = content.replace('              <h1 className="text-3xl md:text-5xl font-black text-foreground mb-2">{movie.title}</h1>\n              <p className="text-foreground/70 max-w-3xl">{movie.overview}</p>', replacement);

fs.writeFileSync('src/app/watch/[id]/page.tsx', content);
console.log('Genres added to watch page');
