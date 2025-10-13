export interface Topic {
  id: number;
  description: string;
  difficulty: '初級' | '中級' | '上級';
  created_at: string;
}

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
  created_at: string;
  updated_at: string;
}

export interface Statistics {
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

export interface AIReport {
  id: number;
  report: string;
  created_at: string;
  updated_at: string;
}
