import { Box, Typography, Link } from '@mui/material';

import type { FC } from 'react';

import { ReactComponent as SchoolLogo } from '@/assets/svg/school-logo.svg';

export const Footer: FC = () => (
  <Box
    component="footer"
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      py: 3,
      px: 2,
      mt: 'auto',
      borderTop: theme => `1px solid ${theme.palette.divider}`,
    }}
  >
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{
        display: 'flex',
        gap: 2,
      }}
    >
      <Box component="span">© World Domination {new Date().getFullYear()}</Box>

      <Link color="inherit" href="/">
        Project
      </Link>

      <Link color="inherit" href="/">
        Team
      </Link>

      <Link color="inherit" href="https://rs.school/js">
        Course
      </Link>
    </Typography>

    <SchoolLogo height="25" width="70" />
  </Box>
);
