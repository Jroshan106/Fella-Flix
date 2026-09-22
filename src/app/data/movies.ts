export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  type: "movie" | "anime";
}

export const mockMovies: Movie[] = [
  {
    id: 157336,
    title: "Interstellar",
    poster_path: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/pbrkL804c8yAv3zBZR4QPEafpAR.jpg",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    release_date: "2014-11-05",
    vote_average: 8.4,
    type: "movie"
  },
  {
    id: 693134,
    title: "Dune: Part Two",
    poster_path: "https://m.media-amazon.com/images/M/MV5BODdjMjM3NGQtZDA5OC00NGE4LWIyZDQtZjYwOGZlMTM5ZTQ1XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_FMjpg_UX1000_.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
    overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
    release_date: "2024-02-27",
    vote_average: 8.3,
    type: "movie"
  },
  {
    id: 872585,
    title: "Oppenheimer",
    poster_path: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/fm6KqXn3fQ2M6UnA05ZSR462i3I.jpg",
    overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
    release_date: "2023-07-19",
    vote_average: 8.1,
    type: "movie"
  },
  {
    id: 129,
    title: "Spirited Away",
    poster_path: "https://m.media-amazon.com/images/M/MV5BMjlmZmI5MDctNDE2YS00YWE0LWE5ZWItZDBhYWQ0NTcxNTEhXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/Ab8mkHcgI5EFjf6bPxND8qxgW8.jpg",
    overview: "A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.",
    release_date: "2001-07-20",
    vote_average: 8.5,
    type: "anime"
  },
  {
    id: 372058,
    title: "Your Name.",
    poster_path: "https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/dIWwZW7dJJtqC6CgWzYkNVKIUm8.jpg",
    overview: "High schoolers Mitsuha and Taki are complete strangers living separate lives. But one night, they suddenly switch places. Mitsuha wakes up in Taki’s body, and he in hers.",
    release_date: "2016-08-26",
    vote_average: 8.5,
    type: "anime"
  },
  {
    id: 569094,
    title: "Spider-Man: Across the Spider-Verse",
    poster_path: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg",
    overview: "After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters the Spider Society, a team of Spider-People charged with protecting the Multiverse’s very existence.",
    release_date: "2023-05-31",
    vote_average: 8.4,
    type: "anime" // Calling it anime for category purposes here
  },
  {
    id: 940721,
    title: "Godzilla Minus One",
    poster_path: "https://image.tmdb.org/t/p/w500/hkxxMIGaiCTmrEArK7J56JTKUlB.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/q8IEFmEG65GkNMtvVq4hxTfF0L5.jpg",
    overview: "Postwar Japan is at its lowest point when a new crisis emerges in the form of a giant monster, baptized in the horrific power of the atomic bomb.",
    release_date: "2023-11-03",
    vote_average: 7.6,
    type: "movie"
  },
  {
    id: 149,
    title: "Akira",
    poster_path: "https://m.media-amazon.com/images/M/MV5BM2ZiZTk1ODgtMTZkNS00NTYxLWI4ZWUtNWQwZTFhZjUzYWQwXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/tYtA8qGvwS3w4T2O13eAWJj2m3I.jpg",
    overview: "A secret military project endangers Neo-Tokyo when it turns a biker gang member into a rampaging psychic psychopath that only two teenagers and a group of psychics can stop.",
    release_date: "1988-07-16",
    vote_average: 7.9,
    type: "anime"
  }
];
