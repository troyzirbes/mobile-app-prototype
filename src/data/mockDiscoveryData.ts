export type DiscoveryTag = 'Trending' | 'Curated';

export type DiscoveryMetadata = {
  description: string;
  occupation: string;
  neighborhood: string;
  distance: string;
  age: number;
  highlights: string[];
};

export type DiscoveryCard = {
  id: string;
  title: string;
  tags: DiscoveryTag[];
  matchScore: number;
  summary: string;
  imageUrl: string;
  metadata: DiscoveryMetadata;
};

const photo = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&h=1800&q=80`;

export const discoveryCards: DiscoveryCard[] = [
  {
    id: 'maya-alvarez',
    title: 'Maya Alvarez',
    tags: ['Trending'],
    matchScore: 94,
    summary: 'Product designer who will split the last dumpling and then suggest a night climb.',
    imageUrl: photo('photo-1494790108377-be9c29b29330'),
    metadata: {
      description:
        'Maya spends weeknights in a ceramics studio and Sundays on the long way home. She is looking for someone who likes a plan and is equally happy to abandon it.',
      occupation: 'Product designer',
      neighborhood: 'Hayes Valley',
      distance: '1.2 miles away',
      age: 29,
      highlights: ['Ceramics', 'Climbing', 'Night markets'],
    },
  },
  {
    id: 'jordan-hale',
    title: 'Jordan Hale',
    tags: ['Curated'],
    matchScore: 88,
    summary: 'Sous chef with strong opinions about tacos and a soft spot for late walks.',
    imageUrl: photo('photo-1500648767791-00dcc994a43e'),
    metadata: {
      description:
        'Jordan cooks until midnight and still wants a diner booth after service. A good match brings an appetite and a playlist that can survive a kitchen soundtrack.',
      occupation: 'Sous chef',
      neighborhood: 'The Mission',
      distance: '2.4 miles away',
      age: 31,
      highlights: ['Late walks', 'Jazz', 'Markets'],
    },
  },
  {
    id: 'mina-park',
    title: 'Mina Park',
    tags: ['Trending'],
    matchScore: 91,
    summary: 'Physical therapist coming from the studio, the trail, or both.',
    imageUrl: photo('photo-1534528741775-53994a69daeb'),
    metadata: {
      description:
        'Mina keeps an easy calendar and a serious record collection. She likes first meetings that can turn into a walk without anyone checking the time.',
      occupation: 'Physical therapist',
      neighborhood: 'Noe Valley',
      distance: '3.1 miles away',
      age: 27,
      highlights: ['Pilates', 'Live music', 'Dogs'],
    },
  },
  {
    id: 'andre-brooks',
    title: 'Andre Brooks',
    tags: ['Curated'],
    matchScore: 86,
    summary: 'Architect who sketches buildings for work and bakeries for fun.',
    imageUrl: photo('photo-1507003211169-0a1dd7228f2d'),
    metadata: {
      description:
        'Andre notices the block you are standing on and will ask which doorway you like. He is most himself with coffee, a tennis court, and nowhere else to be.',
      occupation: 'Architect',
      neighborhood: 'Oakland',
      distance: '6.8 miles away',
      age: 33,
      highlights: ['Drawing', 'Coffee', 'Tennis'],
    },
  },
  {
    id: 'lena-ortiz',
    title: 'Lena Ortiz',
    tags: ['Trending', 'Curated'],
    matchScore: 90,
    summary: 'Bookshop owner who will read the first chapter out loud if you pick the book.',
    imageUrl: photo('photo-1524504388940-b1c1722653e1'),
    metadata: {
      description:
        'Lena runs a small shop in Bernal Heights and hosts quiet film nights after close. She wants someone who lingers, asks what the last great sentence was, and stays for the credits.',
      occupation: 'Bookshop owner',
      neighborhood: 'Bernal Heights',
      distance: '4.0 miles away',
      age: 26,
      highlights: ['Fiction', 'Film photos', 'Cooking'],
    },
  },
  {
    id: 'sam-ellis',
    title: 'Sam Ellis',
    tags: ['Trending'],
    matchScore: 84,
    summary: 'Climate researcher who actually uses the picnic blanket.',
    imageUrl: photo('photo-1539571696357-5a69c17a67c6'),
    metadata: {
      description:
        'Sam is in the fog on purpose. Weekends mean a bakery line, a trail with a view of nothing famous, and trivia if the team needs one more person.',
      occupation: 'Climate researcher',
      neighborhood: 'Inner Richmond',
      distance: '5.5 miles away',
      age: 30,
      highlights: ['Hiking', 'Bread', 'Trivia'],
    },
  },
  {
    id: 'nina-patel',
    title: 'Nina Patel',
    tags: ['Curated'],
    matchScore: 89,
    summary: 'Gallery coordinator with a standing table for two after the opening.',
    imageUrl: photo('photo-1544005313-94ddf0286df2'),
    metadata: {
      description:
        'Nina can explain a painting without making it homework. She likes a sharp outfit, a neighborhood she can walk, and a second drink only if the conversation earns it.',
      occupation: 'Gallery coordinator',
      neighborhood: 'Dogpatch',
      distance: '3.6 miles away',
      age: 28,
      highlights: ['Openings', 'Tailoring', 'Coastal walks'],
    },
  },
  {
    id: 'chris-lang',
    title: 'Chris Lang',
    tags: ['Trending'],
    matchScore: 82,
    summary: 'Bike courier and weekend saxophonist looking for the long way around.',
    imageUrl: photo('photo-1506794778202-cad84cf45f1d'),
    metadata: {
      description:
        'Chris knows which hills are worth the climb and which venues let a horn section breathe. A match is someone who will take the scenic route and still make the reservation.',
      occupation: 'Courier and musician',
      neighborhood: 'Lower Haight',
      distance: '1.8 miles away',
      age: 32,
      highlights: ['Cycling', 'Jazz bars', 'Dawn swims'],
    },
  },
  {
    id: 'elena-voss',
    title: 'Elena Voss',
    tags: ['Curated', 'Trending'],
    matchScore: 93,
    summary: 'Floral designer who keeps one stool open at the shop counter.',
    imageUrl: photo('photo-1529626455594-4ff0802cfb7e'),
    metadata: {
      description:
        'Elena builds arrangements for dinners she is usually too busy to attend. She wants a person who will sit at the counter, learn one flower name, and suggest where to eat with ink still on their hands.',
      occupation: 'Floral designer',
      neighborhood: 'North Beach',
      distance: '2.9 miles away',
      age: 27,
      highlights: ['Markets', 'Handwritten notes', 'Espresso'],
    },
  },
];

export function getCardById(id: string): DiscoveryCard | undefined {
  return discoveryCards.find((card) => card.id === id);
}

export function filterCardsByTag(tag: DiscoveryTag): DiscoveryCard[] {
  return discoveryCards.filter((card) => card.tags.includes(tag));
}
