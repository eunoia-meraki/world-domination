import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  styled,
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
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

import type { FC } from 'react';

let colorNum = 0;

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
  red[500],
];

interface IColumn {
  cityName: string;
  standardOfLiving: number;
}

interface IStandardOfLivingByCity {
  countryName: string;
  columns: IColumn[];
}

// const countryName = 'Россия';

// const columns: IColumn[] = [
//   { cityName: 'Москва', standardOfLiving: 10 },
//   { cityName: 'Санкт-Петербург', standardOfLiving: 20 },
//   { cityName: 'Иваново', standardOfLiving: 30 },
//   { cityName: 'Ярославль', standardOfLiving: 40 },
// ];

export const StandardOfLivingByCity: FC<IStandardOfLivingByCity> = ({ countryName, columns }) => {
  const CityNameTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.body}`]: {
      fontWeight: 700,
    },
  }));

  const CountryNameTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: colors[colorNum],
      color: theme.palette.common.white,
      fontSize: 14,
      fontWeight: 700,
    },
  }));

  colorNum += 1;

  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="customized table">
        <TableHead>
          <TableRow>
            <CountryNameTableCell align="center" colSpan={4}>
              {countryName}
            </CountryNameTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            {columns.map((column, index) => (
              <CityNameTableCell key={index.toString()} align="center">
                {column.cityName}
              </CityNameTableCell>
            ))}
          </TableRow>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={index.toString()} align="center">
                {column.standardOfLiving} %
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
