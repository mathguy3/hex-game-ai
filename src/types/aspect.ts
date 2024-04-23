export type Aspect =
  | {
      type: 'team';
      teamId: string;
    }
  | {
      type: 'fighter';
    }
  | {
      type: 'ground';
    }
  | Record<string, any>;
