import { Box } from '@mui/material';

import type { FC } from 'react';

import type { FallbackProps } from 'react-error-boundary';

export const ErrorFallback: FC<FallbackProps> = ({ error }) => (
  <Box>
    <div>Oh, no</div>
    <pre>Something went wrong</pre>
    <p>
      {JSON.stringify(error.message)}
    </p>
  </Box>
);
