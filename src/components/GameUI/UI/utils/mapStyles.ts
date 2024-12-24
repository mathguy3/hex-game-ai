import { UIModel } from '../UI';

export const mapStyles = (styles: UIModel['styles'], doEval: (value: any) => any) => {
  return Object.fromEntries(
    Object.entries(styles).map(([key, value]) => {
      return [key, doEval(value)];
    })
  );
};
