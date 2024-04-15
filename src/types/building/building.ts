import { Aspect } from '../aspect';
import { EntityState } from '../entities';
import { Interactions } from '../interactions';
import { BuildingKind } from '../types/buildings';

export interface BuildingDefinition {
  type: string;
  kind: string;
  interactions: Interactions;
  aspects: Record<string, Aspect>;
}

export interface BuildingState extends EntityState {
  type: 'building';
  kind: BuildingKind;
}

export interface BuildingState extends EntityState {
  type: 'building';
  kind: BuildingKind;
}
