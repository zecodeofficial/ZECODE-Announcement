export interface AudioGenerationState {
  isLoading: boolean;
  audioUrl: string | null;
  error: string | null;
  text: string;
}

export interface HistoryItem {
  id: string;
  text: string;
  audioUrl: string;
  timestamp: number;
}