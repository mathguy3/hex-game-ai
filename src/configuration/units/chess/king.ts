import { UnitDefinition } from '../../../types/entities/unit/unit';
import { moveToHex } from './helpers/moveToHex';

const kingAttackMove = {
  add: [{ type: 'orthogonal' as const, range: 1 }],
};

export const king: UnitDefinition = {
  type: 'unit',
  kind: 'king',
  aspects: {},
  interactions: [
    {
      type: 'movement',
      tiles: kingAttackMove,
      actions: [
        {
          type: 'movement',
          set: moveToHex,
        },
      ],
    },
    {
      type: 'attack',
      tiles: kingAttackMove,
      actions: [
        {
          type: 'attack',
          set: moveToHex,
        },
      ],
    },
  ],
};
