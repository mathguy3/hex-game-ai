import { Autocomplete, Box, Stack, TextField } from '@mui/material';
import { useMemo } from 'react';
import { EditorNode } from './EditorNode';
import type { EditorComponentProps } from '../types';

type ObjectEditorProps = EditorComponentProps & {
  objectValue: Record<string, any>;
  allowAddFields?: boolean;
  allowedKeys?: string[];
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
}: ObjectEditorProps) => {
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
            />
          </Box>
        );
      })}
      {!allowAddFields && effectiveAllowedKeys && keys.length === 0 && (
        <Stack direction="row" spacing={1} alignItems="center">
          <Autocomplete
            size="small"
            options={effectiveAllowedKeys}
            value={null}
            onChange={(_, nextValue) => {
              if (!nextValue || objectValue[nextValue] !== undefined) {
                return;
              }
              const defaultValue = resolveDefaultValue(nextValue);
              onChange(path, { ...objectValue, [nextValue]: structuredClone(defaultValue) });
            }}
            renderInput={(params) => <TextField {...params} placeholder="add item" />}
            sx={{ minWidth: 200 }}
          />
        </Stack>
      )}
    </Stack >
  );
};
