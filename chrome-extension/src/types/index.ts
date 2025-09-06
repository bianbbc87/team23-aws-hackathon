// Chrome Extension Types
export interface GenerationRequest {
  action: 'generateContent';
  content: string;
  taskType: 'summary' | 'email' | 'idea' | 'report';
}

export interface GenerationResponse {
  success: boolean;
  result?: string;
  error?: string;
}

export interface HistoryItem {
  timestamp: string;
  taskType: string;
  content: string;
  result: string;
}

export interface PageContent {
  title: string;
  description?: string;
  headings: string[];
  mainText: string;
  links?: string[];
}

export type TaskMode = 'summary' | 'email' | 'idea' | 'report';

export interface UIState {
  currentMode: TaskMode | '';
  isExpanded: boolean;
  isLoading: boolean;
  status: string;
}
