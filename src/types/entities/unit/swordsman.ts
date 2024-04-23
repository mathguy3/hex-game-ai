import { UnitDefinition, UnitState } from './unit';

export interface SwordsmanDefinition extends UnitDefinition {
  type: 'unit';
  kind: 'swordsman';
}

export interface SwordsmanState extends UnitState {
  type: 'unit';
  kind: 'swordsman';
}
