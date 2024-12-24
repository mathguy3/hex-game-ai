import { Box } from '@mui/material';
import { UI, ZoneUIModel } from './UI';

export const Zone = ({ styles, children }: ZoneUIModel) => {
  return (
    <Box sx={{ ...styles }}>
      {children?.map((child) => (
        <UI key={child.id} {...child} />
      ))}
    </Box>
  );
};
