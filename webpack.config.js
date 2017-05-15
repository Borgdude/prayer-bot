var reactToolboxVariables = {
  'color-text': '#444548',
  /* Note that you can use global colors and variables */
  'color-primary': 'var(--palette-blue-300)',
  'color-primary-dark': 'var(--palette-blue-500)'
};


module.exports = {
  entry: './client/app.jsx',
  output: {
    path: __dirname,
    filename: './public/bundle.js'
  },
  resolve: {
    root: __dirname,
    alias: {
    },
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0']
        },
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss?sourceMap&sourceComments',
        ],
        exclude: /flexboxgrid/
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?modules',
        include: /flexboxgrid/
      }
    ]
  },
  postcss: () => {
    return [
      /* eslint-disable global-require */
      require('postcss-cssnext')({
        features: {
          customProperties: {
            variables: reactToolboxVariables,
          },
        },
      }),
      /* optional - see next section */
      require('postcss-modules-values'),
      /* eslint-enable global-require */
    ];
  }
};
