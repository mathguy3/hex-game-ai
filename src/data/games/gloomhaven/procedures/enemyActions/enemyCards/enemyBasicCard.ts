export const enemyBasicCard = {
  kind: 'enemyBasicCard',
  name: 'Basic Card',
  image: 'basicCard.png',
  actions: {
    main: {
      action: {
        actions: [
          {
            move: {
              from: 'deck',
              to: 'discard',
            },
          },
        ],
      },
    },
  },
};
