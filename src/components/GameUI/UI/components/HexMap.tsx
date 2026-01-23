import { Box } from '@mui/material';
import { HexMapUIModel, UI } from '../UI';
import { useGameSession } from '../../../../logic/game-controller/context/GameSessionProvider';
import { Hex } from './Hex';
import { mapStyles } from '../utils/mapStyles';
import { useIf } from '../../../../logic/if/if-engine-3/useIf';
import { useMapSelection } from '../../../../logic/game-controller/context/MapSelectionProvider';
import { useUpdatingRef } from '../../../../utils/useUpdatingRef';

const transitionTypes = ['move'];

const fallbackGameSession = {
  gameState: {
    data: {},
    activeId: '',
    hasStarted: false,
    seats: {},
  },
  gameDefinition: {
    definitions: {
      functions: {},
      references: {},
    },
  },
  localControl: {},
} as any;

const useSafeGameSession = () => {
  const ctx = useGameSession();
  if (!ctx?.gameSession) {
    return { gameSession: fallbackGameSession, transitions: {} };
  }
  return ctx;
};

const useSafeMapSelection = () => {
  const ctx = useMapSelection();
  const fallbackSelectHex = useUpdatingRef(() => {});
  return (
    ctx ?? {
      selectedHex: null,
      previewState: {},
      targetState: {},
      selectHex: fallbackSelectHex,
    }
  );
};

type HexMapRenderProps = {
  hex: HexMapUIModel['hex'];
  mappedStyles: Record<string, any>;
  content: Record<string, any>;
  transitions: Record<string, any>;
  selectedHex: any;
  previewState: Record<string, any>;
  targetState: Record<string, any>;
  selectHex: ReturnType<typeof useUpdatingRef>;
};

export const HexMapRender = ({
  hex,
  mappedStyles,
  content,
  transitions,
  selectedHex,
  previewState,
  targetState,
  selectHex,
}: HexMapRenderProps) => {
  return (
    <Box sx={mappedStyles}>
      {Object.entries(content).map(([key, item]) => (
        <UI
          key={key}
          hex={hex}
          data={item}
          isSelected={selectedHex?.id === key}
          isTargeted={targetState[key]}
          preview={previewState[key]}
          transition={transitions[key]}
          selectHex={selectHex}
        />
      ))}
    </Box>
  );
};

export const HexMap = ({ id, styles, hex }: HexMapUIModel) => {
  const { gameSession, transitions: localTransitions } = useSafeGameSession();
  const { selectedHex, previewState, targetState, selectHex } = useSafeMapSelection();
  const { gameState } = gameSession;
  const { doEval } = useIf(gameSession);
  const stores = gameState.data ?? {};
  const content = (stores[id] ?? {}) as Record<string, any>;

  const mappedStyles = styles ? mapStyles(styles, doEval) : {};
  const transitions = localTransitions
    ? Object.entries(localTransitions)
        .filter(([key, value]) => transitionTypes.includes(key) && id == value.from.store && content[value.from.id])
        .reduce((acc, [key, value]) => {
          acc[value.from.id] = {
            from: value.from,
            fromItem: content[value.from.id],
            to: value.to,
            toItem: value.to.store === 'supply' ? null : stores[value.to.store][value.to.id],
            type: key,
          };
          return acc;
        }, {} as Record<string, any>)
    : {};

  //console.log('local transitions', localTransitions);
  console.log('previewState', selectedHex, previewState);

  return (
    <HexMapRender
      hex={hex}
      mappedStyles={mappedStyles}
      content={content}
      transitions={transitions}
      selectedHex={selectedHex}
      previewState={previewState}
      targetState={targetState}
      selectHex={selectHex}
    />
  );
};
