export interface ProgressSection {
  id: string;
  label: string;
}

export const homeProgressSections: ProgressSection[] = [
  {
    id: 'introduction',
    label: 'Introduction',
  },
  {
    id: 'featured-projects',
    label: 'Featured projects',
  },
  {
    id: 'current-focus',
    label: 'Now and interests',
  },
  {
    id: 'github-activity',
    label: 'GitHub activity',
  },
  {
    id: 'latest-notes',
    label: 'Notebook',
  },
  {
    id: 'featured-blog',
    label: 'Journal',
  },
  {
    id: 'featured-lab',
    label: 'Experiments',
  },
  {
    id: 'contact',
    label: 'Contact',
  },
];
