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
                  filter: [
                    {
                      space: {
                        character: {
                          equals: undefined,
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          actions: [
            {
              action: {
                move: {
                  token: {
                    from: {
                      source: 'board',
                      id: {
                        subjectSpace: {
                          id: '$String',
                        },
                      },
                      slot: 'character',
                    },
                    to: {
                      source: 'board',
                      id: {
                        targetSpace: {
                          id: '$String',
                        },
                      },
                      slot: 'character',
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
