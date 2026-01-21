import { Add, Delete } from '@mui/icons-material';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { EditorNode } from './EditorNode';
import type { EditorComponentProps } from '../types';
import { removeAtPath } from '../utils';

type ArrayEditorProps = EditorComponentProps & {
  items: any[];
  label?: string;
  allowCommand?: boolean;
};

const commandListKeys = new Set(['actions', 'phases', 'turns', 'steps', 'options', 'interactions']);

export const ArrayEditor = ({ items, path, onChange, registry, rootValue, label, parentKey }: ArrayEditorProps) => {
  const isCommandList = parentKey ? commandListKeys.has(parentKey) : false;

  return (
    <Stack spacing={1} sx={{ borderLeft: '2px solid', borderColor: 'divider', pl: 2 }}>
      {label && (
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
      )}
      {items.map((item, index) => (
        <Stack key={`${path.join('.')}-${index}`} direction="row" spacing={1} alignItems="flex-start">
          <Box flex={1}>
            <EditorNode
              node={item}
              path={[...path, index]}
              onChange={onChange}
              registry={registry}
              rootValue={rootValue}
              parentKey={parentKey}
              allowCommand={isCommandList}
            />
          </Box>
          <IconButton
            size="small"
            onClick={() => onChange([], removeAtPath(rootValue, [...path, index]))}
            aria-label="remove"
          >
            <Delete fontSize="small" />
          </IconButton>
        </Stack>
      ))}
      <Box>
        <IconButton
          size="small"
          onClick={() => onChange(path, [...items, {}])}
          aria-label="add"
          sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}
        >
          <Add fontSize="small" />
        </IconButton>
      </Box>
    </Stack>
  );
};
