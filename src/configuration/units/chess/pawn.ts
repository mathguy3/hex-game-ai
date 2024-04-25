import { UnitDefinition } from '../../../types/entities/unit/unit';
import { moveToHex } from './helpers/moveToHex';
import { targetIsEnemyUnit } from './helpers/targetIsEnemyUnit';

export const pawn: UnitDefinition = {
  type: 'unit',
  kind: 'pawn',
  aspects: {},
  interactions: [
    {
      type: 'movement',
      tiles: {
        add: [
          {
            type: 'offset',
            offset: { q: 0, r: -1, s: 1 },
          },
          {
            type: 'offset',
            offset: { q: 0, r: -2, s: 2 },
            if: {
              subject: {
                contains: {
                  unit: {
                    aspects: {
                      hasMoved: {
                        value: false,
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      },
      actions: [
        {
          type: 'movement',
          set: moveToHex,
        },
      ],
    },
    {
      type: 'attack',
      tiles: {
        add: [
          {
            type: 'offset',
            offset: { q: -1, r: 0, s: 1 },
            tileIf: targetIsEnemyUnit,
          },
          {
            type: 'offset',
            offset: { q: 1, r: -1, s: 0 },
            tileIf: targetIsEnemyUnit,
          },
        ],
      },
      actions: [
        {
          type: 'attack',
          set: moveToHex,
        },
      ],
    },
  ],
};
