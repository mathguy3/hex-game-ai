import { VillagerDefinition } from '../../types/entities/unit/villager';

export const soldier: VillagerDefinition = {
  type: 'unit',
  kind: 'villager',
  aspects: { ground: { type: 'ground' } },
  interactions: [] /*{
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
      actions: [],
    },
    fromMovement: [],
    other: [],
  },*/,
};
