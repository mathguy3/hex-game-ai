import type React from 'react';
import type { EditorRegistry } from './registry';

export type EditorPath = Array<string | number>;

export type EditorChange = (path: EditorPath, value: any) => void;

export type LockedKeyConfig = {
  lockRename?: boolean;
  lockType?: boolean;
  lockDelete?: boolean;
};

export type EditorComponentProps = {
  node: any;
  path: EditorPath;
  onChange: EditorChange;
  registry: EditorRegistry;
  rootValue: any;
  parentKey?: string;
  allowCommand?: boolean;
  allowAddFields?: boolean;
  lockedKeys?: Record<string, LockedKeyConfig>;
  boundDataItem?: boolean;
};

export type EditorRegistration = {
  label?: string;
  component?: React.ComponentType<EditorComponentProps>;
  defaultValue?: any;
  allowedKeys?: string[];
  allowedArrayKeys?: string[];
  suggestions?: string[];
};
