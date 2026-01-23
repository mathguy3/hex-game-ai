import { Box, Stack } from '@mui/material';
import { EditorNode } from './components/EditorNode';
import type { EditorRegistry } from './registry';
import type { EditorChange } from './types';

type EditorRootProps = {
  value: any;
  onChange: EditorChange;
  registry: EditorRegistry;
};

export const EditorRoot = ({ value, onChange, registry }: EditorRootProps) => {
  return (
    <Stack flex={1} spacing={2} overflow="auto" height="100%" >
      <Box pb={4}>
        <EditorNode node={value} path={[]} onChange={onChange} registry={registry} rootValue={value} />
      </Box>
    </Stack>
  );
};
