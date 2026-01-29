import type React from 'react';
import type { EditorRegistry } from './registry';

export type EditorPath = Array<string | number>;

export type EditorChange = (path: EditorPath, value: any) => void;

export type TypeRuleContext = {
  path: EditorPath;
  node: any;
  rootValue: any;
};

export type MatcherContext = TypeRuleContext & {
  fieldname?: string;
  isChildOf: (parentFieldname: string) => boolean;
  isDecendantOf: (ancestorFieldname: string) => boolean;
};

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
  lockConfig?: LockedKeyConfig;
  boundDataItem?: boolean;
  nodeType?: string;
  isModified?: boolean;
};

export type EditorRegistration = {
  label?: string;
  component?: React.ComponentType<EditorComponentProps>;
  defaultValue?: any;
  allowedKeys?: string[];
  allowedArrayKeys?: string[];
  suggestions?: string[];
  display?: 'inline' | 'block';
  type?: string;
  color?: string;
  fieldnameEditable?: boolean;
  allowDelete?: boolean;
  allowAddFields?: boolean;
  singleKeyOnly?: boolean;
  suggestionsOnly?: boolean;
  prototypeGroups?: Array<'token' | 'card' | 'hex' | 'other'>;
};

export type PrototypeSelection = {
  group: 'token' | 'card' | 'hex' | 'other';
  key: string;
};
