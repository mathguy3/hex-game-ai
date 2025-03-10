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
                      character: {
                        properties: {
                          health: {
                            equals: {
                              targetSpace: {
                                character: {
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
                    character: {
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
                        source: 'board',
                        id: {
                          targetSpace: {
                            id: '$String',
                          },
                        },
                        slot: 'character',
                      },
                      to: {
                        source: 'supply',
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
