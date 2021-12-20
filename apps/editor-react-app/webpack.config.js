//https://github.com/nrwl/nx/issues/3673#issuecomment-721148212

const nrwlConfig = require('@nrwl/react/plugins/webpack.js'); // require the main @nrwl/react/plugins/webpack configuration function.
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = (config, context) => {
  nrwlConfig(config); // first call it so that it @nrwl/react plugin adds its configs,

  // then override your config.
  return {
    ...config,
    // Fix: "Uncaught ReferenceError: global is not defined", and "Can't resolve 'fs'".
    node: { global: true },

    plugins: [
      ...config.plugins,
      new MonacoWebpackPlugin({
        customLanguages: [
          {
            entry: 'graphql',
            label: 'graphql',
            worker: {
              id: 'graphql',
              // https://github.com/graphql/graphiql/blob/main/examples/monaco-graphql-react-vite/vite.config.ts#L16
              // https://github.com/microsoft/monaco-editor-webpack-plugin/issues/136#issuecomment-760296571
              entry: 'monaco-graphql/dist/graphql.worker',
            },
          },
        ],
      }),
    ],
  };
};
