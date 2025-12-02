export const nextSequenceOperation = (ifItem: any) => {
  const operationType = Object.keys(ifItem).filter((key) => key !== 'if')[0];
  return operationType;
};
