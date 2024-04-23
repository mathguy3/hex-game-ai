import { Box } from '@mui/material';
import { HexItem } from '../../types';
import { getKey } from '../../utils/coordinates/getKey';

export const SelectionInfo = ({ item }: { item: HexItem }) => {
  return (
    <Box>
      {item && `${item.contains.unit?.kind} ${getKey(item.coordinates)}`}
    </Box>
  );
};
