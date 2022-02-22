import { Container, Box, Stack } from '@mui/material';

import type { FC } from 'react';

import { EnviromentalHealth } from './EnviromentalHealth';
import { SolByCitiesFragment } from './SolByCitiesFragment';
import { SolByCountries } from './SolByCountries';

export const WorldStatistics: FC = () => (
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
