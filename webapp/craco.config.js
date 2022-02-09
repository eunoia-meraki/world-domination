/* eslint-disable */
const path = require(`path`);
const { RelayCompilerPlugin } = require('@ch1ffa/relay-compiler-webpack-plugin');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
    plugins: [new RelayCompilerPlugin()],
  },
};
