import { Box } from '@mui/material';
import { useClient } from '../logic/client';

export const Username = () => {
  const { user } = useClient();
  return (
    <Box position="fixed" top={0} left={0}>
      {user?.name}
    </Box>
  );
};
