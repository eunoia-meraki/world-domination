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
  TextField,
  Button,
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import graphql from 'babel-plugin-relay/macro';
import { useMatch, useNavigate } from 'react-location';
import { PreloadedQuery, useMutation, usePreloadedQuery } from 'react-relay';

import type { FC, SyntheticEvent } from 'react';

import { Header } from '../Header';

import type { LobbyLocation } from '../LobbyLocations';
import type { GamesList_authorizedUser_Query } from './__generated__/GamesList_authorizedUser_Query.graphql';
import type { GamesList_createGame_Mutation } from './__generated__/GamesList_createGame_Mutation.graphql';
import type { GamesList_games_Query } from './__generated__/GamesList_games_Query.graphql';

import { Footer } from '@/components/Footer';
import { Routes } from '@/enumerations';

const HeaderTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 14,
    fontWeight: 700,
    backgroundColor: theme.palette.grey[400],
  },
}));

export const GamesList: FC = () => {
  const navigate = useNavigate();

  const {
    data: { gamesListRef, userRef },
  } = useMatch<LobbyLocation>();

  const gamesData = usePreloadedQuery<GamesList_games_Query>(
    graphql`
      query GamesList_games_Query {
        games {
          edges {
            node {
              id
              name
              clients {
                id
                login
              }
              teams {
                maxPlayersCount
              }
            }
          }
        }
      }
    `,
    gamesListRef as PreloadedQuery<GamesList_games_Query, Record<string, unknown>>,
  );

  const authorizedUser = usePreloadedQuery<GamesList_authorizedUser_Query>(
    graphql`
      query GamesList_authorizedUser_Query {
        authorizedUser {
          id
          login
          currentGame {
            id
          }
        }
      }
    `,
    userRef as PreloadedQuery<GamesList_authorizedUser_Query, Record<string, unknown>>,
  );

  const userLogin = authorizedUser.authorizedUser.login;
  const games = gamesData.games.edges.filter(edge => edge).map(edge => edge!.node) ?? [];

  const joinLobby = (gameId: string): void => {
    navigate({ to: `${Routes.Lobby}/${gameId}` });
  };

  const [createLobby] = useMutation<GamesList_createGame_Mutation>(
    graphql`
      mutation GamesList_createGame_Mutation($gameName: String!) {
        createGame(gameName: $gameName) {
          id
        }
      }
    `,
  );

  const onCreateLobby = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    createLobby({
      variables: {
        gameName: formData.get('lobbyName') as string,
      },
      onCompleted: response => {
        const { id } = response.createGame;
        joinLobby(id);
      },
    });
  };

  const gamesRows = games.map(game => {
    const connectedClients = game.clients.length;
    const availablePositions = game.teams.reduce(
      (acc, team) => (acc + team.maxPlayersCount), 0,
    );

    return (
      <TableRow
        sx={{
          cursor: 'pointer',
        }}
        hover
        role="checkbox"
        tabIndex={-1}
        key={game.id}
        onClick={() => joinLobby(game.id)}
      >
        <TableCell>{game.name}</TableCell>
        <TableCell>{`${connectedClients}/${availablePositions}`}</TableCell>
      </TableRow>
    );
  });

  return (
    <>
      <Header userLogin={userLogin} />

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
          <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 1, width: '25ch' },
              display: 'flex',
              justifyContent: 'space-between',
              gap: '10px',
            }}
            onSubmit={onCreateLobby}
            noValidate
            autoComplete="off"
          >
            <TextField id="outlined-basic" label="Lobby name" variant="outlined" name='lobbyName' sx={{ flex: '1 1 auto' }} />
            <Button type="submit" variant="outlined">Create lobby</Button>
          </Box>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <HeaderTableCell>Name</HeaderTableCell>
                  <HeaderTableCell>Number of clients</HeaderTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gamesRows}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>

      <Footer />
    </>

  );
};
