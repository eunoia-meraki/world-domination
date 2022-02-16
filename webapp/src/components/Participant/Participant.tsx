/* eslint-disable jsx-a11y/media-has-caption */
import { Paper, Box } from '@mui/material';

import { FC, useEffect, useState } from 'react';

import type { Client } from '@/hooks/useWebRTC';

interface IParticipant {
  color: string;
  client: Client;
  myself: boolean;
  provideMediaRef: (peerId: string, htmlElement: HTMLMediaElement) => void;
}

const ACTIVATION_THRESHOLD = 0.05;
const INDICATION_POLLING_PERIOD = 100;

export const Participant: FC<IParticipant> = ({
  color,
  client,
  myself,
  provideMediaRef,
}) => {
  const [volumeIndication, setVolumeIndication] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const volume = client.audioIndicationGetter();
      const newVolumeIndication = volume > ACTIVATION_THRESHOLD;
      if (newVolumeIndication !== volumeIndication) {
        setVolumeIndication(!volumeIndication);
      }
    }, INDICATION_POLLING_PERIOD);

    return () => clearInterval(interval);
  }, [client, volumeIndication]);

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
        borderColor: volumeIndication ? 'red' : 'transparent',
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
            if (instance) {
              provideMediaRef(client.clientId, instance);
            }
          }}
          autoPlay
          playsInline
          muted={myself}
        />
      </Box>
    </Paper>
  );
};
