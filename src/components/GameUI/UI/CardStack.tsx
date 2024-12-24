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

export const CardStack = ({ id, type, disabled, styles, content, properties }: CardStackUIModel) => {
  const { isDragging } = useDragState();
  const { basicActionState } = useGameController();
  const { doEval } = useIf(basicActionState.gameState);
  const mappedStyles = mapStyles(styles, doEval);
  const testCards = useMemo(() => (content ? doEval(content) : []), [content, doEval]);

  const isDisabled = doEval(disabled);
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
      {isDragging && !isDisabled && <DroppableCard id={id + '-stackslot'} data={{ ...properties, id, type }} />}
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
    return <DraggableCard id={card.id} stackId={stackId} kind={card.kind} isSelected={false} styleOverrides={styles} />;
  } else {
    return (
      <InnerCard
        id={card.id}
        kind={card.kind}
        isFloating={false}
        isSelected={false}
        onClick={() => {}}
        styleOverrides={styles}
      />
    );
  }
};
