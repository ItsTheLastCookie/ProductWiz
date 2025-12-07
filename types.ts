export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  type: 'scenario' | 'edit';
  timestamp: number;
}

export interface MarketingScenario {
  id: string;
  label: string;
  icon: string;
  promptTemplate: string;
}

export type GenerationStatus = 'idle' | 'loading' | 'success' | 'error';
