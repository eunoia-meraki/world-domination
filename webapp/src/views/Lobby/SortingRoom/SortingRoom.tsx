import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Container,
  TableRow,
  styled,
  Button,
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { useMatch, useNavigate } from 'react-location';

import type { FC } from 'react';

import type { LobbyLocation } from '../LobbyLocations';

import { Routes } from '@/enumerations';

const data: {
  country: string;
  players: { role: string; login: string }[];
}[] = [
  {
    country: 'Russia',
    players: [
      {
        role: 'President',
        login: 'Roman',
      },
      {
        role: 'Citizen',
        login: 'Dima',
      },
    ],
  },
  {
    country: 'China',
    players: [
      {
        role: 'President',
        login: 'Roman',
      },
      {
        role: 'Citizen',
        login: 'Dima',
      },
    ],
  },
  {
    country: 'USA',
    players: [
      {
        role: 'President',
        login: 'Roman',
      },
      {
        role: 'Citizen',
        login: 'Dima',
      },
    ],
  },
];

const HeadTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 14,
    fontWeight: 700,
    backgroundColor: theme.palette.grey[400],
  },
}));

const BodyTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export const SortingRoom: FC = () => {
  const {
    params: { gameId },
  } = useMatch<LobbyLocation>();

  const navigate = useNavigate();

  const onClick = (): void => {
    // TODO think
    // sessionStorage.setItem('currentGameId', gameId);
    navigate({ to: `${Routes.Lobby}/${gameId}` });
  };

  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        flexGrow: 1,
      }}
    >
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Button variant="contained">Start</Button>
        <Button variant="contained" onClick={onClick}>
          Leave
        </Button>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <HeadTableCell>Country</HeadTableCell>
                <HeadTableCell>Role</HeadTableCell>
                <HeadTableCell>Player</HeadTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <>
                  <TableRow key={index.toString()}>
                    <BodyTableCell rowSpan={2}>{item.country}</BodyTableCell>
                    <BodyTableCell>{item.players[0].role}</BodyTableCell>
                    <BodyTableCell>{item.players[0].login}</BodyTableCell>
                  </TableRow>
                  <TableRow>
                    <BodyTableCell>{item.players[1].role}</BodyTableCell>
                    <BodyTableCell>{item.players[1].login}</BodyTableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};
