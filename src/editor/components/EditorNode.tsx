import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import type { EditorComponentProps, LockedKeyConfig } from '../types';
import { ArrayEditor } from './ArrayEditor';
import { CommandNodeEditor } from './CommandNodeEditor';
import { ObjectEditor } from './ObjectEditor';
import { PrimitiveEditor } from './PrimitiveEditor';

const boundUiTypes = new Set(['hexMap', 'tokenStack', 'cardStack']);
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

const collectBoundUiIds = (node: any, result: Set<string>) => {
  if (!node) {
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((child) => collectBoundUiIds(child, result));
    return;
  }
  if (typeof node !== 'object') {
    return;
  }
  const keys = Object.keys(node);
  if (keys.length === 1 && boundUiTypes.has(keys[0])) {
    const id = node[keys[0]]?.id;
    if (typeof id === 'string' && id.trim().length > 0) {
      result.add(id);
    }
  }
  Object.values(node).forEach((child) => collectBoundUiIds(child, result));
};

export const EditorNode = ({
  node,
  path,
  onChange,
  registry,
  rootValue,
  parentKey,
  allowCommand,
  allowAddFields,
  boundDataItem,
}: EditorComponentProps) => {
  const [newCommandKey, setNewCommandKey] = useState('');
  const isObjectNode = typeof node === 'object' && node !== null && !Array.isArray(node);
  const objectKeys = isObjectNode ? Object.keys(node) : [];
  const boundCommandKey = objectKeys.length === 1 && boundUiTypes.has(objectKeys[0]) ? objectKeys[0] : null;
  const boundUiId = boundCommandKey ? node?.[boundCommandKey]?.id : undefined;
  const prevBoundUiIdRef = useRef<string | undefined>(boundUiId);

  useEffect(() => {
    if (!boundCommandKey || typeof boundUiId !== 'string' || boundUiId.trim().length === 0) {
      prevBoundUiIdRef.current = boundUiId;
      return;
    }
    const data = rootValue?.data ?? {};
    if (data[boundUiId] === undefined) {
      onChange(['data', boundUiId], {});
    }
    const prevId = prevBoundUiIdRef.current;
    if (prevId && prevId !== boundUiId) {
      const nextData = { ...data };
      if (nextData[boundUiId] === undefined && nextData[prevId] !== undefined) {
        nextData[boundUiId] = nextData[prevId];
      }
      delete nextData[prevId];
      onChange(['data'], nextData);
    }
    prevBoundUiIdRef.current = boundUiId;
  }, [boundCommandKey, boundUiId, onChange, rootValue]);

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
    let lockedKeys: Record<string, LockedKeyConfig> | undefined;
    if (parentKey === 'data') {
      const boundIds = new Set<string>();
      collectBoundUiIds(rootValue?.ui, boundIds);
      if (boundIds.size > 0) {
        lockedKeys = {};
        boundIds.forEach((id) => {
          lockedKeys![id] = { lockRename: true, lockType: true, lockDelete: true };
        });
      }
    }

    return (
      <ObjectEditor
        node={node}
        objectValue={node}
        path={path}
        onChange={onChange}
        registry={registry}
        rootValue={rootValue}
        label={parentKey}
        parentKey={parentKey}
        compact={parentKey !== undefined}
        allowAddFields={cascadedAllowAddFields}
        allowedKeys={registration?.allowedKeys}
        lockedKeys={lockedKeys}
        boundDataItem={boundDataItem}
      />
    );
  }

  const isBoundUiIdField =
    parentKey === 'id' &&
    path.length >= 2 &&
    boundUiTypes.has(String(path[path.length - 2])) &&
    path.includes('ui');

  return (
    <Box>
      <PrimitiveEditor
        value={node}
        path={path}
        onChange={onChange}
        registry={registry}
        rootValue={rootValue}
        node={node}
        preventEmpty={isBoundUiIdField}
        debounceMs={isBoundUiIdField ? 400 : undefined}
      />
    </Box>
  );
};
