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
  properties: {},
  interactions: [
    {
      type: 'hex' as const,
      kind: 'movement',
      targeting: {
        userSelect: true,
        tiles: getKingAttackMove(),
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
        tiles: getKingAttackMove(true),
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
