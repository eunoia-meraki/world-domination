import { Box, Button, Container } from '@mui/material';
import { useMatch, useNavigate } from 'react-location';

import type { FC } from 'react';

import type { LobbyLocation } from '../LobbyLocations';

import { Routes } from '@/enumerations';

export const SortingRoom: FC = () => {
  const {
    params: { gameId },
  } = useMatch<LobbyLocation>();

  const navigate = useNavigate();

  const onClick = (): void => {
    navigate({ to: `${Routes.Lobby}/${gameId}` } );
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          mt: '40vh',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Button variant="contained" onClick={onClick}>
          Start
        </Button>
      </Box>
    </Container>
  );
};
