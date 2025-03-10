import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Button } from '@mui/material';
import { useClient } from '../../client/ClientProvider';
import { queryData } from './query/queryData';
import { useGameSession } from './GameSessionProvider';
import { useUpdatingRef } from '../../../utils/useUpdatingRef';
type MapSelectionCtx = {
  selectedHex: any;
  targetState: Record<string, any>;
  previewState: Record<string, any>;
  setTargetState: (state: Record<string, any>) => void;
  selectHex: React.MutableRefObject<(hex: any) => void>;
};

const MapSelectionContext = createContext<MapSelectionCtx>(null);

export const MapSelectionProvider = ({ children }: React.PropsWithChildren) => {
  const { client } = useClient();
  const { gameSession } = useGameSession();
  const { activeOptions } = gameSession.localControl ?? {};
  const [selectedHex, setSelectedHex] = useState<any>(null);
  const [targetState, setTargetState] = useState<Record<string, any>>({});
  const [optionPreview, setOptionPreview] = useState<Record<string, any>>({});

  const firstValidOption = activeOptions?.find((x) => x.token ?? x.space);
  const firstBoardOption = firstValidOption?.token ?? firstValidOption?.space;

  useEffect(() => {
    setSelectedHex(null);
    setTargetState({});
    setOptionPreview({});
  }, [gameSession.gameState.activeStep]);

  const previewOption = useCallback(
    (option: any, subjectSpace?: any, type?: string) => {
      const { query } = option;
      const queryTiles = queryData(
        { context: gameSession.gameState, subjectSpace },
        gameSession.gameDefinition.definitions.procedures,
        query
      );
      //console.log('queryTiles', queryTiles);
      let preview = Object.entries(queryTiles).reduce((acc, x) => {
        acc[x[1].id] = {
          type: type ?? 'select',
        };
        return acc;
      }, {});

      return preview;
    },
    [gameSession.gameState]
  );

  useEffect(() => {
    if (firstBoardOption) {
      let preview = previewOption(firstBoardOption, selectedHex);
      console.log('selectedHex', selectedHex, preview[selectedHex?.id], firstBoardOption, targetState);
      if (selectedHex && preview[selectedHex.id] && firstBoardOption.target && Object.keys(targetState).length == 0) {
        const firstTarget = Object.entries(firstBoardOption.target)[0] as any;
        const firstTargetOption = firstTarget[1]?.token ?? firstTarget[1]?.space;

        //console.log('starting target preview');
        const targetPreview = previewOption(firstTargetOption, selectedHex, 'target');
        //console.log('targetPreview', targetPreview);
        preview = { ...preview, ...targetPreview };
      }
      setOptionPreview(preview);
    } else {
      setOptionPreview({});
    }
  }, [firstBoardOption, selectedHex, targetState]);

  const selectHex = useUpdatingRef((hex: any) => {
    console.log('selectHex', hex);
    const isTarget = optionPreview[hex.id]?.type === 'target';
    const isTargeted = optionPreview[hex.id]?.type === 'targeted';
    if (isTarget || isTargeted) {
      //console.log('targeting', hex);
      if (targetState[hex.id]) {
        setTargetState({ ...targetState, [hex.id]: null });
        ///setOptionPreview({ ...optionPreview, [hex.id]: { type: 'target' } });
      } else {
        setTargetState({ ...targetState, [hex.id]: hex.id });
        ///setOptionPreview({ ...optionPreview, [hex.id]: { type: 'targeted' } });
      }
    } else {
      //console.log('selecting', hex);
      setTargetState({});
      setOptionPreview({});
      setSelectedHex(hex);
    }
    //console.log('selectedHex', selectedHex);
  });

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
    //console.log('submitAction', subjects);
    client.interact({
      kind: 'space',
      roomCode: gameSession.roomCode,
      subjects,
    });
    setTargetState({});
    setOptionPreview({});
    setSelectedHex(null);
  }, [targetState]);

  //console.log('optionPreview', optionPreview);

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
