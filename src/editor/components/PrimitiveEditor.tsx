import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import type { EditorComponentProps } from '../types';

type PrimitiveEditorProps = EditorComponentProps & {
  value: string | number | boolean | null;
};

export const PrimitiveEditor = ({ value, path, onChange }: PrimitiveEditorProps) => {
  if (typeof value === 'boolean') {
    return (
      <FormControlLabel
        control={
          <Checkbox sx={{ pt: 0, pb: '1px' }} checked={value} onChange={(event) => onChange(path, event.target.checked)} size="small" />
        }
        label=""
      />
    );
  }

  const stringValue = value === null || value === undefined ? '' : String(value);
  const isNumber = typeof value === 'number';

  return (
    <TextField
      size="small"
      type={isNumber ? 'number' : 'text'}
      value={stringValue}
      sx={{ '& .MuiInputBase-input': { py: 0.5 } }}
      onChange={(event) => {
        const nextValue = isNumber ? Number(event.target.value) : event.target.value;
        onChange(path, nextValue);
      }}
      fullWidth
    />
  );
};
