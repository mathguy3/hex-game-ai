import { BoardInteraction } from '../../actions/interactions';
import { Aspect } from '../../aspect';
import { EntityState } from '../../entities/entities';
import { UnitKind } from '../../kinds/units';

export interface UnitDefinition {
  type: string;
  kind: string;
  interactions: BoardInteraction[];
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
