import { Add } from '@mui/icons-material';
import { Autocomplete, Box, IconButton, Stack, TextField } from '@mui/material';
import { useMemo, useState } from 'react';
import { EditorNode } from './EditorNode';
import type { EditorComponentProps } from '../types';

type ObjectEditorProps = EditorComponentProps & {
  objectValue: Record<string, any>;
  allowAddFields?: boolean;
  allowedKeys?: string[];
  modifiedKeys?: Set<string>;
};

export const ObjectEditor = ({
  objectValue,
  path,
  onChange,
  registry,
  rootValue,
  allowAddFields,
  allowedKeys,
  lockedKeys,
  parentKey,
  modifiedKeys,
}: ObjectEditorProps) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [customKey, setCustomKey] = useState('');
  const registration = useMemo(
    () => registry.resolveRegistration({ path, node: objectValue, rootValue }),
    [path, objectValue, rootValue, registry]
  );
  const effectiveAllowedKeys = allowedKeys ?? registration?.allowedKeys;

  const resolveDefaultValue = (key: string) =>
    registry.resolveRegistration({
      path: [...path, key],
      node: objectValue[key],
      rootValue,
    })?.defaultValue ?? {};

  const keys = Object.keys(objectValue);
  const orderedKeys =
    path.length === 0
      ? [
          ...keys.filter((key) => key === 'config'),
          ...keys.filter((key) => key === 'seats'),
          ...keys.filter((key) => key === 'definitions'),
          ...keys.filter((key) => key === 'sequence'),
          ...keys.filter((key) => key === 'ui'),
          ...keys.filter((key) => key === 'data'),
          ...keys.filter((key) => !['config', 'seats', 'definitions', 'sequence', 'ui', 'data', 'meta'].includes(key)),
        ]
      : keys.filter((key) => key !== 'meta');
  const isArrayItem = typeof path[path.length - 1] === 'number';
  const showEmptyAdder = isArrayItem && orderedKeys.length === 0 && (allowAddFields || effectiveAllowedKeys);

  return (
    <Stack spacing={1} sx={{ position: 'relative' }}>
      {orderedKeys.map((key) => {
        const value = objectValue[key];
        return (
          <Box key={`${path.join('.')}-${key}`}>
            <EditorNode
              node={value}
              path={[...path, key]}
              onChange={onChange}
              registry={registry}
              rootValue={rootValue}
              parentKey={key}
              allowAddFields={allowAddFields}
              lockConfig={lockedKeys?.[key]}
              boundDataItem={parentKey === 'data' && !!lockedKeys?.[key]}
              isModified={modifiedKeys?.has(key)}
            />
          </Box>
        );
      })}
      {showEmptyAdder && (
        <Box sx={{ border: '2px solid', borderColor: 'text.primary', borderRadius: 1, p: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            {effectiveAllowedKeys ? (
              <Autocomplete
                size="small"
                options={effectiveAllowedKeys}
                value={selectedKey}
                onChange={(_, nextValue) => setSelectedKey(nextValue)}
                renderInput={(params) => <TextField {...params} placeholder="add item" />}
                sx={{ minWidth: 200 }}
              />
            ) : (
              <TextField
                size="small"
                placeholder="field name"
                value={customKey}
                onChange={(event) => setCustomKey(event.target.value)}
                sx={{ minWidth: 200 }}
              />
            )}
            <IconButton
              size="small"
              onClick={() => {
                const nextKey = effectiveAllowedKeys ? selectedKey : customKey.trim();
                if (!nextKey || objectValue[nextKey] !== undefined) {
                  return;
                }
                const defaultValue = resolveDefaultValue(nextKey);
                onChange(path, { ...objectValue, [nextKey]: structuredClone(defaultValue) });
                setSelectedKey(null);
                setCustomKey('');
              }}
              aria-label="add"
              sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}
            >
              <Add fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      )}
    </Stack>
  );
};
