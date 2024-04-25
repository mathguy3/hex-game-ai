import { UnitDefinition } from '../../../types/entities/unit/unit';
import { moveToHex } from './helpers/moveToHex';

const knightAttackMove = {
  add: [
    {
      type: 'distance' as const,
      range: 3,
    },
  ],
  not: [{ type: 'orthogonal' as const, range: 10 }],
};

export const knight: UnitDefinition = {
  type: 'unit',
  kind: 'knight',
  aspects: {},
  interactions: [
    {
      type: 'movement',
      tiles: knightAttackMove,
      actions: [
        {
          type: 'movement',
          set: moveToHex,
        },
      ],
    },
    {
      type: 'attack',
      tiles: knightAttackMove,
      actions: [
        {
          type: 'attack',
          set: moveToHex,
        },
      ],
    },
  ],
};
