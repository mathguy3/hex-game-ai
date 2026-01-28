import { Add } from '@mui/icons-material';
import { Box } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

type AddFieldButtonProps = {
  hasSuggestions: boolean;
  suggestions: string[];
  onAddField: (nextKey: string) => void;
  onAddSuggestion: (suggestion: string) => void;
  borderColor?: string;
};

export const AddFieldButton = ({
  hasSuggestions,
  suggestions,
  onAddField,
  onAddSuggestion,
  borderColor,
}: AddFieldButtonProps) => {
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasSuggestions) {
      setSuggestionsOpen(false);
    }
  }, [hasSuggestions]);

  useEffect(() => {
    if (!suggestionsOpen) {
      return;
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (!suggestionsRef.current) {
        return;
      }
      if (!suggestionsRef.current.contains(event.target as Node)) {
        setSuggestionsOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [suggestionsOpen]);

  return (
    <Box
      ref={suggestionsRef}
      sx={{
        position: 'relative',
        width: '100%',
      }}
    >
      <Box
        role="button"
        aria-label="add"
        onClick={() => {
          if (suggestionsOpen) {
            return;
          }
          onAddField('fieldname');
        }}
        sx={{
          position: 'relative',
          height: suggestionsOpen ? 40 : 11,
          transition: 'height 160ms ease, opacity 160ms ease',
          width: '100%',
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderTopColor: borderColor ?? 'divider',
          borderTopWidth: '2px',
          borderRadius: '0 0 12px 12px',
          cursor: 'pointer',
          zIndex: 2,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '100%',
            left: '25%',
            transform: 'translateX(-50%)',
            width: 34,
            height: 12,
            border: '1px solid',
            borderColor: 'divider',
            borderTop: 'none',
            borderRadius: '0 0 10px 10px',
            bgcolor: 'background.paper',
          },
        }}
      >
        <Add
          fontSize="small"
          sx={{
            position: 'absolute',
            bottom: -10,
            left: '25%',
            transform: 'translateX(-50%)',
          }}
        />
        {hasSuggestions && (
          <Box
            role="button"
            aria-label="suggestions"
            onClick={(event) => {
              event.stopPropagation();
              setSuggestionsOpen(!suggestionsOpen);
            }}
            sx={{
              position: 'absolute',
              bottom: -13,
              right: 8,
              height: '12px',
              minWidth: 24,
              px: 0.75,
              border: '1px solid',
              borderTop: 'none',
              borderColor: 'divider',
              borderRadius: '0 0 8px 8px',
              bgcolor: 'background.paper',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'text.secondary',
              zIndex: 2,
            }}
          >
            <Box fontSize={24} sx={{ position: 'relative', top: -11 }}>
              ...
            </Box>
          </Box>
        )}
        {hasSuggestions && (
          <Box
            sx={{
              height: '100%',
              opacity: suggestionsOpen ? 1 : 0,
              pointerEvents: suggestionsOpen ? 'auto' : 'none',
            }}
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, px: 1, pt: 1 }}>
              {suggestions.map((suggestion) => (
                <Box
                  key={suggestion}
                  role="button"
                  onClick={() => {
                    onAddSuggestion(suggestion);
                    setSuggestionsOpen(false);
                  }}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 999,
                    px: 1,
                    py: 0.25,
                    fontSize: 11,
                    color: 'text.secondary',
                    cursor: 'pointer',
                    bgcolor: 'background.paper',
                  }}
                >
                  {suggestion}
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
