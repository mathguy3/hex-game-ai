import { Add } from '@mui/icons-material';
import { Autocomplete, Box, IconButton, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { EditorNode } from './EditorNode';
import type { EditorComponentProps } from '../types';

type ArrayEditorProps = EditorComponentProps & {
  items: any[];
  allowedArrayKeys?: string[];
};

const defaultTypeKeys = ['Object', 'Array', 'String', 'Number', 'Boolean'];

export const ArrayEditor = ({
  items,
  path,
  onChange,
  registry,
  rootValue,
  parentKey,
  allowedArrayKeys,
  allowAddFields,
}: ArrayEditorProps) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(() => (allowedArrayKeys ? null : 'Object'));
  const effectiveAllowedArrayKeys = allowedArrayKeys ?? defaultTypeKeys;
  const isTypeSelection = !allowedArrayKeys;
  const allowCommand = !!effectiveAllowedArrayKeys.length;

  return (
    <Stack spacing={0}>
      <Stack direction="row" spacing={1} alignItems="center" pb={1}>
        {effectiveAllowedArrayKeys.length > 0 && (
          <Autocomplete
            size="small"
            options={effectiveAllowedArrayKeys}
            value={selectedKey}
            onChange={(_, nextValue) => setSelectedKey(nextValue)}
            renderInput={(params) => <TextField {...params} placeholder="item type" />}
            sx={{ minWidth: 200 }}
          />
        )}
        <IconButton
          size="small"
          onClick={() => {
            if (effectiveAllowedArrayKeys.length > 0) {
              const nextKey = selectedKey ?? 'Object';
              if (isTypeSelection) {
                const nextValue =
                  nextKey === 'String'
                    ? ''
                    : nextKey === 'Number'
                    ? 0
                    : nextKey === 'Boolean'
                    ? false
                    : nextKey === 'Array'
                    ? [{}]
                    : {};
                onChange(path, [...items, nextValue]);
                return;
              }
              if (!selectedKey) {
                return;
              }
              const defaultValue =
                registry.resolveRegistration({
                  path: [...path, items.length, selectedKey],
                  node: undefined,
                  rootValue,
                })?.defaultValue ?? {};
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
      {items.map((item, index) => (
        <Stack key={`${path.join('.')}-${index}`} spacing={1}>
          {index > 0 && <Box sx={{ borderTop: '1px dashed', borderColor: 'divider', my: 1 }} />}
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <Box flex={1}>
              <EditorNode
                node={item}
                path={[...path, index]}
                onChange={onChange}
                registry={registry}
                rootValue={rootValue}
                parentKey={parentKey}
                allowCommand={allowCommand}
                allowAddFields={allowAddFields}
              />
            </Box>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};
