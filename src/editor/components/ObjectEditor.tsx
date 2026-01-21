import { Add, Delete } from '@mui/icons-material';
import { Box, IconButton, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { EditorNode } from './EditorNode';
import type { EditorComponentProps } from '../types';
import { removeAtPath } from '../utils';

type ObjectEditorProps = EditorComponentProps & {
  objectValue: Record<string, any>;
  label?: string;
  compact?: boolean;
};

export const ObjectEditor = ({
  objectValue,
  path,
  onChange,
  registry,
  rootValue,
  label,
  compact,
}: ObjectEditorProps) => {
  const [newKey, setNewKey] = useState('');

  const keys = Object.keys(objectValue);

  return (
    <Stack spacing={1} sx={compact ? { borderLeft: '2px solid', borderColor: 'divider', pl: 2 } : { borderLeft: '2px solid', borderColor: 'divider', pl: 2 }}>
      {label && !compact && (
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
      )}
      {keys.map((key) => (
        <Stack key={`${path.join('.')}-${key}`} direction="row" spacing={1} alignItems="flex-start">
          <Stack>
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" sx={{ border: '1px solid', borderColor: 'divider' }}>
              <Box minWidth={140} pt={0.5} pl={1}>
                <Typography variant="body2" color="text.secondary">
                  {key}
                </Typography>
              </Box>
              {/*<IconButton
                size="small"
                onClick={() => onChange([], removeAtPath(rootValue, [...path, key]))}
                aria-label="remove"
              >
                <Delete fontSize="small" />
              </IconButton>*/}
            </Box>
            <Box flex={1}>
              <EditorNode
                node={objectValue[key]}
                path={[...path, key]}
                onChange={onChange}
                registry={registry}
                rootValue={rootValue}
                parentKey={key}
              />
            </Box>
          </Stack>
        </Stack>
      ))}
      <Stack direction="row" spacing={1} alignItems="center">
        <TextField
          size="small"
          placeholder="new field"
          value={newKey}
          onChange={(event) => setNewKey(event.target.value)}
          sx={{ maxWidth: 200 }}
        />
        <IconButton
          size="small"
          onClick={() => {
            if (!newKey || objectValue[newKey] !== undefined) {
              return;
            }
            onChange(path, { ...objectValue, [newKey]: {} });
            setNewKey('');
          }}
          aria-label="add"
          sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}
        >
          <Add fontSize="small" />
        </IconButton>
      </Stack>
    </Stack>
  );
};
