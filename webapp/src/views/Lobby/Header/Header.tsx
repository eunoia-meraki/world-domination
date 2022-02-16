import { Language } from '@mui/icons-material';
import {
  Toolbar,
  Button,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-location';

import type { FC } from 'react';

import { Routes } from '@/enumerations';

export const Header: FC = () => {
  const navigate = useNavigate();

  const onLogoutClick = (): void => {
    sessionStorage.clear();
    navigate({ to: Routes.SignIn });
  };

  return (
    <Toolbar color="default" sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Language />
      <Typography component="h2" variant="h6" color="inherit" noWrap sx={{ flex: 1, pl: 1 }}>
        World domination
      </Typography>
      <Button variant="outlined" size="small" onClick={onLogoutClick}>
        Log out
      </Button>
    </Toolbar>
  );
};
