# Game Model Design Document

## Goals

- **Readability**: Game definitions should read like natural language
- **Modularity**: Reusable components for common patterns
- **Hierarchical Structure**: Define from high-level (sequence) to low-level (actions)
- **Simple Conditions**: Complex logic broken into readable `isThisTrue` predicates
- **Reusability**: Parameterized modules for common operations (targeting, filtering, etc.)

---

## Current State Analysis

### What's Working

- Sequence-based game flow (`round` → `phases` → `turns` → `actions`)
- Reference system for reusable procedures (`%playerSelectCards`)
- IF condition system for conditional logic
- Query system for spatial operations (range, distance, adjacent)

### Pain Points

1. **Complex nested conditions** - Hard to read and understand
2. **Repetitive targeting logic** - Similar patterns repeated across cards/abilities
3. **Mixed abstraction levels** - High-level flow mixed with low-level details
4. **Hard to compose** - Difficult to combine simple operations into complex behaviors

---

## Proposed Architecture

### 1. Hierarchical Definition Structure

```
Game Definition
├── Sequence (Top Level Flow)
│   ├── Round
│   │   ├── Phases (Between-turn logic)
│   │   └── Turns (Per-player logic)
│   └── Win Conditions
├── Modules (Reusable Components)
│   ├── Targeting Modules
│   ├── Filter Modules
│   ├── Action Modules
│   └── Condition Modules
└── Procedures (Named Sequences)
```

### 2. Module System

Modules are parameterized, reusable components that can be composed together. All references use the `use` syntax, and parameters are inlined when calling modules.

#### Example: Targeting Module

```typescript
// Define a reusable targeting module
modules: {
  targetGroup: {
    // The implementation - parameters are referenced via { use: { params: 'paramName' } }
    query: {
      from: [
        { range: { range: { use: { params: 'range' } }, includeSelf: { use: { params: 'includeSelf' } } } }
      ],
      filter: {
        and: [
          // Apply target type filter
          {
            if: { use: { params: 'targetEnemies' } },
            then: { character: { properties: { isEnemy: { equals: true } } } }
          },
          {
            if: { use: { params: 'targetAllies' } },
            then: { character: { properties: { isPlayer: { equals: true } } } }
          },
          // Apply custom filter if provided
          { if: { use: { params: 'filter' } }, then: { use: { params: 'filter' } } }
        ]
      }
    }
  }
}
```

#### Usage in Card Definition

```typescript
cards: {
  fireball: {
    id: 'fireball',
    name: 'Fireball',
    targeting: {
      use: 'targetGroup',
      targetEnemies: true,
      range: 3,
      includeSelf: false
    },
    effects: [
      { damage: 3, target: 'selected' }
    ]
  },
  heal: {
    id: 'heal',
    name: 'Heal',
    targeting: {
      use: 'targetGroup',
      targetAllies: true,
      range: 2,
      includeSelf: true
    },
    effects: [
      { heal: 2, target: 'selected' }
    ]
  }
}
```

### 3. Condition Predicates (Simple `isThisTrue` Phrases)

Break complex conditions into named, readable predicates. All conditions use the `use` syntax.

#### Example: Condition Modules

```typescript
modules: {
  isEnemy: {
    check: {
      character: {
        properties: {
          isEnemy: { equals: true }
        }
      }
    }
  },
  isPlayer: {
    check: {
      character: {
        properties: {
          isPlayer: { equals: true }
        }
      }
    }
  },
  isInRange: {
    check: {
      range: {
        from: { use: { params: 'from' } } ?? { use: 'subject' },
        range: { use: { params: 'range' } }
      },
      contains: 'target'
    }
  },
  hasProperty: {
    check: {
      character: {
        properties: {
          [use: { params: 'property' }]: { equals: { use: { params: 'value' } } }
        }
      }
    }
  },
  // Composable conditions
  isEnemyInRange: {
    check: {
      and: [
        { use: 'isEnemy' },
        { use: 'isInRange', range: { use: { params: 'range' } } }
      ]
    }
  }
}
```

#### Usage in Sequence

```typescript
sequence: {
  round: {
    repeat: true,
    phases: [
      {
        name: 'Player Turn',
        if: { use: 'isPlayer' },
        actions: [
          { use: 'selectCards', count: 2 },
          { use: 'playCard' }
        ]
      },
      {
        name: 'Enemy Turn',
        if: { use: 'isEnemy' },
        actions: [
          { use: 'enemyAI' }
        ]
      }
    ]
  }
}
```

### 4. Action Modules

Reusable action patterns. Parameters are inlined when calling, and referenced via `{ use: { params: 'paramName' } }` within the module.

```typescript
modules: {
  selectCards: {
    steps: [
      {
        announce: {
          to: 'active',
          message: { use: { params: 'count' } } + ' cards'
        }
      },
      {
        option: {
          card: {
            select: {
              count: { use: { params: 'count' } },
              from: { use: { params: 'from' } } ?? 'hand',
              to: { use: { params: 'to' } } ?? 'selectedCards'
            }
          }
        }
      }
    ]
  },
  moveCard: {
    steps: [
      {
        action: {
          move: {
            card: {
              from: { use: { params: 'from' } },
              to: { use: { params: 'to' } }
            }
          }
        }
      }
    ]
  },
  dealDamage: {
    steps: [
      {
        action: {
          modify: {
            target: { use: { params: 'target' } } ?? 'selected',
            health: { subtract: { use: { params: 'amount' } } }
          }
        }
      }
    ]
  }
}

// Usage
actions: [
  { use: 'selectCards', count: 2, from: 'hand' },
  { use: 'dealDamage', amount: 3, target: 'selected' }
]
```

### 5. Phase Modules (Between-Turn Logic)

```typescript
modules: {
  cardSelection: {
    name: 'Card Selection Phase',
    allPlayers: true,
    async: true,
    steps: [
      { use: 'selectCards', count: 2 },
      { use: 'setInitiative' }
    ]
  },
  initiativeOrder: {
    name: 'Initiative Order',
    steps: [
      {
        sort: {
          players: 'all',
          by: 'properties.initiative',
          order: 'asc'
        }
      }
    ]
  },
  cleanup: {
    name: 'Cleanup Phase',
    steps: [
      { use: 'discardPlayedCards' },
      { use: 'resetInitiative' }
    ]
  }
}

// Usage in sequence
phases: [
  { use: 'cardSelection' },
  { use: 'initiativeOrder' }
]
```

### 6. Group Selection Syntax

When referencing items from groups (like cards, modules, etc.), use object-based syntax:

```typescript
// Reference a card
{
  use: {
    cards: 'basicCard';
  }
}

// Reference a module from a group
{
  use: {
    targeting: 'targetGroup';
  }
}

// Reference a condition
{
  use: {
    conditions: 'isPlayer';
  }
}

// Can also use direct string if no grouping needed
{
  use: 'isPlayer';
}
```

---

## Complete Example: Simplified Gloomhaven

```typescript
export const gloomhaven = {
  config: {
    name: 'Gloomhaven',
    description: 'A strategic board game',
  },

  // Define reusable modules - flat structure, no nested grouping required
  modules: {
    // Targeting modules
    enemiesInRange: {
      query: {
        from: [{ range: { range: { use: { params: 'range' } } } }],
        filter: {
          character: {
            properties: { isEnemy: { equals: true } },
          },
        },
      },
    },
    alliesInRange: {
      query: {
        from: [{ range: { range: { use: { params: 'range' } } } }],
        filter: {
          character: {
            properties: { isPlayer: { equals: true } },
          },
        },
      },
    },

    // Condition modules
    isPlayer: {
      check: {
        character: {
          properties: { isPlayer: { equals: true } },
        },
      },
    },
    isEnemy: {
      check: {
        character: {
          properties: { isEnemy: { equals: true } },
        },
      },
    },
    noEnemiesRemain: {
      check: {
        spaces: {
          filter: {
            character: {
              properties: { isEnemy: { equals: true } },
            },
          },
          then: { length: { equals: 0 } },
        },
      },
    },

    // Action modules
    selectCards: {
      steps: [
        {
          announce: {
            to: 'active',
            message: 'Select ' + { use: { params: 'count' } } + ' cards',
          },
        },
        {
          option: {
            card: {
              select: {
                count: { use: { params: 'count' } },
                from: 'hand',
              },
            },
          },
        },
      ],
    },
    setInitiative: {
      steps: [
        {
          action: {
            context: {
              key: { context: { activeId: '$String' } },
              value: {
                properties: {
                  initiative: {
                    equals: {
                      context: {
                        key: { activeId: '$String' },
                        value: {
                          selectedCards: {
                            min: { properties: { initiative: '$Number' } } },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },

    // Phase modules
    cardSelection: {
      name: 'Card Selection',
      allPlayers: true,
      async: true,
      steps: [
        { use: 'selectCards', count: 2 },
        { use: 'setInitiative' }
      ],
    },
    playerTurn: {
      name: 'Player Turn',
      if: { use: 'isPlayer' },
      steps: [{ use: 'playCard' }],
    },
  },

  definitions: {
    seats: {
      player1: { isOpen: true, isAi: false },
      player2: { isOpen: true, isAi: false },
      enemy1: { isConfigurable: false, isOpen: false, isAi: true },
    },

    cards: {
      basic: {
        id: 'basic',
        name: 'Basic',
        targeting: {
          use: 'enemiesInRange',
          range: 2,
        },
        effects: [{ damage: 2, target: 'selected' }],
      },
    },

    // High-level sequence definition
    sequence: {
      round: {
        repeat: true,
        breakIf: { use: 'noEnemiesRemain' },
        phases: [
          { use: 'cardSelection' },
          { use: 'playerTurn' }
        ],
      },
    },

    winCondition: {
      use: 'noEnemiesRemain',
    },
  },
};
```

---

## Benefits of This Approach

### 1. **Readability**

- High-level flow is immediately clear
- Conditions read like natural language: `if: { use: 'isPlayer' }`
- Complex logic is hidden in named modules

### 2. **Modularity**

- Reusable components reduce duplication
- Easy to swap implementations
- Test modules independently

### 3. **Composability**

- Simple modules combine into complex behaviors
- Parameters allow customization without duplication
- Can override defaults when needed

### 4. **Maintainability**

- Change targeting logic in one place, affects all cards
- Add new conditions without touching existing code
- Clear separation of concerns

### 5. **Extensibility**

- Easy to add new modules
- Can create module libraries for common game patterns
- Supports game-specific customizations

---

## Implementation Strategy

### Phase 1: Module System

1. Create module registry/loader
2. Implement parameter system
3. Add module resolution in sequence execution

### Phase 2: Condition Predicates

1. Refactor existing conditions into predicate modules
2. Create condition composition system
3. Update sequence definitions to use predicates

### Phase 3: Action Modules

1. Extract common action patterns
2. Create action module system
3. Migrate existing actions to modules

### Phase 4: Targeting System

1. Create targeting module framework
2. Implement parameterized targeting
3. Update card definitions to use targeting modules

---

## Advanced Patterns

### Pattern 1: Conditional Module Selection

```typescript
targeting: {
  use: {
    if: { use: 'isPlayer' },
    then: 'alliesInRange',
    else: 'enemiesInRange'
  },
  range: 3
}
```

### Pattern 2: Composed Conditions

```typescript
modules: {
  isEnemyInMeleeRange: {
    check: {
      and: [{ use: 'isEnemy' }, { use: 'isInRange', range: 1 }, { use: 'hasLineOfSight' }];
    }
  }
}
```

### Pattern 3: Parameterized Phases

```typescript
modules: {
  cardSelection: {
    name: 'Card Selection',
    steps: [
      { use: 'selectCards', count: { use: { params: 'count' } } ?? 2 }
    ]
  }
}

// Usage
sequence: {
  round: {
    phases: [
      { use: 'cardSelection', count: 3 } // Pass parameter inline
    ]
  }
}
```

### Pattern 4: Group-Based References

When you want to organize modules into groups but still use simple syntax:

```typescript
modules: {
  targeting: {
    enemiesInRange: { /* ... */ },
    alliesInRange: { /* ... */ }
  },
  conditions: {
    isPlayer: { /* ... */ },
    isEnemy: { /* ... */ }
  }
}

// Usage - can use group syntax or direct if unambiguous
targeting: {
  use: { targeting: 'enemiesInRange' },
  range: 3
}

// Or if no conflict, direct reference works
if: { use: 'isPlayer' }
```

---

## Syntax Summary

### Core Principles

1. **Everything uses `use`**: Modules, conditions, cards, values - all use the `use` syntax
2. **Parameters are inlined**: When calling a module, parameters are passed directly as properties
3. **Parameter references**: Within modules, use `{ use: { params: 'paramName' } }` to reference parameters
4. **Group selection**: Use object syntax `{ use: { group: 'item' } }` for grouped items (cards, modules, etc.)
5. **No explicit type definitions**: Rely on TypeScript types and runtime validation instead of verbose syntax
6. **Flat structure preferred**: Less hierarchy, simpler organization

### Examples

```typescript
// Simple module reference
{ use: 'isPlayer' }

// Group-based reference
{ use: { cards: 'basicCard' } }
{ use: { targeting: 'targetGroup' } }

// Module with parameters
{ use: 'targetGroup', targetEnemies: true, range: 3 }

// Parameter reference within module
{ use: { params: 'range' } }

// Conditional
if: { use: 'isPlayer' }

// Composed
and: [
  { use: 'isEnemy' },
  { use: 'isInRange', range: 2 }
]
```

## Questions to Consider

1. **Module Resolution**: How do we handle module name conflicts? Use group syntax when needed, direct when unambiguous?
2. **Parameter Validation**: When should parameters be validated? Runtime or definition time? TypeScript types?
3. **Module Caching**: Should modules be evaluated once and cached, or re-evaluated each time?
4. **Type Safety**: How can we provide TypeScript types for modules and their parameters?
5. **Debugging**: How do we trace execution through modules for debugging?
6. **Performance**: Are there performance concerns with deep module nesting?
7. **Reserved Keywords**: How do we handle conflicts between parameter names and reserved words like `use`? (Answer: Type system and validation)

---

## Next Steps

1. **Prototype**: Build a small proof-of-concept with 2-3 modules
2. **Migration Path**: Plan how to migrate existing game definitions
3. **Documentation**: Create examples for common patterns
4. **Tooling**: Consider IDE support for module autocomplete/validation
