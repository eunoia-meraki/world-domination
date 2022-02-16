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
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import graphql from 'babel-plugin-relay/macro';
import { useMatch, useNavigate } from 'react-location';
import { PreloadedQuery, usePreloadedQuery } from 'react-relay';

import type { FC } from 'react';

import type { LobbiesLocation } from './LobbiesLocation';
import type { Lobbies_games_Query } from './__generated__/Lobbies_games_Query.graphql';

import { Footer } from '@/components/Footer';
import { Routes } from '@/enumerations';

const HeaderTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 14,
    fontWeight: 700,
  },
}));

export const Lobbies: FC = () => {
  const {
    data: { gamesRef },
  } = useMatch<LobbiesLocation>();

  const navigate = useNavigate();

  const data = usePreloadedQuery<Lobbies_games_Query>(
    graphql`
      query Lobbies_games_Query {
        games {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    `,
    gamesRef as PreloadedQuery<Lobbies_games_Query, Record<string, unknown>>,
  );

  const games = data.games.edges.filter(edge => edge).map(edge => edge!.node) ?? [];

  const handleClick = (gameId: string): void => {
    navigate({ to: `${Routes.Lobby}/${gameId}` });
  };

  return (
    <>
      <Container
        component="main"
        maxWidth="md"
        sx={{
          mt: '30vh',
        }}
      >
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <HeaderTableCell>Name</HeaderTableCell>
                  <HeaderTableCell>Number of clients</HeaderTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {games.map((game, index) => (
                  <TableRow
                    sx={{
                      cursor: 'pointer',
                    }}
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={index.toString()}
                    onClick={() => handleClick(game.id)}
                  >
                    <TableCell>{game.name}</TableCell>
                    <TableCell>{0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>

      <Footer />
    </>
  );
};
