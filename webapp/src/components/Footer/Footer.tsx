import type { FC } from 'react';

import { Stack, Box, Typography, Link } from '@mui/material';

export const Footer: FC = () => {
  const logo = new URL('../../assets/svg/rss.svg', import.meta.url).toString();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        <Stack direction="row" justifyContent={'space-between'} alignItems={'center'}>
          <Stack direction="row" spacing={2}>
            <Box component="span">
              {'©  World Domination '}
              {new Date().getFullYear()}
            </Box>
            <Link color="inherit" href="/">
              Project
            </Link>
            <Link color="inherit" href="/">
              Team
            </Link>
            <Link color="inherit" href="https://rs.school/js">
              Curse
            </Link>
          </Stack>
          <img src={logo} width="70" />
        </Stack>
      </Typography>
    </Box>
  );
};
