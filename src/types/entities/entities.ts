import { Aspect } from '../aspect';

export interface EntityState {
  type: string;
  properties: Record<string, Aspect>;
  id: string;
}
