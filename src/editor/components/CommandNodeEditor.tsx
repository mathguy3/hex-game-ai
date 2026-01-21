import { Autocomplete, Box, Stack, TextField, Typography } from '@mui/material';
import type { EditorComponentProps } from '../types';
import { ObjectEditor } from './ObjectEditor';

type CommandNodeEditorProps = EditorComponentProps & {
  commandKey: string;
  commandValue: any;
  label?: string;
};

export const CommandNodeEditor = ({
  commandKey,
  commandValue,
  path,
  onChange,
  registry,
  rootValue,
  label,
}: CommandNodeEditorProps) => {
  const registration = registry.get(commandKey);
  const Component = registration?.component;
  const registryKeys = registry.keys();

  return (
    <Stack spacing={1} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box minWidth={140}>
          <Typography variant="subtitle2" color="text.secondary">
            {label ?? 'command'}
          </Typography>
        </Box>
        <Autocomplete
          freeSolo
          size="small"
          options={registryKeys}
          value={commandKey}
          onChange={(_, nextValue) => {
            if (!nextValue || nextValue === commandKey) {
              return;
            }
            onChange(path, { [nextValue]: commandValue });
          }}
          renderInput={(params) => <TextField {...params} />}
          sx={{ minWidth: 200 }}
        />
      </Stack>
      {Component ? (
        <Component
          node={commandValue}
          path={[...path, commandKey]}
          onChange={onChange}
          registry={registry}
          rootValue={rootValue}
          parentKey={commandKey}
        />
      ) : (
        <ObjectEditor
          objectValue={commandValue ?? {}}
          path={[...path, commandKey]}
          onChange={onChange}
          registry={registry}
          rootValue={rootValue}
          label={commandKey}
          compact
        />
      )}
    </Stack>
  );
};
