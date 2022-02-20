import { ThumbUp, Public, Flag, People } from '@mui/icons-material';
import {
  Toolbar,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Typography,
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import { useMatch, useNavigate } from 'react-location';

import type { FC } from 'react';

import type { LobbyLocation } from '../../LobbyLocations';

import { Routes } from '@/enumerations';

enum Contents {
  ConferenceHall,
  WorldStatistics,
  CountryStatistics,
  Actions,
}

const Drawer = styled(MuiDrawer, { shouldForwardProp: prop => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: 260,
      flexGrow: 1,
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
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(7.5),
        },
      }),
    },
  }),
);

interface INavigation {
  open: boolean;
  setContent: (content: Contents) => void;
  content: Contents;
}

export const Navigation: FC<INavigation> = ({ open, setContent, content }) => {
  const {
    params: { gameId },
  } = useMatch<LobbyLocation>();

  const navigate = useNavigate();

  const onMainClick = (): void => {
    navigate({ to: `${Routes.Lobby}/${gameId}` });
    setContent(Contents.ConferenceHall);
  };

  const onWorldStatisticsClick = (): void => {
    navigate({ to: `${Routes.Lobby}/${gameId}/worldstatistics` });
    setContent(Contents.WorldStatistics);
  };

  const onCountryStatisticsClick = (): void => {
    navigate({ to: `${Routes.Lobby}/${gameId}/countrystatistics` });
    setContent(Contents.CountryStatistics);
  };

  const onActionsClick = (): void => {
    navigate({ to: `${Routes.Lobby}/${gameId}/actions` });
    setContent(Contents.Actions);
  };

  const conferenceHallSelected = content === Contents.ConferenceHall;
  const worldStatisticsSelected = content === Contents.WorldStatistics;
  const countryStatisticsSelected = content === Contents.CountryStatistics;
  const actionsSelected = content === Contents.Actions;

  const hostName = 'Hostname';
  const participantCount = 8;

  return (
    <Drawer variant="permanent" open={open}>
      <Toolbar
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: '1px',
          pl: 2,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
          }}
        >
          {hostName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Participants: {participantCount}
        </Typography>
      </Toolbar>

      <Divider />

      <List component="nav">
        <ListItemButton onClick={onMainClick} selected={conferenceHallSelected}>
          <ListItemIcon>
            <People />
          </ListItemIcon>
          <ListItemText>Conference Hall</ListItemText>
        </ListItemButton>

        <ListItemButton onClick={onCountryStatisticsClick} selected={countryStatisticsSelected}>
          <ListItemIcon>
            <Flag />
          </ListItemIcon>
          <ListItemText>Country statistics</ListItemText>
        </ListItemButton>

        <ListItemButton onClick={onWorldStatisticsClick} selected={worldStatisticsSelected}>
          <ListItemIcon>
            <Public />
          </ListItemIcon>
          <ListItemText>World statistics</ListItemText>
        </ListItemButton>

        <ListItemButton onClick={onActionsClick} selected={actionsSelected}>
          <ListItemIcon>
            <ThumbUp />
          </ListItemIcon>
          <ListItemText>Actions</ListItemText>
        </ListItemButton>
      </List>
    </Drawer>
  );
};
