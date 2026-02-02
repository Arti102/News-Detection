
export type Theme = 'light' | 'dark';

export type Classification = 'Real' | 'Fake' | 'Satire' | 'Unsure';

export interface Source {
  title: string;
  url: string;
}

export interface AnalysisResponse {
  classification: Classification;
  confidence: number;
  reasoning: string; // Detailed explanation
  summary: string; // Short plain-English verdict
  redFlags: string[];
  sources: Source[]; // Links to back the news
}

export interface NewsInputProps {
  onAnalyze: (text: string) => void;
}

export interface HeaderProps {
  theme: Theme;
  toggleTheme: () => void;
}
