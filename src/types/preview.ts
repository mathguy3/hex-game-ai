import { InteractionType } from './interactions';

export type PreviewType = 'pathrange' | InteractionType;

export type PathRangePreview = {
  type: 'pathrange';
  color: '#00ff00';
  distance: number;
};

export type Preview =
  | PathRangePreview
  | {
      type: PreviewType;
      color: string;
    };
