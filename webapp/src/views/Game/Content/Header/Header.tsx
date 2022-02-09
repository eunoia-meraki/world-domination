import { Menu, Notifications } from '@mui/icons-material';
import { Toolbar, Typography, Badge, IconButton } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';

import type { FC } from 'react';

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
  heading: string;
}

export const Header: FC<IHeader> = ({ open, toggleOpen, heading }) => (
  <AppBar position="absolute" open={open}>
    <Toolbar
      sx={{
        pr: '24px',
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
      <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
        {heading}
      </Typography>
      <IconButton color="inherit">
        <Badge badgeContent={4} color="secondary">
          <Notifications />
        </Badge>
      </IconButton>
    </Toolbar>
  </AppBar>
);
