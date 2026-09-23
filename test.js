fetch('https://www.themoviedb.org/search/movie?query=spider-man', {
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
}).then(r => r.text()).then(t => {
  const match = t.match(/data-media-type="movie"[\s\S]*?href="\/movie\/(\d+)"[\s\S]*?src="([^"]+)"[\s\S]*?<h2>(.*?)<\/h2>/);
  console.log(match ? match.slice(1) : "No match");
});
