import {
  red,
  deepPurple,
  lightBlue,
  green,
  yellow,
  deepOrange,
  blueGrey,
  pink,
  indigo,
  cyan,
  lightGreen,
  amber,
  brown,
  purple,
  blue,
  teal,
  lime,
  orange,
  grey,
} from '@mui/material/colors';

const colors = [
  red[500],
  deepPurple[500],
  lightBlue[500],
  green[500],
  yellow[500],
  deepOrange[500],
  blueGrey[500],
  pink[500],
  indigo[500],
  cyan[500],
  lightGreen[500],
  amber[500],
  brown[500],
  purple[500],
  blue[500],
  teal[500],
  lime[500],
  orange[500],
  grey[500],
];

interface IUseColor {
  getColor: () => string;
}

export const useColor = (): IUseColor => {
  let colorNum = 0;

  const getColor = (): string => {
    if (colorNum === colors.length) {
      colorNum = 0;
    }
    const color = colors[colorNum];
    colorNum += 1;
    return color;
  };

  return { getColor };
};
