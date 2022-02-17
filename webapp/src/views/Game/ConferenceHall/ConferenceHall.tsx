import { Mic, MicOff, Videocam, VideocamOff } from '@mui/icons-material';
import { Paper, Box, Toolbar, IconButton } from '@mui/material';
import { useMatch } from 'react-location';

import { FC, useState } from 'react';

import type { GameLocation } from '../GameLocation';

import { Participant } from '@/components/Participant';
import { useColor } from '@/hooks/useColor';
import useWebRTC from '@/hooks/useWebRTC';

export const ConferenceHall: FC = () => {
  const {
    params: { gameId },
  } = useMatch<GameLocation>();

  const userId = sessionStorage.getItem('userId') || '';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [voiceRoom, setVoiceRoom] = useState<string>(gameId);

  const [micOn, setMicOn] = useState<boolean>(false);
  const [camOn, setCamOn] = useState<boolean>(false);

  const { clients: participants, provideMediaRef } = useWebRTC(voiceRoom, userId);

  // eslint-disable-next-line no-console
  console.log(participants);

  const onMicClick = (): void => {
    setMicOn(!micOn);
  };

  const onCamClick = (): void => {
    setCamOn(!camOn);
  };

  const { getColor } = useColor();

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
      <Box
        sx={{
          flexGrow: 1,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            maxWidth: '100%',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          {participants.map((participant, index) => {
            const key = index.toString();
            const color = getColor();

            return (
              <Participant
                key={key}
                client={participant}
                color={color}
                myself={participant.clientId === userId}
                provideMediaRef={provideMediaRef}
              />
            );
          })}
        </Box>
      </Box>
      <Toolbar
        sx={{
          position: 'sticky',
          bottom: 0,
          pb: 2,
        }}
      >
        <Paper
          sx={{
            mx: 'auto',
            px: 2,
            py: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            backgroundColor: theme => theme.palette.primary.main,
            color: theme => theme.palette.primary.contrastText,
          }}
        >
          <IconButton color="inherit" onClick={onMicClick}>
            {micOn ? <Mic /> : <MicOff />}
          </IconButton>
          <IconButton color="inherit" onClick={onCamClick}>
            {camOn ? <Videocam /> : <VideocamOff />}
          </IconButton>
        </Paper>
      </Toolbar>
    </Box>
  );
};
