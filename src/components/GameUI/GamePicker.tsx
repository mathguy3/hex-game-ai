import { Button, Stack } from '@mui/material';
import { hexChess } from '../../data';
import { GameDefinition } from '../../types/game';

export const GamePicker = ({ onClick }: { onClick: (game: GameDefinition) => void }) => {
  const games = [hexChess, hexChess];
  return (
    <Stack>
      {games.map((x, idx) => (
        <Button key={x.name + idx} onClick={() => onClick(x)}>
          {x.name}
        </Button>
      ))}
    </Stack>
  );
};
