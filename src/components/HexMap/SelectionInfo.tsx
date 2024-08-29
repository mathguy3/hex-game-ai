import { Box } from '@mui/material';
import { HexItem } from '../../types';

export const SelectionInfo = ({ item }: { item: HexItem }) => {
  //console.log(item.key);
  return <Box>{item && `${item.contains.unit?.kind ?? ''} ${item.key}`}</Box>;
};
