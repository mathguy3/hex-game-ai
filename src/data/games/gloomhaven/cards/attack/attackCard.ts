export const attackCard = (kind: string, damage: number, multiplier?: number) => {
  return {
    kind,
    name: 'Attack Modifier',
    properties: {
      damage,
      multiplier: multiplier ?? 1,
    },
  };
};
