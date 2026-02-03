import { useMemo } from 'react';
import { CoordinatesEditor, EditorRegistry, HexMapEditor, ImageUploadEditor } from '../../../editor';

const collectHexMapIds = (node: any, result: Set<string>) => {
  if (!node) {
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((child) => collectHexMapIds(child, result));
    return;
  }
  if (typeof node !== 'object') {
    return;
  }
  const keys = Object.keys(node);
  if (keys.length === 1 && keys[0] === 'hexMap') {
    const id = node.hexMap?.id;
    if (typeof id === 'string' && id.trim().length > 0) {
      result.add(id);
    }
  }
  Object.values(node).forEach((child) => collectHexMapIds(child, result));
};

export const useGameDefinitionEditorRegistry = () => {
  return useMemo(() => {
    const next = new EditorRegistry();
    const uiKeys = ['zone', 'button', 'cardStack', 'tokenStack', 'hexMap', 'hex', 'text', 'token'];
    const uiColor = '#0ea5e9';
    const sequenceKeys = ['round', 'turn'];
    const sequenceColor = '#7c3aed';

    next.register(
      ({ path, rootValue }) => {
        if (!rootValue || path.length !== 3 || path[0] !== 'data') {
          return false;
        }
        const hexMapIds = new Set<string>();
        collectHexMapIds(rootValue.ui, hexMapIds);
        return hexMapIds.has(String(path[1]));
      },
      { type: 'hex', suggestions: [], color: '#2563eb' }
    );
    next.register(({ path, isChildOf }) => path[0] === 'definitions' && isChildOf('cards'), {
      type: 'cardDefinition',
      color: '#c026d3',
    });
    next.register(({ path, isChildOf }) => path[0] === 'definitions' && isChildOf('tokens'), {
      type: 'tokenDefinition',
      color: '#ea580c',
    });
    next.register(({ path, isChildOf }) => path[0] === 'definitions' && isChildOf('hexes'), {
      type: 'hexDefinition',
      color: '#0d9488',
    });
    next.register(
      ({ fieldname, isDecendantOf }) =>
        fieldname === 'image' &&
        isDecendantOf('definitions') &&
        (isDecendantOf('cards') || isDecendantOf('tokens')),
      { component: ImageUploadEditor, defaultValue: '', allowDataTypeSelection: false, display: 'inline' }
    );
    next.register(
      ({ path, fieldname, isChildOf }) =>
        (path.length === 1 && fieldname === 'sequence') ||
        (path[0] === 'definitions' &&
          ['cards', 'tokens', 'hexes'].includes(String(path[1])) &&
          isChildOf('actions')),
      { type: 'sequence', suggestions: sequenceKeys, color: sequenceColor }
    );
    next.register(({ fieldname }) => fieldname === 'shared', { allowedKeys: uiKeys, color: uiColor });
    next.register(({ fieldname }) => fieldname === 'player', { allowedKeys: uiKeys, color: uiColor });
    next.register(({ fieldname }) => fieldname === 'zone', { defaultValue: { children: [] }, color: uiColor });
    next.register(({ fieldname }) => fieldname === 'children', { allowedArrayKeys: uiKeys, color: uiColor });
    next.register(({ fieldname }) => fieldname === 'button', {
      defaultValue: { content: '', action: '' },
      color: uiColor,
    });
    next.register(({ fieldname }) => fieldname === 'cardStack', { defaultValue: { content: '' }, color: uiColor });
    next.register(({ fieldname }) => fieldname === 'tokenStack', { defaultValue: { content: '' }, color: uiColor });
    next.register(({ fieldname }) => fieldname === 'hexMap', {
      defaultValue: { id: 'board', hex: {} },
      component: HexMapEditor,
      color: uiColor,
    });
    next.register(({ fieldname, isDecendantOf }) => isDecendantOf('ui') && fieldname === 'hex', {
      defaultValue: {},
      color: uiColor,
      suggestions: ['contains'],
    });
    next.register(({ fieldname }) => fieldname === 'contains', {
      suggestions: ['token', 'card'],
      singleKeyOnly: true,
      suggestionsOnly: true,
    });
    next.register(({ fieldname, isDecendantOf }) => isDecendantOf('contains') && fieldname === 'token', {});
    next.register(({ fieldname, isDecendantOf }) => isDecendantOf('data') && fieldname === 'token', {
      prototypeGroups: ['token'],
      color: '#86efac',
      allowDataTypeSelection: false,
    });
    next.register(({ fieldname, isDecendantOf }) => isDecendantOf('data') && fieldname === 'card', {
      prototypeGroups: ['card'],
    });
    next.register(({ fieldname, isDecendantOf }) => isDecendantOf('data') && fieldname === 'hex', {
      prototypeGroups: ['hex'],
    });
    next.register(({ node, isDecendantOf }) => isDecendantOf('data') && node?.type === 'hex', {
      prototypeGroups: ['hex'],
    });
    next.register(({ fieldname, isDecendantOf }) => isDecendantOf('ui') && fieldname === 'text', {
      defaultValue: { content: '' },
      color: uiColor,
    });
    next.register(({ fieldname, isDecendantOf }) => isDecendantOf('ui') && fieldname === 'token', {
      defaultValue: { image: '' },
      color: uiColor,
    });
    next.register(({ fieldname }) => fieldname === 'coordinates', {
      component: CoordinatesEditor,
      display: 'inline',
      type: 'coordinates',
      color: '#0284c7',
    });
    next.register(({ fieldname }) => fieldname === 'round', {
      defaultValue: { repeat: true, phases: [] },
      color: sequenceColor,
    });
    next.register(({ fieldname }) => fieldname === 'turn', {
      defaultValue: {
        actions: [],
      },
      color: sequenceColor,
    });
    next.register(({ fieldname }) => fieldname === 'phases', { allowedArrayKeys: sequenceKeys, color: sequenceColor });
    next.register(({ fieldname }) => fieldname === 'actions', {
      allowedArrayKeys: ['move', 'draw', 'play', 'discard', 'endTurn'],
    });
    next.register(({ fieldname }) => fieldname === 'play', {
      suggestions: ['hex', 'card', 'token'],
      singleKeyOnly: true,
      suggestionsOnly: true,
    });
    next.register(({ fieldname, isChildOf }) => isChildOf('play') && fieldname === 'token', {
      suggestions: ['where', 'tokenAction', 'action'],
      suggestionsOnly: true,
    });
    next.register(({ fieldname }) => fieldname === 'where', {
      type: 'selector',
      color: '#ef4444',
      singleKeyOnly: true,
    });
    next.register(({ isDecendantOf }) => isDecendantOf('where'), {
      singleKeyOnly: true,
    });
    return next;
  }, []);
};
