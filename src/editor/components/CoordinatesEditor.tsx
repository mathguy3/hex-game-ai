import { Stack, TextField, Typography } from '@mui/material';
import type { EditorComponentProps } from '../types';

const parseNumber = (value: string) => {
  if (value.trim() === '') {
    return 0;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const CoordinatesEditor = ({ node, path, onChange }: EditorComponentProps) => {
  const coordinates = (node ?? {}) as { q?: number; r?: number; s?: number };


  return (
    <Stack direction="row" spacing={0.75} alignItems="center" pl={2} pt={0.5}>
      <Typography variant="body2" color="text.secondary">
        q
      </Typography>
      <TextField
        size="small"
        value={coordinates.q ?? 0}
        onChange={(event) => onChange([...path, 'q'], parseNumber(event.target.value))}
        inputProps={{ style: { width: 36 } }}
        sx={{ '& .MuiInputBase-input': { py: 0.5, px: 1 } }}
      />
      <Typography variant="body2" color="text.secondary">
        r
      </Typography>
      <TextField
        size="small"
        value={coordinates.r ?? 0}
        onChange={(event) => onChange([...path, 'r'], parseNumber(event.target.value))}
        inputProps={{ style: { width: 36 } }}
        sx={{ '& .MuiInputBase-input': { py: 0.5, px: 1 } }}
      />
      <Typography variant="body2" color="text.secondary">
        s
      </Typography>
      <TextField
        size="small"
        value={coordinates.s ?? 0}
        onChange={(event) => onChange([...path, 's'], parseNumber(event.target.value))}
        inputProps={{ style: { width: 36 } }}
        sx={{ '& .MuiInputBase-input': { py: 0.5, px: 1 } }}
      />
    </Stack>
  );
};
