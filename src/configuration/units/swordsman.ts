import { SwordsmanDefinition } from '../../types/entities/unit/swordsman';

export const swordsman: SwordsmanDefinition = {
  type: 'unit',
  kind: 'swordsman',
  aspects: { fighter: { type: 'fighter' } },
  interactions: [] /*{
    movement: {
      type: 'movement',
      tiles: {
        add: [
          {
            type: 'offset',
            offset: { q: 0, r: -1, s: 1 },
          },
        ],
      },
      actions: [],
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
            /*{
              type: 'aspect',
              target: 'unit',
              aspect: { type: 'team', teamId: 'team2' },
            },
          ],
        },
        actions: [],
      },
    ],
  other: [],
  },*/,
};
