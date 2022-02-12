import { Mic, MicOff, Videocam, VideocamOff } from '@mui/icons-material';
import { Paper, Box, Toolbar, IconButton } from '@mui/material';

import type { FC } from 'react';
import { useState } from 'react';

import { Participant } from '@/components/Participant';
import { useColor } from '@/hooks/useColor';

const participants: {
  firstName: string;
  lastName: string;
  speaking: boolean;
}[] = [
  {
    firstName: 'Alexey',
    lastName: 'Koren',
    speaking: true,
  },
  {
    firstName: 'Roman',
    lastName: 'Fomin',
    speaking: false,
  },
  {
    firstName: 'Dima',
    lastName: 'Chuhlyaev',
    speaking: false,
  },
  {
    firstName: 'Ivan',
    lastName: 'Kuricyn',
    speaking: false,
  },
  {
    firstName: 'Vadim',
    lastName: 'Evseev',
    speaking: true,
  },
  {
    firstName: 'Ivan',
    lastName: 'Tur',
    speaking: false,
  },
  {
    firstName: 'David',
    lastName: 'Kuchukidze',
    speaking: false,
  },
];

export const ConferenceHall: FC = () => {
  const [micOn, setMicOn] = useState<boolean>(false);
  const [camOn, setCamOn] = useState<boolean>(false);

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
            const { firstName, lastName, speaking } = participant;
            return (
              <Participant
                key={key}
                color={color}
                firstName={firstName}
                lastName={lastName}
                speaking={speaking}
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
