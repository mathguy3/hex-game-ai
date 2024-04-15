export const makeSoldier = (team: string) => ({
  type: 'unit',
  kind: 'soldier',
  aspects: {
    team: { type: 'team', teamId: team },
  },
  interactions: {
    movement: {
      type: 'movement',
      tiles: {
        add: [{ type: 'pathrange', range: 3 }],
        limit: [{ type: 'kind', kind: 'points', target: 'hex' }],
      },
    },
    fromMovement: [
      {
        type: 'attack',
        tiles: { add: [{ type: 'range', range: 1 }] },
      },
    ],
    other: [],
  },
});
