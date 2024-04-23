import { Aspect } from '../aspect';

export interface EntityState {
  type: string;
  aspects: Record<string, Aspect>;
  id: string;
}
