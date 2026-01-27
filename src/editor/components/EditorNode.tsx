import { Close } from '@mui/icons-material';
import { Box, Button, IconButton, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import type { EditorComponentProps, LockedKeyConfig } from '../types';
import { ArrayEditor } from './ArrayEditor';
import { ObjectEditor } from './ObjectEditor';
import { PrimitiveEditor } from './PrimitiveEditor';
import { BlockNodeRow, ExpandButton, InlineNodeRow, NodeHeader, NodeTitle } from './node';
import { getAtPath } from '../utils';

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

const collectBoundUiIndex = (node: any, path: Array<string | number>, result: Map<string, string>) => {
  if (!node) {
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((child, index) => collectBoundUiIndex(child, [...path, index], result));
    return;
  }
  if (typeof node !== 'object') {
    return;
  }
  const keys = Object.keys(node);
  if (keys.length === 1 && boundUiTypes.has(keys[0])) {
    const id = node[keys[0]]?.id;
    if (typeof id === 'string' && id.trim().length > 0) {
      result.set(JSON.stringify(path), id);
    }
  }
  Object.entries(node).forEach(([key, child]) => collectBoundUiIndex(child, [...path, key], result));
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
  lockConfig,
}: EditorComponentProps) => {
  const [newCommandKey, setNewCommandKey] = useState('');
  const nodeType = registry.resolveType({ path, node, rootValue });
  const registration = registry.resolveRegistration({ path, node, rootValue });
  const boundIndexRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    if (path.length !== 0) {
      return;
    }
    const nextIndex = new Map<string, string>();
    collectBoundUiIndex(rootValue?.ui, ['ui'], nextIndex);
    const prevIndex = boundIndexRef.current;
    const data = rootValue?.data ?? {};
    let nextData = data;
    let didChange = false;
    nextIndex.forEach((id, key) => {
      const prevId = prevIndex.get(key);
      if (prevId && prevId !== id) {
        if (nextData === data) {
          nextData = { ...data };
        }
        if (nextData[id] === undefined && nextData[prevId] !== undefined) {
          nextData[id] = nextData[prevId];
        }
        if (nextData[prevId] !== undefined) {
          delete nextData[prevId];
        }
        didChange = true;
      }
      if (nextData[id] === undefined) {
        if (nextData === data) {
          nextData = { ...data };
        }
        nextData[id] = {};
        didChange = true;
      }
    });
    boundIndexRef.current = nextIndex;
    if (didChange) {
      onChange(['data'], nextData);
    }
  }, [onChange, path.length, rootValue]);

  const isNullish = node === null || node === undefined;
  const displayMode = registration?.display
    ?? (isNullish || nodeType === 'coordinates' || typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean'
      ? 'inline'
      : 'block');
  const isInline = displayMode === 'inline';
  const parentPath = path.slice(0, -1);
  const titleLabel = typeof parentKey === 'string' ? parentKey : undefined;
  const allowRename = !!allowAddFields
    && typeof parentKey === 'string'
    && !lockConfig?.lockRename
    && (registration?.fieldnameEditable ?? true);
  const allowDelete = !!allowAddFields
    && typeof parentKey === 'string'
    && !lockConfig?.lockDelete
    && (registration?.allowDelete ?? true);
  const [collapsed, setCollapsed] = useState(
    boundDataItem || (path.length === 1 && path[0] === 'seats')
  );

  useEffect(() => {
    if (boundDataItem) {
      setCollapsed(true);
    }
  }, [boundDataItem]);

  const commitRename = (nextValue: string) => {
    if (!allowRename || typeof parentKey !== 'string') {
      return;
    }
    const trimmed = nextValue.trim();
    if (!trimmed || trimmed === parentKey) {
      return;
    }
    const parentValue = getAtPath(rootValue, parentPath);
    if (!parentValue || typeof parentValue !== 'object' || Array.isArray(parentValue)) {
      return;
    }
    if (parentValue[trimmed] !== undefined) {
      return;
    }
    const { [parentKey]: removed, ...rest } = parentValue;
    onChange(parentPath, { ...rest, [trimmed]: removed });
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

  const handleDelete = () => {
    if (!allowDelete || typeof parentKey !== 'string') {
      return;
    }
    if (shouldConfirmDelete(node)) {
      if (!window.confirm(`Delete "${parentKey}"? This cannot be undone.`)) {
        return;
      }
    }
    const parentValue = getAtPath(rootValue, parentPath);
    if (!parentValue || typeof parentValue !== 'object' || Array.isArray(parentValue)) {
      return;
    }
    const { [parentKey]: removed, ...rest } = parentValue;
    onChange(parentPath, rest);
  };

  const title = titleLabel ? (
    <NodeTitle
      label={titleLabel}
      editable={allowRename}
      locked={!!lockConfig}
      mode={isInline ? 'inline' : 'block'}
      onCommit={commitRename}
    />
  ) : undefined;
  const typeLabel = nodeType;
  const deleteButton = allowDelete ? (
    <IconButton size="small" onClick={handleDelete} aria-label="delete" sx={{ p: 0 }}>
      <Close fontSize="inherit" sx={{ fontSize: 14 }} />
    </IconButton>
  ) : undefined;

  if (Array.isArray(node)) {
    const editor = (
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
    if (isInline) {
      return (
        <InlineNodeRow
          title={title}
          typeLabel={typeLabel}
          content={editor}
          deleteButton={deleteButton}
        />
      );
    }
    return (
      <BlockNodeRow
        header={(
          <NodeHeader
            title={title}
            typeLabel={nodeType}
            collapseButton={<ExpandButton expanded={!collapsed} onToggle={() => setCollapsed((prev) => !prev)} />}
            deleteButton={deleteButton}
          />
        )}
        collapsed={collapsed}
      >
        {editor}
      </BlockNodeRow>
    );
  }

  if (typeof node === 'object') {
    const directRegistration = registration;
    if (directRegistration?.component) {
      const Component = directRegistration.component;
      const editor = (
        <Component
          node={node}
          path={path}
          onChange={onChange}
          registry={registry}
          rootValue={rootValue}
          parentKey={parentKey}
          allowAddFields={allowAddFields}
          nodeType={nodeType}
        />
      );
      if (isInline) {
        return (
          <InlineNodeRow
            title={title}
            typeLabel={typeLabel}
            content={editor}
            deleteButton={deleteButton}
          />
        );
      }
      return (
        <BlockNodeRow
          header={(
            <NodeHeader
              title={title}
              typeLabel={nodeType}
              collapseButton={<ExpandButton expanded={!collapsed} onToggle={() => setCollapsed((prev) => !prev)} />}
              deleteButton={deleteButton}
            />
          )}
          collapsed={collapsed}
        >
          {editor}
        </BlockNodeRow>
      );
    }
    const keys = Object.keys(node);
    const showCommandBuilder = allowCommand && keys.length === 0;
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
    const editor = showCommandBuilder ? (
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
    ) : (
      <ObjectEditor
        node={node}
        objectValue={node}
        path={path}
        onChange={onChange}
        registry={registry}
        rootValue={rootValue}
        parentKey={parentKey}
        allowAddFields={cascadedAllowAddFields}
        allowedKeys={registration?.allowedKeys}
        lockedKeys={lockedKeys}
        boundDataItem={boundDataItem}
        nodeType={nodeType}
      />
    );
    if (isInline) {
      return (
        <InlineNodeRow
          title={title}
          typeLabel={typeLabel}
          content={editor}
          deleteButton={deleteButton}
        />
      );
    }
    return (
      <BlockNodeRow
        header={(
          <NodeHeader
            title={title}
            typeLabel={nodeType}
            collapseButton={<ExpandButton expanded={!collapsed} onToggle={() => setCollapsed((prev) => !prev)} />}
            deleteButton={deleteButton}
          />
        )}
        collapsed={collapsed}
      >
        {editor}
      </BlockNodeRow>
    );
  }

  const isBoundUiIdField =
    parentKey === 'id' &&
    path.length >= 2 &&
    boundUiTypes.has(String(path[path.length - 2])) &&
    path.includes('ui');

  const primitiveEditor = node === null || node === undefined ? (
    <Button
      size="small"
      variant="outlined"
      onClick={() => onChange(path, structuredClone(registration?.defaultValue ?? {}))}
      sx={{ textTransform: 'none' }}
    >
      Set value
    </Button>
  ) : (
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
  );

  const primitiveContent = <Box>{primitiveEditor}</Box>;
  if (isInline) {
    return (
      <InlineNodeRow
        title={title}
        typeLabel={typeLabel}
        content={primitiveContent}
        deleteButton={deleteButton}
      />
    );
  }
  return (
    <BlockNodeRow
      header={(
        <NodeHeader
          title={title}
          typeLabel={nodeType}
          collapseButton={<ExpandButton expanded={!collapsed} onToggle={() => setCollapsed((prev) => !prev)} />}
          deleteButton={deleteButton}
        />
      )}
      collapsed={collapsed}
    >
      {primitiveContent}
    </BlockNodeRow>
  );
};
