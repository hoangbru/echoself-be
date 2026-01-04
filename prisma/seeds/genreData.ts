export interface GenreData {
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
}

export const genreData: GenreData[] = [
  // Popular Genres
  {
    name: "Pop",
    slug: "pop",
    description:
      "Popular music characterized by catchy melodies and mainstream appeal",
  },
  {
    name: "Rock",
    slug: "rock",
    description: "Music featuring electric guitars, drums, and strong rhythms",
  },
  {
    name: "Hip Hop",
    slug: "hip-hop",
    description:
      "Urban music featuring rhythmic vocal delivery (rapping) over beats",
  },
  {
    name: "R&B",
    slug: "r-n-b",
    description: "Rhythm and Blues - soulful vocals with smooth melodies",
  },
  {
    name: "Electronic",
    slug: "electronic",
    description:
      "Music produced primarily with electronic instruments and technology",
  },
  {
    name: "Dance",
    slug: "dance",
    description: "Upbeat electronic music designed for dancing",
  },
  {
    name: "EDM",
    slug: "edm",
    description:
      "Electronic Dance Music - high-energy electronic music for festivals and clubs",
  },
  {
    name: "House",
    slug: "house",
    description: "Electronic dance music with a repetitive 4/4 beat",
  },
  {
    name: "Techno",
    slug: "techno",
    description: "Electronic music with a strong, repetitive beat",
  },
  {
    name: "Trance",
    slug: "trance",
    description:
      "Electronic music with hypnotic rhythms and uplifting melodies",
  },
  {
    name: "Dubstep",
    slug: "dubstep",
    description: "Electronic music with heavy bass drops and wobble sounds",
  },

  // Urban Genres
  {
    name: "Rap",
    slug: "rap",
    description: "Rhythmic vocal delivery over instrumental beats",
  },
  {
    name: "Trap",
    slug: "trap",
    description: "Hip hop subgenre with heavy 808 drums and hi-hats",
  },
  {
    name: "Drill",
    slug: "drill",
    description: "Dark, aggressive style of trap music",
  },

  // Rock Subgenres
  {
    name: "Alternative Rock",
    slug: "alternative-rock",
    description: "Non-mainstream rock music with diverse influences",
  },
  {
    name: "Indie Rock",
    slug: "indie-rock",
    description: "Independent rock music with DIY ethos",
  },
  {
    name: "Hard Rock",
    slug: "hard-rock",
    description: "Aggressive rock with heavy guitar riffs",
  },
  {
    name: "Metal",
    slug: "metal",
    description: "Heavy, aggressive music with distorted guitars",
  },
  {
    name: "Punk",
    slug: "punk",
    description: "Fast, energetic rock with rebellious attitude",
  },

  // Soul & Funk
  {
    name: "Soul",
    slug: "soul",
    description: "Emotional vocal music with roots in gospel and blues",
  },
  {
    name: "Funk",
    slug: "funk",
    description: "Groove-oriented music with strong bass lines",
  },
  {
    name: "Disco",
    slug: "disco",
    description:
      "Dance music from the 1970s with steady four-on-the-floor beat",
  },

  // Jazz & Blues
  {
    name: "Jazz",
    slug: "jazz",
    description: "Improvisational music with complex harmonies",
  },
  {
    name: "Blues",
    slug: "blues",
    description: "Emotional music with roots in African-American work songs",
  },

  // Country & Folk
  {
    name: "Country",
    slug: "country",
    description: "American roots music with storytelling lyrics",
  },
  {
    name: "Folk",
    slug: "folk",
    description: "Traditional music passed down through generations",
  },
  {
    name: "Americana",
    slug: "americana",
    description: "Blend of American roots music styles",
  },

  // Latin
  {
    name: "Latin",
    slug: "latin",
    description: "Music from Latin America and Spain",
  },
  {
    name: "Reggaeton",
    slug: "reggaeton",
    description: "Latin urban music with dembow rhythm",
  },
  {
    name: "Salsa",
    slug: "salsa",
    description: "Latin dance music with Cuban and Puerto Rican influences",
  },
  {
    name: "Bachata",
    slug: "bachata",
    description: "Dominican romantic music",
  },

  // Reggae & Caribbean
  {
    name: "Reggae",
    slug: "reggae",
    description: "Jamaican music with offbeat rhythms",
  },
  {
    name: "Dancehall",
    slug: "dancehall",
    description: "Jamaican dance music evolved from reggae",
  },
  {
    name: "Afrobeat",
    slug: "afrobeat",
    description:
      "West African music fusing traditional and contemporary sounds",
  },

  // Classical & Instrumental
  {
    name: "Classical",
    slug: "classical",
    description: "Traditional Western art music",
  },
  {
    name: "Instrumental",
    slug: "instrumental",
    description: "Music without vocals",
  },
  {
    name: "Ambient",
    slug: "ambient",
    description: "Atmospheric music focused on tone and mood",
  },

  // Other Popular Genres
  {
    name: "Indie",
    slug: "indie",
    description: "Independent music outside mainstream genres",
  },
  {
    name: "Singer-Songwriter",
    slug: "singer-songwriter",
    description: "Music performed by the songwriter, often acoustic",
  },
  {
    name: "Acoustic",
    slug: "acoustic",
    description: "Music using primarily acoustic instruments",
  },
  {
    name: "Lo-Fi",
    slug: "lo-fi",
    description: "Relaxed music with intentionally low-fidelity production",
  },
  {
    name: "Chill",
    slug: "chill",
    description: "Relaxing, downtempo music",
  },
  {
    name: "World",
    slug: "world",
    description: "Non-Western traditional and folk music",
  },
  {
    name: "K-Pop",
    slug: "k-pop",
    description: "Korean pop music with synchronized choreography",
  },
  {
    name: "J-Pop",
    slug: "j-pop",
    description: "Japanese pop music",
  },
  {
    name: "Gospel",
    slug: "gospel",
    description: "Christian religious music",
  },
  {
    name: "Christian",
    slug: "christian",
    description: "Contemporary Christian music",
  },
  {
    name: "Soundtrack",
    slug: "soundtrack",
    description: "Music from films, TV shows, and games",
  },
  {
    name: "Comedy",
    slug: "comedy",
    description: "Humorous music and comedy songs",
  },
  {
    name: "Children",
    slug: "children",
    description: "Music for kids",
  },
];
