import { Box, Toolbar, Card } from '@mui/material';
import { useMatch } from 'react-location';

import { FC, useState } from 'react';

import type { LobbyLocation } from '../../LobbyLocations';
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
  } = useMatch<LobbyLocation>();

  const [voiceRoom] = useState<string>(gameId);

  const { clients: participants, provideMediaRef } = useWebRTC(voiceRoom, userId);

  // eslint-disable-next-line no-console
  console.log(participants.map(p => p.clientId));

  const participantCollection = participants.map(participant => {
    const clientName = clientData[participant.clientId];

    return (
      <Participant
        name={clientName}
        key={participant.clientId}
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
        minWidth: '200px',
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
          gap: 2,
          display: 'flex',
          alignItems: 'stretch',
          flexDirection: 'column',
        }}
      >
        {participantCollection}
      </Box>
    </Card>
  );
};
