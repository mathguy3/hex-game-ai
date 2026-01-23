import { Button } from '@mui/material';
import type { EditorComponentProps } from '../types';
import { ObjectEditor } from './ObjectEditor';
import { setAtPath } from '../utils';
import { getKey } from '../../utils/coordinates/getKey';
import { withEditorToolbar } from './withEditorToolbar';

const buildRadiusMap = (radius: number) => {
  const map: Record<string, any> = {};
  for (let q = -radius; q <= radius; q += 1) {
    const rMin = Math.max(-radius, -q - radius);
    const rMax = Math.min(radius, -q + radius);
    for (let r = rMin; r <= rMax; r += 1) {
      const s = -q - r;
      const coordinates = { q, r, s };
      const key = getKey(coordinates);
      map[key] = {
        id: key,
        key,
        type: 'hex',
        kind: 'hex',
        properties: {},
        coordinates,
        isSelected: false,
        contains: {},
        preview: {},
        source: 'editor',
      };
    }
  }
  return map;
};

export const HexMapEditor = withEditorToolbar('Hex Map', (props) => {
  const mapId = props.node?.id ?? 'board';
  const handleSeedMap = () => {
    const updatedRoot = setAtPath(props.rootValue, ['data', mapId], buildRadiusMap(3));
    props.onChange([], updatedRoot);
  };
  return (
    <Button size="small" variant="outlined" onClick={handleSeedMap}>
      Seed map (r=3)
    </Button>
  );
})((props) => (
  <ObjectEditor
    node={props.node ?? {}}
    objectValue={props.node ?? {}}
    path={props.path}
    onChange={props.onChange}
    registry={props.registry}
    rootValue={props.rootValue}
    compact
    allowAddFields={false}
  />
));
