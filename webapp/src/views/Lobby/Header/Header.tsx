import { Language } from '@mui/icons-material';
import { Toolbar, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-location';

import type { FC } from 'react';

import { Routes } from '@/enumerations';

interface IHeader {
  userLogin: string;
  currentGame: boolean;
  leaveGame: () => void;
}

export const Header: FC<IHeader> = ({ userLogin, currentGame, leaveGame }) => {
  const navigate = useNavigate();

  const onLeaveClick = () => {
    leaveGame();
  };

  const onSignClick = (): void => {
    sessionStorage.clear();
    navigate({ to: Routes.SignIn });
  };

  return (
    <Toolbar color="default" sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Language />
      <Typography component="h2" variant="h6" color="inherit" noWrap sx={{ flex: 1, pl: 1 }}>
        World domination
      </Typography>
      <Typography component="h2" variant="h6" color="inherit" noWrap sx={{ flex: 1, pl: 1 }}>
        {userLogin}
      </Typography>
      {currentGame ? (
        <Button variant="outlined" size="small" onClick={onLeaveClick}>
          Leave
        </Button>
      ) : (
        <Button variant="outlined" size="small" onClick={onSignClick}>
          Sign out
        </Button>
      )}
    </Toolbar>
  );
};
