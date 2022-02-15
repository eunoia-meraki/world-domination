/* eslint-disable jsx-a11y/media-has-caption */
import { Paper, Box } from '@mui/material';

import type { FC } from 'react';

interface IParticipant {
  color: string;
  userId: string;
  speaking: boolean;
  myself: boolean;
  provideMediaRef: (id: string, node: HTMLElement | null) => void;
}

export const Participant: FC<IParticipant> = ({
  color,
  userId,
  speaking,
  myself,
  provideMediaRef,
}) => (
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
      <video
        width='100%'
        height='100%'
        ref={instance => {
          provideMediaRef(userId, instance);
        }}
        autoPlay
        playsInline
        muted={!myself}
      />
    </Box>
  </Paper>
);
