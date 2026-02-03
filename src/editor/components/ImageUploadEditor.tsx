import { Upload } from '@mui/icons-material';
import { Box, Button, Stack, TextField } from '@mui/material';
import { useRef } from 'react';
import type { EditorComponentProps } from '../types';

const ACCEPT = '.svg,.png,.jpg,.jpeg,image/svg+xml,image/png,image/jpeg';

const isDataUrl = (value: unknown): value is string =>
  typeof value === 'string' && value.startsWith('data:');

const canPreview = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0 && isDataUrl(value);

export const ImageUploadEditor = ({ node, path, onChange }: EditorComponentProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const value = typeof node === 'string' ? node : '';

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isSvg = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');
    const reader = new FileReader();

    if (isSvg) {
      reader.onload = () => {
        const svgText = reader.result as string;
        const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
        onChange(path, dataUrl);
      };
      reader.readAsText(file);
    } else {
      reader.onload = () => {
        onChange(path, reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    event.target.value = '';
  };

  const showPreview = canPreview(value);

  return (
    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ maxHeight: 96 }}>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      <Button
        size="small"
        variant="outlined"
        startIcon={<Upload />}
        onClick={() => inputRef.current?.click()}
      >
        Upload
      </Button>
      <TextField
        size="small"
        placeholder="Or enter path / URL"
        value={value}
        onChange={(event) => onChange(path, event.target.value)}
        sx={{ flex: 1, minWidth: 120, '& .MuiInputBase-input': { py: 0.5 } }}
      />
      {showPreview && (
        <Box
          component="img"
          src={value}
          alt="Preview"
          sx={{
            width: 40,
            height: 40,
            objectFit: 'contain',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            flexShrink: 0,
          }}
          onError={() => {}}
        />
      )}
    </Stack>
  );
};
