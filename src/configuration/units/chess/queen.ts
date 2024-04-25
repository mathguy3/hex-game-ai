import { UnitDefinition } from '../../../types/entities/unit/unit';
import { moveToHex } from './helpers/moveToHex';

const queenAttackMove = {
  add: [
    { type: 'orthogonal' as const, range: 10 },
    { type: 'diagonal' as const, range: 10 },
  ],
};

export const queen: UnitDefinition = {
  type: 'unit',
  kind: 'queen',
  aspects: {},
  interactions: [
    {
      type: 'movement',
      tiles: queenAttackMove,
      actions: [
        {
          type: 'movement',
          set: moveToHex,
        },
      ],
    },
    {
      type: 'attack',
      tiles: queenAttackMove,
      actions: [
        {
          type: 'attack',
          set: moveToHex,
        },
      ],
    },
  ],
};
