export const getProcedure = (ifItem: any, procedures: any) => {
  if (typeof ifItem === 'string' && ifItem.startsWith('%')) {
    console.log('REPLACEMENT -------- ', ifItem);
    const procedureName = ifItem.slice(1);
    ifItem = procedures?.[procedureName];
    if (!ifItem) {
      throw new Error('No procedure found for ' + procedureName);
    }
    console.log('REPLACEMENT -------- ', ifItem);
  }
  return ifItem;
};
