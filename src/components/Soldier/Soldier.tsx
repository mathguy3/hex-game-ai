import { Box } from '@mui/material';
import { gridColumnWidth } from '../../configuration/constants';
import { UnitState } from '../../types/entities/unit/unit';
import { SoldierIcon } from './SoldierIcon';

export const Soldier = ({ item }: { item: UnitState }) => {
  return (
    <Box
      position="absolute"
      zIndex={2}
      top={10}
      left={gridColumnWidth / 2 - 25}
    >
      <SoldierIcon width={50} />
      <Box position="absolute" zIndex={3} top={50} left={5}>
        {item.kind}
      </Box>
    </Box>
  );
};
