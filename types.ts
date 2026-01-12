
export interface GrowthAnalysis {
  id: string;
  timestamp: number;
  input: {
    text: string;
    hasImage: boolean;
  };
  output: string;
}

export interface IntelligenceResponse {
  brandObjective: string;
  targetAudience: string;
  contentIdeas: string[];
  campaignConcepts: string[];
  suggestedChannels: string[];
  nextBestActions: string[];
}

export enum AppRoute {
  DASHBOARD = 'dashboard',
  ANALYZE = 'analyze',
  HISTORY = 'history',
  SETTINGS = 'settings'
}
