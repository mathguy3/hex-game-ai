import { Add, Close, ExpandLess, ExpandMore } from '@mui/icons-material';
import { Autocomplete, Box, IconButton, MenuItem, Stack, TextField, Typography } from '@mui/material';
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
  const [renamingKey, setRenamingKey] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [collapsedKeys, setCollapsedKeys] = useState<Record<string, boolean>>({});

  const keys = Object.keys(objectValue);
  const getFieldType = (value: any) => {
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'object') return 'object';
    return 'string';
  };
  const typeDefaults: Record<string, any> = {
    string: '',
    number: 0,
    boolean: false,
    object: {},
  };

  return (
    <Stack
      sx={compact ? { borderLeft: '2px solid', borderColor: 'divider', pl: 2, pb: '4px' } : { borderLeft: '2px solid', borderColor: 'divider', pl: 2, pb: '4px' }}
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
        const isRenaming = renamingKey === key;
        const commitRename = () => {
          const trimmed = renameValue.trim();
          if (!trimmed || trimmed === key || objectValue[trimmed] !== undefined) {
            setRenamingKey(null);
            setRenameValue('');
            return;
          }
          const { [key]: removed, ...rest } = objectValue;
          onChange(path, { ...rest, [trimmed]: removed });
          setRenamingKey(null);
          setRenameValue('');
        };
        return (
          <Stack key={`${path.join('.')}-${key}`} direction="row" spacing={1} alignItems="flex-start" marginTop={'8px'}>
            <Stack>
              {isInlineValue ? (
                <Box
                  display="flex"
                  alignItems="center"
                  flexWrap="wrap"
                  gap={1}
                  sx={{ border: '1px solid', borderColor: 'divider', p: 1 }}
                >
                {allowAddFields ? (
                  <>
                    <TextField
                      size="small"
                      value={isRenaming ? renameValue : key}
                      onFocus={() => {
                        setRenamingKey(key);
                        setRenameValue(key);
                      }}
                      onChange={(event) => setRenameValue(event.target.value)}
                      onBlur={commitRename}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          commitRename();
                        }
                      }}
                      sx={{
                        minWidth: 80,
                        maxWidth: 160,
                        '& .MuiInputBase-input': { py: 0.5, px: 1 },
                      }}
                    />
                    <TextField
                      select
                      size="small"
                      value={getFieldType(value)}
                      onChange={(event) => {
                        const nextType = event.target.value;
                        onChange([...path, key], typeDefaults[nextType]);
                      }}
                      sx={{
                        width: 90,
                        '& .MuiInputBase-input': { py: 0.5, px: 1, textOverflow: 'unset' },
                        '& .MuiSelect-select': { py: 0.5, px: 1, textOverflow: 'unset', whiteSpace: 'nowrap' },
                      }}
                    >
                      <MenuItem value="string">string</MenuItem>
                      <MenuItem value="number">number</MenuItem>
                      <MenuItem value="boolean">boolean</MenuItem>
                      <MenuItem value="object">object</MenuItem>
                    </TextField>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 24 }}>
                    {key}
                  </Typography>
                )}
                  {!isCollapsed && (
                    <Box flex={1} minWidth={160}>
                      <EditorNode
                        node={value}
                        path={[...path, key]}
                        onChange={onChange}
                        registry={registry}
                        rootValue={rootValue}
                        parentKey={key}
                        allowAddFields={allowAddFields}
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
                    {allowAddFields ? (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <TextField
                          size="small"
                          value={isRenaming ? renameValue : key}
                          onFocus={() => {
                            setRenamingKey(key);
                            setRenameValue(key);
                          }}
                          onChange={(event) => setRenameValue(event.target.value)}
                          onBlur={commitRename}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              commitRename();
                            }
                          }}
                          sx={{
                            minWidth: 120,
                            maxWidth: 200,
                            '& .MuiInputBase-input': { py: 0.5, px: 1 },
                          }}
                        />
                        <TextField
                          select
                          size="small"
                          value={getFieldType(value)}
                          onChange={(event) => {
                            const nextType = event.target.value;
                            onChange([...path, key], typeDefaults[nextType]);
                          }}
                          sx={{
                            width: 90,
                            '& .MuiInputBase-input': { py: 0.5, px: 1, textOverflow: 'unset' },
                            '& .MuiSelect-select': { py: 0.5, px: 1, textOverflow: 'unset', whiteSpace: 'nowrap' },
                          }}
                        >
                          <MenuItem value="string">string</MenuItem>
                          <MenuItem value="number">number</MenuItem>
                          <MenuItem value="boolean">boolean</MenuItem>
                          <MenuItem value="object">object</MenuItem>
                        </TextField>
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {key}
                      </Typography>
                    )}
                    </Box>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <IconButton
                        size="small"
                        onClick={() =>
                          setCollapsedKeys((prev) => ({ ...prev, [key]: !prev[key] }))
                        }
                        aria-label={isCollapsed ? 'expand' : 'collapse'}
                      >
                        {isCollapsed ? <ExpandMore fontSize="small" /> : <ExpandLess fontSize="small" />}
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          if (!window.confirm(`Delete "${key}"? This cannot be undone.`)) {
                            return;
                          }
                          const { [key]: removed, ...rest } = objectValue;
                          onChange(path, rest);
                        }}
                        aria-label="delete"
                        sx={{ p: 0.25 }}
                      >
                        <Close fontSize="inherit" sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Stack>
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
                        allowAddFields={allowAddFields}
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
        <Stack direction="row" alignItems="center">
          <Box
            role="button"
            aria-label="add"
            onClick={() => {
              const baseKey = 'fieldname';
              let nextKey = baseKey;
              let counter = 2;
              while (objectValue[nextKey] !== undefined) {
                nextKey = `${baseKey}-${counter}`;
                counter += 1;
              }
              onChange(path, { ...objectValue, [nextKey]: {} });
              setRenamingKey(nextKey);
              setRenameValue(nextKey);
            }}
            sx={{
              position: 'relative',
              height: 11,
              width: '100%',
              marginBottom: '10px',
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '0 0 12px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '100%',
                left: '25%',
                transform: 'translateX(-50%)',
                width: 34,
                height: 12,
                border: '1px solid',
                borderColor: 'divider',
                borderTop: 'none',
                borderRadius: '0 0 10px 10px',
                bgcolor: 'background.paper',
              },
            }}
          >
            <Add fontSize="small" sx={{ position: 'relative', top: 6, left: '-25%' }} />
          </Box>
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
