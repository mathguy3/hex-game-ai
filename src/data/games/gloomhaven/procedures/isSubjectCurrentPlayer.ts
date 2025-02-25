export const isSubjectCurrentPlayer = {
  subject: {
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
