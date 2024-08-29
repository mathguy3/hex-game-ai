import { Action } from '../../../types/actions/interactions';
import { UnitDefinition } from '../../../types/entities/unit/unit';

type HexDefinition = {};

export type EngineState = {
  map: Record<string, HexDefinition>;
  units: Record<string, UnitDefinition>;
  actions: Record<string, Action>;
  game: {
    setup: {
      units: Record<string, string>;
    };
  };
};
