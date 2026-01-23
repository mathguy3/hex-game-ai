import { Stack } from '@mui/material';
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
    <Stack flex={1} spacing={2} overflow="auto" minWidth={600} pb={"100px"}>
      <EditorNode node={value} path={[]} onChange={onChange} registry={registry} rootValue={value} />
    </Stack>
  );
};
