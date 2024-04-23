export type Coordinates = { q: number; r: number; s: number };
export type CoordinateKey = `${number}.${number}.${number}`;

export type Tile =
  | { type: 'tile'; coordinates: Coordinates; key: CoordinateKey }
  | {
      type: 'pathrange';
      coordinates: Coordinates;
      key: CoordinateKey;
      pathRange: number;
    };
