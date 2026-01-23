import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import type { EditorComponentProps } from '../types';
import { ArrayEditor } from './ArrayEditor';
import { CommandNodeEditor } from './CommandNodeEditor';
import { ObjectEditor } from './ObjectEditor';
import { PrimitiveEditor } from './PrimitiveEditor';

const recordContainerKeys = new Set([
  'seats',
  'cards',
  'tokens',
  'hexes',
  'references',
  'functions',
  'data',
  'other',
  'sequence',
]);

export const EditorNode = ({
  node,
  path,
  onChange,
  registry,
  rootValue,
  parentKey,
  allowCommand,
  allowAddFields,
}: EditorComponentProps) => {
  const [newCommandKey, setNewCommandKey] = useState('');

  if (node === null || node === undefined) {
    return (
      <Button
        size="small"
        variant="outlined"
        onClick={() => onChange(path, {})}
        sx={{ textTransform: 'none' }}
      >
        Set value
      </Button>
    );
  }

  if (Array.isArray(node)) {
    const registration = parentKey ? registry.get(parentKey) : undefined;
    return (
      <ArrayEditor
        node={node}
        items={node}
        path={path}
        onChange={onChange}
        registry={registry}
        rootValue={rootValue}
        parentKey={parentKey}
        allowedArrayKeys={registration?.allowedArrayKeys}
        allowAddFields={allowAddFields}
      />
    );
  }

  if (typeof node === 'object') {
    const directRegistration = parentKey ? registry.get(parentKey) : undefined;
    if (directRegistration?.component) {
      const Component = directRegistration.component;
      return (
        <Component
          node={node}
          path={path}
          onChange={onChange}
          registry={registry}
          rootValue={rootValue}
          parentKey={parentKey}
          allowAddFields={allowAddFields}
        />
      );
    }
    const keys = Object.keys(node);
    const parentRegistration = parentKey ? registry.get(parentKey) : undefined;
    const isCommandNode =
      keys.length === 1 &&
      (allowCommand || registry.get(keys[0]) !== undefined || parentRegistration?.allowedKeys !== undefined);

    if (isCommandNode) {
      const commandKey = keys[0];
      const label = parentRegistration?.allowedKeys ? undefined : parentKey;
      return (
        <CommandNodeEditor
          node={node}
          commandKey={commandKey}
          commandValue={node[commandKey]}
          path={path}
          onChange={onChange}
          registry={registry}
          rootValue={rootValue}
          label={label}
          parentKey={parentKey}
          allowAddFields={allowAddFields}
        />
      );
    }

    if (allowCommand && keys.length === 0) {
      return (
        <Stack spacing={1} sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 2, p: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Choose a command
          </Typography>
          <TextField
            size="small"
            placeholder="command key"
            value={newCommandKey}
            onChange={(event) => setNewCommandKey(event.target.value)}
          />
          <Button
            size="small"
            variant="contained"
            onClick={() => {
              if (!newCommandKey) {
                return;
              }
              onChange(path, { [newCommandKey]: {} });
              setNewCommandKey('');
            }}
          >
            Add
          </Button>
        </Stack>
      );
    }

    const registration = parentKey ? registry.get(parentKey) : undefined;
    const cascadedAllowAddFields = allowAddFields || (parentKey ? recordContainerKeys.has(parentKey) : false);

    return (
      <ObjectEditor
        node={node}
        objectValue={node}
        path={path}
        onChange={onChange}
        registry={registry}
        rootValue={rootValue}
        label={parentKey}
        compact={parentKey !== undefined}
        allowAddFields={cascadedAllowAddFields}
        allowedKeys={registration?.allowedKeys}
      />
    );
  }

  return (
    <Box>
      <PrimitiveEditor value={node} path={path} onChange={onChange} registry={registry} rootValue={rootValue} node={node} />
    </Box>
  );
};
