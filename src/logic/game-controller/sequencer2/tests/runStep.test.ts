import { context } from '../../../if/if-engine-3/operations/indexes/context';
import { beginSequence } from '../beginSequence';
import { runStep } from '../runStep';

const otherState = {
  gameState: {
    roomCode: 'test',
    players: {},
    activePlayerId: 'test',
    model: {
      maps: {},
      cards: {},
      tokens: {},
    },
  },

  localState: {
    mapManager: {
      state: 'view' as const,
    },
    cardManager: {
      state: 'view' as const,
      selectionSlots: 0,
    },
    selectionState: {},
    previewState: {},
    meId: 'test',
    playerState: {
      playerId: 'test',
      status: 'active' as const,
    },
  },
  localControl: {
    activeActions: {},
  },
  gameDefinition: {
    name: 'test',
    config: {
      description: 'test',
    },
    players: {},
    definitions: {
      units: {},
      cards: {},
      map: {},
      sequencing: {
        type: 'repeating' as const,
        actions: [
          {
            type: 'options' as const,
            interactions: {
              card: {
                type: 'card' as const,
                kind: 'play' as const,
              },
              ui: {
                type: 'ui' as const,
                kind: 'button' as const,
                id: 'shuffleButton' as const,
              },
            },
          },
        ],
      },
      actions: {},
    },
  },
  indexes: {
    cards: {},
    maps: {},
    spaces: {},
    units: {},
    //subjects: [],
    activePlayer: {
      playerId: 'test',
      status: 'active' as const,
    },
  },
};

describe('run', () => {
  it('should run the next step', () => {
    const item = {
      type: 'repeating' as const,
      actions: [
        {
          type: 'options' as const,
          interactions: {
            card: {
              type: 'card' as const,
              kind: 'play' as const,
            },
            ui: {
              type: 'ui' as const,
              kind: 'button' as const,
              id: 'shuffleButton' as const,
            },
          },
        },
      ],
    };
    const result = beginSequence(otherState, item);
    expect(result.sequenceState.path).toBe(item.type);
    const result2 = runStep(result);
    expect(result2.sequenceState.path).toBe('options');
  });
});
