import { Paper } from '@mui/material';
import { green } from '@mui/material/colors';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

import type { FC } from 'react';

const data: {
  stageNum: number;
  environmentalHealth: number;
}[] = [
  {
    stageNum: 1,
    environmentalHealth: 40,
  },
  {
    stageNum: 2,
    environmentalHealth: 30,
  },
  {
    stageNum: 3,
    environmentalHealth: 20,
  },
  {
    stageNum: 4,
    environmentalHealth: 27,
  },
  {
    stageNum: 5,
    environmentalHealth: 18,
  },
  {
    stageNum: 6,
    environmentalHealth: 23,
  },
];

export const EnviromentalHealth: FC = () => (
  <Paper
    sx={{
      p: 2,
      height: 300,
    }}
  >
    <ResponsiveContainer>
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 20,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="stageNum"
          label={{
            value: 'Stage',
            position: 'insideTop',
            offset: 35,
          }}
        />
        <YAxis
          type="number"
          domain={[0, 100]}
          label={{
            value: 'Environmental health, %',
            angle: -90,
            offset: 60,
            position: 'insideTopRight',
          }}
        />
        <Line
          type="monotone"
          dataKey="environmentalHealth"
          stroke={green[500]}
          activeDot={{
            r: 8,
          }}
        >
          <LabelList dataKey="environmentalHealth" position="top" />
        </Line>
      </LineChart>
    </ResponsiveContainer>
  </Paper>
);
