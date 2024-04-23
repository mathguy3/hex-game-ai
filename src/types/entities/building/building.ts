import { Interaction } from '../../actions/interactions';
import { Aspect } from '../../aspect';
import { EntityState } from '../../entities/entities';
import { BuildingKind } from '../../kinds/buildings';

export interface BuildingDefinition {
  type: string;
  kind: string;
  interactions: Interaction[];
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
