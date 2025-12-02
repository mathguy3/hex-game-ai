export const getProcedure = (ifItem: any, references: any) => {
  if (typeof ifItem === 'string' && ifItem.startsWith('%')) {
    //console.log('REPLACEMENT -------- ', ifItem);
    const procedureName = ifItem.slice(1);
    ifItem = references?.[procedureName];
    if (!ifItem) {
      console.log(references);
      throw new Error('No procedure found for ' + procedureName);
    }
    console.log('REPLACEMENT -------- ', ifItem);
  }
  return ifItem;
};
