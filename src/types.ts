export type BlockCategory = 'warmup' | 'drills' | 'mainset' | 'sprint' | 'cooldown';

export interface BlockTemplate {
  id: string;
  title: string;
  distance: number; // distance in meters, e.g. 400
  time: number; // time in minutes, e.g. 20
  category: BlockCategory;
  details?: string; // e.g. "4x100m Medley | Easy Pace"
  description?: string; // e.g. "Focus on form"
  tags?: string[]; // tags like ['Drills', 'Freestyle', 'Kick', 'Backstroke', 'Butterfly', 'Starts', 'Turns']
}

export interface TrainingBlock {
  id: string; // Unique instance ID in the timeline
  templateId: string; // Reference to the source BlockTemplate
  title: string;
  distance: number;
  time: number;
  category: BlockCategory;
  details?: string;
  description?: string;
  tags?: string[];
}

export interface Athlete {
  id: string;
  name: string;
  avatarUrl: string;
}
