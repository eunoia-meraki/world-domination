import { Paper } from '@mui/material';
import { purple } from '@mui/material/colors';
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

const data: {
  countryName: string;
  solValue: number;
}[] = [
  {
    countryName: 'Russia',
    solValue: 24,
  },
  {
    countryName: 'China',
    solValue: 13,
  },
  {
    countryName: 'USA',
    solValue: 40,
  },
  {
    countryName: 'Great Britain',
    solValue: 39,
  },
  {
    countryName: 'France',
    solValue: 48,
  },
  {
    countryName: 'Japan',
    solValue: 38,
  },
  {
    countryName: 'Spain',
    solValue: 43,
  },
  {
    countryName: 'Germany',
    solValue: 43,
  },
];

export const SolByCountries: FC = () => (
  <Paper
    sx={{
      p: 2,
      height: 300,
    }}
  >
    <ResponsiveContainer>
      <BarChart
        data={data}
        barSize={50}
        margin={{
          top: 20,
          right: 20,
          left: 20,
          bottom: 20,
        }}
      >
        <XAxis
          dataKey="countryName"
          label={{
            value: 'Country',
            position: 'insideTop',
            offset: 35,
          }}
          scale="point"
          padding={{
            left: 25,
            right: 25,
          }}
        />
        <YAxis
          type="number"
          domain={[0, 100]}
          label={{
            value: 'Standard of living, %',
            angle: -90,
            offset: 60,
            position: 'insideTopRight',
          }}
        />
        <CartesianGrid strokeDasharray="3 3" />
        <Bar
          dataKey="solValue"
          fill={purple[500]}
          background={{
            fill: '#eee',
          }}
        >
          <LabelList dataKey="solValue" position="top" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </Paper>
);
