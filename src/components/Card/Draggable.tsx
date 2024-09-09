import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

export function Draggable(props: React.PropsWithChildren<{ id: string; data: any }>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props.id,
    data: props.data,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : undefined,
  };

  return (
    <li ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </li>
  );
}
