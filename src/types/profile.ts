import type { ImageSourcePropType } from 'react-native';

export type Profile = {
  id: string;
  name: string;
  age: number;
  occupation: string;
  neighborhood: string;
  bio: string;
  interests: string[];
  photo: ImageSourcePropType;
};
