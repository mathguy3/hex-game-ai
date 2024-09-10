import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

export function Draggable(props: React.PropsWithChildren<{ id: string; data: any; disabled?: boolean }>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props.id,
    data: props.data,
    disabled: props.disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : undefined,
    listStyleType: 'none',
  };

  return (
    <li ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </li>
  );
}
