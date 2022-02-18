import type { FC } from 'react';

import { SolByCities } from '@/components/SolByCities';
import { useColor } from '@/hooks/useColor';

const data: {
  countryName: string;
  columns: {
    cityName: string;
    solValue: number;
  }[];
}[] = [
  {
    countryName: 'Russia',
    columns: [
      {
        cityName: 'Moscow',
        solValue: 10,
      },
      {
        cityName: 'Saint-Petersburg',
        solValue: 20,
      },
      {
        cityName: 'Ivanovo',
        solValue: 30,
      },
      {
        cityName: 'Zelenograd',
        solValue: 50,
      },
    ],
  },
  {
    countryName: 'USA',
    columns: [
      {
        cityName: 'Las Vegas',
        solValue: 10,
      },
      {
        cityName: 'Washington',
        solValue: 20,
      },
      {
        cityName: 'New-York',
        solValue: 30,
      },
      {
        cityName: 'Los Angeles',
        solValue: 50,
      },
    ],
  },
  {
    countryName: 'China',
    columns: [
      {
        cityName: 'Beijing',
        solValue: 10,
      },
      {
        cityName: 'Shanghai',
        solValue: 20,
      },
      {
        cityName: 'Guangzhou',
        solValue: 30,
      },
      {
        cityName: 'Wuhan',
        solValue: 50,
      },
    ],
  },
];

export const SolByCitiesFragment: FC = () => {
  const { getColor } = useColor();

  return (
    <>
      {data.map((item, index) => (
        <SolByCities
          key={index.toString()}
          countryName={item.countryName}
          columns={item.columns}
          color={getColor()}
        />
      ))}
    </>
  );
};
