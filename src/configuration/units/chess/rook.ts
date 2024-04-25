import { UnitDefinition } from '../../../types/entities/unit/unit';
import { moveToHex } from './helpers/moveToHex';

const rookAttackMove = {
  add: [{ type: 'orthogonal' as const, range: 10 }],
};

export const rook: UnitDefinition = {
  type: 'unit',
  kind: 'rook',
  aspects: {},
  interactions: [
    {
      type: 'movement',
      tiles: rookAttackMove,
      actions: [
        {
          type: 'movement',
          set: moveToHex,
        },
      ],
    },
    {
      type: 'attack',
      tiles: rookAttackMove,
      actions: [
        {
          type: 'attack',
          set: moveToHex,
        },
      ],
    },
  ],
};
