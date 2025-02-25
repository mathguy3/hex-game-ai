export const isTargetCurrentPlayer = {
  target: {
    properties: {
      playerId: {
        equals: {
          context: {
            activeId: '$String',
          },
        },
      },
    },
  },
};
