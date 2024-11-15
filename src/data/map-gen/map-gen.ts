import { rangeSimple } from '../../components/logic/tile-generators';
import { originHex } from '../../configuration/constants';
import { CoordinateKey, Coordinates, MapState, Tile } from '../../types';
import { UnitKind } from '../../types/kinds/units';
import { fromKey } from '../../utils/coordinates/fromKey';
import { getKey } from '../../utils/coordinates/getKey';
import { mapRecord } from '../../utils/record/mapRecord';

export const mapGen = (tiles: MapState = {}) => {
  return {
    tile: (coordinates: CoordinateKey) => {
      return mapGen({ ...tiles, [coordinates]: makeHex(fromKey(coordinates)) });
    },
    radius: (radius: number) => {
      const newTiles = rangeSimple({ type: 'range' as const, range: radius }, originHex, true);
      const newHexes = mapRecord(newTiles, (x: Tile) => makeHex(x.coordinates));
      return mapGen({ ...newHexes });
    },
    spawn: (kind: UnitKind, coordinates: CoordinateKey, team?: string) => {
      const newUnit = makeUnit(team, kind);
      return mapGen({
        ...tiles,
        [coordinates]: {
          ...tiles[coordinates],
          contains: { unit: newUnit },
        },
      });
    },
    result: () => tiles,
  };
};

const makeHex = (coordinates: Coordinates) => {
  return {
    type: 'hex' as const,
    key: getKey(coordinates),
    kind: coordinates.q === -2 ? 'river' : 'hex',
    aspects: {},
    coordinates: coordinates,
    isSelected: false,
    contains: {},
    preview: {},
  };
};

const makeUnit = (team?: string, kind?: UnitKind) => ({
  type: 'unit' as const,
  kind: kind,
  id: team,
  aspects: {
    ...(team ? { team: { type: 'team' as const, value: team } } : {}),
    health: { type: 'health', value: 100 },
    fallbackHealth: { type: 'fallbackHealth', value: 50 },
  },
});
