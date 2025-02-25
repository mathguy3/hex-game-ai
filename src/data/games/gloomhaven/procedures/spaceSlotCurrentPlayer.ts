export const spaceSlotCurrentPlayer = {
  space: {
    slot: {
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
