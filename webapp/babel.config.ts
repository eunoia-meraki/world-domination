import type {
  ConfigAPI,
  TransformOptions,
} from '@babel/core';

const config = (api: ConfigAPI): TransformOptions => {
  return {
    presets: ['@babel/preset-env'],

    overrides: [
      {
        test: /\.(m?ts|m?tsx)$/,
        presets: ['@babel/preset-typescript'],
      },
      {
        test: /\.(m?ts|m?tsx)$/,
        presets: [
          [
            '@babel/preset-react',
            {
              development: api.env() === 'development',
              useBuiltIns: true,
              runtime: 'automatic',
            },
          ],
        ],
      },
      {
        test: '**/*.d.ts',
        presets: [['@babel/preset-env', { targets: { esmodules: true } }]],
      },
    ],

    plugins: [
      [
        'module-resolver',
        {
          'alias': {
            '@/': 'src/',
          },
        },
      ],
    ],
  };
};

export default config;
