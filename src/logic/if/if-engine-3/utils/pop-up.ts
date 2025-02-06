export const popUp = <T extends { previousContext?: T; nextOperation?: string; bag: any }>(context: T) => {
  return {
    ...context.previousContext,
    nextOperation: undefined,
    bag: context.bag,
  };
};
