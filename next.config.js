/* eslint-disable @typescript-eslint/no-var-requires */
const withSass = require('@zeit/next-sass')
const withCSS = require('@zeit/next-css')
const webpack = require('webpack')
const withFonts = require('next-fonts')

module.exports = withCSS(
    withSass(withFonts({
    cssModules: true,
    cssLoaderOptions: {
      importLoaders: 1,
      localIdentName: "[local]___[hash:base64:5]",
    },
    sassLoaderOptions: {
      data: `
        @import './assets/styles/variables.scss';
        @import './assets/styles/rubber.scss';
      `
    },
    env: {
      BASE_URL: process.env.BASE_URL,
    },
    webpack: config => {
      config.module.rules.forEach(rule => {
        if (rule.test.toString().includes('.scss')) {
          rule.rules = rule.use.map(useRule => {
            if (typeof useRule === 'string') return { loader: useRule }

            return useRule.loader.startsWith('css-loader')
              ? {
                  oneOf: [
                    {
                      test: new RegExp('.scss$'),
                      resourceQuery: /^\?raw$/,
                      loader: useRule.loader,
                      options: { ...useRule.options, modules: false }
                    },
                    {
                      loader: useRule.loader,
                      options: useRule.options
                    }
                  ]
                }
              : useRule
          })

          delete rule.use
        }
      })
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
  }))
)
