import { Box } from '@mui/material';
import { useMemo } from 'react';
import { useGameController } from '../../../logic/game-controller/GameControllerProvider';
import { useIf } from '../../../logic/if/if-engine-3/useIf';
import { DraggableCard } from '../../Card/DraggableCard';
import { InnerCard } from '../../Card/InnerCard';
import { useDragState } from '../../CardManager/DragStateProvider';
import { DroppableCard } from '../../CardManager/DroppableCard';
import { CardStackUIModel } from './UI';
import { mapStyles } from './utils/mapStyles';

const cardsBasedOnId = (id: string) => ({
  context: {
    cardStacks: {
      [id]: '$Array',
    },
  },
});

export const CardStack = ({ id, type, disabled, styles, content, properties, filter }: CardStackUIModel) => {
  const { isDragging, activeCard } = useDragState();
  const { basicActionState } = useGameController();
  const { doEval } = useIf(basicActionState.gameState);
  const mappedStyles = mapStyles(styles, doEval);
  const testCards = useMemo(() => doEval(cardsBasedOnId(id)) ?? [], [doEval]);

  const isDisabled = doEval(disabled);
  const matchesFilter = !filter || doEval(filter, { subject: activeCard });
  return (
    <Box sx={{ width: '150px', height: '190px', ...mappedStyles, border: '1px solid #ccc', borderRadius: '4px' }}>
      {testCards.map((card, index) => (
        <StackedCard
          isDisabled={isDisabled}
          stackId={id}
          card={card}
          index={index}
          isLast={index === testCards.length - 1}
        />
      ))}
      {isDragging && !isDisabled && matchesFilter && (
        <DroppableCard id={id + '-stackslot'} data={{ ...properties, id, type }} />
      )}
    </Box>
  );
};

const StackedCard = ({
  stackId,
  card,
  index,
  isLast,
  isDisabled,
}: {
  stackId: string;
  card: any;
  index: number;
  isLast: boolean;
  isDisabled: boolean;
}) => {
  const maxIndex = Math.min(index, 7);
  const styles = {
    position: 'absolute',
    top: maxIndex * 3,
    left: maxIndex * 3,
    border: '1px solid black',
    borderRadius: '4px',
  } as const;
  console.log('isDisabled', isDisabled);
  if (isLast && !isDisabled) {
    console.log('isLast', card);
    return (
      <DraggableCard
        id={card.id}
        name={card.name}
        stackId={stackId}
        kind={card.kind}
        isSelected={false}
        styleOverrides={styles}
        onClick={() => {
          console.log('Why');
        }}
      />
    );
  } else {
    return (
      <InnerCard
        id={card.id}
        kind={card.kind}
        name={card.name}
        isFloating={false}
        isSelected={false}
        onClick={() => {}}
        styleOverrides={styles}
      />
    );
  }
};
