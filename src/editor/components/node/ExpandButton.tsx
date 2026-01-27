import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { IconButton } from '@mui/material';

type ExpandButtonProps = {
  expanded: boolean;
  onToggle: () => void;
};

export const ExpandButton = ({ expanded, onToggle }: ExpandButtonProps) => {
  return (
    <IconButton size="small" onClick={onToggle} aria-label={expanded ? 'collapse' : 'expand'}>
      {expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
    </IconButton>
  );
};
