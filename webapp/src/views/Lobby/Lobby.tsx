import { Box, Button, Container, CssBaseline } from '@mui/material';
import { useMatch, useNavigate } from 'react-location';

import type { FC } from 'react';

import type { LobbyLocation } from './LobbyLocation';

import { Routes } from '@/enumerations';

export const Lobby: FC = () => {
  const {
    params: { lobbyId },
  } = useMatch<LobbyLocation>();

  const navigate = useNavigate();

  const onClick = (): void => {
    navigate({ to: `${Routes.Game}/${lobbyId}` } );
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
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
