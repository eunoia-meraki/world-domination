import { Container, Box, Toolbar, Stack } from '@mui/material';

import type { FC } from 'react';

import { EnviromentalHealth } from './EnviromentalHealth';
import { SolByCitiesFragment } from './SolByCitiesFragment';
import { SolByCountries } from './SolByCountries';

export const WorldStatistics: FC = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      overflow: 'auto',
      backgroundColor: theme =>
        theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
    }}
  >
    <Toolbar />

    <Container
      maxWidth="md"
      sx={{
        mt: 2,
        mb: 2,
      }}
    >
      <Stack spacing={2}>
        <EnviromentalHealth />

        <SolByCountries />

        <SolByCitiesFragment />
      </Stack>
    </Container>
  </Box>
);
