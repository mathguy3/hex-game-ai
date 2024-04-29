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
      isBlocking: attack ? undefined : targetIsUnit,
    },
    {
      type: 'diagonal' as const,
      range: 10,
      tileIf: attack ? targetIsEnemyUnit : targetIsNotUnit,
      isBlocking: attack ? undefined : targetIsUnit,
    },
  ],
});

export const queen: UnitDefinition = {
  type: 'unit',
  kind: 'queen',
  aspects: {},
  interactions: [
    {
      type: 'movement',
      tiles: getQueenAttackMove(),
      actions: [
        {
          type: 'movement',
          set: moveToHex,
        },
      ],
    },
    {
      type: 'attack',
      tiles: getQueenAttackMove(true),
      actions: [
        {
          type: 'attack',
          set: moveToHex,
        },
      ],
    },
  ],
};
