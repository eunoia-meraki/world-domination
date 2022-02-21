import { Box, styled } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';

import type { FC } from 'react';

import type { ClientData } from '../types';

import { Participant } from '@/components/Participant';
import useWebRTC from '@/hooks/useWebRTC';

const Drawer = styled(MuiDrawer, { shouldForwardProp: prop => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: 240,
      backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: 0,
        [theme.breakpoints.up('sm')]: {
          width: 0,
        },
      }),
    },
  }),
);

interface IVoiceChat {
  userId: string;
  clientData: ClientData;
  open: boolean;
  voiceChatId: string;
}

export const VoiceChat: FC<IVoiceChat> = ({ userId, clientData, open, voiceChatId }) => {
  const { clients: participants, provideMediaRef } = useWebRTC(voiceChatId, userId);

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
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        borderLeft: open ? 1 : 0,
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          p: 2,
          gap: 2,
          display: 'flex',
          alignItems: 'stretch',
          flexDirection: 'column',
        }}
      >
        {participantCollection}
      </Box>
    </Drawer>
    // <Card
    //   sx={{
    //     display: 'flex',
    //     flexDirection: 'column',
    //     maxWidth: '250px',
    //     minWidth: '200px',
    //     flexGrow: 1,
    //     overflow: 'auto',
    //     backgroundColor: theme =>
    //       theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    //   }}
    // >
    //   <Toolbar />
    //   <Box
    //     sx={{
    //       flexGrow: 1,
    //       p: 2,
    //       gap: 2,
    //       display: 'flex',
    //       alignItems: 'stretch',
    //       flexDirection: 'column',
    //     }}
    //   >
    //     {participantCollection}
    //   </Box>
    // </Card>
  );
};
