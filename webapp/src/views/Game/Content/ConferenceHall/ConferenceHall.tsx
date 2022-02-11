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
  raisedHand: boolean;
}[] = [
  {
    firstName: 'Alexey',
    lastName: 'Koren',
    speaking: true,
    raisedHand: false,
  },
  {
    firstName: 'Roman',
    lastName: 'Fomin',
    speaking: false,
    raisedHand: false,
  },
  {
    firstName: 'Dima',
    lastName: 'Chuhlyaev',
    speaking: false,
    raisedHand: false,
  },
  {
    firstName: 'Ivan',
    lastName: 'Kuricyn',
    speaking: false,
    raisedHand: true,
  },
  {
    firstName: 'Vadim',
    lastName: 'Evseev',
    speaking: true,
    raisedHand: false,
  },
  {
    firstName: 'Ivan',
    lastName: 'Tur',
    speaking: false,
    raisedHand: false,
  },
  {
    firstName: 'David',
    lastName: 'Kuchukidze',
    speaking: false,
    raisedHand: false,
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
        position: 'relative',
        flexGrow: 1,
        m: 2,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        alignContent: 'flex-start',
      }}
    >
      {participants.map((participant, index) => {
        const key = index.toString();
        const color = getColor();
        const { firstName, lastName, speaking, raisedHand } = participant;
        return (
          <Participant
            key={key}
            color={color}
            firstName={firstName}
            lastName={lastName}
            speaking={speaking}
            raisedHand={raisedHand}
          />
        );
      })}
      <Toolbar sx={{ position: 'absolute', bottom: 0, width: '100%', boxSizing: 'border-box' }}>
        <Paper
          sx={{
            mx: 'auto',
            px: 2,
            py: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <IconButton onClick={onMicClick}>{micOn ? <Mic /> : <MicOff />}</IconButton>
          <IconButton onClick={onCamClick}>{camOn ? <Videocam /> : <VideocamOff />}</IconButton>
        </Paper>
      </Toolbar>
    </Box>
  );
};
