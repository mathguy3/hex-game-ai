import { gridRowRatio } from '../../../configuration/constants';

export const HexImg = ({
  width,
  height,
  strokeWidth = 2,
  color,
}: {
  width: number;
  height?: number;
  strokeWidth?: number;
  color: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="#fff"
    stroke={color || '#000'}
    strokeWidth={`${strokeWidth}px`}
    width={`${width + 2}px`} //800
    height={`${height ?? width * gridRowRatio + 2}px`} //690
    viewBox={`-${100 + strokeWidth} -${87 + strokeWidth} ${
      200 + strokeWidth * 2
    } ${174 + strokeWidth * 2}`}
  >
    <polygon points="100,0 50,-87 -50,-87 -100,-0 -50,87 50,87"></polygon>
  </svg>
);
