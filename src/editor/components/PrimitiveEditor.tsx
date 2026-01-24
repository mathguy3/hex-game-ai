import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import { useRef } from 'react';
import type { EditorComponentProps } from '../types';

type PrimitiveEditorProps = EditorComponentProps & {
  value: string | number | boolean | null;
  preventEmpty?: boolean;
};

export const PrimitiveEditor = ({ value, path, onChange, preventEmpty }: PrimitiveEditorProps) => {
  const lastNonEmptyRef = useRef<string>(typeof value === 'string' && value.length > 0 ? value : '');
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
        if (preventEmpty && !isNumber && typeof nextValue === 'string' && nextValue.length > 0) {
          lastNonEmptyRef.current = nextValue;
        }
        onChange(path, nextValue);
      }}
      onBlur={(event) => {
        if (!preventEmpty || isNumber) {
          return;
        }
        const nextValue = event.target.value;
        if (nextValue.length === 0 && lastNonEmptyRef.current.length > 0) {
          onChange(path, lastNonEmptyRef.current);
        }
      }}
      fullWidth
    />
  );
};
