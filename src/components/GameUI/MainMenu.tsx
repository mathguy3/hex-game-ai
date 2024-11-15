import { Button, Stack } from '@mui/material';

type MainMenuProps = {
  onPlay: () => void;
  onConfigure: () => void;
};
export const MainMenu = (props: MainMenuProps) => {
  const { onPlay, onConfigure } = props;
  return (
    <Stack>
      <Button onClick={onPlay}>{'Play game'}</Button>
      <Button onClick={onConfigure}>{'Configure game'}</Button>
      <Button
        onClick={async () => {
          const response = await fetch('http://localhost:3004/play', {
            method: 'POST',
            body: JSON.stringify({
              game: 'gameid',
              move: 'moveid',
              data: { name: 'any' },
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const answer = await response.json();
          console.log('result', answer);
        }}
      >
        {'Test route'}
      </Button>
    </Stack>
  );
};
