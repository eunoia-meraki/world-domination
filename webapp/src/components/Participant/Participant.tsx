import { PanTool } from '@mui/icons-material';
import { Paper, Box, Typography } from '@mui/material';

import { FC } from 'react';

interface IParticipant {
  color: string;
  firstName: string;
  lastName: string;
  speaking: boolean;
  raisedHand: boolean;
}

export const Participant: FC<IParticipant> = ({
  color,
  firstName,
  lastName,
  speaking,
  raisedHand,
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
        outlineWidth: '3px',
        borderStyle: 'solid',
        outlineStyle: 'solid',
        borderColor: raisedHand ? 'yellow' : 'transparent',
        outlineColor: speaking ? 'red' : 'transparent',
      }}
    >
      {raisedHand && (
        <PanTool
          sx={{
            position: 'absolute',
            left: 20,
            top: 20,
            color: 'yellow',
          }}
        />
      )}
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
