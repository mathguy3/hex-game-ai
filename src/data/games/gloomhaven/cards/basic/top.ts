export const top = {
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
            attack: {
              space: {
                query: {
                  type: 'space',
                  from: ['board'],
                  filter: [{ adjacent: {} }, '%isEnemyTargetSpace'],
                },
              },
            },
          },
          actions: [
            {
              action: {
                actions: [
                  {
                    targetSpace: {
                      slot: {
                        properties: {
                          health: {
                            equals: {
                              targetSpace: {
                                slot: {
                                  properties: { health: { minus: 2 } },
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
            {
              action: {
                if: {
                  targetSpace: {
                    slot: {
                      properties: {
                        health: { equals: 0 },
                      },
                    },
                  },
                },
                actions: [
                  {
                    move: {
                      from: {
                        store: 'board',
                        id: {
                          targetSpace: {
                            id: '$String',
                          },
                        },
                        link: 'slot',
                      },
                      to: {
                        store: 'supply',
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
