import { Menu, Notifications } from '@mui/icons-material';
import { Toolbar, Typography, Badge, IconButton, LinearProgress, Box } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';

import type { FC } from 'react';

enum Contents {
  ConferenceHall,
  WorldStatistics,
  CountryStatistics,
  Actions,
}

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: 260,
    width: `calc(100% - ${260}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

interface IHeader {
  open: boolean;
  toggleOpen: () => void;
  content: Contents;
}

export const Header: FC<IHeader> = ({ open, toggleOpen, content }) => {
  const stageNum = 2;
  const countryName = 'Russia';
  const amountOfMoney = 1000000000;
  const stageProgressValue = 80;

  const headings = {
    [`${Contents.ConferenceHall}`]: {
      heading: 'Conference Hall',
      subheading: 'Communicate with people all over the world',
    },
    [`${Contents.CountryStatistics}`]: {
      heading: 'Country Statistics',
      subheading: 'Track standard of living of your country',
    },
    [`${Contents.WorldStatistics}`]: {
      heading: 'World Statistics',
      subheading: 'Track environmental health of the world',
    },
    [`${Contents.Actions}`]: {
      heading: 'Actions',
      subheading: 'Protect your home, throw rockets to the enemy',
    },
  };

  return (
    <AppBar position="absolute" open={open}>
      <Toolbar
        sx={{
          pr: '24px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleOpen}
            sx={{
              marginRight: '36px',
            }}
          >
            <Menu />
          </IconButton>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Typography variant="h6" color="inherit">
              {headings[content].heading}
            </Typography>
            <Typography variant="body2" color="inherit">
              {headings[content].subheading}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: 5,
          }}
        >
          <Typography
            variant="subtitle2"
            color="inherit"
            sx={{
              display: 'flex',
              gap: 5,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <Box>Stage {stageNum}/6</Box>
              <LinearProgress
                sx={{
                  width: '100%',
                }}
                variant="determinate"
                color="inherit"
                value={stageProgressValue}
              />
            </Box>
            <Box>
              <Box>Country</Box>
              <Box sx={{ fontWeight: 600 }}>{countryName}</Box>
            </Box>
            <Box>
              <Box>Money</Box>
              <Box sx={{ fontWeight: 600 }}>{amountOfMoney} $</Box>
            </Box>
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <Notifications />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
