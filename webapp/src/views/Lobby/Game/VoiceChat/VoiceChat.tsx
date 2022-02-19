import { Box, Toolbar, Card } from '@mui/material';
import graphql from 'babel-plugin-relay/macro';
import { useMatch } from 'react-location';
import { useRefetchableFragment } from 'react-relay';

import { FC, useEffect, useState } from 'react';

import type { LobbyLocation } from '../../LobbyLocations';
import type { ClientData } from '../types';
import type { VoiceChat_clients_Fragment$key } from './__generated__/VoiceChat_clients_Fragment.graphql';
import type { VoiceChat_clients_Query } from './__generated__/VoiceChat_clients_Query.graphql';

import { Participant } from '@/components/Participant';
import useWebRTC from '@/hooks/useWebRTC';

interface IVoiceChat {
  userId: string;
  data: VoiceChat_clients_Fragment$key;
}

export const VoiceChat: FC<IVoiceChat> = ({
  userId,
  data,
}) => {
  const {
    params: { gameId },
  } = useMatch<LobbyLocation>();

  const [voiceRoom] = useState<string>(gameId);

  const { clients: participants, provideMediaRef } = useWebRTC(voiceRoom, userId);

  const [clientsFragmentData, refetch] = useRefetchableFragment<VoiceChat_clients_Query, VoiceChat_clients_Fragment$key>(
    graphql`
      fragment VoiceChat_clients_Fragment on Game
      @refetchable(queryName: "VoiceChat_clients_Query") {
        clients {
          id
          login
        }
      }
    `,
    data,
  );

  useEffect(() => {
    refetch({}, { fetchPolicy: 'network-only' });
  }, [participants, refetch]);

  const clientsData = clientsFragmentData.clients.reduce(
    (acc: ClientData, client) => ({
      ...acc, [client.id]: client.login,
    }),
    {}) || {};

  // eslint-disable-next-line no-console
  console.log(participants);

  const participantCollection = participants.map(participant => {
    const clientName = clientsData[participant.clientId];

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
