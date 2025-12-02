export const playerTurn = {
  turn: {
    name: 'Play Card',
    allPlayers: true,
    rotate: true,
    order: {
      properties: {
        initiative: '$Number',
      },
    },
    actions: [
      {
        doAction: {
          from: {
            context: {
              key: {
                activeId: '$String',
              },
              value: {
                selectedCards: {
                  0: {
                    actions: {
                      0: '$Action',
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        option: {
          options: [
            {
              card: {
                play: {
                  from: 'selectedCards',
                  remove: true,
                },
              },
            },
          ],
        },
        if: '%isPlayerAction',
      },
      {
        option: {
          options: [
            {
              card: {
                play: {
                  from: 'selectedCards',
                  remove: true,
                },
              },
            },
          ],
        },
        if: '%isPlayerAction',
      },
    ],
  },
};
