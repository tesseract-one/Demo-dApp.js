/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack')
const withFonts = require('next-fonts')

module.exports = withFonts(
  {
    env: {
      BASE_URL: process.env.BASE_URL,
    },
    webpack: config => {
      config.module.rules.push({
        test: /\.txt$/i,
        use: 'raw-loader'
      })
      config.module.rules.push({
        test: /\.(png|jpe?g|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 100000,
            name: '[name].[ext]'
          }
        }
      })
      config.module.rules.push({
        test: /\.svg$/,
        use: '@svgr/webpack'
      })
      config.plugins.push(
        new webpack.ContextReplacementPlugin(
          new RegExp('/highlight.js/lib/languages$/'),
          new RegExp(`^./(javascript)$`)
        )
      )
      return config
    }
  }
)
