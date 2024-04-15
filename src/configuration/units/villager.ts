import { VillagerDefinition } from '../../types/unit/villager';

export const soldier: VillagerDefinition = {
  type: 'unit',
  kind: 'villager',
  aspects: { ground: { type: 'ground' } },
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
    fromMovement: [],
    other: [],
  },
};
