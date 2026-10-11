import type { Profile } from '../types/profile';
import andre from '../../assets/profiles/andre.jpg';
import jordan from '../../assets/profiles/jordan.jpg';
import lena from '../../assets/profiles/lena.jpg';
import maya from '../../assets/profiles/maya.jpg';
import mina from '../../assets/profiles/mina.jpg';
import sam from '../../assets/profiles/sam.jpg';

export const profiles: Profile[] = [
  {
    id: 'maya',
    name: 'Maya Alvarez',
    age: 29,
    occupation: 'Product designer',
    neighborhood: 'Hayes Valley',
    bio: 'Sunday pancakes, weeknight ceramics, and a standing offer to split the last dumpling.',
    interests: ['Ceramics', 'Dumplings', 'Climbing'],
    photo: maya,
  },
  {
    id: 'jordan',
    name: 'Jordan Hale',
    age: 31,
    occupation: 'Sous chef',
    neighborhood: 'The Mission',
    bio: 'I cook for a living and still want someone to argue with about the best taco in the city.',
    interests: ['Late walks', 'Jazz', 'Markets'],
    photo: jordan,
  },
  {
    id: 'mina',
    name: 'Mina Park',
    age: 27,
    occupation: 'Physical therapist',
    neighborhood: 'Noe Valley',
    bio: 'Usually coming from the studio or the trail. Looking for an easy laugh and a good playlist.',
    interests: ['Pilates', 'Live music', 'Dogs'],
    photo: mina,
  },
  {
    id: 'andre',
    name: 'Andre Brooks',
    age: 33,
    occupation: 'Architect',
    neighborhood: 'Oakland',
    bio: 'I sketch buildings for work and bakeries for fun. Tell me your favorite block in the city.',
    interests: ['Drawing', 'Coffee', 'Tennis'],
    photo: andre,
  },
  {
    id: 'lena',
    name: 'Lena Ortiz',
    age: 26,
    occupation: 'Bookshop owner',
    neighborhood: 'Bernal Heights',
    bio: 'I will read the first chapter out loud in the shop if you pick the book.',
    interests: ['Fiction', 'Film photos', 'Cooking'],
    photo: lena,
  },
  {
    id: 'sam',
    name: 'Sam Ellis',
    age: 30,
    occupation: 'Climate researcher',
    neighborhood: 'Inner Richmond',
    bio: 'Fog, farmers markets, and someone who will actually use the picnic blanket.',
    interests: ['Hiking', 'Bread', 'Trivia'],
    photo: sam,
  },
];
