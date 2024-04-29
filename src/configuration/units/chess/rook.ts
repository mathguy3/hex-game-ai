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
  aspects: {},
  interactions: [
    {
      type: 'movement',
      tiles: getRookAttackMove(),
      actions: [
        {
          type: 'movement',
          set: moveToHex,
        },
      ],
    },
    {
      type: 'attack',
      tiles: getRookAttackMove(true),
      actions: [
        {
          type: 'attack',
          set: moveToHex,
        },
      ],
    },
  ],
};
