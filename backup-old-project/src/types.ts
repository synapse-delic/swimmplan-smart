export type BlockCategory = 'warmup' | 'drills' | 'mainset' | 'sprint' | 'cooldown';

export interface TrainingBlock {
  id: string; // Unique ID for dragged instances
  templateId: string; // ID of the original template
  title: string;
  distance: number; // in meters
  time: number; // in minutes
  category: BlockCategory;
  details?: string;
  description?: string; // Long text explaining the exercise
}

export interface BlockTemplate {
  id: string;
  title: string;
  distance: number;
  time: number;
  category: BlockCategory;
  details?: string;
  description?: string;
}
