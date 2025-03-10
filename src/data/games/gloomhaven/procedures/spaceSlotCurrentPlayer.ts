export const spaceSlotCurrentPlayer = {
  space: {
    character: {
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
  },
};
