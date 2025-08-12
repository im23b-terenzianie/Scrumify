// User Story Types - EXAKT nach Backend Schema
export enum StoryStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  IN_REVIEW = "in_review",
  DONE = "done",
}

export enum StoryPriority {
  LOW = 1,         // 🟢 Fibonacci: 1
  MEDIUM = 2,      // 🟡 Fibonacci: 2  
  HIGH = 3,        // 🟠 Fibonacci: 3
  URGENT = 5,      // 🔴 Fibonacci: 5
  CRITICAL = 8,    // 🚨 Fibonacci: 8
}

// Interface f�r das Erstellen einer Story
export interface UserStoryCreate {
  title: string;                    // Required, max 200 chars
  description?: string;             // Optional, max 2000 chars
  story_points?: number;            // Optional, Fibonacci
  priority?: StoryPriority;         // Optional, default: MEDIUM
  status?: StoryStatus;             // Optional, default: TODO
  user_type?: string;               // "Als..." Teil
  user_action?: string;             // "m�chte ich..." Teil  
  user_benefit?: string;            // "um..." Teil
  acceptance_criteria?: string;     // Akzeptanzkriterien
  assignee_id?: number | null;      // User assignment
}

// Interface f�r das Aktualisieren einer Story
export interface UserStoryUpdate extends Partial<UserStoryCreate> { }

// Interface f�r eine gelesene Story vom Backend
export interface UserStory {
  id: number;
  board_id: number;
  owner_id: number;
  created_at: string;
  updated_at: string;
  assignee?: { id: number; username: string; email: string; }; // User-Objekt
  owner?: { id: number; username: string; email: string; };
  // Alle Felder von UserStoryCreate
  title: string;
  description: string | null;
  story_points: number | null;
  priority: StoryPriority;
  status: StoryStatus;
  user_type: string | null;
  user_action: string | null;
  user_benefit: string | null;
  acceptance_criteria: string | null;
  assignee_id: number | null;
}

// ✅ MAPPING HELPERS für Backend-Kompatibilität
export const getPriorityNumber = (priority: StoryPriority | string): number => {
  if (typeof priority === 'number') return priority;

  const map: Record<string, number> = {
    'LOW': 1,      // Fibonacci
    'MEDIUM': 2,   // Fibonacci
    'HIGH': 3,     // Fibonacci
    'URGENT': 5,   // Fibonacci
    'CRITICAL': 8  // Fibonacci
  };
  return map[priority] || StoryPriority.MEDIUM;
}; export const getStatusString = (status: StoryStatus | string): string => {
  if (typeof status === 'string' && !status.includes('_')) return status;

  const map: Record<string, string> = {
    'TODO': 'todo',
    'IN_PROGRESS': 'in_progress',
    'IN_REVIEW': 'in_review',
    'DONE': 'done'
  };
  return map[status] || StoryStatus.TODO;
};
