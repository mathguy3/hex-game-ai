import { UnitDefinition, UnitState } from './unit';

export interface VillagerDefinition extends UnitDefinition {
  type: 'unit';
  kind: 'villager';
}

export interface VillagerState extends UnitState {
  type: 'unit';
  kind: 'villager';
}
