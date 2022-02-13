import { Container, Paper, Box, Toolbar } from '@mui/material';
import { indigo } from '@mui/material/colors';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

import type { FC } from 'react';

const countries: {
  name: string;
  sl: number;
}[] = [
  {
    name: 'Russia',
    sl: 24,
  },
  {
    name: 'China',
    sl: 13,
  },
  {
    name: 'USA',
    sl: 98,
  },
  {
    name: 'Great Britain',
    sl: 39,
  },
  {
    name: 'France',
    sl: 48,
  },
  {
    name: 'Japan',
    sl: 38,
  },
  {
    name: 'Spain',
    sl: 43,
  },
  {
    name: 'Germany',
    sl: 43,
  },
];

export const WorldStatistics: FC = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      overflow: 'auto',
      backgroundColor: theme =>
        theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
    }}
  >
    <Toolbar />

    <Container
      maxWidth="md"
      sx={{
        mt: 2,
        mb: 2,
      }}
    >
      <Paper
        sx={{
          p: 2,
          height: 300,
        }}
      >
        <ResponsiveContainer>
          <BarChart
            data={countries}
            barSize={50}
            margin={{
              top: 20,
              right: 5,
              left: 10,
              bottom: 20,
            }}
          >
            <XAxis
              dataKey="name"
              label={{ value: 'Country', position: 'insideTop', offset: 35 }}
              scale="point"
              padding={{ left: 25, right: 25 }}
            />
            <YAxis
              label={{
                value: 'Standard of living, %',
                angle: -90,
                offset: 60,
                position: 'insideTopRight',
              }}
            />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="sl" fill={indigo[500]} background={{ fill: '#eee' }}>
              <LabelList dataKey="sl" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Container>
  </Box>
);
