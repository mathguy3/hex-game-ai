import { UnitDefinition } from '../../../types/entities/unit/unit';
import { moveToHex } from './helpers/moveToHex';
import { targetIsEnemyUnit } from './helpers/targetIsEnemyUnit';
import { targetIsNotUnit } from './helpers/targetIsNotUnit';

const getKingAttackMove = (attack?: boolean) => ({
  add: [
    {
      type: 'orthogonal' as const,
      range: 1,
      tileIf: attack ? targetIsEnemyUnit : targetIsNotUnit,
    },
    {
      type: 'diagonal' as const,
      range: 1,
      tileIf: attack ? targetIsEnemyUnit : targetIsNotUnit,
    },
  ],
});

export const king: UnitDefinition = {
  type: 'unit',
  kind: 'king',
  aspects: {},
  interactions: [
    {
      type: 'movement',
      tiles: getKingAttackMove(),
      actions: [
        {
          type: 'movement',
          set: moveToHex,
        },
      ],
    },
    {
      type: 'attack',
      tiles: getKingAttackMove(true),
      actions: [
        {
          type: 'attack',
          set: moveToHex,
        },
      ],
    },
  ],
};
