import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Button } from '@mui/material';
import { useClient } from '../../client/ClientProvider';
import { useQueryData } from './query/useQueryData';
import { useGameSession } from './GameSessionProvider';
import { useUpdatingRef } from '../../../utils/useUpdatingRef';
import { useIf } from '../../if/if-engine-3/useIf';

type MapSelectionCtx = {
  selectedHex: any;
  targetState: Record<string, any>;
  previewState: Record<string, any>;
  setTargetState: (state: Record<string, any>) => void;
  selectHex: React.MutableRefObject<(hex: any) => void>;
};

const MapSelectionContext = createContext<MapSelectionCtx>(null);

function useTargetPreview() {
  const queryData = useQueryData();
  return (gameSession: any, option: any, selectedHex: any, kind: string) => {
    const { query } = option;
    const queryTiles = queryData(
      { context: gameSession.gameState, subjectSpace: selectedHex },
      gameSession.gameDefinition.definitions.procedures,
      query
    );
    console.log('queryTiles', queryTiles, option, kind);
    return Object.entries(queryTiles).reduce((acc, x: any) => {
      acc[x[1].id] = {
        type: 'target',
        kind,
      };
      return acc;
    }, {} as Record<string, any>);
  };
}

export const MapSelectionProvider = ({ children }: React.PropsWithChildren) => {
  const { client, user } = useClient();
  const { gameSession } = useGameSession();
  const { doEval } = useIf(gameSession);
  const { activeOptions } = gameSession.localControl ?? {};
  const [selectedHex, setSelectedHex] = useState<any>(null);
  const [targetState, setTargetState] = useState<Record<string, any>>({});
  const [previews, setPreviews] = useState<Record<string, any>>({});

  const isMyTurn = gameSession.gameState.seats[gameSession.gameState.activeId]?.userId === user?.userId;
  const firstValidOption = activeOptions?.find((x) => x.token ?? x.space);
  const firstBoardOption = firstValidOption?.token ?? firstValidOption?.space;

  useEffect(() => {
    setSelectedHex(null);
    setTargetState({});
    setPreviews({});
  }, [gameSession.gameState.activeStep]);

  const getTargetPreview = useTargetPreview();
  useEffect(() => {
    console.log('firstBoardOption', firstBoardOption, selectedHex);
    if (selectedHex && firstBoardOption && isMyTurn) {
      let hydratedOption = firstBoardOption;
      if (firstBoardOption?.defined) {
        const hydratedDefinedOption = doEval(firstBoardOption.defined, { subjectSpace: selectedHex });
        console.log(selectedHex);
        console.log('hydratedDefinedOption', hydratedDefinedOption, hydratedOption);
        if (hydratedDefinedOption) {
          hydratedOption = { ...firstBoardOption, ...hydratedDefinedOption };
        }
      }
      console.log('hydratedOption', hydratedOption);
      if (!hydratedOption.target) {
        return;
      }

      console.log('hydratedOption', hydratedOption);
      const targets: any[] = Object.entries(hydratedOption.target);
      let preview: Record<string, any> = {};
      targets.forEach(([key, value]) => {
        const targetOption = value.token ?? value.space;
        console.log('targetOption', targetOption);
        const targetPreview = getTargetPreview(gameSession, targetOption, selectedHex, key);
        preview = { ...preview, ...targetPreview };
      });
      setPreviews(preview);
    } else {
      setPreviews({});
    }
  }, [firstBoardOption, selectedHex, targetState]);

  const selectHex = useUpdatingRef((hex: any) => {
    if (!selectedHex) {
      setSelectedHex(hex);
      return;
    }
    console.log('selectHex', hex);
    const isTarget = previews[hex.id]?.type === 'target';
    const isTargeted = previews[hex.id]?.type === 'targeted';
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
      setPreviews({});
      setSelectedHex(hex);
    }
    //console.log('selectedHex', selectedHex);
  });

  /*const previewOption = useCallback(
    (option: any, subjectSpace?: any, type?: string) => {
      const { query } = option;
      const queryTiles = queryData(
        { context: gameSession.gameState, subjectSpace },
        gameSession.gameDefinition.definitions.references,
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
  );*/

  /*useEffect(() => {
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
  }, [firstBoardOption, selectedHex, targetState]);*/

  const submitAction = useCallback(() => {
    if (!selectedHex || !isMyTurn) {
      return;
    }
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
    setPreviews({});
    setSelectedHex(null);
  }, [targetState]);

  //console.log('optionPreview', optionPreview);

  return (
    <MapSelectionContext.Provider
      value={{
        selectedHex,
        targetState: isMyTurn ? targetState : {},
        previewState: isMyTurn ? previews : {},
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
