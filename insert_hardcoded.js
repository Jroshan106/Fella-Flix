const fs = require('fs');
const path = require('path');

const newMovies = [
  {
    "id": 569094,
    "title": "Spider-Man: Across the Spider-Verse",
    "poster_path": "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    "backdrop_path": "https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg",
    "overview": "After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters the Spider Society, a team of Spider-People charged with protecting the Multiverse’s very existence.",
    "release_date": "2023-05-31",
    "vote_average": 8.4,
    "type": "movie"
  },
  {
    "id": 634649,
    "title": "Spider-Man: No Way Home",
    "poster_path": "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1R80vEM4u1E3wO.jpg",
    "backdrop_path": "https://image.tmdb.org/t/p/original/iQFcwSGbZc8Jj0iOwsO8n59Zonb.jpg",
    "overview": "Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero. When he asks for help from Doctor Strange the stakes become even more dangerous, forcing him to discover what it truly means to be Spider-Man.",
    "release_date": "2021-12-15",
    "vote_average": 8.0,
    "type": "movie"
  },
  {
    "id": 324857,
    "title": "Spider-Man: Into the Spider-Verse",
    "poster_path": "https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",
    "backdrop_path": "https://image.tmdb.org/t/p/original/eCgXPTyXF3hFngh2j0Q8E6K4f3h.jpg",
    "overview": "Struggling to find his place in the world while juggling school and family, Brooklyn teenager Miles Morales is unexpectedly bitten by a radioactive spider and develops unfathomable powers just like the one and only Spider-Man.",
    "release_date": "2018-12-06",
    "vote_average": 8.4,
    "type": "movie"
  },
  {
    "id": 414906,
    "title": "The Batman",
    "poster_path": "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    "backdrop_path": "https://image.tmdb.org/t/p/original/b0PlSNyXq2bZmBGsS7Y2P8p6uHq.jpg",
    "overview": "In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.",
    "release_date": "2022-03-01",
    "vote_average": 7.7,
    "type": "movie"
  },
  {
    "id": 545611,
    "title": "Everything Everywhere All at Once",
    "poster_path": "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    "backdrop_path": "https://image.tmdb.org/t/p/original/8hL3FqD9rR21hYn8hP7v5c0oFmC.jpg",
    "overview": "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save what's important to her by connecting with the lives she could have led in other universes.",
    "release_date": "2022-03-24",
    "vote_average": 7.9,
    "type": "movie"
  },
  {
    "id": 361743,
    "title": "Top Gun: Maverick",
    "poster_path": "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1VNoj13n.jpg",
    "backdrop_path": "https://image.tmdb.org/t/p/original/jsoz1HlxczSuZ8x2Cg1G5B1q7q3.jpg",
    "overview": "After more than thirty years of service as one of the Navy’s top aviators, and dodging the advancement in rank that would ground him, Pete “Maverick” Mitchell finds himself training a detachment of TOPGUN graduates for a specialized mission.",
    "release_date": "2022-05-24",
    "vote_average": 8.3,
    "type": "movie"
  },
  {
    "id": 76600,
    "title": "Avatar: The Way of Water",
    "poster_path": "https://image.tmdb.org/t/p/w500/t6HIqrHe2w8kH2y0H7R24P1hX9J.jpg",
    "backdrop_path": "https://image.tmdb.org/t/p/original/8rpDcsfLJypbO6vtec0iO1s5nCq.jpg",
    "overview": "Set more than a decade after the events of the first film, learn the story of the Sully family (Jake, Neytiri, and their kids), the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure.",
    "release_date": "2022-12-14",
    "vote_average": 7.6,
    "type": "movie"
  },
  {
    "id": 603692,
    "title": "John Wick: Chapter 4",
    "poster_path": "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5Uqd0k2W.jpg",
    "backdrop_path": "https://image.tmdb.org/t/p/original/7I6V7b5K2qD0q8D9dEa5uP5y5m.jpg",
    "overview": "With the price on his head ever increasing, John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe and forces that turn old friends into foes.",
    "release_date": "2023-03-22",
    "vote_average": 7.8,
    "type": "movie"
  },
  {
    "id": 447365,
    "title": "Guardians of the Galaxy Vol. 3",
    "poster_path": "https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg",
    "backdrop_path": "https://image.tmdb.org/t/p/original/5YZbUmjbMa0t7O9T1G2tXvj3Q8.jpg",
    "overview": "Peter Quill, still reeling from the loss of Gamora, must rally his team around him to defend the universe along with protecting one of their own. A mission that, if not completed successfully, could quite possibly lead to the end of the Guardians as we know them.",
    "release_date": "2023-05-03",
    "vote_average": 8.0,
    "type": "movie"
  },
  {
    "id": 346698,
    "title": "Barbie",
    "poster_path": "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
    "backdrop_path": "https://image.tmdb.org/t/p/original/ctMserH8g2SeOAnCw5gFjdQF8mo.jpg",
    "overview": "Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans.",
    "release_date": "2023-07-19",
    "vote_average": 7.1,
    "type": "movie"
  },
  {
    "id": 575264,
    "title": "Mission: Impossible - Dead Reckoning Part One",
    "poster_path": "https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg",
    "backdrop_path": "https://image.tmdb.org/t/p/original/4XM8DUTQb3lhLemJC51Jx4a2EuA.jpg",
    "overview": "Ethan Hunt and his IMF team embark on their most dangerous mission yet: To track down a terrifying new weapon that threatens all of humanity before it falls into the wrong hands.",
    "release_date": "2023-07-08",
    "vote_average": 7.6,
    "type": "movie"
  },
  {
    "id": 315162,
    "title": "Puss in Boots: The Last Wish",
    "poster_path": "https://image.tmdb.org/t/p/w500/kuf6dutpsT0vSVehic3EZIqkOBt.jpg",
    "backdrop_path": "https://image.tmdb.org/t/p/original/jr8tSoJGj33XLgFBy6lmZvlQzD3.jpg",
    "overview": "Puss in Boots discovers that his passion for adventure has taken its toll: He has burned through eight of his nine lives, leaving him with only one life left.",
    "release_date": "2022-12-07",
    "vote_average": 8.2,
    "type": "movie"
  },
  {
    "id": 502356,
    "title": "The Super Mario Bros. Movie",
    "poster_path": "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg",
    "backdrop_path": "https://image.tmdb.org/t/p/original/nLBRD7UPzGfaf97q3W0Bw8i6Wj9.jpg",
    "overview": "While working underground to fix a water main, Brooklyn plumbers—and brothers—Mario and Luigi are transported down a mysterious pipe and wander into a magical new world.",
    "release_date": "2023-04-05",
    "vote_average": 7.7,
    "type": "movie"
  },
  {
    "id": 505642,
    "title": "Black Panther: Wakanda Forever",
    "poster_path": "https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg",
    "backdrop_path": "https://image.tmdb.org/t/p/original/xDMIl84Qo5Tsu62c9DGWhmPI67A.jpg",
    "overview": "Queen Ramonda, Shuri, M’Baku, Okoye and the Dora Milaje fight to protect their nation from intervening world powers in the wake of King T’Challa’s death.",
    "release_date": "2022-11-09",
    "vote_average": 7.2,
    "type": "movie"
  },
  {
    "id": 539681,
    "title": "DC League of Super-Pets",
    "poster_path": "https://image.tmdb.org/t/p/w500/r7XifzvtezNt31ypvsmb6Oqxw49.jpg",
    "backdrop_path": "https://image.tmdb.org/t/p/original/egoyMDLqC8XwIq8hGZ2lR6u9p3V.jpg",
    "overview": "When Superman and the rest of the Justice League are kidnapped, Krypto the Super-Dog must convince a rag-tag shelter pack to master their own newfound powers and help him rescue the superheroes.",
    "release_date": "2022-07-27",
    "vote_average": 7.4,
    "type": "movie"
  },
  {
    "id": 533535,
    "title": "Deadpool & Wolverine",
    "poster_path": "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    "backdrop_path": "https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16ZBRW6KQhL8.jpg",
    "overview": "A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine.",
    "release_date": "2024-07-24",
    "vote_average": 7.7,
    "type": "movie"
  },
  {
    "id": 1022789,
    "title": "Inside Out 2",
    "poster_path": "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    "backdrop_path": "https://image.tmdb.org/t/p/original/t5zCBSB5xMItcDpq1C8W4B7KqQ.jpg",
    "overview": "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions! Joy, Sadness, Anger, Fear and Disgust, who’ve long been running a successful operation by all accounts, aren’t sure how to feel when Anxiety shows up. And it looks like she’s not alone.",
    "release_date": "2024-06-11",
    "vote_average": 7.6,
    "type": "movie"
  },
  {
    "id": 786892,
    "title": "Furiosa: A Mad Max Saga",
    "poster_path": "https://image.tmdb.org/t/p/w500/iADOJ8Zymht2JPMoy3R7xceZprc.jpg",
    "backdrop_path": "https://image.tmdb.org/t/p/original/wNAhuOZ3Zf84jCIlrcI6JhgmY5q.jpg",
    "overview": "As the world fell, young Furiosa is snatched from the Green Place of Many Mothers and falls into the hands of a great Biker Horde led by the Warlord Dementus. Sweeping through the Wasteland, they come across the Citadel presided over by The Immortan Joe. While the two Tyrants war for dominance, Furiosa must survive many trials as she puts together the means to find her way home.",
    "release_date": "2024-05-22",
    "vote_average": 7.6,
    "type": "movie"
  },
  {
    "id": 372058,
    "title": "Your Name.",
    "poster_path": "https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg",
    "backdrop_path": "https://image.tmdb.org/t/p/original/7lmBufEG7P7Y1HClYK3gCxYrIN7.jpg",
    "overview": "High schoolers Mitsuha and Taki are complete strangers living separate lives. But one night, they suddenly switch places. Mitsuha wakes up in Taki’s body, and he in hers. This bizarre occurrence continues to happen randomly, and the two must adjust their lives around each other.",
    "release_date": "2016-08-26",
    "vote_average": 8.5,
    "type": "anime"
  },
  {
    "id": 810693,
    "title": "Jujutsu Kaisen 0",
    "poster_path": "https://image.tmdb.org/t/p/w500/3pTwMUEavTzVOh6yLN0aEwR7uSy.jpg",
    "backdrop_path": "https://image.tmdb.org/t/p/original/8rpDcsfLJypbO6vtec0iO1s5nCq.jpg",
    "overview": "Yuta Okkotsu is a nervous high school student who is suffering from a serious problem—his childhood friend Rika has turned into a curse and won't leave him alone. Since Rika is no ordinary curse, his plight is noticed by Satoru Gojo, a teacher at Jujutsu High, a school where fledgling exorcists learn how to combat curses.",
    "release_date": "2021-12-24",
    "vote_average": 8.3,
    "type": "anime"
  },
  {
    "id": 923186,
    "title": "The Boy and the Heron",
    "poster_path": "https://image.tmdb.org/t/p/w500/jDQPkgzerGophKRRn7MKm071vCU.jpg",
    "backdrop_path": "https://image.tmdb.org/t/p/original/p3HqC4qWqKkE1bXbQ2V7X6b4q7V.jpg",
    "overview": "While the Second World War rages, the teenage Mahito, haunted by his mother's tragic death, is relocated from Tokyo to the serene rural home of his new stepmother Natsuko, a woman who bears a striking resemblance to the boy's mother.",
    "release_date": "2023-07-14",
    "vote_average": 7.4,
    "type": "anime"
  },
  {
    "id": 997614,
    "title": "Suzume",
    "poster_path": "https://image.tmdb.org/t/p/w500/vIeu8WysGznr24ALr3xP8Vb1vF.jpg",
    "backdrop_path": "https://image.tmdb.org/t/p/original/a0xZ8J7m4fC83YfL7HqE6847P2u.jpg",
    "overview": "Suzume, 17, lost her mother as a little girl. On her way to school, she meets a mysterious young man. But her curiosity unleashes a calamity that endangers the entire population of Japan, and so Suzume embarks on a journey to set things right.",
    "release_date": "2022-11-11",
    "vote_average": 7.9,
    "type": "anime"
  }
];

const filePath = path.join(__dirname, 'src', 'app', 'data', 'movies.json');
let db = JSON.parse(fs.readFileSync(filePath, 'utf8'));

let added = 0;
for (const m of newMovies) {
  // Check if it already exists by title
  if (!db.some(existing => existing.title.toLowerCase() === m.title.toLowerCase())) {
    db.unshift(m);
    added++;
  }
}

fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
console.log(`Successfully added ${added} new high-quality movies to the database!`);
