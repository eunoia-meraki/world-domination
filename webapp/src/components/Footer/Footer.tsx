import { Stack, Box, Typography, Link } from '@mui/material';

import type { FC } from 'react';

import SchoolLogo from '@/assets/svg/school-logo.svg';

export const Footer: FC = () => (
  <Box
    component="footer"
    sx={{
      py: 3,
      px: 2,
      mt: 'auto',
      borderTop: theme => `1px solid ${theme.palette.divider}`,
    }}
  >
    <Typography variant="body2" color="text.secondary">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
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

        <SchoolLogo height="25" width="70"/>
      </Stack>
    </Typography>
  </Box>
);
