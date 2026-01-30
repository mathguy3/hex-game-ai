import { Close } from '@mui/icons-material';
import { Box, Button, IconButton, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import type { EditorComponentProps, LockedKeyConfig, PrototypeSelection } from '../types';
import { ArrayEditor } from './ArrayEditor';
import { ObjectEditor } from './ObjectEditor';
import { PrimitiveEditor } from './PrimitiveEditor';
import { ObjectAddFieldFooter } from './ObjectAddFieldFooter';
import { BlockNodeRow, ExpandButton, InlineNodeRow, NodeHeader, NodeTitle } from './node';
import { deepEqual, getAtPath } from '../utils';
import type { EditorRegistry } from '../registry';

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

const prototypeGroupToDefinitionsKey: Record<string, string> = {
  token: 'tokens',
  card: 'cards',
  hex: 'hexes',
  other: 'other',
};

const prototypeSnapshotsByRegistry = new WeakMap<EditorRegistry, Map<string, any>>();

const getPrototypeSnapshotMap = (registry: EditorRegistry) => {
  const existing = prototypeSnapshotsByRegistry.get(registry);
  if (existing) {
    return existing;
  }
  const next = new Map<string, any>();
  prototypeSnapshotsByRegistry.set(registry, next);
  return next;
};

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
  isModified,
}: EditorComponentProps) => {
  const [newCommandKey, setNewCommandKey] = useState('');
  const nodeType = registry.resolveType({ path, node, rootValue });
  const registration = registry.resolveRegistration({ path, node, rootValue });
  const typeColor = nodeType ? registry.getTypeColor(nodeType) : undefined;
  const basicTypeColor =
    typeof node === 'string'
      ? '#228B22'
      : node && typeof node === 'object' && !Array.isArray(node)
      ? '#4b5563'
      : undefined;
  const borderColor = registration?.color ?? typeColor ?? basicTypeColor;
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
  const displayMode =
    registration?.display ??
    (isNullish ||
    nodeType === 'coordinates' ||
    typeof node === 'string' ||
    typeof node === 'number' ||
    typeof node === 'boolean'
      ? 'inline'
      : 'block');
  const isInline = displayMode === 'inline';
  const parentPath = path.slice(0, -1);
  const isFieldNode = typeof path[path.length - 1] === 'string';
  const titleLabel = isFieldNode && typeof parentKey === 'string' ? parentKey : undefined;
  const allowRename =
    !!allowAddFields &&
    isFieldNode &&
    typeof parentKey === 'string' &&
    !lockConfig?.lockRename &&
    (registration?.fieldnameEditable ?? true);
  const allowDelete =
    !!allowAddFields &&
    isFieldNode &&
    typeof parentKey === 'string' &&
    !lockConfig?.lockDelete &&
    (registration?.allowDelete ?? true);
  const [collapsed, setCollapsed] = useState(boundDataItem || (path.length === 1 && path[0] === 'seats'));
  const highlightColor = isModified ? 'warning.main' : undefined;

  const prototypeGroups = registration?.prototypeGroups;
  const pathKey = JSON.stringify(path);
  const prototypeLinks = rootValue?.meta?.prototypeLinks as Record<string, PrototypeSelection> | undefined;
  const prototypeSelection = prototypeLinks?.[pathKey];
  const nodeTypeGroup = nodeType?.includes('token')
    ? 'token'
    : nodeType?.includes('card')
    ? 'card'
    : nodeType?.includes('hex')
    ? 'hex'
    : nodeType?.includes('other')
    ? 'other'
    : undefined;
  const resolvedPrototypeGroup = prototypeGroups?.length
    ? prototypeSelection?.group && prototypeGroups.includes(prototypeSelection.group)
      ? prototypeSelection.group
      : nodeTypeGroup && prototypeGroups.includes(nodeTypeGroup)
      ? nodeTypeGroup
      : prototypeGroups[0]
    : undefined;
  const definitionGroupKey = resolvedPrototypeGroup
    ? prototypeGroupToDefinitionsKey[resolvedPrototypeGroup]
    : undefined;
  const definitionGroup = definitionGroupKey ? rootValue?.definitions?.[definitionGroupKey] : undefined;
  const definitionOptions = definitionGroup ? Object.keys(definitionGroup) : [];
  const selectedDefinitionKey =
    prototypeSelection?.group === resolvedPrototypeGroup ? prototypeSelection?.key ?? '' : '';
  const definitionValue =
    resolvedPrototypeGroup && selectedDefinitionKey && definitionGroup
      ? definitionGroup[selectedDefinitionKey]
      : undefined;

  useEffect(() => {
    if (boundDataItem) {
      setCollapsed(true);
    }
  }, [boundDataItem]);

  useEffect(() => {
    if (!prototypeGroups || !resolvedPrototypeGroup || !definitionValue) {
      if (prototypeGroups) {
        const snapshotMap = getPrototypeSnapshotMap(registry);
        snapshotMap.delete(pathKey);
      }
      return;
    }
    if (
      !node ||
      typeof node !== 'object' ||
      Array.isArray(node) ||
      typeof definitionValue !== 'object' ||
      Array.isArray(definitionValue)
    ) {
      return;
    }
    const snapshotMap = getPrototypeSnapshotMap(registry);
    const hasSnapshot = snapshotMap.has(pathKey);
    const previousSnapshot = hasSnapshot ? snapshotMap.get(pathKey) : undefined;
    let nextValue = node;
    let didChange = false;
    if (previousSnapshot) {
      Object.keys(previousSnapshot).forEach((key) => {
        if (definitionValue[key] === undefined && nextValue[key] !== undefined) {
          if (nextValue === node) {
            nextValue = { ...node };
          }
          delete nextValue[key];
          didChange = true;
        }
      });
    }
    Object.entries(definitionValue).forEach(([key, value]) => {
      const shouldApply = !hasSnapshot
        ? !deepEqual(nextValue[key], value)
        : deepEqual(nextValue[key], previousSnapshot?.[key]) && !deepEqual(nextValue[key], value);
      if (shouldApply) {
        if (nextValue === node) {
          nextValue = { ...node };
        }
        nextValue[key] = structuredClone(value);
        didChange = true;
      }
    });
    snapshotMap.set(pathKey, structuredClone(definitionValue));
    if (didChange) {
      onChange(path, nextValue);
    }
  }, [definitionValue, node, onChange, path, pathKey, prototypeGroups, registry, resolvedPrototypeGroup]);

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
  const handlePrototypeChange = (nextKey: string) => {
    if (!prototypeGroups || !resolvedPrototypeGroup) {
      return;
    }
    const nextMeta = { ...(rootValue?.meta ?? {}) } as Record<string, any>;
    const nextLinks = { ...(nextMeta.prototypeLinks ?? {}) } as Record<string, PrototypeSelection>;
    if (!nextKey) {
      delete nextLinks[pathKey];
    } else {
      nextLinks[pathKey] = { group: resolvedPrototypeGroup, key: nextKey };
    }
    nextMeta.prototypeLinks = nextLinks;
    onChange(['meta'], nextMeta);
  };
  const dataTypeValue =
    !nodeType && node !== null && node !== undefined
      ? typeof node === 'string'
        ? 'String'
        : typeof node === 'number'
        ? 'Number'
        : typeof node === 'boolean'
        ? 'Boolean'
        : Array.isArray(node)
        ? 'Array'
        : typeof node === 'object' && !Array.isArray(node)
        ? 'Object'
        : undefined
      : undefined;
  const allowDataTypeSelection = registration?.allowDataTypeSelection ?? true;
  const showDataTypeSelector = !!dataTypeValue && allowDataTypeSelection;
  const handleDataTypeChange = (nextType: string) => {
    if (!showDataTypeSelector) {
      return;
    }
    if (nextType === 'Object') {
      if (!node || typeof node !== 'object' || Array.isArray(node)) {
        onChange(path, {});
      }
      return;
    }
    if (nextType === 'Array') {
      if (!Array.isArray(node)) {
        onChange(path, [{ item: {} }]);
      }
      return;
    }
    if (nextType === 'String') {
      onChange(path, '');
      return;
    }
    if (nextType === 'Number') {
      onChange(path, 0);
      return;
    }
    if (nextType === 'Boolean') {
      onChange(path, false);
    }
  };
  const dataTypeSelector = showDataTypeSelector ? (
    <Select
      size="small"
      value={dataTypeValue}
      onChange={(event) => handleDataTypeChange(String(event.target.value))}
      sx={{ minWidth: 90, height: '31px' }}
    >
      <MenuItem value="Object">Object</MenuItem>
      <MenuItem value="Array">Array</MenuItem>
      <MenuItem value="String">String</MenuItem>
      <MenuItem value="Number">Number</MenuItem>
      <MenuItem value="Boolean">Boolean</MenuItem>
    </Select>
  ) : undefined;
  const prototypeSelector =
    prototypeGroups && resolvedPrototypeGroup ? (
      <Select
        size="small"
        value={selectedDefinitionKey}
        displayEmpty
        onChange={(event) => handlePrototypeChange(String(event.target.value))}
        sx={{ minWidth: 140, height: '31px' }}
      >
        <MenuItem value="">select definition</MenuItem>
        {definitionOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    ) : undefined;
  const headerTypeLabel =
    prototypeSelector || dataTypeSelector ? (
      <Stack direction="row" spacing={1} alignItems="center">
        {nodeType && (
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 24 }}>
            {nodeType}
          </Typography>
        )}
        {prototypeSelector}
        {dataTypeSelector}
      </Stack>
    ) : (
      nodeType
    );
  const inlineTypeLabel = typeof headerTypeLabel === 'string' ? headerTypeLabel : undefined;
  const inlineTypeControl = isInline ? dataTypeSelector : undefined;
  const deleteButton = allowDelete ? (
    <IconButton size="small" onClick={handleDelete} aria-label="delete" sx={{ p: 0 }}>
      <Close fontSize="inherit" sx={{ fontSize: 14 }} />
    </IconButton>
  ) : undefined;
  const wrapInline = (content: JSX.Element) => {
    if (!isFieldNode) {
      return content;
    }
    return (
      <InlineNodeRow
        title={title}
        typeLabel={inlineTypeLabel}
        typeControl={inlineTypeControl}
        content={content}
        deleteButton={deleteButton}
        highlightColor={highlightColor}
      />
    );
  };
  const wrapBlock = (content: JSX.Element, footer?: JSX.Element, footerSpacing?: number) => {
    if (!isFieldNode) {
      return content;
    }
    return (
      <BlockNodeRow
        header={
          <NodeHeader
            title={title}
            typeLabel={headerTypeLabel}
            collapseButton={<ExpandButton expanded={!collapsed} onToggle={() => setCollapsed((prev) => !prev)} />}
            deleteButton={deleteButton}
            borderColor={borderColor}
            highlightColor={highlightColor}
          />
        }
        collapsed={collapsed}
        borderColor={borderColor}
        footerSpacing={footerSpacing}
        footer={footer}
        highlightColor={highlightColor}
      >
        {content}
      </BlockNodeRow>
    );
  };

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
    return isInline ? wrapInline(editor) : wrapBlock(editor);
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
      return isInline ? wrapInline(editor) : wrapBlock(editor);
    }
    const keys = Object.keys(node);
    const showCommandBuilder = false;
    const cascadedAllowAddFields = allowAddFields || (parentKey ? recordContainerKeys.has(parentKey) : false);
    const allowAddFieldsForNode =
      (registration?.allowAddFields ?? cascadedAllowAddFields) && !(registration?.singleKeyOnly && keys.length > 0);
    const modifiedKeys =
      definitionValue &&
      node &&
      typeof node === 'object' &&
      !Array.isArray(node) &&
      typeof definitionValue === 'object' &&
      !Array.isArray(definitionValue)
        ? new Set(
            Object.entries(definitionValue)
              .filter(([key, value]) => !deepEqual((node as Record<string, any>)[key], value))
              .map(([key]) => key)
          )
        : undefined;
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
    const footer = allowAddFieldsForNode ? (
      <ObjectAddFieldFooter
        objectValue={node}
        path={path}
        onChange={onChange}
        registry={registry}
        rootValue={rootValue}
        nodeType={nodeType}
        borderColor={borderColor}
        suggestionsOnly={registration?.suggestionsOnly}
      />
    ) : undefined;
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
        modifiedKeys={modifiedKeys}
      />
    );
    return isInline ? wrapInline(editor) : wrapBlock(editor, footer, allowAddFieldsForNode ? 18 : undefined);
  }

  const isBoundUiIdField =
    parentKey === 'id' && path.length >= 2 && boundUiTypes.has(String(path[path.length - 2])) && path.includes('ui');

  const primitiveEditor =
    node === null || node === undefined ? (
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
  return isInline ? wrapInline(primitiveContent) : wrapBlock(primitiveContent);
};
