module.exports = {
  entry: "./client/app/main.ts",
  output: {
    path: __dirname,
    filename: "./client/dist/bundle.js"
  },
  resolve:{
    extensions: ['', '.ts', '.js']
  },
  module : {
    loaders: [{
      test: /\.ts/, loaders: ['ts-loader'], exclude: /node_modules/
    }]
  }
}
