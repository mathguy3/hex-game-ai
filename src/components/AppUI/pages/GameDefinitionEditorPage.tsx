import { Save } from '@mui/icons-material';
import { Box, Button, Stack, Typography } from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EditorRegistry, EditorRoot, HexMapEditor, setAtPath } from '../../../editor';
import { UI } from '../../GameUI/UI/UI';
import { UIFrame } from '../../GameUI/TableFrame';
import { useClient } from '../../../logic/client';
import { GameDefinitionRecord } from '../../../server/games/gameManager';
import { PreviewGameSessionProvider } from '../../../logic/game-controller/context/GameSessionProvider';
import { MapSelectionProvider } from '../../../logic/game-controller/context/MapSelectionProvider';
import { UIPlayerProvider } from '../../../logic/game-controller/context/UIPlayerProvider';

class PreviewErrorBoundary extends React.Component<{ resetKey: unknown; children: React.ReactNode }, { error: Error | null }> {
  state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidUpdate(prevProps: { resetKey: unknown }) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <Typography color="error">
          Preview error: {this.state.error.message}
        </Typography>
      );
    }
    return this.props.children;
  }
}

export const GameDefinitionEditorPage = () => {
  const { client } = useClient();
  const navigate = useNavigate();
  const { id } = useParams();
  const [definition, setDefinition] = useState<GameDefinitionRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [editorWidthPct, setEditorWidthPct] = useState(() => {
    const stored = window.localStorage.getItem('editorSplitPct');
    const parsed = stored ? Number(stored) : NaN;
    return Number.isFinite(parsed) ? parsed : 55;
  });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const registry = useMemo(() => {
    const next = new EditorRegistry();
    const uiKeys = ['zone', 'button', 'cardStack', 'tokenStack', 'hexMap', 'hex', 'text', 'token'];
    next.register('shared', { allowedKeys: uiKeys });
    next.register('player', { allowedKeys: uiKeys });
    next.register('zone', { defaultValue: { children: [] } });
    next.register('children', { allowedArrayKeys: uiKeys });
    next.register('button', { defaultValue: { content: '', action: '' } });
    next.register('cardStack', { defaultValue: { content: '' } });
    next.register('tokenStack', { defaultValue: { content: '' } });
    next.register('hexMap', { defaultValue: { id: 'board', hex: {} }, component: HexMapEditor });
    next.register('hex', { defaultValue: {} });
    next.register('text', { defaultValue: { content: '' } });
    next.register('token', { defaultValue: { image: '' } });
    return next;
  }, []);

  useEffect(() => {
    const fetchDefinition = async () => {
      if (!id) {
        return;
      }
      const response = await client.getGameDefinition({ id });
      if (response.definition) {
        setDefinition(response.definition);
      }
    };
    fetchDefinition();
  }, [client, id]);

  useEffect(() => {
    window.localStorage.setItem('editorSplitPct', String(editorWidthPct));
  }, [editorWidthPct]);


  const previewGameSession = useMemo(() => {
    if (!definition) {
      return null;
    }
    const definitionValue = definition.definition as any;
    const seats = definitionValue.seats ?? {};
    const seatEntries = Object.keys(seats).reduce(
      (acc, key) => ({ ...acc, [key]: { id: key, isActive: false } }),
      {} as Record<string, any>
    );
    const activeId = Object.keys(seatEntries)[0] ?? 'player1';
    if (seatEntries[activeId]) {
      seatEntries[activeId].isActive = true;
    }
    return {
      roomCode: 'preview',
      roomConfig: { isPrivate: true, seats },
      gameDefinition: definitionValue,
      gameState: {
        history: [],
        data: definitionValue.data ?? {},
        seats: seatEntries,
        activeId,
        hasStarted: true,
        activeStep: 'preview',
        activePath: '',
        isComplete: false,
      },
      localControl: { activeOptions: [] },
    } as any;
  }, [definition]);

  if (!definition) {
    return (
      <Stack spacing={2} sx={{ padding: 4 }}>
        <Typography>Loading...</Typography>
        <Button variant="outlined" onClick={() => navigate('/editor')}>
          Back to Definitions
        </Button>
      </Stack>
    );
  }

  const handleChange = (path: Array<string | number>, value: any) => {
    setDefinition((prev) => {
      if (!prev) {
        return prev;
      }
      return { ...prev, definition: setAtPath(prev.definition, path, value) };
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await client.updateGameDefinition({ id: definition.id, definition: definition.definition });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack flex={1} height="100%" spacing={3} sx={{ padding: 4, minHeight: 0 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4">{definition.definition.config.name}</Typography>
          <Typography color="text.secondary">{definition.definition.config.description}</Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={() => navigate('/editor')}>
            Back
          </Button>
          <Button variant="contained" startIcon={<Save />} onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </Stack>
      </Stack>
      <Stack
        ref={containerRef}
        minHeight={0}
        height="calc(100vh - 100px)"
        direction="row"
        spacing={0}
        alignItems="stretch"
      >
        <Box
          sx={{
            width: `${editorWidthPct}%`,
            minWidth: 300,
            pr: 2,
            overflow: 'hidden',
          }}
        >
          <EditorRoot value={definition.definition} onChange={handleChange} registry={registry} />
        </Box>
        <Box
          sx={{
            width: '8px',
            cursor: 'col-resize',
            position: 'relative',
            flexShrink: 0,
          }}
          onMouseDown={(event) => {
            event.preventDefault();
            const startX = event.clientX;
            const startPct = editorWidthPct;
            const container = containerRef.current;
            if (!container) {
              return;
            }
            const { width } = container.getBoundingClientRect();
            const handleMove = (moveEvent: MouseEvent) => {
              const delta = moveEvent.clientX - startX;
              const nextPct = Math.min(80, Math.max(20, startPct + (delta / width) * 100));
              setEditorWidthPct(nextPct);
            };
            const handleUp = () => {
              window.removeEventListener('mousemove', handleMove);
              window.removeEventListener('mouseup', handleUp);
            };
            window.addEventListener('mousemove', handleMove);
            window.addEventListener('mouseup', handleUp);
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '50%',
              width: '2px',
              transform: 'translateX(-50%)',
              bgcolor: 'divider',
            }}
          />
        </Box>
        <Box
          sx={{
            width: `${100 - editorWidthPct}%`,
            minWidth: 320,
            pl: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: 2,
            height: '75vh',
            position: 'relative'
          }}
        >
          <Typography variant="h6" gutterBottom>
            Preview
          </Typography>
          {(() => {
            const sharedModel = definition.definition.ui?.shared;
            const sharedKeys = sharedModel && typeof sharedModel === 'object' ? Object.keys(sharedModel) : [];
            if (!sharedModel || sharedKeys.length === 0) {
              return <Typography color="text.secondary">No UI model yet.</Typography>;
            }
            return previewGameSession ? (
              <PreviewGameSessionProvider gameSession={previewGameSession}>
                <MapSelectionProvider>
                  <UIPlayerProvider>
                    <PreviewErrorBoundary resetKey={sharedModel}>
                      <UIFrame
                        width={sharedModel?.zone?.styles?.width ?? 1}
                        height={sharedModel?.zone?.styles?.height ?? 1}
                      >
                        <UI {...sharedModel} />
                      </UIFrame>
                    </PreviewErrorBoundary>
                  </UIPlayerProvider>
                </MapSelectionProvider>
              </PreviewGameSessionProvider>
            ) : (
              <Typography color="text.secondary">Preview unavailable.</Typography>
            );
          })()}
        </Box>
      </Stack>
    </Stack>
  );
};
