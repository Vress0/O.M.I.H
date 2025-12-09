export enum AppMode {
  Home = 'HOME',
  Chat = 'CHAT',
  Constitution = 'CONSTITUTION',
  FindDoctor = 'FIND_DOCTOR',
  Secret = 'SECRET',
  KnowledgeBase = 'KNOWLEDGE_BASE'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ConstitutionData {
  energy: string;
  temperature: string;
  sleep: string;
  mood: string;
  appetite: string;
  other: string;
}

export interface DoctorSearchResult {
  text: string;
  places: GroundingPlace[];
}

export interface GroundingPlace {
  title: string;
  uri: string;
  address?: string;
  rating?: number;
}

export interface KnowledgeItem {
  title: string;
  summary: string;
  category: string;
  tags: string[];
}