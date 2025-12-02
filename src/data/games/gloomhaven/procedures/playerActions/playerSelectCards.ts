export const playerSelectCards = {
  turn: {
    name: 'Select Card',
    allPlayers: true,
    async: true,
    actions: [
      {
        action: {
          if: '%isEnemyAction',
          move: {
            card: {
              from: {
                source: {
                  context: {
                    activeId: '$String',
                  },
                },
                slot: 'hand',
                id: 'first',
              },
              to: {
                source: {
                  context: {
                    activeId: '$String',
                  },
                },
                slot: 'selectedCards',
              },
            },
          },
        },
      },
      {
        announce: {
          if: '%isPlayerAction',
          to: 'active',
          message: 'Select 2 cards',
        },
      },
      {
        option: {
          if: '%isPlayerAction',
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
          context: {
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
                      key: {
                        activeId: '$String',
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
    ],
  },
};
