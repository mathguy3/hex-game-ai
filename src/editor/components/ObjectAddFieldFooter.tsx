import { Box } from '@mui/material';
import { useMemo } from 'react';
import type { EditorComponentProps } from '../types';
import { AddFieldButton } from './node';

type ObjectAddFieldFooterProps = Pick<
  EditorComponentProps,
  'path' | 'onChange' | 'registry' | 'rootValue' | 'nodeType'
> & {
  objectValue: Record<string, any>;
  borderColor?: string;
};

export const ObjectAddFieldFooter = ({
  objectValue,
  path,
  onChange,
  registry,
  rootValue,
  nodeType,
  borderColor,
}: ObjectAddFieldFooterProps) => {
  const registration = useMemo(
    () => registry.resolveRegistration({ path, node: objectValue, rootValue }),
    [path, objectValue, rootValue, registry]
  );
  const typeSuggestions = nodeType ? registry.getTypeSuggestions(nodeType) : [];
  const mergedSuggestions = Array.from(new Set([...(registration?.suggestions ?? []), ...(typeSuggestions ?? [])]));
  const availableSuggestions = mergedSuggestions.filter((suggestion) => objectValue[suggestion] === undefined);
  const hasSuggestions = availableSuggestions.length > 0;

  const resolveDefaultValue = (key: string) =>
    registry.resolveRegistration({
      path: [...path, key],
      node: objectValue[key],
      rootValue,
    })?.defaultValue ?? {};

  return (
    <Box sx={{ width: '100%' }}>
      <AddFieldButton
        hasSuggestions={hasSuggestions}
        suggestions={availableSuggestions}
        borderColor={borderColor}
        onAddField={(baseKey) => {
          let nextKey = baseKey;
          let counter = 2;
          while (objectValue[nextKey] !== undefined) {
            nextKey = `${baseKey}-${counter}`;
            counter += 1;
          }
          onChange(path, { ...objectValue, [nextKey]: {} });
        }}
        onAddSuggestion={(suggestion) => {
          const defaultValue = resolveDefaultValue(suggestion);
          onChange(path, {
            ...objectValue,
            [suggestion]: structuredClone(defaultValue),
          });
        }}
      />
    </Box>
  );
};
