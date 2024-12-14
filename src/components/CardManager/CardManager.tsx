import { DndContext, DragEndEvent, DragOverlay, useDroppable } from '@dnd-kit/core';
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import IconExpandLess from '@mui/icons-material/ExpandLess';
import IconExpandMore from '@mui/icons-material/ExpandMore';
import { Box, Button, IconButton } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CardState, PlayerState } from '../../types/game';
import { useOutsideAlerter } from '../../utils/useOutsideAlerter';
import { DraggableCard } from '../Card/DraggableCard';
import { InnerCard } from '../Card/InnerCard';
import { useGameController } from '../logic/game-controller/GameControllerProvider';
import { previewCard } from '../logic/game-controller/cards/previewCard';
import { endInteraction } from '../logic/game-controller/system-actions/end-action';

export const CardManager = () => {
  const { basicActionState, saveActionState } = useGameController();
  const { gameState, localState } = basicActionState;
  const { cardManager } = localState;
  const [active, setActive] = useState(null);
  const [selected, setSelected] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  function handleDragStart(event) {
    setSelected(event.active.id);
    setActive({ id: event.active.id, kind: event.active.data.current.kind });
    saveActionState.current(previewCard(basicActionState, event.active.id));
  }

  const playerHand = (gameState.players[localState.meId] as PlayerState).hand;
  const [dropSlots, setDropSlots] = useState<(CardState | null)[]>(Array(cardManager.selectionSlots).fill(null));
  //Reset slots and open if state changes
  useEffect(() => {
    setIsOpen(false);
    setDropSlots(Array(cardManager.selectionSlots).fill(null));
  }, [cardManager.selectionSlots]);
  const filteredHand = playerHand?.filter((x) => !dropSlots.some((y) => y?.id === x.id)) ?? [];

  const handleUnselect = () => {
    setActive(null);
    setSelected(null);
  };

  function handleDragEnd(event: DragEndEvent) {
    setActive(null);
    const { active, over } = event;
    if (typeof over?.id === 'string' && over.id.startsWith('slot')) {
      const droppedCard = playerHand.find((x) => x.id === active.id);
      const slotIndex = Number(over.id.replace('slot', ''));
      setDropSlots(dropSlots.toSpliced(slotIndex, 1, droppedCard));
      handleUnselect();
      return;
    }

    if (active.id !== over?.id) {
      let ph = [...playerHand];
      const oldIndex = ph.findIndex((x) => x.id === active.id);
      const newIndex = ph.findIndex((x) => x.id === over?.id);
      const oldValue = ph[oldIndex];
      ph = [...ph.toSpliced(oldIndex, 1).toSpliced(newIndex, 0, oldValue)];
      saveActionState.current({
        ...basicActionState,
        gameState: {
          ...gameState,
          players: {
            ...gameState.players,
            [localState.meId]: { ...gameState.players[localState.meId], hand: ph },
          },
        },
      });
    }
  }

  const removeSelected = (card: CardState) => {
    const clickedIndex = dropSlots.findIndex((x) => x?.id === card.id);
    setDropSlots(dropSlots.toSpliced(clickedIndex, 1, null));
  };

  const openHeight = 150;
  const closedHeight = 25;

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
    handleUnselect();
  };

  const focusRef = useRef(null);
  useOutsideAlerter(focusRef, () => {
    if (cardManager.state === 'view' && isOpen) {
      setIsOpen(false);
      handleUnselect();
    }
  });
  const handleFocus = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
  };
  const containerHeight = isOpen ? openHeight : closedHeight;
  const handleSelect = () => {

    // TODO: Send 'action' instead
    let updatedState = {
      ...basicActionState,
      gameState: {
        ...gameState,
        players: {
          ...gameState.players,
          [localState.meId]: {
            ...gameState.players[localState.meId],
            selected: playerHand.filter((x) => dropSlots.some((y) => y.id === x.id)),
          },
        },
      },
    };
    updatedState = endInteraction(updatedState);
    saveActionState.current(updatedState);
    setDropSlots(Array(cardManager.selectionSlots).fill(null));
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {cardManager.state === 'select' && isOpen && (
        <Box position="fixed" left={0} top={0} right={0} bottom={0} bgcolor="#00000055">
          <Box
            position="absolute"
            top={0}
            left={0}
            padding={6}
            display="flex"
            flexDirection="row"
            alignItems="center"
            gap={4}
          >
            {dropSlots.map((card, index) => (
              <DroppableCard id={'slot' + index} key={index} onClick={() => removeSelected(card)}>
                {card ? <InnerCard id={card.id} kind={card.kind} /> : undefined}
              </DroppableCard>
            ))}
            <Box>
              <Button variant="contained" disabled={dropSlots.some((x) => x === null)} onClick={handleSelect}>
                {'Select'}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
      <Box
        component="ol"
        display="flex"
        flexDirection="row"
        gap={2}
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        top={`calc(100% - ${containerHeight}px)`}
        bgcolor="#5f5f5f"
        padding="8px"
        margin={0}
        ref={focusRef}
        onClick={handleFocus}
      >
        <SortableContext items={filteredHand} strategy={horizontalListSortingStrategy}>
          {filteredHand.map((card) => (
            <DraggableCard
              key={card.id}
              id={card.id}
              kind={card.kind}
              isSelected={selected === card.id}
              disabled={!isOpen}
            />
          ))}
        </SortableContext>
      </Box>
      {createPortal(
        <DragOverlay>
          {active ? <InnerCard id={active.id} kind={active.kind} isFloating isSelected /> : null}
        </DragOverlay>,
        document.body
      )}
      <Box position="absolute" right="0" top={`calc(100% - ${containerHeight + 30}px)`}>
        <IconButton onClick={toggleCollapse} sx={{ background: '#f5f5f5' }}>
          {containerHeight === closedHeight ? <IconExpandLess /> : <IconExpandMore />}
        </IconButton>
      </Box>
    </DndContext>
  );
};

const DroppableCard = ({ id, onClick, children }: React.PropsWithChildren<{ id: string; onClick?: () => void }>) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <Box
      ref={setNodeRef}
      top={'0px'}
      width={'150px'}
      height={'190px'}
      boxSizing="border-box"
      borderRadius="4px"
      bgcolor={isOver ? '#ccc' : 'white'}
      boxShadow={'0px 0px 10px 1px rgba(0,0,0,0.3);'}
      onClick={onClick}
    >
      {children}
    </Box>
  );
};
