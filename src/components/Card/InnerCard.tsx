import { Box } from '@mui/material';

type InnerCardProps = {
  id: string;
  kind: string;
  name?: string;
  isFloating?: boolean;
  isSelected?: boolean;
  isDropped?: boolean;
  onClick?: () => void;
  styleOverrides?: React.CSSProperties;
};
// was 225px, 285px
const selectedSize = { width: '150px', height: '190px' };
const unselectedSize = { width: '150px', height: '190px' };

export const InnerCard = ({
  id,
  kind,
  name,
  isFloating,
  isSelected,
  isDropped,
  onClick,
  styleOverrides,
}: InnerCardProps) => {
  if (isFloating) {
    console.log(isSelected);
  }
  return (
    <Box
      position="relative"
      width={isSelected ? selectedSize.width : unselectedSize.width}
      height={isSelected ? selectedSize.height : unselectedSize.height}
      style={{ touchAction: 'none' }}
      onClick={onClick}
      sx={{ ...styleOverrides }}
    >
      <Box
        position="absolute"
        top={isSelected ? '-20px' : '0px'}
        width={isSelected ? selectedSize.width : unselectedSize.width}
        height={isSelected ? selectedSize.height : unselectedSize.height}
        padding="8px"
        boxSizing="border-box"
        borderRadius="4px"
        bgcolor="white"
        boxShadow={isSelected ? '0px 0px 10px 2px rgba(255,238,46,1);' : undefined}
      >
        Id: {id} Kind: {kind}
      </Box>
      {/* Centered box with name please */}
      <Box position="absolute" top="50%" left="50%" sx={{ transform: 'translate(-50%, -50%)' }}>
        {name}
      </Box>
    </Box>
  );
};
