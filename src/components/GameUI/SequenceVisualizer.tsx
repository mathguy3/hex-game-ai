import React, { useState, useMemo } from 'react';
import { Box, Typography, Collapse, IconButton } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { SequencerContext } from '../../logic/if/if-engine-3/operations/types';
import { GameDefinition } from '../../types/game';
import { useGameSession } from '../../logic/game-controller/context/GameSessionProvider';

interface SequenceNode {
  key: string;
  label: string;
  operationType?: string;
  children?: SequenceNode[];
  sequenceItem?: any;
  index?: number;
  isCurrentPath?: boolean;
  isActive?: boolean;
  hasNext?: boolean;
  nextOperation?: string;
  metadata?: {
    roundNumber?: number;
    playerId?: string;
    turnNumber?: number;
    phaseName?: string;
    actionIndex?: number;
  };
}

interface SequenceVisualizerProps {
  gameDefinition: GameDefinition;
  sequenceState?: Partial<SequencerContext>;
  gameState?: any;
  currentPath?: string;
  nextOperation?: string;
}

const getOperationLabel = (operationType: string, item: any, index?: number): string => {
  switch (operationType) {
    case 'round':
      return `Round ${index !== undefined ? index + 1 : ''}`;
    case 'turn':
      return `Turn ${index !== undefined ? index + 1 : ''}`;
    case 'action':
      return `Action ${index !== undefined ? index + 1 : ''}`;
    case 'phase':
      return item?.name || `Phase ${index !== undefined ? index + 1 : ''}`;
    case 'interact':
      return 'Interact';
    case 'card':
      return item?.name || 'Card';
    case 'space':
      return 'Space';
    case 'selectCards':
      return 'Select Cards';
    case 'playCard':
      return 'Play Card';
    case 'announce':
      return 'Announce';
    case 'ackAnnounce':
      return 'Acknowledge';
    case 'start':
      return 'Start';
    case 'foreach':
      return `For Each ${index !== undefined ? `(${index + 1})` : ''}`;
    default:
      return operationType || 'Unknown';
  }
};

const buildSequenceTree = (
  sequenceItem: any,
  path: string,
  currentPath: string,
  nextOperation?: string,
  metadata: any = {},
  depth: number = 0
): SequenceNode[] => {
  const nodes: SequenceNode[] = [];

  if (!sequenceItem || typeof sequenceItem !== 'object') {
    return nodes;
  }

  // Handle different sequence structures
  const operationTypes = [
    'round',
    'turn',
    'action',
    'phase',
    'interact',
    'card',
    'space',
    'selectCards',
    'playCard',
    'announce',
    'ackAnnounce',
    'start',
    'foreach',
    'option',
  ];

  for (const opType of operationTypes) {
    if (sequenceItem[opType]) {
      const item = sequenceItem[opType];
      const newPath = path ? `${path}.${opType}` : opType;
      const isCurrentPath = currentPath === newPath || currentPath.startsWith(newPath + '.');
      const isActive = currentPath === newPath;

      // Extract metadata from localBag if available
      const nodeMetadata = {
        ...metadata,
        ...(opType === 'round' && metadata.roundNumber !== undefined ? { roundNumber: metadata.roundNumber } : {}),
        ...(opType === 'turn' && metadata.playerId
          ? { playerId: metadata.playerId, turnNumber: metadata.turnNumber }
          : {}),
      };

      // Handle arrays (phases, actions, turns)
      if (Array.isArray(item)) {
        item.forEach((subItem: any, index: number) => {
          const subPath = `${newPath}[${index}]`;
          const subIsCurrentPath = currentPath === subPath || currentPath.startsWith(subPath + '.');
          const subIsActive = currentPath === subPath;

          // Determine what's inside this item
          const subOperationTypes = Object.keys(subItem).filter((k) => operationTypes.includes(k));

          if (subOperationTypes.length > 0) {
            subOperationTypes.forEach((subOpType) => {
              const subNode: SequenceNode = {
                key: `${newPath}[${index}].${subOpType}`,
                label: getOperationLabel(subOpType, subItem[subOpType], index),
                operationType: subOpType,
                isCurrentPath: subIsCurrentPath || currentPath.startsWith(`${subPath}.${subOpType}`),
                isActive: subIsActive && currentPath === `${subPath}.${subOpType}`,
                hasNext: nextOperation === subOpType,
                nextOperation: nextOperation === subOpType ? nextOperation : undefined,
                sequenceItem: subItem[subOpType],
                index,
                metadata: {
                  ...nodeMetadata,
                  ...(subOpType === 'phase' ? { phaseName: subItem[subOpType]?.name } : {}),
                  ...(subOpType === 'action' ? { actionIndex: index } : {}),
                },
              };

              // Recursively build children
              const children = buildSequenceTree(
                subItem[subOpType],
                `${subPath}.${subOpType}`,
                currentPath,
                nextOperation,
                subNode.metadata,
                depth + 1
              );

              if (children.length > 0) {
                subNode.children = children;
              }

              nodes.push(subNode);
            });
          } else {
            // It's a procedure reference (like '%playerSelectCards')
            const procNode: SequenceNode = {
              key: subPath,
              label: typeof subItem === 'string' ? subItem : `Item ${index + 1}`,
              operationType: opType,
              isCurrentPath: subIsCurrentPath,
              isActive: subIsActive,
              index,
              sequenceItem: subItem,
              metadata: nodeMetadata,
            };
            nodes.push(procNode);
          }
        });
      } else if (typeof item === 'object') {
        // Single object, not an array
        const node: SequenceNode = {
          key: newPath,
          label: getOperationLabel(opType, item),
          operationType: opType,
          isCurrentPath,
          isActive,
          hasNext: nextOperation === opType,
          nextOperation: nextOperation === opType ? nextOperation : undefined,
          sequenceItem: item,
          metadata: nodeMetadata,
        };

        // Recursively build children
        const children = buildSequenceTree(item, newPath, currentPath, nextOperation, node.metadata, depth + 1);

        if (children.length > 0) {
          node.children = children;
        }

        nodes.push(node);
      }
    }
  }

  // Handle actions array directly
  if (sequenceItem.actions && Array.isArray(sequenceItem.actions)) {
    sequenceItem.actions.forEach((action: any, index: number) => {
      const actionPath = path ? `${path}.action[${index}]` : `action[${index}]`;
      const actionNodes = buildSequenceTree(
        action,
        actionPath,
        currentPath,
        nextOperation,
        { ...metadata, actionIndex: index },
        depth + 1
      );
      nodes.push(...actionNodes);
    });
  }

  // Handle phases array directly
  if (sequenceItem.phases && Array.isArray(sequenceItem.phases)) {
    sequenceItem.phases.forEach((phase: any, index: number) => {
      const phasePath = path ? `${path}.phase[${index}]` : `phase[${index}]`;
      const phaseNodes = buildSequenceTree(
        phase,
        phasePath,
        currentPath,
        nextOperation,
        { ...metadata, phaseIndex: index },
        depth + 1
      );
      nodes.push(...phaseNodes);
    });
  }

  // Handle turns array directly
  if (sequenceItem.turns && Array.isArray(sequenceItem.turns)) {
    sequenceItem.turns.forEach((turn: any, index: number) => {
      const turnPath = path ? `${path}.turn[${index}]` : `turn[${index}]`;
      const turnNodes = buildSequenceTree(
        turn,
        turnPath,
        currentPath,
        nextOperation,
        { ...metadata, turnIndex: index },
        depth + 1
      );
      nodes.push(...turnNodes);
    });
  }

  return nodes;
};

const SequenceNodeComponent: React.FC<{
  node: SequenceNode;
  depth: number;
  defaultExpanded?: boolean;
}> = ({ node, depth, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded || node.isCurrentPath || node.isActive);

  const hasChildren = node.children && node.children.length > 0;
  const indent = depth * 16;

  // Determine background colors
  const bgColor = node.isActive
    ? '#4caf50' // Green for active
    : node.isCurrentPath
    ? '#ffeb3b' // Yellow for current path
    : 'transparent';

  const borderColor = node.isActive ? '#2e7d32' : node.isCurrentPath ? '#fbc02d' : '#e0e0e0';

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '4px 8px',
          marginLeft: `${indent}px`,
          backgroundColor: bgColor,
          border: `1px solid ${borderColor}`,
          borderRadius: '4px',
          marginBottom: '2px',
          minHeight: '32px',
          cursor: hasChildren ? 'pointer' : 'default',
          '&:hover': {
            backgroundColor: node.isActive ? '#66bb6a' : node.isCurrentPath ? '#fff59d' : '#f5f5f5',
          },
        }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren && (
          <IconButton size="small" sx={{ padding: '4px', marginRight: '4px' }}>
            {expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
          </IconButton>
        )}
        {!hasChildren && <Box sx={{ width: '32px' }} />}
        <Typography
          variant="body2"
          sx={{
            fontWeight: node.isActive ? 'bold' : node.isCurrentPath ? '600' : 'normal',
            flex: 1,
          }}
        >
          {node.label}
          {node.metadata?.roundNumber && ` (Round ${node.metadata.roundNumber})`}
          {node.metadata?.playerId && ` (${node.metadata.playerId})`}
          {node.metadata?.turnNumber && ` - Turn ${node.metadata.turnNumber}`}
          {node.hasNext && (
            <Typography component="span" sx={{ color: '#1976d2', marginLeft: '8px', fontSize: '0.75em' }}>
              → {node.nextOperation}
            </Typography>
          )}
        </Typography>
        {node.isActive && (
          <Typography
            variant="caption"
            sx={{
              backgroundColor: '#2e7d32',
              color: 'white',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '0.7em',
              marginLeft: '8px',
            }}
          >
            ACTIVE
          </Typography>
        )}
      </Box>
      {hasChildren && (
        <Collapse in={expanded}>
          <Box sx={{ marginLeft: `${indent + 8}px` }}>
            {node.children?.map((child, index) => (
              <SequenceNodeComponent
                key={child.key || index}
                node={child}
                depth={depth + 1}
                defaultExpanded={child.isCurrentPath || child.isActive}
              />
            ))}
          </Box>
        </Collapse>
      )}
    </Box>
  );
};

export const SequenceVisualizer: React.FC<SequenceVisualizerProps> = ({
  gameDefinition,
  sequenceState,
  gameState,
  currentPath: propCurrentPath,
  nextOperation: propNextOperation,
}) => {
  const tree = useMemo(() => {
    const sequence = gameDefinition.definitions.sequence;
    const currentPath = propCurrentPath || sequenceState?.path || gameState?.activePath || gameState?.activeStep || '';
    const nextOperation = propNextOperation || sequenceState?.next?.operationType;

    // Extract metadata from sequenceState or gameState
    const metadata: any = {};
    if (sequenceState?.localBag) {
      if (sequenceState.localBag.roundNumber !== undefined) {
        metadata.roundNumber = sequenceState.localBag.roundNumber;
      }
      if (sequenceState.localBag.orderIndex !== undefined && sequenceState.localBag.order) {
        const playerId = sequenceState.localBag.order[sequenceState.localBag.orderIndex];
        metadata.playerId = playerId;
        metadata.turnNumber = sequenceState.localBag.orderIndex + 1;
      }
    }
    // Try to extract player info from gameState
    if (gameState?.activeId) {
      metadata.playerId = gameState.activeId;
    }

    // Build the tree starting from the root sequence
    const rootNodes = buildSequenceTree(sequence, '', currentPath, nextOperation, metadata, 0);

    // If we have a 'start' operation, add it as the root
    if (sequenceState?.operationType === 'start' || currentPath === 'start' || currentPath.startsWith('start')) {
      return [
        {
          key: 'start',
          label: 'Start',
          operationType: 'start',
          isCurrentPath: currentPath === 'start' || currentPath.startsWith('start'),
          isActive: currentPath === 'start',
          hasNext: nextOperation !== undefined,
          nextOperation,
          children: rootNodes,
          metadata: {},
        },
      ];
    }

    return rootNodes;
  }, [gameDefinition, sequenceState, gameState]);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '80px',
        right: '16px',
        width: '400px',
        maxHeight: '80vh',
        overflowY: 'auto',
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: 1000,
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: '16px', fontWeight: 'bold' }}>
        Sequence Visualizer
      </Typography>
      <Typography variant="caption" sx={{ display: 'block', marginBottom: '8px', color: '#666' }}>
        Current Path:{' '}
        {propCurrentPath || sequenceState?.path || gameState?.activePath || gameState?.activeStep || 'none'}
      </Typography>
      {(propNextOperation || sequenceState?.next) && (
        <Typography variant="caption" sx={{ display: 'block', marginBottom: '16px', color: '#666' }}>
          Next: {propNextOperation || sequenceState?.next?.operationType}
        </Typography>
      )}
      <Box>
        {tree.map((node, index) => (
          <SequenceNodeComponent key={node.key || index} node={node} depth={0} defaultExpanded={true} />
        ))}
      </Box>
    </Box>
  );
};

// Wrapper component that uses game session context
export const SequenceVisualizerWrapper: React.FC = () => {
  const { gameSession } = useGameSession();

  if (!gameSession) return null;

  return (
    <SequenceVisualizer
      gameDefinition={gameSession.gameDefinition}
      gameState={gameSession.gameState}
      currentPath={gameSession.gameState.activePath || gameSession.gameState.activeStep}
    />
  );
};
