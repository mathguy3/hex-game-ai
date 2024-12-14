import { UnitDefinition } from '../../../types/entities/unit/unit';
import { moveToHex } from './helpers/moveToHex';
import { targetIsEnemyUnit } from './helpers/targetIsEnemyUnit';
import { targetIsNotUnit } from './helpers/targetIsNotUnit';
import { targetIsUnit } from './helpers/targetIsUnit';

const getRookAttackMove = (attack?: boolean) => ({
  add: [
    {
      type: 'orthogonal' as const,
      range: 10,
      tileIf: attack ? targetIsEnemyUnit : targetIsNotUnit,
      isBlocking: attack ? undefined : targetIsUnit,
    },
  ],
});

export const rook: UnitDefinition = {
  type: 'unit',
  kind: 'rook',
  properties: {},
  interactions: [
    {
      type: 'hex' as const,
      kind: 'movement',
      targeting: {
        userSelect: true,
        tiles: getRookAttackMove(),
      },
      actions: [
        {
          type: 'action' as const,
          name: 'moveToHex',
          description: 'Moves subject unit to target hex, clears subject hex, and sets newly moved target unit aspect hasMoved: true',
          set: moveToHex,
        },
      ],
    },
    {
      type: 'hex' as const,
      kind: 'attack',
      targeting: {
        userSelect: true,
        tiles: getRookAttackMove(true),
      },
      actions: [
        {
          type: 'action' as const,
          name: 'moveToHex',
          description: 'Moves subject unit to target hex, clears subject hex, and sets newly moved target unit aspect hasMoved: true',
          set: moveToHex,
        },
      ],
    },
  ],
};
