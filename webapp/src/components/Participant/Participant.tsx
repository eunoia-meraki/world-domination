import { Mic, MicOff, VolumeUp, VolumeOff } from '@mui/icons-material';
import { Box, IconButton, Card, CardContent, Typography, CardMedia } from '@mui/material';

import { FC, useEffect, useState } from 'react';

import type { Client } from '@/hooks/useWebRTC';

interface IParticipant {
  name: string;
  client: Client;
  myself: boolean;
  provideMediaRef: (peerId: string, htmlElement: HTMLMediaElement) => void;
}

const ACTIVATION_THRESHOLD = 0.05;
const INDICATION_POLLING_PERIOD = 100;

export const Participant: FC<IParticipant> = ({
  name,
  client,
  myself,
  provideMediaRef,
}) => {
  const [isActive, setActive] = useState<boolean>(false);
  const [micOn, setMicOn] = useState<boolean>(true);

  useEffect(() => {
    const interval = setInterval(() => {
      const volume = client.audioIndicationGetter();
      const newVolumeIndication = volume > ACTIVATION_THRESHOLD;
      if (newVolumeIndication !== isActive) {
        setActive(!isActive);
      }
    }, INDICATION_POLLING_PERIOD);

    return () => clearInterval(interval);
  }, [client, isActive]);

  const onMicClick = (): void => {
    setMicOn(!micOn);
    client.setMuted(!micOn);
  };

  return (
    <Card sx={{
      display: 'flex',
      borderWidth: '3px',
      borderStyle: 'solid',
      alignItems: 'center',
      height: '50px',
      borderColor: isActive ? 'red' : 'transparent',
    }}>
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <IconButton color="inherit" onClick={onMicClick}>
          {myself && (micOn ? <Mic /> : <MicOff />)}
          {!myself && (micOn ? <VolumeUp /> : <VolumeOff />)}
        </IconButton>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" component="span">
            {name}
          </Typography>
        </CardContent>
      </Box>
      <CardMedia
        component="audio"
        ref={(instance: HTMLAudioElement | null) => {
          if (instance) {
            provideMediaRef(client.clientId, instance);
          }
        }}
        autoPlay
        playsInline
        muted={myself}
      />
    </Card>
  );
};
