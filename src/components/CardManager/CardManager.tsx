import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import IconExpandLess from '@mui/icons-material/ExpandLess';
import IconExpandMore from '@mui/icons-material/ExpandMore';
import { Box, Button, IconButton, Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CardState, PlayerState } from '../../types/game';
import { useOutsideAlerter } from '../../utils/useOutsideAlerter';
import { DraggableCard } from '../Card/DraggableCard';

import { InnerCard } from '../Card/InnerCard';
import { useDragState } from './DragStateProvider';
import { DroppableCard } from './DroppableCard';
import { useGameSession } from '../../logic/game-controller/context/GameSessionProvider';
import { useClient } from '../../logic/client/ClientProvider';

export const CardManager = ({ children }: { children: React.ReactNode }) => {
  const { client, user } = useClient();
  const { isDragging, setIsDragging, setActiveCard } = useDragState();
  const { gameSession } = useGameSession();
  const { gameState, localControl, gameDefinition } = gameSession;
  const { activeOptions } = localControl ?? {};
  const [active, setActive] = useState(null);
  const [selected, setSelected] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const seatId = Object.values(gameSession.gameState.seats).find((x) => x.userId === user.userId)?.id;

  const firstCardOption = activeOptions?.find((x) => x.card);
  const firstCardOptionType = firstCardOption?.card?.select ? 'select' : 'play';
  const state = firstCardOption ? firstCardOptionType : 'view';

  const selectionSlots = (firstCardOptionType === 'play' ? 1 : firstCardOption?.card?.select?.count) ?? 0;
  const playerState = gameState.data[seatId] as PlayerState;
  const playSourceType = firstCardOption?.card?.play?.from ?? firstCardOption?.card?.select?.from;
  const playSource = playSourceType === 'selectedCards' ? playerState.selectedCards : playerState.hand;
  console.log('playSource', playerState);
  const [dropSlots, setDropSlots] = useState<(CardState | null)[]>(Array(selectionSlots).fill(null));
  const filteredHand = playSource?.filter((x) => !!x && !dropSlots.some((y) => y?.id === x.id)) ?? [];

  //Reset slots and open if state changes
  useEffect(() => {
    setIsOpen(false);
    setDropSlots(Array(selectionSlots).fill(null));
  }, [selectionSlots]);

  function handleDragStart(event: DragStartEvent) {
    //console.log('handleDragStart', event.active.id);
    setSelected(event.active.id);
    setActive({ id: event.active.id, kind: event.active.data.current.kind });
    setActiveCard(event.active.data.current as CardState);
    //saveActionState.current(previewCard(basicActionState, event.active.id + ''));
    setIsDragging(true);
  }

  const handleUnselect = () => {
    setActive(null);
    setSelected(null);
  };

  function handleDragEnd(event: DragEndEvent) {
    setActive(null);
    setIsDragging(false);
    const { active, over } = event;
    if (!over) {
      return;
    }
    console.log('handleDragEnd', active, over);
    if (over.data.current.type === 'CardStack') {
      if (over.data.current.id == active.data.current.stackId) {
        console.log('same stack', over.data.current, active.data.current.stackId);
        return;
      }
      console.log('why does it go boom', active.data.current, over.data.current);
      // do a handlePlaceCard
      handlePlaceCard.current(active.data.current.id, active.data.current.stackId, over.data.current.id);
      //console.log('CardPlace!', active.data.current, over.data.current);
      // move the card to the other stack
      // Need to do a 'set' action to move the card

      return;
    }
    console.log('over', over);
    if (typeof over?.id === 'string' && over.id.startsWith('slot')) {
      const droppedCard = playSource.find((x) => x.id === active.id);
      const slotIndex = Number(over.id.replace('slot', ''));
      setDropSlots(dropSlots.toSpliced(slotIndex, 1, droppedCard));
      handleUnselect();
      return;
    }

    if (active.id !== over?.id) {
      let ph = [...playSource];
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
    if (state === 'view' && isOpen) {
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
    // interact
    client.interact({
      kind: 'selectCards',
      subjects: dropSlots.map((x) => ({ id: x?.id, type: 'card' })),
      roomCode: gameSession.roomCode,
    });
    setDropSlots(Array(selectionSlots).fill(null));
    setIsOpen(false);
  };

  const handlePlay = (key: string, value: any) => {
    console.log('handlePlay', key, value);
    client.interact({
      kind: 'playCard',
      subjects: [{ id: dropSlots[0].id, type: 'card', action: key }],
      roomCode: gameSession.roomCode,
    });
    setDropSlots(Array(selectionSlots).fill(null));
    setIsOpen(false);
  };

  console.log('card state', dropSlots[0]);

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {children}
      {(state === 'select' || state === 'play') && isOpen && (
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
              <DroppableCard
                id={'slot' + index}
                key={index}
                data={{ type: 'select', id: 'slot' + index }}
                onClick={() => removeSelected(card)}
              >
                {card ? <InnerCard id={card.id} kind={card.kind} /> : undefined}
              </DroppableCard>
            ))}
            <Box>
              {state === 'select' && (
                <Button variant="contained" disabled={dropSlots.some((x) => x === null)} onClick={handleSelect}>
                  {'Select'}
                </Button>
              )}
              {state === 'play' && !dropSlots[0] && (
                <Button variant="contained" disabled={true}>
                  {'Play'}
                </Button>
              )}
              {state === 'play' && dropSlots[0] && (
                <Stack gap={2}>
                  {Object.entries((dropSlots[0] as any).actions).map(([key, value]) => {
                    return (
                      <Button variant="contained" onClick={() => handlePlay(key, value)}>
                        {key}
                      </Button>
                    );
                  })}
                </Stack>
              )}
            </Box>
          </Box>
        </Box>
      )}
      {gameDefinition.config.useHand && (
        <>
          <Box
            component="ol"
            position="fixed"
            bottom={0}
            left={0}
            right={0}
            top={`calc(100% - ${containerHeight}px)`}
            display="flex"
            flexDirection="row"
            gap={2}
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
          <Box position="absolute" right="0" top={`calc(100% - ${containerHeight + 30}px)`}>
            <IconButton onClick={toggleCollapse} sx={{ background: '#f5f5f5' }}>
              {containerHeight === closedHeight ? <IconExpandLess /> : <IconExpandMore />}
            </IconButton>
          </Box>
        </>
      )}
      {createPortal(
        <DragOverlay>
          {active ? (
            <InnerCard id={active.id} kind={active.kind} isFloating isSelected isDropped={!isDragging} />
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};
