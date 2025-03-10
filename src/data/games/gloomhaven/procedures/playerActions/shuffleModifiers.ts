import { isPlayerAction } from './isPlayerAction';

export const shuffleModifiers = {
  action: {
    if: 'isPlayerAction',
    actions: [
      {
        context: {
          data: {
            key: {
              context: {
                activeId: '$String',
              },
            },
            value: {
              modifiers: {
                equals: {
                  context: {
                    data: {
                      key: {
                        context: {
                          activeId: '$String',
                        },
                      },
                      value: {
                        modifiers: {
                          shuffle: '$Array',
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
