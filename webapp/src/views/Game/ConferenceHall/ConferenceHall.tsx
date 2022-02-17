import { Box, Toolbar } from '@mui/material';
import type { FC } from 'react';

export const ConferenceHall: FC = () => {
  const pageName = 'Conference Hall';
  return (
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
      {pageName}
    </Box>
  );
};
