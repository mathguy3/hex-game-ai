import { Save } from '@mui/icons-material';
import { Box, Button, Stack, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EditorRegistry, EditorRoot, HexMapEditor, setAtPath } from '../../../editor';
import { UI } from '../../GameUI/UI/UI';
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
    <Stack height="100%" spacing={3} sx={{ padding: 4, minHeight: 0 }}>
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
      <Stack minHeight={0} height="calc(100vh - 100px)" direction="row" spacing={3} alignItems="stretch">
        <EditorRoot value={definition.definition} onChange={handleChange} registry={registry} />
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: 2,
            height: '75vh',
            width: '750px',
            position: 'relative'
          }}
        >
          <Typography variant="h6" gutterBottom>
            Preview
          </Typography>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', right: 0, bottom: 0 }}>
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
                        <UI {...sharedModel} />
                      </PreviewErrorBoundary>
                    </UIPlayerProvider>
                  </MapSelectionProvider>
                </PreviewGameSessionProvider>
              ) : (
                <Typography color="text.secondary">Preview unavailable.</Typography>
              );
            })()}</Box>
        </Box>
      </Stack>
    </Stack>
  );
};
