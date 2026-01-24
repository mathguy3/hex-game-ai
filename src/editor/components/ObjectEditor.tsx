import { Add, Close, ExpandLess, ExpandMore } from '@mui/icons-material';
import { Autocomplete, Box, IconButton, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
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
  lockedKeys,
  parentKey,
  boundDataItem,
  nodeType,
}: ObjectEditorProps) => {
  const [newKey, setNewKey] = useState('');
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [renamingKey, setRenamingKey] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const suggestionsRef = useRef<HTMLDivElement | null>(null);
  const [collapsedKeys, setCollapsedKeys] = useState<Record<string, boolean>>(() => {
    if (path.length === 0) {
      return { seats: true };
    }
    if (boundDataItem) {
      return Object.keys(objectValue).reduce<Record<string, boolean>>((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
    }
    return {};
  });

  useEffect(() => {
    if (!boundDataItem) {
      return;
    }
    setCollapsedKeys((prev) => {
      const next = { ...prev };
      Object.keys(objectValue).forEach((key) => {
        if (next[key] === undefined) {
          next[key] = true;
        }
      });
      return next;
    });
  }, [boundDataItem, objectValue]);

  const keySuggestions = parentKey ? registry.get(parentKey)?.suggestions : [];
  const typeSuggestions = nodeType ? registry.getTypeSuggestions(nodeType) : [];
  const mergedSuggestions = Array.from(new Set([...(keySuggestions ?? []), ...(typeSuggestions ?? [])]));
  const availableSuggestions = mergedSuggestions.filter((suggestion) => objectValue[suggestion] === undefined);
  const hasSuggestions = !!(allowAddFields && availableSuggestions.length > 0);

  useEffect(() => {
    if (!hasSuggestions) {
      setSuggestionsOpen(false);
    }
  }, [hasSuggestions]);

  useEffect(() => {
    if (!suggestionsOpen) {
      return;
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (!suggestionsRef.current) {
        return;
      }
      if (!suggestionsRef.current.contains(event.target as Node)) {
        setSuggestionsOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [suggestionsOpen]);

  const keys = Object.keys(objectValue);
  const orderedKeys = path.length === 0
    ? [
      ...keys.filter((key) => key === 'config'),
      ...keys.filter((key) => key === 'seats'),
      ...keys.filter((key) => key === 'definitions'),
      ...keys.filter((key) => key === 'sequence'),
      ...keys.filter((key) => key === 'ui'),
      ...keys.filter((key) => key === 'data'),
      ...keys.filter(
        (key) =>
          !['config', 'seats', 'definitions', 'sequence', 'ui', 'data'].includes(key)
      ),
    ]
    : keys;
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
  const shouldConfirmDelete = (value: any) => {
    if (typeof value === 'string') {
      return value.length !== 0;
    }
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return Object.keys(value).length !== 0;
    }
    return true;
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
      {orderedKeys.map((key) => {
        const isCollapsed = collapsedKeys[key];
        const value = objectValue[key];
        const isInlineValue = value === null || value === undefined || typeof value !== 'object';
        const isRenaming = renamingKey === key;
        const fieldNodeType = registry.resolveType({ path: [...path, key], node: value, rootValue });
        const lockConfig = lockedKeys?.[key];
        const allowRename = allowAddFields && !lockConfig?.lockRename;
        const allowTypeChange = allowAddFields && !lockConfig?.lockType && !fieldNodeType;
        const allowDelete = allowAddFields && !lockConfig?.lockDelete;
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
                  {allowRename ? (
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
                          width: 50,
                          minWidth: 50,
                          maxWidth: 160,
                          '& .MuiInputBase-input': { py: 0.5, px: 1 },
                        }}
                      />
                      {allowTypeChange ? (
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
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 24 }}>
                          {fieldNodeType}
                        </Typography>
                      )}
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 24 }}>
                      {key}
                      {lockConfig ? ' *' : ''}
                    </Typography>
                  )}
                  {!isCollapsed && (
                    <Box flex={1} minWidth={75}>
                      <EditorNode
                        node={value}
                        path={[...path, key]}
                        onChange={onChange}
                        registry={registry}
                        rootValue={rootValue}
                        parentKey={key}
                        allowAddFields={allowAddFields}
                        boundDataItem={parentKey === 'data' && !!lockedKeys?.[key]}
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
                    <Box minWidth={75} pt={0.5} pl={1}>
                      {allowRename ? (
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
                              flexBasis: 'auto',
                              minWidth: 75,
                              maxWidth: 200,
                              '& .MuiInputBase-input': { py: 0.5, px: 1 },
                            }}
                          />
                          {allowTypeChange ? (
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
                          ) : (
                            <Box flexGrow={1}>
                              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 24 }}>
                                {fieldNodeType}
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          {key}
                          {lockConfig ? ' *' : ''}
                        </Typography>
                      )}
                    </Box>
                    <Stack direction="row" spacing={0.5} mr={1} alignItems="center">
                      <IconButton
                        size="small"
                        onClick={() =>
                          setCollapsedKeys((prev) => ({ ...prev, [key]: !prev[key] }))
                        }
                        aria-label={isCollapsed ? 'expand' : 'collapse'}
                      >
                        {isCollapsed ? <ExpandMore fontSize="small" /> : <ExpandLess fontSize="small" />}
                      </IconButton>
                      {allowDelete && (
                        <IconButton
                          size="small"
                          onClick={() => {
                            if (shouldConfirmDelete(value)) {
                              if (!window.confirm(`Delete "${key}"? This cannot be undone.`)) {
                                return;
                              }
                            }
                            const { [key]: removed, ...rest } = objectValue;
                            onChange(path, rest);
                          }}
                          aria-label="delete"
                          sx={{ p: 0 }}
                        >
                          <Close fontSize="inherit" sx={{ fontSize: 14 }} />
                        </IconButton>
                      )}
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
                        boundDataItem={parentKey === 'data' && !!lockedKeys?.[key]}
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
            ref={suggestionsRef}
            sx={{
              position: 'relative',
              width: '100%',
              marginBottom: '10px',
            }}
          >
            <Box
              role="button"
              aria-label="add"
              onClick={() => {
                if (suggestionsOpen) {
                  return;
                }
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
                height: suggestionsOpen ? 40 : 11,
                transition: 'height 160ms ease, opacity 160ms ease',
                width: '100%',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '0 0 12px 12px',
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
              <Add fontSize="small" sx={{
                position: 'absolute', bottom: -10, left: '25%', transform: 'translateX(-50%)',
              }} />
              {hasSuggestions && (
                <Box
                  role="button"
                  aria-label="suggestions"
                  onClick={(event) => {
                    event.stopPropagation();
                    setSuggestionsOpen(!suggestionsOpen);
                  }}
                  sx={{
                    position: 'absolute',
                    bottom: -13,
                    right: 8,
                    height: '12px',
                    minWidth: 24,
                    px: 0.75,
                    border: '1px solid',
                    borderTop: 'none',
                    borderColor: 'divider',
                    borderRadius: '0 0 8px 8px',
                    bgcolor: 'background.paper',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'text.secondary',
                    zIndex: 2,
                  }}
                >
                  <Box fontSize={24} sx={{ position: 'relative', top: -11, }}>
                    ...
                  </Box>
                </Box>
              )}
              {hasSuggestions && (
                <Box
                  sx={{
                    height: '100%',
                    opacity: suggestionsOpen ? 1 : 0,
                    pointerEvents: suggestionsOpen ? 'auto' : 'none',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 0.5,
                      px: 1,
                      pt: 1,
                    }}
                  >
                    {availableSuggestions.map((suggestion) => (
                      <Box
                        key={suggestion}
                        role="button"
                        onClick={() => {
                          const defaultValue = registry.get(suggestion)?.defaultValue ?? {};
                          onChange(path, {
                            ...objectValue,
                            [suggestion]: structuredClone(defaultValue),
                          });
                          setSuggestionsOpen(false);
                        }}
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 999,
                          px: 1,
                          py: 0.25,
                          fontSize: 11,
                          color: 'text.secondary',
                          cursor: 'pointer',
                          bgcolor: 'background.paper',
                        }}
                      >
                        {suggestion}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>

          </Box>
        </Stack>
      )
      }
      {
        !allowAddFields && allowedKeys && keys.length === 0 && (
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
        )
      }
    </Stack >
  );
};
