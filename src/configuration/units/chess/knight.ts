import { UnitDefinition } from '../../../types/entities/unit/unit';
import { moveToHex } from './helpers/moveToHex';
import { targetIsEnemyUnit } from './helpers/targetIsEnemyUnit';
import { targetIsNotUnit } from './helpers/targetIsNotUnit';

const getKnightAttackMove = (attack?: boolean) => ({
  add: [
    {
      type: 'distance' as const,
      range: 3,
      tileIf: attack ? targetIsEnemyUnit : targetIsNotUnit,
    },
  ],
  not: [{ type: 'orthogonal' as const, range: 10 }],
});

export const knight: UnitDefinition = {
  type: 'unit',
  kind: 'knight',
  aspects: {},
  interactions: [
    {
      type: 'movement',
      tiles: getKnightAttackMove(),
      actions: [
        {
          type: 'movement',
          set: moveToHex,
        },
      ],
    },
    {
      type: 'attack',
      tiles: getKnightAttackMove(true),
      actions: [
        {
          type: 'attack',
          set: moveToHex,
        },
      ],
    },
  ],
};
