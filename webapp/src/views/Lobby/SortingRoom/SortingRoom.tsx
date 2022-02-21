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
  Box,
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import graphql from 'babel-plugin-relay/macro';
import { useFragment } from 'react-relay';

import { FC, Fragment } from 'react';

import type { SortingRoom_game_Fragment$key } from './__generated__/SortingRoom_game_Fragment.graphql';

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

interface ISortingRoom {
  game: SortingRoom_game_Fragment$key;
}

export const SortingRoom: FC<ISortingRoom> = ({ game }) => {
  const data = useFragment(
    graphql`
      fragment SortingRoom_game_Fragment on Game {
        teams {
          id
          players {
            role
            user {
              id
              login
            }
          }
          nation
        }
      }
    `,
    game,
  );

  const teams = data?.teams;

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        backgroundColor: theme =>
          theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
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
                {teams.map(team => {
                  const president = team.players.find(player => player.role === 'PRESIDENT');
                  const diplomat = team.players.find(player => player.role === 'DIPLOMAT');

                  return (
                    <Fragment key={team.id}>
                      <TableRow key={president?.user?.id || `${team.id}_president`}>
                        <BodyTableCell rowSpan={2}>{team.nation}</BodyTableCell>
                        <BodyTableCell>PRESIDENT</BodyTableCell>
                        <BodyTableCell>{president?.user?.login || ''}</BodyTableCell>
                      </TableRow>
                      <TableRow key={diplomat?.user?.id || `${team.id}_diplomat`}>
                        <BodyTableCell>DIPLOMAT</BodyTableCell>
                        <BodyTableCell>{diplomat?.user?.login || ''}</BodyTableCell>
                      </TableRow>
                    </Fragment>
                  );
                },
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  );
};
