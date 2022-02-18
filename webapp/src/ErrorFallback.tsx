import { Box } from '@mui/material';

import type { FC } from 'react';

import type { FallbackProps } from 'react-error-boundary';

export const ErrorFallback: FC<FallbackProps> = () => (
  <Box>
    <div>Oh, no</div>
    <pre>Something went wrong</pre>
  </Box>
);
