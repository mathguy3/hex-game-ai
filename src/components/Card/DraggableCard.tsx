import { Draggable } from './Draggable';
import { InnerCard } from './InnerCard';

type DraggableCardProps = {
  id: string;
  kind: string;
  isFloating?: boolean;
  isSelected: boolean;
  onClick?: () => void;
  disabled?: boolean;
};
export const DraggableCard = ({ id, kind, isFloating, isSelected, onClick, disabled }: DraggableCardProps) => {
  return (
    <Draggable id={id} data={{ kind }} disabled={disabled}>
      <InnerCard id={id} kind={kind} isFloating={isFloating} isSelected={isSelected} onClick={onClick} />
    </Draggable>
  );
};
