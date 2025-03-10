export const playerTurn = {
  turn: {
    if: 'isPlayerAction',
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
      },
    ],
  },
};
