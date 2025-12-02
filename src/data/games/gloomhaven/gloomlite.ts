export const gloomlite = {
  config: {
    name: 'Gloomlite',
    description: 'A strategic board game',
  },
  definitions: {
    seats: [{ isOpen: true, isAi: false }],
    cards: {
      basic: {
        id: 'basic',
        name: 'Basic',
        description: 'A basic card',
        properties: {
          value: 1,
        },
      },
    },
    sequence: {
      round: {
        repeat: true,
        turns: [
          {
            if: '%isNotAI',
            name: 'Player Turn',
            actions: [
              {
                option: {
                  options: [
                    {
                      card: {
                        play: {
                          from: 'hand',
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
          {
            if: '%isAI',
            name: 'AI Turn',
            actions: [
              {
                option: {
                  options: [
                    {
                      card: {
                        play: {
                          from: 'hand',
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    },
  },
};
