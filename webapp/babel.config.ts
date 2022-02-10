import type { ConfigAPI, TransformOptions } from '@babel/core';

const config = (api: ConfigAPI): TransformOptions => ({
  presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],

  plugins: [
    'macros',
    'relay',
    '@babel/plugin-transform-runtime',
    [
      'module-resolver',
      {
        extensions: ['.ts', '.mts', '.tsx', '.mtsx'],
        root: ['./src/'],
        alias: {
          '@/': 'src/',
        },
      },
    ],
  ],

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
            flow: false,
            typescript: true,
            development: api.env() === 'development',
            useBuiltIns: true,
            runtime: 'automatic',
          },
        ],
      ],
    },
    {
      test: '**/*.d.ts',
      presets: [['@babel/preset-env']],
    },
  ],
});

export default config;
