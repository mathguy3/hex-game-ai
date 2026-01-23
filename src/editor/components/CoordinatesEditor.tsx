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
  console.log("blah", coordinates);

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography variant="caption" color="text.secondary">
        q
      </Typography>
      <TextField
        size="small"
        value={coordinates.q ?? 0}
        onChange={(event) => onChange([...path, 'q'], parseNumber(event.target.value))}
        inputProps={{ style: { width: 50 } }}
      />
      <Typography variant="caption" color="text.secondary">
        r
      </Typography>
      <TextField
        size="small"
        value={coordinates.r ?? 0}
        onChange={(event) => onChange([...path, 'r'], parseNumber(event.target.value))}
        inputProps={{ style: { width: 50 } }}
      />
      <Typography variant="caption" color="text.secondary">
        s
      </Typography>
      <TextField
        size="small"
        value={coordinates.s ?? 0}
        onChange={(event) => onChange([...path, 's'], parseNumber(event.target.value))}
        inputProps={{ style: { width: 50 } }}
      />
    </Stack>
  );
};
