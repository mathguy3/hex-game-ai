import { Box } from '@mui/material';
import { useMemo } from 'react';
import { useIf } from '../../../../logic/if/if-engine-3/useIf';
import { DraggableCard } from '../../../Card/DraggableCard';
import { InnerCard } from '../../../Card/InnerCard';
import { useDragState } from '../../../CardManager/DragStateProvider';
import { DroppableCard } from '../../../CardManager/DroppableCard';
import { CardStackUIModel } from '../UI';
import { mapStyles } from '../utils/mapStyles';

const cardsBasedOnId = (id: string) => ({
  context: {
    cardStacks: {
      [id]: '$Array',
    },
  },
});

export const CardStack = ({ id, type, disabled, styles, content, properties, filter }: CardStackUIModel) => {
  const { isDragging, activeCard } = useDragState();
  const mappedStyles = { ...styles };
  const testCards = useMemo(() => [], []);

  const isDisabled = disabled;
  const matchesFilter = useMemo(() => !filter || filter, [filter]);

  /*if (activeCard && id == 'finalStack1') {
    console.log('-----------------');
    console.log('activeCard', activeCard);
    console.log('matchesFilter', matchesFilter);
    console.log('testCards', testCards);
    console.log('filter', filter);
    console.log('-----------------');
  }*/

  return (
    // add a soft yellow glow to the stack if matchesFilter is true
    <Box
      sx={{
        width: '150px',
        height: '190px',
        ...mappedStyles,
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: isDragging && matchesFilter ? '0 0 10px rgba(255, 255, 0, 0.5)' : 'none',
      }}
    >
      {testCards.map((card, index) => (
        <StackedCard
          key={card.id}
          isDisabled={isDisabled}
          stackId={id}
          card={card}
          index={index}
          isLast={index === testCards.length - 1}
        />
      ))}
      {isDragging && !isDisabled && matchesFilter && (
        <DroppableCard key={id + '-stackslot'} id={id + '-stackslot'} data={{ ...properties, id, type }} />
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
  if (isLast && !isDisabled) {
    return (
      <DraggableCard
        id={card.id}
        name={card.name}
        stackId={stackId}
        kind={card.kind}
        card={card}
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
