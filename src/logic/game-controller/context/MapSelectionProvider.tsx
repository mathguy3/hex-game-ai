import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Button } from '@mui/material';
import { useClient } from '../../client/ClientProvider';
import { queryData } from './query/queryData';
import { useGameSession } from './GameSessionProvider';

type MapSelectionCtx = {
  selectedHex: any;
  targetState: Record<string, any>;
  previewState: Record<string, any>;
  setTargetState: (state: Record<string, any>) => void;
  selectHex: (id: string) => void;
};

const MapSelectionContext = createContext<MapSelectionCtx>(null);

export const MapSelectionProvider = ({ children }: React.PropsWithChildren) => {
  const { client } = useClient();
  const { gameSession } = useGameSession();
  const { activeOptions } = gameSession.localControl ?? {};
  const [selectedHex, setSelectedHex] = useState<any>(null);
  const [targetState, setTargetState] = useState<Record<string, any>>({});
  const [optionPreview, setOptionPreview] = useState<Record<string, any>>({});

  const firstBoardOption = activeOptions?.find((x) => x.token ?? x.space);

  console.log('firstBoardOption', firstBoardOption);
  useEffect(() => {
    setSelectedHex(null);
    setTargetState({});
    setOptionPreview({});
  }, [gameSession.gameState.activeStep]);

  const previewOption = useCallback(
    (optionToPreview: any, subjectSpace?: any, targetSpace?: any, type?: string) => {
      const option = optionToPreview.token ?? optionToPreview.space;
      if (!option) {
        return {};
      }

      const { query, target } = option;
      const queryTiles = queryData(
        { context: gameSession.gameState, subjectSpace },
        gameSession.gameDefinition.definitions.procedures,
        query
      );
      console.log('queryTiles', queryTiles);
      let preview = Object.entries(queryTiles).reduce((acc, x) => {
        acc[x[1].id] = {
          type: type ?? 'select',
        };
        return acc;
      }, {});

      console.log('target preview', subjectSpace, preview, target);
      if (subjectSpace && preview[subjectSpace.id] && target) {
        const firstTarget = Object.entries(target)[0];

        console.log('starting target preview');
        const targetPreview = previewOption(firstTarget[1], subjectSpace, targetSpace, 'target');
        console.log('targetPreview', targetPreview);
        preview = { ...preview, ...targetPreview };
      }
      return preview;
    },
    [gameSession.gameState]
  );

  useEffect(() => {
    if (firstBoardOption) {
      const preview = previewOption(firstBoardOption, selectedHex);
      setOptionPreview(preview);
    } else {
      setOptionPreview({});
    }
  }, [firstBoardOption, selectedHex]);

  const selectHex = useCallback(
    (hex: any) => {
      const isTarget = optionPreview[hex.id]?.type === 'target';
      const isTargeted = optionPreview[hex.id]?.type === 'targeted';
      if (isTarget || isTargeted) {
        console.log('targeting', hex);
        if (targetState[hex.id]) {
          setTargetState({ ...targetState, [hex.id]: null });
          setOptionPreview({ ...optionPreview, [hex.id]: { type: 'target' } });
        } else {
          setTargetState({ ...targetState, [hex.id]: hex.id });
          setOptionPreview({ ...optionPreview, [hex.id]: { type: 'targeted' } });
        }
      } else {
        console.log('selecting', hex);
        setTargetState({});
        setOptionPreview({});
        setSelectedHex(hex);
      }
      console.log('selectedHex', selectedHex);
    },
    [targetState, optionPreview]
  );

  const submitAction = useCallback(() => {
    const subjects = [
      {
        id: selectedHex.id,
        from: 'board',
        type: 'space' as const,
        targets: Object.entries(targetState).map(([key, value]) => ({
          id: key,
          from: 'board',
          type: 'space' as const,
        })),
      },
    ];
    console.log('submitAction', subjects);
    client.interact({
      kind: 'space',
      roomCode: gameSession.roomCode,
      subjects,
    });
  }, [targetState]);

  console.log('optionPreview', optionPreview);

  return (
    <MapSelectionContext.Provider
      value={{
        selectedHex,
        targetState,
        previewState: optionPreview,
        setTargetState,
        selectHex,
      }}
    >
      {!!firstBoardOption && (
        <Button
          sx={{ position: 'absolute', top: 100, left: 16, zIndex: 1000 }}
          onClick={submitAction}
          variant="contained"
        >
          Submit Action
        </Button>
      )}
      {children}
    </MapSelectionContext.Provider>
  );
};

export const useMapSelection = () => useContext(MapSelectionContext);
