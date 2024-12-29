import { Box } from '@mui/material';
import { Draggable } from './Draggable';
import { InnerCard } from './InnerCard';
import { CardState } from '../../types/game';

type DraggableCardProps = {
  id: string;
  stackId?: string;
  kind: string;
  card?: CardState;
  name?: string;
  isFloating?: boolean;
  isSelected: boolean;
  onClick?: () => void;
  disabled?: boolean;
  styleOverrides?: React.CSSProperties;
};
export const DraggableCard = ({
  id,
  stackId,
  kind,
  card,
  name,
  isFloating,
  isSelected,
  onClick,
  disabled,
  styleOverrides,
}: DraggableCardProps) => {
  return (
    <Draggable id={id} data={{ id, kind, stackId, ...card }} disabled={disabled}>
      <InnerCard
        id={id}
        kind={kind}
        name={name}
        isFloating={isFloating}
        isSelected={isSelected}
        onClick={onClick}
        styleOverrides={styleOverrides}
      />
    </Draggable>
  );
};
