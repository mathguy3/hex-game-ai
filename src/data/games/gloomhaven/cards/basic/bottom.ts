export const bottom = {
  option: {
    options: [
      {
        space: {
          query: {
            type: 'space',
            from: ['board'],
            filter: ['%spaceSlotCurrentPlayer'],
          },
          target: {
            move: {
              space: {
                query: {
                  type: 'space',
                  from: [
                    {
                      range: 2,
                    },
                  ],
                },
              },
            },
          },
          actions: [
            {
              action: {
                actions: [
                  {
                    move: {
                      from: {
                        store: 'board',
                        id: {
                          subjectSpace: {
                            id: '$String',
                          },
                        },
                        link: 'slot',
                      },
                      to: {
                        store: 'board',
                        id: {
                          targetSpace: {
                            id: '$String',
                          },
                        },
                        link: 'slot',
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  },
};
