import { Paper, Box, Typography } from '@mui/material';

import { FC } from 'react';

interface IParticipant {
  color: string;
  firstName: string;
  lastName: string;
  speaking: boolean;
}

export const Participant: FC<IParticipant> = ({
  color,
  firstName,
  lastName,
  speaking,
}) => {
  const initials = firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();

  return (
    <Paper
      sx={{
        position: 'relative',
        width: 200,
        height: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: '3px',
        borderStyle: 'solid',
        borderColor: speaking ? 'red' : 'transparent',
      }}
    >
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: 100,
          backgroundColor: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h3" color="white">
          {initials}
        </Typography>
      </Box>
    </Paper>
  );
};
