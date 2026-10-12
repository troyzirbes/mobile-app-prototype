import type { AppScreen, LikesTab } from '../types/demo';
import { searchTrackMeta } from './tracks';

export type NavItem = {
  label: string;
  screen: AppScreen;
  likesTab?: LikesTab;
};

const discovery = searchTrackMeta.map((item) => item.id);

export function contextualNav(screen: AppScreen): NavItem[] {
  if (screen === 'Intro') {
    return [];
  }
  if (screen === 'Home' || screen === 'AppInfo') {
    return [
      { label: 'Profile', screen: 'Profile' },
      { label: 'Likes & Connections', screen: 'LikesHub', likesTab: 'Interested' },
      { label: 'App Info', screen: 'AppInfo' },
    ];
  }
  if (screen === 'Profile' || screen === 'LikesHub') {
    return [
      { label: 'Home', screen: 'Home' },
      { label: 'Interested', screen: 'LikesHub', likesTab: 'Interested' },
      { label: 'Exploring', screen: 'LikesHub', likesTab: 'Exploring' },
      { label: 'Connections', screen: 'LikesHub', likesTab: 'Connections' },
    ];
  }
  return [
    { label: 'Home', screen: 'Home' },
    ...discovery
      .filter((item) => item !== screen)
      .map((item) => ({ label: item, screen: item })),
  ];
}
