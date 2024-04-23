import { IFObjectValue } from '../../../types/actions/if';
import { UnitDefinition } from '../../../types/entities/unit/unit';

const movementSetList = [
  {
    target: {
      contains: {
        subject: {
          contains: IFObjectValue,
        },
      },
    },
  },
  {
    subject: {
      contains: {},
    },
  },
  {
    target: {
      contains: {
        unit: {
          aspects: {
            hasMoved: {
              value: true,
            },
          },
        },
      },
    },
  },
];

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
          set: movementSetList,
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
            tileIf: {
              target: {
                contains: {
                  unit: {
                    type: 'unit',
                  },
                },
              },
            },
          },
          {
            type: 'offset',
            offset: { q: 1, r: -1, s: 0 },
            tileIf: {
              target: {
                contains: {
                  unit: {
                    type: 'unit',
                  },
                },
              },
            },
          },
        ],
      },
      actions: [
        {
          type: 'attack',
          set: movementSetList,
        },
      ],
    },
  ],
};
