import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  styled,
  Box,
  Container,
  Grid,
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';

import type { FC } from 'react';

import { useColor } from '@/hooks/useColor';

export const CountryStatistics: FC = () => {
  const { getColor } = useColor();

  const PaperHeaderTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: getColor(),
      color: theme.palette.common.white,
      fontSize: 14,
      fontWeight: 700,
    },
  }));

  const HeaderTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.body}`]: {
      fontWeight: 700,
    },
  }));

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        height: '100%',
        backgroundColor: theme =>
          theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
      }}
    >
      <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table size="small" aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <PaperHeaderTableCell align="center" colSpan={5}>
                      Russia
                    </PaperHeaderTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <HeaderTableCell align="left">City</HeaderTableCell>
                    {['Moscow', 'Saint Petersburg', 'Zelenograd', 'Yaroslavl'].map(
                      (item, index) => (
                        <TableCell key={index.toString()} align="left">
                          {item}
                        </TableCell>
                      ),
                    )}
                  </TableRow>
                  <TableRow>
                    <HeaderTableCell align="left">Development level</HeaderTableCell>
                    {[40, 50, 60, 70].map((item, index) => (
                      <TableCell key={index.toString()} align="left">
                        {item} %
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <HeaderTableCell align="left">Standard of living</HeaderTableCell>
                    {[40, 50, 60, 70].map((item, index) => (
                      <TableCell key={index.toString()} align="left">
                        {item} %
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <HeaderTableCell align="left">Income</HeaderTableCell>
                    {[40, 50, 60, 70].map((item, index) => (
                      <TableCell key={index.toString()} align="left">
                        {item}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} lg={4}>
            <TableContainer component={Paper}>
              <Table size="small" aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <PaperHeaderTableCell align="center" colSpan={5}>
                      Common characteristics
                    </PaperHeaderTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <HeaderTableCell align="left">Average sol</HeaderTableCell>
                    <TableCell align="left">95 %</TableCell>
                  </TableRow>
                  <TableRow>
                    <HeaderTableCell align="left">Budget</HeaderTableCell>
                    <TableCell align="left">1000</TableCell>
                  </TableRow>
                  <TableRow>
                    <HeaderTableCell align="left">Nuclear technology</HeaderTableCell>
                    <TableCell align="left">+</TableCell>
                  </TableRow>
                  <TableRow>
                    <HeaderTableCell align="left">Nuclear bombs</HeaderTableCell>
                    <TableCell align="left">8</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item lg={8}>
            <TableContainer component={Paper}>
              <Table size="small" aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <PaperHeaderTableCell align="center" colSpan={5}>
                      Economic sanctions
                    </PaperHeaderTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    {['USA', 'China', 'Germany', 'France', 'Australia'].map((item, index) => (
                      <TableCell key={index.toString()} align="center">
                        {item}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    {['+', '-', '+', '-', '+'].map((item, index) => (
                      <TableCell key={index.toString()} align="center">
                        {item}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
