import { Box } from '@mui/material';

type InnerCardProps = {
  id: string;
  kind: string;
  isFloating?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
};

export const InnerCard = ({ id, kind, isFloating, isSelected, onClick }: InnerCardProps) => {
  if (isFloating) {
    console.log(isSelected);
  }
  return (
    <Box
      position="relative"
      width={isSelected ? '225px' : '150px'}
      height={isSelected ? '285px' : '190px'}
      style={{ touchAction: 'none' }}
      onClick={onClick}
    >
      <Box
        position="absolute"
        top={isSelected ? '-20px' : '0px'}
        width={isSelected ? '225px' : '150px'}
        height={isSelected ? '285px' : '190px'}
        padding="8px"
        boxSizing="border-box"
        borderRadius="4px"
        bgcolor="white"
        boxShadow={isSelected ? '0px 0px 10px 2px rgba(255,238,46,1);' : undefined}
      >
        Id: {id} Kind: {kind}
      </Box>
    </Box>
  );
};
