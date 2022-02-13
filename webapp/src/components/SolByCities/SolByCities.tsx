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

import type { FC } from 'react';

interface ISolByCities {
  countryName: string;
  columns: {
    cityName: string;
    solValue: number;
  }[];
  color: string;
}

export const SolByCities: FC<ISolByCities> = ({ countryName, columns, color }) => {
  const CityNameTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.body}`]: {
      fontWeight: 700,
    },
  }));

  const CountryNameTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: color,
      color: theme.palette.common.white,
      fontSize: 14,
      fontWeight: 700,
    },
  }));

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
            {columns.map((item, index) => (
              <CityNameTableCell key={index.toString()} align="center">
                {item.cityName}
              </CityNameTableCell>
            ))}
          </TableRow>
          <TableRow>
            {columns.map((item, index) => (
              <TableCell key={index.toString()} align="center">
                {item.solValue} %
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
