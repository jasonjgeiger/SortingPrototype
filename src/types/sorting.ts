export interface Card {
  id: string;
  value: number;
  color: string;
  isPinned: boolean;
  isRecommendation: boolean;
}

export type SortingMethod = 'bubble' | 'selection' | 'insertion' | 'quick' | 'merge';

export interface SortingState {
  cards: Card[];
  isSorting: boolean;
  currentMethod: SortingMethod;
} 