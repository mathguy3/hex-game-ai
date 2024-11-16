import { UnitDefinition } from '../../../types/entities/unit/unit';
import { moveToHex } from './helpers/moveToHex';
import { targetIsEnemyUnit } from './helpers/targetIsEnemyUnit';
import { targetIsNotUnit } from './helpers/targetIsNotUnit';
import { targetIsUnit } from './helpers/targetIsUnit';

const getQueenAttackMove = (attack?: boolean) => ({
  add: [
    {
      type: 'orthogonal' as const,
      range: 10,
      tileIf: attack ? targetIsEnemyUnit : targetIsNotUnit,
      isBlocking: targetIsUnit,
    },
    {
      type: 'diagonal' as const,
      range: 10,
      tileIf: attack ? targetIsEnemyUnit : targetIsNotUnit,
      isBlocking: targetIsUnit,
    },
  ],
});

export const queen: UnitDefinition = {
  type: 'unit',
  kind: 'queen',
  properties: {},
  interactions: [
    {
      type: 'hex' as const,
      kind: 'movement',
      targeting: {
        userSelect: true,
        tiles: getQueenAttackMove(),
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
        tiles: getQueenAttackMove(true),
      },
      actions: [
        {
          type: 'action' as const,
          name: 'attack',
          description: 'Attacks target unit, setting target unit aspect hasMoved: true',
          set: moveToHex,
        },
      ],
    },
  ],
};
