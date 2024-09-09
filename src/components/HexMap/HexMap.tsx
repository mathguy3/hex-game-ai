import { closestCenter, DndContext, DragEndEvent, DragOverlay } from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { isDev } from '../../configuration/constants';
import { Draggable } from '../Card/Draggable';
import { useGameController } from '../logic/game-controller/useGameController';
import { Hex } from './Hex/Hex';
import { MapFrame } from './MapFrame';
import { SelectionInfo } from './SelectionInfo';

export const HexMap = () => {
  const { selectionState, mapState, gameState, pressHex, systemAction, basicActionState, saveActionState } =
    useGameController();

  const [active, setActive] = useState(null);
  function handleDragStart(event) {
    console.log(event);
    console.log('drag event');
    setActive({ id: event.active.id, kind: event.active.data.current.kind });
  }

  const playerHand = gameState.players[gameState.meId].hand;

  function handleDragEnd(event: DragEndEvent) {
    console.log('1');
    console.log('why is it stopping?');
    setActive(null);
    const { active, over } = event;

    if (active.id !== over.id) {
      let ph = [...playerHand];
      const oldIndex = ph.findIndex((x) => x.id === active.id);
      const newIndex = ph.findIndex((x) => x.id === over.id);
      const oldValue = ph[oldIndex];
      ph = [...ph.toSpliced(oldIndex, 1).toSpliced(newIndex, 0, oldValue)];
      saveActionState.current({
        ...basicActionState,
        gameState: {
          ...gameState,
          players: {
            ...gameState.players,
            [gameState.meId]: { ...gameState.players[gameState.meId], hand: ph },
          },
        },
      });
    }
  }

  function handleDragMove() {
    console.log('moving');
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragMove={handleDragMove}
      collisionDetection={closestCenter}
    >
      {isDev && (
        <Box position="absolute" top="10px" right="10px" zIndex={1000}>
          {Object.values(selectionState).map((x) => (
            <SelectionInfo key={x.key} item={x} />
          ))}
        </Box>
      )}
      <MapFrame>
        <Box id="inner-inner" position="relative">
          {Object.values(mapState).map((x) => {
            return <Hex key={x.key} item={x} onSelectedRef={pressHex} />;
          })}
        </Box>
      </MapFrame>

      <Box
        component="ol"
        display="flex"
        flexDirection="row"
        gap={2}
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        top="calc(100% - 150px)"
        bgcolor="#5f5f5f"
        padding="8px"
        margin={0}
      >
        <SortableContext items={playerHand ?? []} strategy={rectSortingStrategy}>
          {playerHand.map((card) => (
            <DraggableCard key={card.id} id={card.id} kind={card.kind} />
          ))}
        </SortableContext>
      </Box>
      {createPortal(
        <DragOverlay>{active ? <InnerCard id={active.id} kind={active.kind} isFloating /> : null}</DragOverlay>,
        document.body
      )}
      <Box position="fixed" bottom={0} right={0}>
        <Button
          variant="contained"
          disabled={/*!isPlayerTurn(gameState)*/ false}
          onClick={() => systemAction.current('end-turn')}
        >
          {'End turn'}
        </Button>
      </Box>

      <Box position="fixed" top={0} left={0}>
        {gameState.activePlayerId}
      </Box>
    </DndContext>
  );
};

const DraggableCard = ({ id, kind, isFloating }: { id: string; kind: string; isFloating?: boolean }) => {
  return (
    <Draggable id={id} data={{ kind }}>
      <InnerCard id={id} kind={kind} isFloating={isFloating} />
    </Draggable>
  );
};

const InnerCard = ({ id, kind, isFloating }: { id: string; kind: string; isFloating?: boolean }) => {
  return (
    <Box
      width="150px"
      padding="8px"
      boxSizing="border-box"
      height="190px"
      borderRadius="4px"
      bgcolor="white"
      border="1px solid white"
      boxShadow={isFloating ? 'rgba(0, 0, 0, 0.16) 0px 1px 4px;' : undefined}
      style={{ touchAction: 'none' }}
    >
      Id: {id} Kind: {kind}
    </Box>
  );
};
