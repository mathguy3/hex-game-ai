export const enemyBasic = {
  kind: 'enemyBasic',
  name: 'Basic',
  image: 'basic.png',
  properties: {
    initiative: 4,
  },
  actions: [
    {
      move: {
        token: {
          from: {
            source: 'board',
            id: {
              enemyPiece: {
                id: '$String',
              },
            },
            slot: 'character',
          },
          to: {
            source: 'board',
            id: '0.0.0',
            slot: 'character',
          },
        },
      },
    },
  ],
};
