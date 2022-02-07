import { Box, Button, Container, CssBaseline } from '@mui/material';
import { useNavigate } from 'react-location';

import type { FC } from 'react';

import { Routes } from '@/enumerations';

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
