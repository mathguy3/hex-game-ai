export const attackCard = (id: string, damage: number, multiplier?: number) => {
  return {
    id,
    name: 'Attack Modifier',
    properties: {
      damage,
      multiplier: multiplier ?? 1,
    },
  };
};
