import type { FC } from 'react';

import { useNavigate } from 'react-location';

import { Routes } from '@/enumerations';

import { Box, Button, Container, CssBaseline } from '@mui/material';

export const Start: FC = () => {
  const navigate = useNavigate();

  const onClick = (): void => {
    navigate({ to: Routes.Game } );
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
