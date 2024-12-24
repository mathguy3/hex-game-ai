import { GameDefinition } from '../../../types/game';
import { cards } from './cards';

const hasNotStarted = {
  context: {
    not: {
      hasStarted: '$Boolean',
    },
  },
};

const tablePadding = 25;

export const solitaire: GameDefinition = {
  name: 'Solitaire',
  config: {
    rotateTable: true,
    description: 'A simple card game',
  },
  players: {
    player1: {},
  },
  initialState: {
    drawStack: Object.values(cards),
  },
  definitions: {
    map: {},
    sequencing: {
      type: 'repeating',
      //breakOn: currentPlayerHasWon,
      actions: [
        {
          type: 'options',
          interactions: {
            card: {
              type: 'card',
              kind: 'play',
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
      },
    ],
  },
};
