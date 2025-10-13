// User types
export interface User {
  id: number;
  username: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

// Topic types
export interface Topic {
  id: number;
  description: string;
  difficulty: '初級' | '中級' | '上級';
  created_at: Date;
}

export interface GeneratedTopic {
  description: string;
  difficulty: '初級' | '中級' | '上級';
}

// Practice session types
export interface PracticeSession {
  id: number;
  user_id: number;
  topic_id: number | null;
  topic_description: string;
  topic_difficulty: '初級' | '中級' | '上級';
  image_path: string;
  duration_seconds: number;
  reflection_good: string | null;
  reflection_struggled: string | null;
  reflection_learned: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreatePracticeSessionInput {
  user_id: number;
  topic_description: string;
  topic_difficulty: '初級' | '中級' | '上級';
  image_path: string;
  duration_seconds: number;
  reflection_good?: string;
  reflection_struggled?: string;
  reflection_learned?: string;
}

export interface UpdateReflectionInput {
  reflection_good?: string;
  reflection_struggled?: string;
  reflection_learned?: string;
}

// AI Report types
export interface AIReport {
  id: number;
  user_id: number;
  overall_assessment: string;
  strengths: string;
  weaknesses: string;
  growth_records: string;
  next_steps: string;
  created_at: Date;
  updated_at: Date;
}

// Statistics types
export interface UserStatistics {
  total_practices: number;
  consecutive_days: number;
  average_duration_seconds: number;
  difficulty_distribution: {
    初級: number;
    中級: number;
    上級: number;
  };
  calendar_data: CalendarDay[];
}

export interface CalendarDay {
  date: string;
  count: number;
}
