export interface UserProfile {
  name: string;
  grade: string; // Represents the stream or specialization (e.g., Computer Science)
  year: string;  // Represents the current year of study (e.g., 2nd Year)
  dateOfBirth: string; // ISO format or YYYY-MM-DD
  hasTakenTest: boolean;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
}

export interface TestResult {
  personalitySummary: string;
  recommendedBranches: Array<{
    branch: string;
    reason: string;
  }>;
  subDomains: string[];
}

export interface Goal {
  id: string;
  text: string;
  completed: boolean;
  type: 'daily' | 'weekly';
  createdAt: number;
}

export interface RoadmapTopic {
  name: string;
  completed: boolean;
}

export interface RoadmapPhase {
  title: string;
  duration: string;
  topics: RoadmapTopic[];
}

export interface Roadmap {
  id: string;
  domain: string;
  phases: RoadmapPhase[];
  createdAt: number;
}

export interface Resource {
  title: string;
  type: 'Video' | 'Article' | 'Course' | 'PDF';
  url: string;
  category: string;
}

export interface MentorTip {
  quote: string;
  author: string;
  tip: string;
}

export interface StudyStats {
  studyHours: number;
  problemsSolved: number;
  codingHours: number;
  streak: number;
  lastActive: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  description: string;
  unlockedAt: number;
  image?: string; // Base64 encoded image
  category?: 'Certificate' | 'Project' | 'Milestone' | 'Skill Upgrade';
}