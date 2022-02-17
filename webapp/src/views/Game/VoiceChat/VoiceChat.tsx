import { Mic, MicOff, Videocam, VideocamOff } from '@mui/icons-material';
import { Paper, Box, Toolbar, IconButton, Card } from '@mui/material';
import { useMatch } from 'react-location';

import { FC, useState } from 'react';

import type { GameLocation } from '../GameLocation';

import { Participant } from '@/components/Participant';
import { useColor } from '@/hooks/useColor';
import useWebRTC from '@/hooks/useWebRTC';

interface IVoiceChat {
  userId: string;
}

export const VoiceChat: FC<IVoiceChat> = ({
  userId
}) => {
  const {
    params: { gameId },
  } = useMatch<GameLocation>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [voiceRoom, setVoiceRoom] = useState<string>(gameId);


  const { clients: participants, provideMediaRef } = useWebRTC(voiceRoom, userId);

  // eslint-disable-next-line no-console
  console.log(participants);

  const { getColor } = useColor();

  const participantCollection = participants.map((participant, index) => {
    const key = index.toString();
    const color = getColor();

    return (
      <Participant
        name={userId}
        key={key}
        client={participant}
        color={color}
        myself={participant.clientId === userId}
        provideMediaRef={provideMediaRef}
      />
    );
  })

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
