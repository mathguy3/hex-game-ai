import { Close, ExpandLess, ExpandMore } from '@mui/icons-material';
import { Autocomplete, Box, IconButton, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import type { EditorComponentProps } from '../types';
import { ObjectEditor } from './ObjectEditor';

type CommandNodeEditorProps = EditorComponentProps & {
  commandKey: string;
  commandValue: any;
  label?: string;
  parentKey?: string;
};

export const CommandNodeEditor = ({
  commandKey,
  commandValue,
  path,
  onChange,
  registry,
  rootValue,
  label,
  parentKey,
  allowAddFields,
}: CommandNodeEditorProps) => {
  const registration = registry.get(commandKey);
  const parentRegistration = parentKey ? registry.get(parentKey) : undefined;
  const Component = registration?.component;
  const registryKeys = parentRegistration?.allowedKeys ?? registry.keys();
  const [collapsed, setCollapsed] = useState(false);
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
    <Stack spacing={1} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1 }}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
        {label && (
          <Box minWidth={140}>
            <Typography variant="subtitle2" color="text.secondary">
              {label}
            </Typography>
          </Box>
        )}
        <Stack direction="row" spacing={1} alignItems="center" flex={1}>
          <Autocomplete
            freeSolo
            size="small"
            options={registryKeys}
            value={commandKey}
            onChange={(_, nextValue) => {
              if (!nextValue || nextValue === commandKey) {
                return;
              }
              const defaultValue = registry.get(nextValue)?.defaultValue ?? {};
              onChange(path, { [nextValue]: structuredClone(defaultValue) });
            }}
            renderInput={(params) => <TextField {...params} />}
            sx={{ minWidth: 200 }}
          />
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <IconButton
            size="small"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? 'expand' : 'collapse'}
          >
            {collapsed ? <ExpandMore fontSize="small" /> : <ExpandLess fontSize="small" />}
          </IconButton>
          {allowAddFields && (
            <IconButton
              size="small"
              onClick={() => {
                if (shouldConfirmDelete(commandValue)) {
                  if (!window.confirm(`Delete "${commandKey}"? This cannot be undone.`)) {
                    return;
                  }
                }
                onChange(path, {});
              }}
              aria-label="delete"
              sx={{ p: 0 }}
            >
              <Close fontSize="inherit" sx={{ fontSize: 14 }} />
            </IconButton>
          )}
        </Stack>
      </Stack>
      {!collapsed && (
        <>
          {Component ? (
            <Component
              node={commandValue}
              path={[...path, commandKey]}
              onChange={onChange}
              registry={registry}
              rootValue={rootValue}
              parentKey={commandKey}
              allowAddFields={allowAddFields}
            />
          ) : (
            <ObjectEditor
              node={commandValue ?? {}}
              objectValue={commandValue ?? {}}
              path={[...path, commandKey]}
              onChange={onChange}
              registry={registry}
              rootValue={rootValue}
              label={commandKey}
              compact
              allowAddFields={false}
            />
          )}
        </>
      )}
    </Stack>
  );
};
