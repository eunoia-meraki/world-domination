import { ContentPaste, Public, Flag, People, Logout } from '@mui/icons-material';
import {
  Box,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  AppBar,
  Drawer,
  ListItem,
  ListSubheader,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { FC } from 'react';

const drawerWidth = 240;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  marginLeft: drawerWidth,
  width: `calc(100% - ${drawerWidth}px)`,
}));

const StyledDrawer = styled(Drawer)(() => ({
  '& .MuiDrawer-paper': {
    flexGrow: 1,
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    boxSizing: 'border-box',
  },
}));

export const Game: FC = () => (
  <Box sx={{ display: 'flex', flexGrow: 1 }}>
    <StyledAppBar position="absolute">
      <Toolbar
        sx={{
          pr: '24px',
        }}
      >
        <Typography component="h2" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          World domination
        </Typography>
        <IconButton color="inherit">
          <Logout />
        </IconButton>
      </Toolbar>
    </StyledAppBar>
    <StyledDrawer variant="permanent">
      <Toolbar />
      <Divider />
      <List component="nav">
        <ListItem>
          <ListSubheader>Сводка по раунду</ListSubheader>
        </ListItem>
        <ListItemButton>
          <ListItemIcon>
            <Public />
          </ListItemIcon>
          <ListItemText>Весь мир</ListItemText>
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <Flag />
          </ListItemIcon>
          <ListItemText>Своя страна</ListItemText>
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <ContentPaste />
          </ListItemIcon>
          <ListItemText>Действия</ListItemText>
        </ListItemButton>
        <Divider />
        <ListItem>
          <ListSubheader>Конференц-залы</ListSubheader>
        </ListItem>
        <ListItemButton>
          <ListItemIcon>
            <People />
          </ListItemIcon>
          <ListItemText>Весь мир</ListItemText>
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <People />
          </ListItemIcon>
          <ListItemText>Своя страна</ListItemText>
        </ListItemButton>
      </List>
    </StyledDrawer>
    <Box
      component="main"
      sx={{
        backgroundColor: theme =>
          theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
        flexGrow: 1,
      }}
    >
      <Toolbar />
    </Box>
  </Box>
);
