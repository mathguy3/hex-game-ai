import SoldierSvg from './Soldier.svg';

export const SoldierIcon = ({ width }: { width: number }) => (
  <img
    style={{ zIndex: 4, position: 'absolute' }}
    src={SoldierSvg}
    title="unit"
    alt="unit"
    width={width}
    height={width}
  />
);
