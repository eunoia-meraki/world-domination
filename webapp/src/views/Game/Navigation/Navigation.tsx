import { ContentPaste, Public, Flag, People } from '@mui/icons-material';
import {
  Toolbar,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  ListSubheader,
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-location';

import type { FC } from 'react';
import { useState } from 'react';

import { Routes } from '@/enumerations';

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

enum NavigationItem {
  Main,
  WorldStatistics,
  CountryStatistics,
  Actions,
}

interface INavigation {
  open: boolean;
  setHeading: (heading: string) => void;
}

export const Navigation: FC<INavigation> = ({ open, setHeading }) => {
  const navigate = useNavigate();

  const [navigationItem, setNavigationItem] = useState<NavigationItem>(NavigationItem.Main);

  const onMainClick = (): void => {
    navigate({ to: Routes.Game });
    setNavigationItem(NavigationItem.Main);
    setHeading('Main');
  };

  const onWorldStatisticsClick = (): void => {
    navigate({ to: `${Routes.Game}/worldstatistics` });
    setNavigationItem(NavigationItem.WorldStatistics);
    setHeading('World Statistics');
  };

  const onCountryStatisticsClick = (): void => {
    navigate({ to: `${Routes.Game}/countrystatistics` });
    setNavigationItem(NavigationItem.CountryStatistics);
    setHeading('Country Statistics');
  };

  const onActionsClick = (): void => {
    navigate({ to: `${Routes.Game}/actions` });
    setNavigationItem(NavigationItem.Actions);
    setHeading('Actions');
  };

  const mainSelected = navigationItem === NavigationItem.Main;
  const worldStatisticsSelected = navigationItem === NavigationItem.WorldStatistics;
  const countryStatisticsSelected = navigationItem === NavigationItem.CountryStatistics;
  const actionsSelected = navigationItem === NavigationItem.Actions;

  return (
    <Drawer variant="permanent" open={open}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [1],
        }}
      />
      <Divider />
      <List component="nav">
        <ListItemButton onClick={onMainClick} selected={mainSelected}>
          <ListItemIcon>
            <People />
          </ListItemIcon>
          <ListItemText>Main</ListItemText>
        </ListItemButton>
        <Divider sx={{ my: 1 }} />
        <ListSubheader component="div" inset>
          Statistics
        </ListSubheader>
        <ListItemButton onClick={onWorldStatisticsClick} selected={worldStatisticsSelected}>
          <ListItemIcon>
            <Public />
          </ListItemIcon>
          <ListItemText>World</ListItemText>
        </ListItemButton>
        <ListItemButton onClick={onCountryStatisticsClick} selected={countryStatisticsSelected}>
          <ListItemIcon>
            <Flag />
          </ListItemIcon>
          <ListItemText>Country</ListItemText>
        </ListItemButton>
        <Divider sx={{ my: 1 }} />
        <ListItemButton onClick={onActionsClick} selected={actionsSelected}>
          <ListItemIcon>
            <ContentPaste />
          </ListItemIcon>
          <ListItemText>Actions</ListItemText>
        </ListItemButton>
      </List>
    </Drawer>
  );
};
