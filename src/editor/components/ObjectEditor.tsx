import { Add, ExpandLess, ExpandMore } from '@mui/icons-material';
import { Autocomplete, Box, IconButton, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { EditorNode } from './EditorNode';
import type { EditorComponentProps } from '../types';

type ObjectEditorProps = EditorComponentProps & {
  objectValue: Record<string, any>;
  label?: string;
  compact?: boolean;
  allowAddFields?: boolean;
  allowedKeys?: string[];
};

export const ObjectEditor = ({
  objectValue,
  path,
  onChange,
  registry,
  rootValue,
  label,
  compact,
  allowAddFields,
  allowedKeys,
}: ObjectEditorProps) => {
  const [newKey, setNewKey] = useState('');
  const [collapsedKeys, setCollapsedKeys] = useState<Record<string, boolean>>({});

  const keys = Object.keys(objectValue);

  return (
    <Stack
      spacing={1}
      sx={compact ? { borderLeft: '2px solid', borderColor: 'divider', pl: 2 } : { borderLeft: '2px solid', borderColor: 'divider', pl: 2 }}
    >
      {label && !compact && (
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
      )}
      {keys.map((key) => {
        const isCollapsed = collapsedKeys[key];
        const value = objectValue[key];
        const isInlineValue = value === null || value === undefined || typeof value !== 'object';
        return (
        <Stack key={`${path.join('.')}-${key}`} direction="row" spacing={1} alignItems="flex-start">
          <Stack>
            {isInlineValue ? (
              <Box
                display="flex"
                alignItems="center"
                flexWrap="wrap"
                gap={1}
                sx={{ border: '1px solid', borderColor: 'divider', p: 1 }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 24 }}>
                  {key}
                </Typography>
                {!isCollapsed && (
                  <Box flex={1} minWidth={160}>
                    <EditorNode
                      node={value}
                      path={[...path, key]}
                      onChange={onChange}
                      registry={registry}
                      rootValue={rootValue}
                      parentKey={key}
                    />
                  </Box>
                )}
              </Box>
            ) : (
              <>
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ border: '1px solid', borderColor: 'divider' }}
                >
                  <Box minWidth={140} pt={0.5} pl={1}>
                    <Typography variant="body2" color="text.secondary">
                      {key}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() =>
                      setCollapsedKeys((prev) => ({ ...prev, [key]: !prev[key] }))
                    }
                    aria-label={isCollapsed ? 'expand' : 'collapse'}
                  >
                    {isCollapsed ? <ExpandMore fontSize="small" /> : <ExpandLess fontSize="small" />}
                  </IconButton>
                </Box>
                {!isCollapsed && (
                  <Box flex={1}>
                    <EditorNode
                      node={value}
                      path={[...path, key]}
                      onChange={onChange}
                      registry={registry}
                      rootValue={rootValue}
                      parentKey={key}
                    />
                  </Box>
                )}
              </>
            )}
          </Stack>
        </Stack>
      );
      })}
      {allowAddFields && (
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
      )}
      {!allowAddFields && allowedKeys && keys.length === 0 && (
        <Stack direction="row" spacing={1} alignItems="center">
          <Autocomplete
            size="small"
            options={allowedKeys}
            value={null}
            onChange={(_, nextValue) => {
              if (!nextValue || objectValue[nextValue] !== undefined) {
                return;
              }
              const defaultValue = registry.get(nextValue)?.defaultValue ?? {};
              onChange(path, { ...objectValue, [nextValue]: structuredClone(defaultValue) });
            }}
            renderInput={(params) => <TextField {...params} placeholder="add item" />}
            sx={{ minWidth: 200 }}
          />
        </Stack>
      )}
    </Stack>
  );
};
