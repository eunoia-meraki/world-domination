import { Box, Toolbar, Card } from '@mui/material';
import { useMatch } from 'react-location';

import { FC, useState } from 'react';

import type { GameLocation } from '../GameLocation';
import type { ClientData } from '../types';

import { Participant } from '@/components/Participant';
import useWebRTC from '@/hooks/useWebRTC';

interface IVoiceChat {
  userId: string;
  clientData: ClientData;
}

export const VoiceChat: FC<IVoiceChat> = ({
  userId,
  clientData,
}) => {
  const {
    params: { gameId },
  } = useMatch<GameLocation>();

  const [voiceRoom] = useState<string>(gameId);

  const { clients: participants, provideMediaRef } = useWebRTC(voiceRoom, userId);

  // eslint-disable-next-line no-console
  console.log(participants);

  const participantCollection = participants.map((participant, index) => {
    const key = index.toString();

    return (
      <Participant
        name={clientData[userId]}
        key={key}
        client={participant}
        myself={participant.clientId === userId}
        provideMediaRef={provideMediaRef}
      />
    );
  });

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '250px',
        flexGrow: 1,
        overflow: 'auto',
        backgroundColor: theme =>
          theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
      }}
    >
      <Toolbar />
      <Box
        sx={{
          flexGrow: 1,
          p: 2,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        {participantCollection}
      </Box>
    </Card>
  );
};
