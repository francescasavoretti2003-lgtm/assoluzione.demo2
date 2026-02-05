import type { PersonalizedGuiltReductionOutput } from '@/ai/flows/personalized-guilt-reduction';

export type Language = 'en' | 'it';

export type Profile = {
  id: string; // Firebase Auth UID
  name: string;
  gender: string;
  age: number;
  photo: string; // This is the data URI
  language: Language;
  photoUrl: string; // This is the data URI
};

export type Participant = {
  id: string;
  name: string;
  photoUrl: string;
  biggestFault: string;
};

export type Question = {
  id: string;
  category: string;
  type: 'numeric' | 'boolean' | 'open';
  text: {
    en: string;
    it: string;
  };
  fact: {
    en: string;
    it: string;
  };
  scoring: (value: any) => number;
};

export type Answer = {
  questionId: string;
  value: any;
  score: number;
  questionText: string;
};

export type ConfessionState = {
  language: Language;
  profile: Profile | null;
  answers: Record<string, Answer>;
  totalScore: number;
  aiResponse: PersonalizedGuiltReductionOutput | null;
  isLoadingAi: boolean;
};

export type AppContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  answers: Record<string, Answer>;
  addAnswer: (answer: Answer) => void;
  totalScore: number;
  aiResponse: PersonalizedGuiltReductionOutput | null;
  setAiResponse: (response: PersonalizedGuiltReductionOutput | null) => void;
  isLoadingAi: boolean;
  setIsLoadingAi: (loading: boolean) => void;
  resetState: () => void;
};
    