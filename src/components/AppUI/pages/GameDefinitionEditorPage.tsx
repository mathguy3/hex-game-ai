import { Save } from '@mui/icons-material';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EditorRegistry, EditorRoot, setAtPath } from '../../../editor';
import { useClient } from '../../../logic/client';
import { GameDefinitionRecord } from '../../../server/games/gameManager';

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
    next.register('button', { defaultValue: { content: '', action: '' } });
    next.register('cardStack', { defaultValue: { content: '' } });
    next.register('tokenStack', { defaultValue: { content: '' } });
    next.register('hexMap', { defaultValue: { hex: {} } });
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
    <Stack spacing={3} sx={{ padding: 4 }}>
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
      <EditorRoot value={definition.definition} onChange={handleChange} registry={registry} />
    </Stack>
  );
};
