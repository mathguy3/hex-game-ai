import { GameDefinition } from '../../../types/game';
import { cards } from './cards';

const hasNotStarted = {
  context: {
    not: {
      hasStarted: '$Boolean',
    },
  },
};
const oneGreaterThanValue = {
  subject: {
    value: {
      equals: {
        if: {
          target: {
            cards: {
              length: {
                equals: 0,
              },
            },
          },
        },
        then: 1,
        else: {
          target: {
            cards: {
              key: {
                length: {
                  minus: 1,
                },
              },
              value: {
                value: {
                  add: 1,
                },
              },
            },
          },
        },
      },
    },
  },
};

// Only if the target has any cards
const suitMatches = {
  if: {
    target: {
      cards: {
        length: {
          equals: 0,
        },
      },
    },
  },
  then: true,
  else: {
    subject: {
      properties: {
        suit: {
          equals: {
            target: {
              cards: {
                key: {
                  length: {
                    minus: 1,
                  },
                },
                value: {
                  properties: {
                    suit: '$String',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const suitAndIncreasing = {
  and: [suitMatches, oneGreaterThanValue],
};

const kingOrDecreasing = {
  subject: {
    value: {
      equals: {
        if: {
          target: {
            cards: {
              length: {
                equals: 0,
              },
            },
          },
        },
        then: 13,
        else: {
          target: {
            cards: {
              key: {
                length: {
                  minus: 1,
                },
              },
              value: {
                value: {
                  minus: 1,
                },
              },
            },
          },
        },
      },
    },
  },
};

const tablePadding = 25;

function drawCard(isFaceDown: boolean = true) {
  const card = cards.pop();
  return isFaceDown ? { ...card, isFaceDown } : card;
}

/*const tableStack1 = [drawCard(false)];
const tableStack2 = [drawCard(), drawCard(false)];
const tableStack3 = [drawCard(), drawCard(), drawCard(false)];
const tableStack4 = [drawCard(), drawCard(), drawCard(), drawCard(false)];
const tableStack5 = [drawCard(), drawCard(), drawCard(), drawCard(), drawCard(false)];
const tableStack6 = [drawCard(), drawCard(), drawCard(), drawCard(), drawCard(), drawCard(false)];
const tableStack7 = [drawCard(), drawCard(), drawCard(), drawCard(), drawCard(), drawCard(), drawCard(false)];*/

const shortGame = 1;
const shortGameDeck = cards.filter((card) => card.value <= shortGame);

const useShortGame = true;
const cardsToUse = useShortGame ? shortGameDeck : cards;
const suitCount = useShortGame ? shortGame : 13;

const winCondition = {
  context: {
    cardStacks: {
      and: [
        {
          finalStack1: {
            length: {
              equals: suitCount,
            },
          },
        },
        {
          finalStack2: {
            length: {
              equals: suitCount,
            },
          },
        },
        {
          finalStack3: {
            length: {
              equals: suitCount,
            },
          },
        },
        {
          finalStack4: {
            length: {
              equals: suitCount,
            },
          },
        },
      ],
    },
  },
};

export const solitaire: GameDefinition = {
  name: 'Solitaire',
  config: {
    rotateTable: true,
    description: 'A simple card game',
  },
  winCondition,
  players: {
    player1: {},
  },
  initialState: {
    drawStack: cardsToUse,
    discardStack: [],
    finalStack1: [],
    finalStack2: [],
    finalStack3: [],
    finalStack4: [],
    tableStack1: [],
    tableStack2: [],
    tableStack3: [],
    tableStack4: [],
    tableStack5: [],
    tableStack6: [],
    tableStack7: [],
  },
  definitions: {
    map: {},
    sequencing: {
      type: 'repeating',
      breakOn: winCondition,
      actions: [
        {
          type: 'options',
          interactions: {
            card: {
              type: 'card',
              kind: 'play',
            },
            ui: {
              type: 'ui',
              kind: 'button',
              id: 'shuffleButton',
            },
          },
        },
      ],
    },
    actions: {},
    cards: {
      ace: {
        properties: { value: 1 },
      },
    },
    units: {},
  },
  ui: {
    type: 'Zone',
    id: 'solitaire-ui',
    styles: {
      width: 1500,
      height: 1000,
      border: '1px solid #777',
      borderRadius: 10,
    },
    children: [
      {
        id: 'shuffleButton',
        type: 'Button',
        content: 'Shuffle',
        disabled: hasNotStarted,
        styles: { position: 'absolute', top: -85, left: 10 },
        action: {
          context: {
            cardStacks: {
              drawStack: {
                shuffle: '$Array',
              },
            },
          },
        },
      },
      {
        id: 'drawButton',
        type: 'Button',
        content: 'Draw',
        disabled: hasNotStarted,
        styles: { position: 'absolute', top: -85, left: 170 },
      },
      {
        id: 'drawStack',
        type: 'CardStack',
        disabled: hasNotStarted,
        styles: {
          position: 'absolute',
          top: tablePadding,
          left: tablePadding,
        },
      },
      {
        id: 'discardStack',
        type: 'CardStack',
        disabled: hasNotStarted,
        styles: {
          position: 'absolute',
          top: tablePadding,
          left: tablePadding + 200,
        },
      },
      {
        id: 'finalStack1',
        type: 'CardStack',
        styles: {
          position: 'absolute',
          top: tablePadding,
          left: 500,
          backgroundColor: '#eee',
        },
        disabled: hasNotStarted,
        filter: suitAndIncreasing,
      },
      {
        id: 'finalStack2',
        type: 'CardStack',
        styles: {
          position: 'absolute',
          top: tablePadding,
          left: 700,
          backgroundColor: '#eee',
        },
        disabled: hasNotStarted,
        filter: suitAndIncreasing,
      },
      {
        id: 'finalStack3',
        type: 'CardStack',
        styles: {
          position: 'absolute',
          top: tablePadding,
          left: 900,
          backgroundColor: '#eee',
        },
        disabled: hasNotStarted,
        filter: suitAndIncreasing,
      },
      {
        id: 'finalStack4',
        type: 'CardStack',
        styles: {
          position: 'absolute',
          top: tablePadding,
          left: 1100,
          backgroundColor: '#eee',
        },
        disabled: hasNotStarted,
        filter: suitAndIncreasing,
      },
      // Table stacks
      {
        id: 'tableStack1',
        type: 'CardStack',
        styles: {
          position: 'absolute',
          top: tablePadding + 300,
          left: tablePadding + 50,
          backgroundColor: '#eee',
        },
        disabled: hasNotStarted,
        filter: kingOrDecreasing,
      },
      {
        id: 'tableStack2',
        type: 'CardStack',
        styles: {
          position: 'absolute',
          top: tablePadding + 300,
          left: tablePadding + 250,
          backgroundColor: '#eee',
        },
        disabled: hasNotStarted,
        filter: kingOrDecreasing,
      },
      {
        id: 'tableStack3',
        type: 'CardStack',
        styles: {
          position: 'absolute',
          top: tablePadding + 300,
          left: tablePadding + 450,
          backgroundColor: '#eee',
        },
        disabled: hasNotStarted,
        filter: kingOrDecreasing,
      },
      {
        id: 'tableStack4',
        type: 'CardStack',
        styles: {
          position: 'absolute',
          top: tablePadding + 300,
          left: tablePadding + 650,
          backgroundColor: '#eee',
        },
        disabled: hasNotStarted,
        filter: kingOrDecreasing,
      },
      {
        id: 'tableStack5',
        type: 'CardStack',
        styles: {
          position: 'absolute',
          top: tablePadding + 300,
          left: tablePadding + 850,
          backgroundColor: '#eee',
        },
        disabled: hasNotStarted,
        filter: kingOrDecreasing,
      },
      {
        id: 'tableStack6',
        type: 'CardStack',
        styles: {
          position: 'absolute',
          top: tablePadding + 300,
          left: tablePadding + 1050,
          backgroundColor: '#eee',
        },
        disabled: hasNotStarted,
        filter: kingOrDecreasing,
      },
      {
        id: 'tableStack7',
        type: 'CardStack',
        styles: {
          position: 'absolute',
          top: tablePadding + 300,
          left: tablePadding + 1250,
          backgroundColor: '#eee',
        },
        disabled: hasNotStarted,
        filter: kingOrDecreasing,
      },
    ],
  },
};
