import { Box } from '@mui/material';
import { Draggable } from './Draggable';
import { InnerCard } from './InnerCard';

type DraggableCardProps = {
  id: string;
  stackId?: string;
  kind: string;
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
  name,
  isFloating,
  isSelected,
  onClick,
  disabled,
  styleOverrides,
}: DraggableCardProps) => {
  return (
    <Draggable id={id} data={{ id, kind, stackId }} disabled={disabled}>
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
