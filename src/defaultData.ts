import { BlockTemplate, TrainingBlock, Athlete } from './types';

export const DEFAULT_TEMPLATES: BlockTemplate[] = [
  {
    id: 'tpl-warmup-1',
    title: 'Warm-up Drills',
    distance: 400, // 4x100m
    time: 20,
    category: 'warmup',
    details: '4x100m Medley | Easy Pace',
    description: 'Focus on form',
    tags: ['Drills', 'Warmup']
  },
  {
    id: 'tpl-endurance-1',
    title: 'Endurance Free',
    distance: 1600, // 8x200m / 8x100m
    time: 30,
    category: 'mainset',
    details: '8x200m Freestyle @ 3:00',
    description: '75% Effort, Zone 3',
    tags: ['Freestyle', 'Mainset']
  },
  {
    id: 'tpl-kick-1',
    title: 'Kick & Stroke Drills',
    distance: 300, // 6x50m
    time: 25,
    category: 'drills',
    details: '6x50m Back/Breast',
    description: 'Catch focus, Fin Use',
    tags: ['Kick', 'Backstroke', 'Drills']
  },
  {
    id: 'tpl-speed-1',
    title: 'Speed Bursts',
    distance: 250, // 10x25m
    time: 15,
    category: 'sprint',
    details: '10x25m @ 0:45',
    description: 'All Out Sprint',
    tags: ['Sprint', 'Butterfly', 'Drills']
  },
  {
    id: 'tpl-cooldown-1',
    title: 'Recovery Cooldown',
    distance: 200, // 4x50m
    time: 10,
    category: 'cooldown',
    details: '4x50m Choice | Slow & Relaxed',
    description: 'Relaxed layout, focus on stroke rate',
    tags: ['Cooldown', 'Turns']
  }
];

export const INITIAL_TIMELINE: TrainingBlock[] = [
  {
    id: 'block-1',
    templateId: 'tpl-warmup-1',
    title: 'Warm-up Drills',
    distance: 400,
    time: 20,
    category: 'warmup',
    details: '4x100m Medley | Easy Pace',
    description: 'Focus on form',
    tags: ['Drills', 'Warmup']
  },
  {
    id: 'block-2',
    templateId: 'tpl-endurance-1',
    title: 'Endurance Free',
    distance: 1600,
    time: 30,
    category: 'mainset',
    details: '8x200m Freestyle @ 3:00',
    description: '75% Effort, Zone 3',
    tags: ['Freestyle', 'Mainset']
  },
  {
    id: 'block-3',
    templateId: 'tpl-kick-1',
    title: 'Kick & Stroke Drills',
    distance: 300,
    time: 25,
    category: 'drills',
    details: '6x50m Back/Breast',
    description: 'Catch focus, Fin Use',
    tags: ['Kick', 'Backstroke', 'Drills']
  },
  {
    id: 'block-4',
    templateId: 'tpl-speed-1',
    title: 'Speed Bursts',
    distance: 250,
    time: 15,
    category: 'sprint',
    details: '10x25m @ 0:45',
    description: 'All Out Sprint',
    tags: ['Sprint', 'Butterfly', 'Drills']
  }
];

export const TEAM_ATHLETES: Athlete[] = [
  { id: 'ath-1', name: 'Michael R. (Coach)', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100' },
  { id: 'ath-2', name: 'Laura S.', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
  { id: 'ath-3', name: 'David K.', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100' },
  { id: 'ath-4', name: 'Sarah M.', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100' }
];

export const CATEGORY_LABELS: Record<string, string> = {
  warmup: 'Warm-up',
  drills: 'Technique / Drills',
  mainset: 'Main Set',
  sprint: 'Sprint',
  cooldown: 'Cooldown'
};
