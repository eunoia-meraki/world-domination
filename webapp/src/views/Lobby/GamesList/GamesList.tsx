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
import { useNavigate } from 'react-location';
import { useFragment, useMutation } from 'react-relay';

import type { FC, SyntheticEvent } from 'react';

import type { GamesList_createGame_Mutation } from './__generated__/GamesList_createGame_Mutation.graphql';
import type { GamesList_games_Fragment$key } from './__generated__/GamesList_games_Fragment.graphql';
import type { GamesList_joinGame_Mutation } from './__generated__/GamesList_joinGame_Mutation.graphql';

import { Routes } from '@/enumerations';

const HeaderTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 14,
    fontWeight: 700,
    backgroundColor: theme.palette.grey[400],
  },
}));

interface IGamesList {
  gamesList: GamesList_games_Fragment$key;
}

export const GamesList: FC<IGamesList> = ({
  gamesList,
}) => {
  const navigate = useNavigate();

  const gamesData = useFragment(
    graphql`
      fragment GamesList_games_Fragment on User {
        availableGames {
          edges {
            node {
              id
              name
              clients {
                id
              }
              teams {
                maxPlayersCount
              }
            }
          }
        }
      }
    `,
    gamesList,
  );

  const games = gamesData.availableGames.edges.filter(edge => edge).map(edge => edge!.node) ?? [];

  const [createLobby] = useMutation<GamesList_createGame_Mutation>(
    graphql`
      mutation GamesList_createGame_Mutation($gameName: String!) {
        createGame(gameName: $gameName) {
          id
        }
      }
    `,
  );

  const [joinGame] = useMutation<GamesList_joinGame_Mutation>(
    graphql`
      mutation GamesList_joinGame_Mutation($gameId: ID!) {
        joinGame(gameId: $gameId) {
          currentGame {
            id
            name
            owner {
              login
            }
          }
          id
        }
      }
    `,
  );

  const joinLobby = (gameId: string): void => {
    joinGame({
      variables: {
        gameId,
      },
      onCompleted: () => navigate({ to: `${Routes.Lobby}/${gameId}` }),
    });
  };

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

  );
};
