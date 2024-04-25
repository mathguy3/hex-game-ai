import { UnitDefinition } from '../../../types/entities/unit/unit';
import { moveToHex } from './helpers/moveToHex';

const bishopAttackMove = {
  add: [{ type: 'diagonal' as const, range: 10 }],
};

export const bishop: UnitDefinition = {
  type: 'unit',
  kind: 'bishop',
  aspects: {},
  interactions: [
    {
      type: 'movement',
      tiles: bishopAttackMove,
      actions: [
        {
          type: 'movement',
          set: moveToHex,
        },
      ],
    },
    {
      type: 'attack',
      tiles: bishopAttackMove,
      actions: [
        {
          type: 'attack',
          set: moveToHex,
        },
      ],
    },
  ],
};
