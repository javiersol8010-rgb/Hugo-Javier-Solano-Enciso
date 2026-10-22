export type UserRole = 'instructor' | 'aprendiz';

export interface InstructorProfile {
  name: string;
  email: string;
  regional: string;
  trainingCenter: string;
  assignedFichas: string[];
}

export interface ApprenticeProfile {
  fullName: string;
  documentType: 'CC' | 'TI' | 'CE' | 'PEP' | 'PPT';
  documentNumber: string;
  programName: string;
  fichaNumber: string;
  regional: string;
  trainingCenter: string;
  avatarId: string;
  enrollmentDate: string;
}

export interface GamificationState {
  xp: number;
  level: number;
  streak: number;
  completedModules: string[];
  unlockedBadges: string[];
  assessmentScore: number;
  assessmentPassed: boolean;
  certificateCode: string | null;
  certificateIssuedDate: string | null;
}

export interface RightItem {
  id: string;
  articleRef: string;
  title: string;
  category: 'Formación y Calidad' | 'Bienestar y Apoyos' | 'Representación y Libertad' | 'Certificación';
  summary: string;
  practicalExample: string;
  statuteHighlight: string;
}

export interface DutyItem {
  id: string;
  articleRef: string;
  title: string;
  type: 'Académico' | 'Disciplinario' | 'Seguridad y SST';
  summary: string;
  consequenceIfViolated: string;
  bestPractice: string;
}

export interface ProhibitionItem {
  id: string;
  articleRef: string;
  title: string;
  severity: 'Leve' | 'Grave' | 'Gravísima';
  description: string;
  senaPrecedent: string;
}

export interface DilemmaCase {
  id: string;
  title: string;
  module: string;
  storyContext: string;
  problem: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
    legalBasis: string;
    xpEarned: number;
  }[];
}

export interface ProductiveStageModal {
  id: string;
  title: string;
  iconName: string;
  durationMonths: number;
  description: string;
  economicSupport: string;
  socialSecurity: string;
  frequentMistakeToAvoid: string;
}

export interface QuizQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  normativeRef: string;
  points: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  criteria: string;
}

export interface RegulationSearchItem {
  id: string;
  chapter: string;
  title: string;
  tags: string[];
  summary: string;
  fullNote: string;
}
