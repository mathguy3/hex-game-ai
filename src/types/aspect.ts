export type Aspect =
  | {
      type: string;
    }
  | {
      type: 'team';
      teamId: string;
    };
