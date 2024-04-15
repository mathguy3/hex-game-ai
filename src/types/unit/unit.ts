import { Aspect } from '../aspect';
import { EntityState } from '../entities';
import { Interactions } from '../interactions';
import { UnitKind } from '../types/units';

export interface UnitDefinition {
  type: string;
  kind: string;
  interactions: Interactions;
  aspects: Record<string, Aspect>;
}

export interface UnitState extends EntityState {
  type: 'unit';
  kind: UnitKind;
}

export interface UnitState extends EntityState {
  type: 'unit';
  kind: UnitKind;
}
