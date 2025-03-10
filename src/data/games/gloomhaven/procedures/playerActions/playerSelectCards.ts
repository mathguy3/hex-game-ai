export const playerSelectCards = {
  turn: {
    if: 'isPlayerAction',
    name: 'Select Card',
    allPlayers: true,
    async: true,
    actions: [
      {
        announce: {
          to: 'active',
          message: 'Select 2 cards',
        },
      },
      {
        option: {
          options: [
            {
              card: {
                select: {
                  count: 2,
                  from: 'hand',
                },
              },
            },
          ],
        },
      },
      {
        action: {
          actions: [
            {
              context: {
                data: {
                  key: {
                    context: {
                      activeId: '$String',
                    },
                  },
                  value: {
                    properties: {
                      initiative: {
                        equals: {
                          context: {
                            data: {
                              key: {
                                context: {
                                  activeId: '$String',
                                },
                              },
                              value: {
                                selectedCards: {
                                  min: {
                                    properties: {
                                      initiative: '$Number',
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          ],
        },
      },
    ],
  },
};
