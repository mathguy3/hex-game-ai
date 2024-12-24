import { Box, Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const MainMenu = () => {
  const navigate = useNavigate();
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" width="100vw">
      <Stack spacing={6} alignItems="center">
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
            letterSpacing: '0.1em',
            transform: 'rotate(-2deg)',
            mb: 2,
          }}
        >
          -----------
        </Typography>
        <Stack spacing={2}>
          <Button variant="contained" size="medium" onClick={() => navigate('/pick')}>
            Start
          </Button>
          <Button variant="contained" size="medium" onClick={() => navigate('/configure')}>
            Configure
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
