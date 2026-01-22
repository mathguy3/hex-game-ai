import { Add, Delete } from '@mui/icons-material';
import { Autocomplete, Box, IconButton, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { EditorNode } from './EditorNode';
import type { EditorComponentProps } from '../types';
import { removeAtPath } from '../utils';

type ArrayEditorProps = EditorComponentProps & {
  items: any[];
  label?: string;
  allowCommand?: boolean;
  allowedArrayKeys?: string[];
};

const commandListKeys = new Set(['actions', 'phases', 'turns', 'steps', 'options', 'interactions']);

export const ArrayEditor = ({
  items,
  path,
  onChange,
  registry,
  rootValue,
  label,
  parentKey,
  allowedArrayKeys,
}: ArrayEditorProps) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const isCommandList = parentKey ? commandListKeys.has(parentKey) : false;
  const allowCommand = isCommandList || !!allowedArrayKeys?.length;

  return (
    <Stack spacing={1} sx={{ borderLeft: '2px solid', borderColor: 'divider', pl: 2 }}>
      {label && (
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
      )}
      {items.map((item, index) => (
        <Stack key={`${path.join('.')}-${index}`} direction="row" spacing={1} alignItems="flex-start">
          <Box flex={1}>
            <EditorNode
              node={item}
              path={[...path, index]}
              onChange={onChange}
              registry={registry}
              rootValue={rootValue}
              parentKey={parentKey}
              allowCommand={allowCommand}
            />
          </Box>
          <IconButton
            size="small"
            onClick={() => onChange([], removeAtPath(rootValue, [...path, index]))}
            aria-label="remove"
          >
            <Delete fontSize="small" />
          </IconButton>
        </Stack>
      ))}
      <Stack direction="row" spacing={1} alignItems="center">
        {allowedArrayKeys && (
          <Autocomplete
            size="small"
            options={allowedArrayKeys}
            value={selectedKey}
            onChange={(_, nextValue) => setSelectedKey(nextValue)}
            renderInput={(params) => <TextField {...params} placeholder="item type" />}
            sx={{ minWidth: 200 }}
          />
        )}
        <IconButton
          size="small"
          onClick={() => {
            if (allowedArrayKeys) {
              if (!selectedKey) {
                return;
              }
              const defaultValue = registry.get(selectedKey)?.defaultValue ?? {};
              onChange(path, [...items, { [selectedKey]: structuredClone(defaultValue) }]);
              setSelectedKey(null);
              return;
            }
            onChange(path, [...items, {}]);
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
