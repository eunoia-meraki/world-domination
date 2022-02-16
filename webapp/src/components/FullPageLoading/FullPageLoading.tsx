import { CircularProgress, Box } from '@mui/material';

import type { FC } from 'react';

export const FullPageLoading: FC = () => (
  <Box sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  }}>
    <CircularProgress />
  </Box>
);
