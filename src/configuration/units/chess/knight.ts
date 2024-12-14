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
  properties: {},
  interactions: [
    {
      type: 'hex' as const,
      kind: 'movement',
      targeting: {
        userSelect: true,
        tiles: getKnightAttackMove(),
      },
      actions: [
        {
          type: 'action' as const,
          name: 'moveToHex',
          description: 'Moves subject unit to target hex, clears subject hex, and sets newly movedc target unit aspect hasMoved: true',
          set: moveToHex,
        },
      ],
    },
    {
      type: 'hex' as const,
      kind: 'attack',
      targeting: {
        userSelect: true,
        tiles: getKnightAttackMove(true),
      },
      actions: [
        {
          type: 'action' as const,
          name: 'moveToHex',
          description: 'Moves subject unit to target hex, clears subject hex, and sets target unit aspect hasMoved: true',
          set: moveToHex,
        },
      ],
    },
  ],
};
