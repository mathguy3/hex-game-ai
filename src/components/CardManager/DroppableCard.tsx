import { useDroppable } from '@dnd-kit/core';
import { Box } from '@mui/material';

export const DroppableCard = ({
  id,
  data,
  onClick,
  children,
}: React.PropsWithChildren<{ id: string; data?: any; onClick?: () => void }>) => {
  const { setNodeRef, isOver } = useDroppable({ id, data });
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
