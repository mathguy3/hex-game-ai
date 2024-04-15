import { Box } from '@mui/material';
import { gridColumnWidth } from '../../configuration/constants';
import { Unit } from '../../types';
import { SoldierIcon } from './SoldierIcon';

export const Soldier = ({ item }: { item: Unit }) => {
  return (
    <Box
      position="absolute"
      zIndex={2}
      top={10}
      left={gridColumnWidth / 2 - 25}
    >
      <SoldierIcon width={50} />
    </Box>
  );
};
