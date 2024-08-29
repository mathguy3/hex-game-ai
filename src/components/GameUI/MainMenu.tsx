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
    </Stack>
  );
};
