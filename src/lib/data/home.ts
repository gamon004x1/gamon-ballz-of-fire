export interface StackGroup {
  title: string;
  items: string[];
}

export interface ContactLink {
  label: string;
  href: string;
  external?: boolean;
}

export const aboutMetadata = [
  { label: 'interests', value: 'tokusatsu  anime  games  collectibles' },
  { label: 'making', value: 'creative projects  little experiments' },
];

export const nowItems: string[] = [];

export const stackGroups: StackGroup[] = [
  { title: 'Watching', items: ['Tokusatsu', 'Anime'] },
  { title: 'Playing', items: ['Video games'] },
  { title: 'Keeping', items: ['Collectibles', 'Internet finds'] },
  { title: 'Making', items: ['Creative projects', 'Small experiments'] },
];

export const contactLinks: ContactLink[] = [
  {
    label: 'Project source',
    href: 'https://github.com/gamon004x1/gamon-ballz-of-fire',
    external: true,
  },
];
