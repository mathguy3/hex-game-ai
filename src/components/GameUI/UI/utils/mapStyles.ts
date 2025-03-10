export const mapStyles = (styles: any, doEval: (value: any) => any) => {
  return Object.fromEntries(
    Object.entries(styles).map(([key, value]) => {
      return [key, doEval(value)];
    })
  );
};
