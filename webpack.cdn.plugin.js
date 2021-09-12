const HtmlWebpackPlugin = require("html-webpack-plugin");

class CDNInjectPlugin {
  constructor ({ options }) {
    this.options = options
  }
  
  apply(compiler) {
    compiler.hooks.compilation.tap("CDNInjectPlugin", compilation => { 
      HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync("CDNInjectPlugin", (data, callback) => {
        if (data.plugin.options) {
          data.plugin.options.cdnUrl = this.options.cdnUrl
        }
        callback(null, data)
      })
    })
  }
}

module.exports = CDNInjectPlugin;