import { TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

type NodeTitleProps = {
  label: string;
  editable?: boolean;
  locked?: boolean;
  mode?: 'inline' | 'block';
  onCommit?: (nextValue: string) => void;
};

export const NodeTitle = ({ label, editable, locked, mode = 'block', onCommit }: NodeTitleProps) => {
  const [localValue, setLocalValue] = useState(label);
  const [isEditing, setIsEditing] = useState(false);
  const sizeSx = mode === 'inline'
    ? { width: 50, minWidth: 50, maxWidth: 160 }
    : { minWidth: 75, maxWidth: 200 };

  useEffect(() => {
    if (!isEditing) {
      setLocalValue(label);
    }
  }, [isEditing, label]);

  if (!editable) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 24 }}>
        {label}
        {locked ? ' *' : ''}
      </Typography>
    );
  }

  return (
    <TextField
      size="small"
      value={localValue}
      onFocus={() => setIsEditing(true)}
      onBlur={() => {
        setIsEditing(false);
        onCommit?.(localValue);
      }}
      onChange={(event) => setLocalValue(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          setIsEditing(false);
          onCommit?.(localValue);
        }
      }}
      sx={{
        ...sizeSx,
        '& .MuiInputBase-input': { py: 0.5, px: 1 },
      }}
    />
  );
};
