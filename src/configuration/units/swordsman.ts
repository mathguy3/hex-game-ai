import { SwordsmanDefinition } from '../../types/unit/swordsman';

export const swordsman: SwordsmanDefinition = {
  type: 'unit',
  kind: 'swordsman',
  aspects: { fighter: { type: 'fighter' } },
  interactions: {
    movement: {
      type: 'movement',
      tiles: {
        add: [
          {
            type: 'pathrange',
            range: 3,
          },
        ],
      },
    },
    fromMovement: [
      {
        type: 'attack',
        tiles: {
          add: [
            {
              type: 'range',
              range: 1,
            },
          ],
          limit: [
            {
              type: 'aspect',
              target: 'unit',
              aspect: { type: 'team', teamId: 'team2' },
            },
          ],
        },
      },
    ],
    other: [],
  },
};
