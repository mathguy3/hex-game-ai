import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import type { EditorComponentProps } from '../types';

type PrimitiveEditorProps = EditorComponentProps & {
  value: string | number | boolean | null;
  preventEmpty?: boolean;
  debounceMs?: number;
};

export const PrimitiveEditor = ({ value, path, onChange, preventEmpty, debounceMs }: PrimitiveEditorProps) => {
  const isBoolean = typeof value === 'boolean';
  const stringValue = value === null || value === undefined ? '' : String(value);
  const isNumber = typeof value === 'number';
  const shouldDebounce = !isNumber && !isBoolean && typeof debounceMs === 'number';
  const lastNonEmptyRef = useRef<string>(typeof value === 'string' && value.length > 0 ? value : '');
  const debounceRef = useRef<number | null>(null);
  const isDirtyRef = useRef(false);
  const [localValue, setLocalValue] = useState(stringValue);

  useEffect(() => {
    if (!shouldDebounce || isDirtyRef.current) {
      return;
    }
    setLocalValue(stringValue);
  }, [shouldDebounce, stringValue]);

  if (isBoolean) {
    return (
      <FormControlLabel
        control={
          <Checkbox
            sx={{ pt: 0, pb: '1px' }}
            checked={value}
            onChange={(event) => onChange(path, event.target.checked)}
            size="small"
          />
        }
        label=""
      />
    );
  }

  return (
    <TextField
      size="small"
      type={isNumber ? 'number' : 'text'}
      value={shouldDebounce ? localValue : stringValue}
      sx={{ '& .MuiInputBase-input': { py: 0.5 } }}
      onChange={(event) => {
        const nextValue = isNumber ? Number(event.target.value) : event.target.value;
        if (preventEmpty && !isNumber && typeof nextValue === 'string' && nextValue.length > 0) {
          lastNonEmptyRef.current = nextValue;
        }
        if (!shouldDebounce) {
          onChange(path, nextValue);
          return;
        }
        isDirtyRef.current = true;
        setLocalValue(String(nextValue));
        if (debounceRef.current) {
          window.clearTimeout(debounceRef.current);
        }
        debounceRef.current = window.setTimeout(() => {
          onChange(path, nextValue);
          isDirtyRef.current = false;
        }, debounceMs);
      }}
      onBlur={(event) => {
        if (!preventEmpty || isNumber) {
          return;
        }
        const nextValue = event.target.value;
        let resolvedValue = nextValue;
        if (nextValue.length === 0 && lastNonEmptyRef.current.length > 0) {
          resolvedValue = lastNonEmptyRef.current;
          if (shouldDebounce) {
            setLocalValue(resolvedValue);
          }
        }
        if (shouldDebounce) {
          if (debounceRef.current) {
            window.clearTimeout(debounceRef.current);
          }
          onChange(path, resolvedValue);
          isDirtyRef.current = false;
        } else if (resolvedValue !== nextValue) {
          onChange(path, resolvedValue);
        }
      }}
      fullWidth
    />
  );
};
