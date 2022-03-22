const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// This is the main configuration object.
// Here, you can write different options and tell Webpack what to do
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  mode: 'development',
  devServer: {
    static: {
      publicPath: '/build/',
    },
    host: 'localhost',
    port: 3000,
    // enable HMR (Hot Model Reloading) on the devServer
    hot: true,
    
    historyApiFallback: true,

    headers: { 'Access-Control-Allow-Origin': '*' },
    /**
     * proxy is required in order to make api calls to
     * express servers while using hot-reload
     * routes api fetch requests from localhost:8080/api/* (webpack dev server)
     * to localhost:3000/api/* (where our Express server is running)
     */
  },
  module: {
    rules: [
      {
        //this rule is applied to let webpack handle js and JSX files
        test: /\.(jsx|js)$/,
        exclude: /(node_modules)/,
        use: {
          //Babel helps compile JSX syntax to JS. 
          //Not just that, but for regular .js files, we can now use the ES6 syntax and Babel will compile that to its equivalent ES5 form.
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          }
        }
      },
      {
        test: /\.s[ac]ss$/i,
        //This boilerplate uses these loaders for handling static CSS/SASS files.
        use: ['style-loader', 'css-loader']
      } 
  ],
}, 
  resolve: {
    extensions: ['.ts', '.jsx', '.js', '.svg', '.png']
  },
  
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
};
