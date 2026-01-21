import { Add, Delete, Edit } from '@mui/icons-material';
import { Box, Button, Card, CardActions, CardContent, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClient } from '../../../logic/client';
import { GameDefinitionRecord } from '../../../server/games/gameManager';

export const GameDefinitionListPage = () => {
  const { client } = useClient();
  const navigate = useNavigate();
  const [definitions, setDefinitions] = useState<GameDefinitionRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDefinitions = async () => {
    const response = await client.listGameDefinitions();
    setDefinitions(response.definitions ?? []);
  };

  useEffect(() => {
    fetchDefinitions();
  }, [client]);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const response = await client.createGameDefinition();
      if (response.definition?.id) {
        navigate(`/editor/${response.definition.id}`);
        return;
      }
      await fetchDefinitions();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (definition: GameDefinitionRecord) => {
    const confirmed = window.confirm(`Delete "${definition.definition.config.name}"?`);
    if (!confirmed) {
      return;
    }
    await client.deleteGameDefinition({ id: definition.id });
    await fetchDefinitions();
  };

  return (
    <Stack spacing={3} sx={{ padding: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Game Definitions</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate} disabled={loading}>
          New Definition
        </Button>
      </Stack>
      <Stack spacing={2}>
        {definitions.map((definition) => (
          <Card key={definition.id} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="h6">{definition.definition.config.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {definition.definition.config.description}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                startIcon={<Edit />}
                onClick={() => navigate(`/editor/${definition.id}`)}
              >
                Edit
              </Button>
              <Button size="small" color="error" startIcon={<Delete />} onClick={() => handleDelete(definition)}>
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
        {definitions.length === 0 && (
          <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 2, p: 3 }}>
            <Typography color="text.secondary" align="center">
              No game definitions yet
            </Typography>
          </Box>
        )}
      </Stack>
      <Box>
        <Button variant="outlined" onClick={() => navigate('/')}>
          Back to Main Menu
        </Button>
      </Box>
    </Stack>
  );
};
