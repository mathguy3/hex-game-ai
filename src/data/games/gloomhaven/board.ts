export const board = {
  // Center
  '0.0.0': {
    id: '0.0.0',
    source: 'board',
    coordinates: { q: 0, r: 0, s: 0 },
    character: { type: 'token', kind: 'enemy', properties: { isEnemy: true, health: 2 } },
  },

  // Ring 1
  '0.1.-1': {
    id: '0.1.-1',
    source: 'board',
    coordinates: { q: 0, r: 1, s: -1 },
  },
  '1.0.-1': {
    id: '1.0.-1',
    source: 'board',
    coordinates: { q: 1, r: 0, s: -1 },
  },
  '1.-1.0': {
    id: '1.-1.0',
    source: 'board',
    coordinates: { q: 1, r: -1, s: 0 },
  },
  '0.-1.1': {
    id: '0.-1.1',
    source: 'board',
    coordinates: { q: 0, r: -1, s: 1 },
  },
  '-1.0.1': {
    id: '-1.0.1',
    source: 'board',
    coordinates: { q: -1, r: 0, s: 1 },
  },
  '-1.1.0': {
    id: '-1.1.0',
    source: 'board',
    coordinates: { q: -1, r: 1, s: 0 },
  },

  // Ring 2
  '0.2.-2': {
    id: '0.2.-2',
    source: 'board',
    coordinates: { q: 0, r: 2, s: -2 },
  },
  '1.1.-2': {
    id: '1.1.-2',
    source: 'board',
    coordinates: { q: 1, r: 1, s: -2 },
  },
  '2.0.-2': {
    id: '2.0.-2',
    source: 'board',
    coordinates: { q: 2, r: 0, s: -2 },
  },
  '2.-1.-1': {
    id: '2.-1.-1',
    source: 'board',
    coordinates: { q: 2, r: -1, s: -1 },
  },
  '2.-2.0': {
    id: '2.-2.0',
    source: 'board',
    coordinates: { q: 2, r: -2, s: 0 },
  },
  '1.-2.1': {
    id: '1.-2.1',
    source: 'board',
    coordinates: { q: 1, r: -2, s: 1 },
  },
  '0.-2.2': {
    id: '0.-2.2',
    source: 'board',
    coordinates: { q: 0, r: -2, s: 2 },
  },
  '-1.-1.2': {
    id: '-1.-1.2',
    source: 'board',
    coordinates: { q: -1, r: -1, s: 2 },
  },
  '-2.0.2': {
    id: '-2.0.2',
    source: 'board',
    coordinates: { q: -2, r: 0, s: 2 },
  },
  '-2.1.1': {
    id: '-2.1.1',
    source: 'board',
    coordinates: { q: -2, r: 1, s: 1 },
  },
  '-2.2.0': {
    id: '-2.2.0',
    source: 'board',
    coordinates: { q: -2, r: 2, s: 0 },
  },
  '-1.2.-1': {
    id: '-1.2.-1',
    source: 'board',
    coordinates: { q: -1, r: 2, s: -1 },
  },

  // Ring 3
  '0.3.-3': {
    id: '0.3.-3',
    source: 'board',
    coordinates: { q: 0, r: 3, s: -3 },
    character: { type: 'token', kind: 'blinkblade', properties: { playerId: 'player2', health: 10 } },
  },
  '1.2.-3': {
    id: '1.2.-3',
    source: 'board',
    coordinates: { q: 1, r: 2, s: -3 },
    character: { type: 'token', kind: 'blinkblade', properties: { playerId: 'player1', health: 10 } },
  },
  '2.1.-3': {
    id: '2.1.-3',
    source: 'board',
    coordinates: { q: 2, r: 1, s: -3 },
    character: { type: 'token', kind: 'blinkblade', properties: { playerId: 'player3', health: 10 } },
  },
  '3.0.-3': {
    id: '3.0.-3',
    source: 'board',
    coordinates: { q: 3, r: 0, s: -3 },
  },
  '3.-1.-2': {
    id: '3.-1.-2',
    source: 'board',
    coordinates: { q: 3, r: -1, s: -2 },
  },
  '3.-2.-1': {
    id: '3.-2.-1',
    source: 'board',
    coordinates: { q: 3, r: -2, s: -1 },
  },
  '3.-3.0': {
    id: '3.-3.0',
    source: 'board',
    coordinates: { q: 3, r: -3, s: 0 },
  },
  '2.-3.1': {
    id: '2.-3.1',
    source: 'board',
    coordinates: { q: 2, r: -3, s: 1 },
  },
  '1.-3.2': {
    id: '1.-3.2',
    source: 'board',
    coordinates: { q: 1, r: -3, s: 2 },
  },
  '0.-3.3': {
    id: '0.-3.3',
    source: 'board',
    coordinates: { q: 0, r: -3, s: 3 },
  },
  '-1.-2.3': {
    id: '-1.-2.3',
    source: 'board',
    coordinates: { q: -1, r: -2, s: 3 },
  },
  '-2.-1.3': {
    id: '-2.-1.3',
    source: 'board',
    coordinates: { q: -2, r: -1, s: 3 },
  },
  '-3.0.3': {
    id: '-3.0.3',
    source: 'board',
    coordinates: { q: -3, r: 0, s: 3 },
  },
  '-3.1.2': {
    id: '-3.1.2',
    source: 'board',
    coordinates: { q: -3, r: 1, s: 2 },
  },
  '-3.2.1': {
    id: '-3.2.1',
    source: 'board',
    coordinates: { q: -3, r: 2, s: 1 },
  },
  '-3.3.0': {
    id: '-3.3.0',
    source: 'board',
    coordinates: { q: -3, r: 3, s: 0 },
  },
  '-2.3.-1': {
    id: '-2.3.-1',
    source: 'board',
    coordinates: { q: -2, r: 3, s: -1 },
  },
  '-1.3.-2': {
    id: '-1.3.-2',
    source: 'board',
    coordinates: { q: -1, r: 3, s: -2 },
  },

  // Ring 4
  '0.4.-4': {
    id: '0.4.-4',
    source: 'board',
    coordinates: { q: 0, r: 4, s: -4 },
  },
  '1.3.-4': {
    id: '1.3.-4',
    source: 'board',
    coordinates: { q: 1, r: 3, s: -4 },
  },
  '2.2.-4': {
    id: '2.2.-4',
    source: 'board',
    coordinates: { q: 2, r: 2, s: -4 },
  },
  '3.1.-4': {
    id: '3.1.-4',
    source: 'board',
    coordinates: { q: 3, r: 1, s: -4 },
  },
  '4.0.-4': {
    id: '4.0.-4',
    source: 'board',
    coordinates: { q: 4, r: 0, s: -4 },
  },
  '4.-1.-3': {
    id: '4.-1.-3',
    source: 'board',
    coordinates: { q: 4, r: -1, s: -3 },
  },
  '4.-2.-2': {
    id: '4.-2.-2',
    source: 'board',
    coordinates: { q: 4, r: -2, s: -2 },
  },
  '4.-3.-1': {
    id: '4.-3.-1',
    source: 'board',
    coordinates: { q: 4, r: -3, s: -1 },
  },
  '4.-4.0': {
    id: '4.-4.0',
    source: 'board',
    coordinates: { q: 4, r: -4, s: 0 },
  },
  '3.-4.1': {
    id: '3.-4.1',
    source: 'board',
    coordinates: { q: 3, r: -4, s: 1 },
  },
  '2.-4.2': {
    id: '2.-4.2',
    source: 'board',
    coordinates: { q: 2, r: -4, s: 2 },
    character: { type: 'token', kind: 'enemy', properties: { isEnemy: true, health: 2 } },
  },
  '1.-4.3': {
    id: '1.-4.3',
    source: 'board',
    coordinates: { q: 1, r: -4, s: 3 },
    character: { type: 'token', kind: 'enemy', properties: { isEnemy: true, health: 2 } },
  },
  '0.-4.4': {
    id: '0.-4.4',
    source: 'board',
    coordinates: { q: 0, r: -4, s: 4 },
  },
  '-1.-3.4': {
    id: '-1.-3.4',
    source: 'board',
    coordinates: { q: -1, r: -3, s: 4 },
  },
  '-2.-2.4': {
    id: '-2.-2.4',
    source: 'board',
    coordinates: { q: -2, r: -2, s: 4 },
  },
  '-3.-1.4': {
    id: '-3.-1.4',
    source: 'board',
    coordinates: { q: -3, r: -1, s: 4 },
  },
  '-4.0.4': {
    id: '-4.0.4',
    source: 'board',
    coordinates: { q: -4, r: 0, s: 4 },
  },
  '-4.1.3': {
    id: '-4.1.3',
    source: 'board',
    coordinates: { q: -4, r: 1, s: 3 },
  },
  '-4.2.2': {
    id: '-4.2.2',
    source: 'board',
    coordinates: { q: -4, r: 2, s: 2 },
  },
  '-4.3.1': {
    id: '-4.3.1',
    source: 'board',
    coordinates: { q: -4, r: 3, s: 1 },
  },
  '-4.4.0': {
    id: '-4.4.0',
    source: 'board',
    coordinates: { q: -4, r: 4, s: 0 },
  },
  '-3.4.-1': {
    id: '-3.4.-1',
    source: 'board',
    coordinates: { q: -3, r: 4, s: -1 },
  },
  '-2.4.-2': {
    id: '-2.4.-2',
    source: 'board',
    coordinates: { q: -2, r: 4, s: -2 },
  },
  '-1.4.-3': {
    id: '-1.4.-3',
    source: 'board',
    coordinates: { q: -1, r: 4, s: -3 },
  },
};
