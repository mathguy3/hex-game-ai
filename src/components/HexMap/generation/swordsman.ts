export const makeSwordsman = (team: string) => ({
  type: 'unit',
  kind: 'pawn',
  id: team,
  aspects: {
    team: { type: 'team', value: team },
    health: { type: 'health', value: 100 },
    fallbackHealth: { type: 'fallbackHealth', value: 50 },
    hasMoved: { type: 'hasMoved', value: false },
  },
});
